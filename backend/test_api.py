import unittest
from fastapi.testclient import TestClient
import main
import auth
import config
import db_manager
import seed_data
from rate_limiter import limiter, get_client_ip, is_trusted_proxy

class TestOrbivisionBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        # Clear rate limits before tests
        limiter._requests.clear()

    def tearDown(self):
        # Clean up any test records generated during test execution to preserve db integrity
        with db_manager.get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM inquiries WHERE email IN (?, ?, ?, ?)",
                ("testclient@example.com", "rapid@example.com", "lifecycle@example.com", "visitor@example.com")
            )

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertEqual(data["brand"], "ORBIVISION")

    def test_agency_config(self):
        response = self.client.get("/api/config")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["brand"]["name"], "ORBIVISION")
        self.assertIn("om", data["contact_info"])
        self.assertIn("trushal", data["contact_info"])

    def test_services_catalog_has_no_pricing(self):
        response = self.client.get("/api/services")
        self.assertEqual(response.status_code, 200)
        services = response.json()
        self.assertGreaterEqual(len(services), 10)
        for s in services:
            # Guarantee no pricing info is leaked
            self.assertNotIn("pricing_tier", s)
            self.assertNotIn("price", s)

    # -------------------------------------------------------------
    # 1. Admin Credential Security Tests
    # -------------------------------------------------------------
    def test_old_admin_password_rejected(self):
        """Verify the legacy/default password 'Orbivision@2025' returns 401 Unauthorized."""
        res = self.client.post("/api/admin/login", json={
            "username_or_email": "admin",
            "password": "Orbivision@2025"
        })
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.json()["detail"], "Incorrect username or password")

    def test_new_admin_password_accepted(self):
        """Verify the environment-configured admin password authenticates successfully."""
        self.assertTrue(bool(config.ADMIN_PASSWORD), "ADMIN_PASSWORD must be configured in environment")
        res = self.client.post("/api/admin/login", json={
            "username_or_email": config.ADMIN_USERNAME,
            "password": config.ADMIN_PASSWORD
        })
        self.assertEqual(res.status_code, 200)
        token_data = res.json()
        self.assertIn("access_token", token_data)
        self.assertEqual(token_data["token_type"], "bearer")
        self.assertEqual(token_data["user"]["username"], config.ADMIN_USERNAME)

    def test_seed_database_does_not_reset_existing_admin_password(self):
        """Ensure application startup / seed_database does NOT reset an existing admin password."""
        admin_before = db_manager.get_admin_by_username_or_email(config.ADMIN_USERNAME)
        self.assertIsNotNone(admin_before)
        hash_before = admin_before["password_hash"]

        # Run seed_database as done during application lifespan startup
        seed_data.seed_database()

        admin_after = db_manager.get_admin_by_username_or_email(config.ADMIN_USERNAME)
        self.assertIsNotNone(admin_after)
        hash_after = admin_after["password_hash"]

        # Password hash must remain identical and untouched
        self.assertEqual(hash_before, hash_after)

    # -------------------------------------------------------------
    # 2. Public vs. Protected Inquiry API Tests
    # -------------------------------------------------------------
    def test_public_inquiry_submission_no_jwt(self):
        """Verify public visitors can submit inquiries without any JWT authentication."""
        payload = {
            "full_name": "Public Visitor",
            "email": "visitor@example.com",
            "phone": "+91 9876543210",
            "company": "Public Brand Co.",
            "service_required": "UI/UX Design",
            "project_description": "We need a complete Figma design system for our modern enterprise SaaS portal."
        }
        # Post with NO headers (no Authorization bearer token)
        response = self.client.post("/api/inquiries", json=payload)
        self.assertEqual(response.status_code, 201)
        res_data = response.json()
        self.assertTrue(res_data["success"])
        self.assertIn("inquiry", res_data)
        self.assertEqual(res_data["inquiry"]["full_name"], "Public Visitor")
        self.assertEqual(res_data["inquiry"]["status"], "new")

    def test_inquiry_input_validation(self):
        """Verify inquiry input validation rejects bad email, empty description, etc."""
        bad_payload = {
            "full_name": "Invalid Form",
            "email": "not-a-valid-email-format",
            "phone": "+91 9999999999",
            "service_required": "Web Design & Development",
            "project_description": "Short" # Must be >= 10 chars
        }
        res = self.client.post("/api/inquiries", json=bad_payload)
        self.assertEqual(res.status_code, 422)

    def test_unauthenticated_inquiry_endpoints_rejected(self):
        """Verify protected admin inquiry endpoints strictly reject unauthenticated requests."""
        # 1. GET /api/inquiries without JWT -> 401
        res_get = self.client.get("/api/inquiries")
        self.assertEqual(res_get.status_code, 401)

        # 2. PATCH /api/inquiries/{id} without JWT -> 401
        res_patch = self.client.patch("/api/inquiries/1", json={"status": "contacted"})
        self.assertEqual(res_patch.status_code, 401)

        # 3. DELETE /api/inquiries/{id} without JWT -> 401
        res_del = self.client.delete("/api/inquiries/1")
        self.assertEqual(res_del.status_code, 401)

        # 4. GET /api/admin/stats without JWT -> 401
        res_stats = self.client.get("/api/admin/stats")
        self.assertEqual(res_stats.status_code, 401)

        # 5. Invalid JWT bearer token -> 401
        invalid_headers = {"Authorization": "Bearer totally-fake-or-tampered-token"}
        res_fake_jwt = self.client.get("/api/inquiries", headers=invalid_headers)
        self.assertEqual(res_fake_jwt.status_code, 401)

    # -------------------------------------------------------------
    # 3. Rate Limiting & Reverse Proxy Security Tests
    # -------------------------------------------------------------
    def test_rate_limiting_login(self):
        """Limit is 5 requests per minute per IP."""
        for _ in range(5):
            res = self.client.post("/api/admin/login", json={
                "username_or_email": "admin",
                "password": "WrongPasswordAttempt"
            })
            self.assertEqual(res.status_code, 401)

        # 6th attempt should be blocked with 429
        blocked_res = self.client.post("/api/admin/login", json={
            "username_or_email": "admin",
            "password": "WrongPasswordAttempt"
        })
        self.assertEqual(blocked_res.status_code, 429)
        self.assertIn("Retry-After", blocked_res.headers)

    def test_inquiry_rate_limiting(self):
        """Limit is 3 inquiries per 10 minutes per IP."""
        payload = {
            "full_name": "Rapid Submitter",
            "email": "rapid@example.com",
            "phone": "+91 9123456789",
            "service_required": "Web Design & Development",
            "project_description": "First legitimate submission brief with sufficient length."
        }
        for _ in range(3):
            res = self.client.post("/api/inquiries", json=payload)
            self.assertEqual(res.status_code, 201)

        # 4th submission should trigger rate limit 429
        blocked = self.client.post("/api/inquiries", json=payload)
        self.assertEqual(blocked.status_code, 429)
        self.assertIn("Retry-After", blocked.headers)

    def test_trusted_proxy_ip_spoofing_defense(self):
        """Ensure forwarded headers are only trusted if the connection peer is a trusted proxy."""
        # Test helper functions
        self.assertTrue(is_trusted_proxy("127.0.0.1"))
        self.assertTrue(is_trusted_proxy("172.18.0.2"))  # Docker subnet 172.16.0.0/12
        self.assertFalse(is_trusted_proxy("203.0.113.195"))  # Untrusted public IP

        # Mock requests
        class MockClient:
            def __init__(self, host):
                self.host = host

        class MockRequest:
            def __init__(self, host, headers):
                self.client = MockClient(host)
                self.headers = headers

        # Case 1: Untrusted public client sends fake X-Forwarded-For to spoof another IP
        untrusted_req = MockRequest("203.0.113.195", {"X-Forwarded-For": "1.2.3.4"})
        ip = get_client_ip(untrusted_req)
        # MUST ignore X-Forwarded-For and return the actual socket IP
        self.assertEqual(ip, "203.0.113.195")

        # Case 2: Trusted reverse proxy sends X-Forwarded-For containing real client
        trusted_proxy_req = MockRequest("172.18.0.2", {"X-Forwarded-For": "198.51.100.42, 172.18.0.2"})
        ip_proxy = get_client_ip(trusted_proxy_req)
        # MUST extract originating client IP
        self.assertEqual(ip_proxy, "198.51.100.42")

    # -------------------------------------------------------------
    # 4. Admin Management Lifecycle Tests
    # -------------------------------------------------------------
    def test_admin_inquiry_lifecycle(self):
        # Authenticate admin with new password
        login_res = self.client.post("/api/admin/login", json={
            "username_or_email": config.ADMIN_USERNAME,
            "password": config.ADMIN_PASSWORD
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Submit fresh inquiry
        create_res = self.client.post("/api/inquiries", json={
            "full_name": "Lifecycle Test User",
            "email": "lifecycle@example.com",
            "phone": "+91 9988776655",
            "service_required": "Full-Stack Web Development",
            "project_description": "Testing full inquiry lifecycle from creation to status update."
        })
        inquiry_id = create_res.json()["inquiry"]["id"]

        # Retrieve inquiries list as authenticated admin
        list_res = self.client.get("/api/inquiries", headers=headers)
        self.assertEqual(list_res.status_code, 200)
        inquiries = list_res.json()
        self.assertTrue(any(i["id"] == inquiry_id for i in inquiries))

        # Update status to in_progress with notes
        patch_res = self.client.patch(
            f"/api/inquiries/{inquiry_id}",
            json={"status": "in_progress", "notes": "Contacted client via WhatsApp"},
            headers=headers
        )
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["status"], "in_progress")
        self.assertEqual(patch_res.json()["notes"], "Contacted client via WhatsApp")

        # Delete inquiry
        del_res = self.client.delete(f"/api/inquiries/{inquiry_id}", headers=headers)
        self.assertEqual(del_res.status_code, 200)

    def test_bcrypt_hashing_and_verification(self):
        raw_pw = "SuperSecurePassphrase2025!"
        hashed = auth.hash_password(raw_pw)
        self.assertTrue(hashed.startswith(("$2b$", "$2a$")))
        is_valid, needs_rehash = auth.verify_password(raw_pw, hashed)
        self.assertTrue(is_valid)
        self.assertFalse(needs_rehash)

    # -------------------------------------------------------------
    # 5. Render Compatibility & CORS Verification Tests
    # -------------------------------------------------------------
    def test_cors_allowed_and_rejected_origins(self):
        """Verify CORS allows configured origins and rejects unknown origins."""
        # 1. Allowed origin receives Access-Control-Allow-Origin header
        allowed = config.ALLOWED_ORIGINS[0]
        res_allowed = self.client.get("/api/health", headers={"Origin": allowed})
        self.assertEqual(res_allowed.status_code, 200)
        self.assertEqual(res_allowed.headers.get("access-control-allow-origin"), allowed)

        # 2. Unknown origin is rejected (no access-control-allow-origin header)
        res_unauthorized = self.client.get("/api/health", headers={"Origin": "https://malicious-attacker-domain.com"})
        self.assertEqual(res_unauthorized.status_code, 200)
        self.assertIsNone(res_unauthorized.headers.get("access-control-allow-origin"))

    def test_render_ip_extraction(self):
        """Verify IP extraction on Render cloud infrastructure (CF-Connecting-IP, True-Client-IP, XFF)."""
        class MockClient:
            def __init__(self, host):
                self.host = host

        class MockRequest:
            def __init__(self, host, headers):
                self.client = MockClient(host)
                self.headers = headers

        # Temporarily simulate config.IS_RENDER = True
        orig_render = config.IS_RENDER
        try:
            config.IS_RENDER = True

            # 1. Cloudflare connecting IP takes precedence on Render
            req_cf = MockRequest("10.0.0.1", {
                "CF-Connecting-IP": "198.51.100.77",
                "X-Forwarded-For": "198.51.100.77, 10.0.0.1"
            })
            self.assertEqual(get_client_ip(req_cf), "198.51.100.77")

            # 2. True-Client-IP takes precedence if CF-Connecting-IP absent
            req_true = MockRequest("10.0.0.1", {
                "True-Client-IP": "198.51.100.88",
                "X-Forwarded-For": "198.51.100.88, 10.0.0.1"
            })
            self.assertEqual(get_client_ip(req_true), "198.51.100.88")

            # 3. Standard Render X-Forwarded-For first entry
            req_xff = MockRequest("10.0.0.1", {
                "X-Forwarded-For": "203.0.113.66, 10.0.0.1"
            })
            self.assertEqual(get_client_ip(req_xff), "203.0.113.66")
        finally:
            config.IS_RENDER = orig_render

    def test_database_init_preserves_services_and_admins(self):
        """Verify init_db and seed_database do not delete or overwrite services or admins."""
        services_before = db_manager.get_services()
        self.assertGreaterEqual(len(services_before), 10)

        admin_before = db_manager.get_admin_by_username_or_email(config.ADMIN_USERNAME)
        self.assertIsNotNone(admin_before)

        # Run init and seed again
        db_manager.init_db()
        seed_data.seed_database()

        services_after = db_manager.get_services()
        self.assertEqual(len(services_before), len(services_after))

        admin_after = db_manager.get_admin_by_username_or_email(config.ADMIN_USERNAME)
        self.assertEqual(admin_before["id"], admin_after["id"])
        self.assertEqual(admin_before["password_hash"], admin_after["password_hash"])

if __name__ == "__main__":
    unittest.main()
