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

    def test_bcrypt_hashing_and_verification(self):
        raw_pw = "SuperSecurePassword123!"
        hashed = auth.hash_password(raw_pw)
        self.assertTrue(hashed.startswith(("$2b$", "$2a$")))
        is_valid, needs_rehash = auth.verify_password(raw_pw, hashed)
        self.assertTrue(is_valid)
        self.assertFalse(needs_rehash)

if __name__ == "__main__":
    unittest.main()
