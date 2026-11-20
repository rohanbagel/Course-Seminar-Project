import unittest
from unittest.mock import patch
import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

class TestServerEndpoints(unittest.TestCase):
    def test_health_check(self):
        """Test GET / returns online status and registered agents."""
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["status"], "online")
        self.assertEqual(len(json_data["agents"]), 4)

    def test_list_ipos_catalog(self):
        """Test GET /api/ipos lists all sample offerings."""
        response = client.get("/api/ipos")
        self.assertEqual(response.status_code, 200)
        items = response.json()
        self.assertTrue(len(items) >= 3)
        tickers = [item["ticker"] for item in items]
        self.assertIn("SWIGGY", tickers)
        self.assertIn("HYUNDAI", tickers)

    @patch("agents.orchestrator.run_groq_inference", return_value="Mocked Agent Reasoning Output")
    def test_get_ipo_analysis_swiggy(self, mock_groq):
        """Test GET /api/ipo/SWIGGY executes full multi-agent orchestration."""
        response = client.get("/api/ipo/SWIGGY")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["company_name"], "Swiggy Limited")
        self.assertIn("verdict", data)
        self.assertIn("math_metrics", data)
        self.assertEqual(len(data["debate_stream"]), 3)

    def test_get_ipo_not_found(self):
        """Test GET /api/ipo/UNKNOWN returns 404."""
        response = client.get("/api/ipo/UNKNOWN_TICKER")
        self.assertEqual(response.status_code, 404)

    @patch("agents.orchestrator.run_groq_inference", return_value="Mocked Custom Agent Reasoning")
    def test_post_custom_ipo_analyze(self, mock_groq):
        """Test POST /api/analyze accepts custom IPO metrics and returns full analysis."""
        payload = {
            "company_name": "Nova Tech AI Limited",
            "ticker": "NOVATECH",
            "sector": "Enterprise AI / Cloud",
            "price_band": "₹450 - ₹480",
            "issue_price": 480.0,
            "gmp_rupees": 45.0,
            "qib_subscription_x": 12.5,
            "nii_subscription_x": 3.2,
            "retail_subscription_x": 2.1,
            "fresh_issue_cr": 800.0,
            "ofs_cr": 200.0,
            "anchor_book_cr": 350.0,
            "pre_promoter_holding_pct": 72.0,
            "post_promoter_holding_pct": 58.0
        }
        response = client.post("/api/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["company_name"], "Nova Tech AI Limited")
        self.assertIn("verdict", data)
        self.assertIn("conviction_score", data)
        self.assertIn("math_metrics", data)
        self.assertIn("spike_cone", data["math_metrics"])


if __name__ == "__main__":
    unittest.main()
