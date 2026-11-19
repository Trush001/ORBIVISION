import unittest
from fastapi.testclient import TestClient
import main
import auth
import config
from rate_limiter import limiter

class TestOrbivisionBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        # Clear rate limits before tests
        limiter._requests.clear()

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

    def test_inquiry_submission_and_validation(self):
        # Valid inquiry
        payload = {
            "full_name": "Test Client",
            "email": "testclient@example.com",
            "phone": "+91 9999999999",
            "company": "Test Enterprise",
            "service_required": "AI Automation & AI Integration",
            "project_budget": "Full Custom Build",
            "project_description": "We need custom autonomous AI agents for customer workflow automation."
        }
        response = self.client.post("/api/inquiries", json=payload)
        self.assertEqual(response.status_code, 201)
        res_data = response.json()
        self.assertTrue(res_data["success"])
        self.assertIn("inquiry", res_data)
        self.assertEqual(res_data["inquiry"]["full_name"], "Test Client")

        # Invalid email format should return 422
        bad_payload = payload.copy()
        bad_payload["email"] = "notanemail"
        bad_res = self.client.post("/api/inquiries", json=bad_payload)
        self.assertEqual(bad_res.status_code, 422)

    def test_admin_auth_and_protected_routes(self):
        # Invalid login
        bad_login = self.client.post("/api/admin/login", json={
            "username_or_email": "admin",
            "password": "WrongPassword123!"
        })
        self.assertEqual(bad_login.status_code, 401)

        # Valid login
        login_res = self.client.post("/api/admin/login", json={
            "username_or_email": config.INITIAL_ADMIN_USERNAME,
            "password": config.INITIAL_ADMIN_PASSWORD
        })
        self.assertEqual(login_res.status_code, 200)
        token_data = login_res.json()
        self.assertIn("access_token", token_data)
        token = token_data["access_token"]

        # Access protected endpoint with token
        headers = {"Authorization": f"Bearer {token}"}
        stats_res = self.client.get("/api/admin/stats", headers=headers)
        self.assertEqual(stats_res.status_code, 200)
        stats = stats_res.json()
        self.assertIn("total_inquiries", stats)

        # Access protected endpoint without token should fail
        unauth_res = self.client.get("/api/admin/stats")
        self.assertEqual(unauth_res.status_code, 401)

    def test_rate_limiting_login(self):
        # Limit is 5 requests per minute
        for _ in range(5):
            res = self.client.post("/api/admin/login", json={
                "username_or_email": "admin",
                "password": "WrongPassword"
            })
            self.assertIn(res.status_code, (401, 200))

        # 6th attempt should be blocked with 429
        blocked_res = self.client.post("/api/admin/login", json={
            "username_or_email": "admin",
            "password": "WrongPassword"
        })
        self.assertEqual(blocked_res.status_code, 429)
        self.assertIn("Retry-After", blocked_res.headers)

    def test_inquiry_rate_limiting(self):
        # Limit is 3 inquiries per 10 minutes
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

    def test_admin_inquiry_lifecycle(self):
        # Authenticate admin
        login_res = self.client.post("/api/admin/login", json={
            "username_or_email": config.INITIAL_ADMIN_USERNAME,
            "password": config.INITIAL_ADMIN_PASSWORD
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

        # Retrieve inquiries list
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
        raw_pw = "SuperSecurePassword123!"
        hashed = auth.hash_password(raw_pw)
        self.assertTrue(hashed.startswith(("$2b$", "$2a$")))
        is_valid, needs_rehash = auth.verify_password(raw_pw, hashed)
        self.assertTrue(is_valid)
        self.assertFalse(needs_rehash)

if __name__ == "__main__":
    unittest.main()
