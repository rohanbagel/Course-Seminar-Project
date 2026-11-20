import unittest
from unittest.mock import patch
import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from math_engine.beneish import calculate_beneish_m_score
from math_engine.dilution import calculate_dilution_and_governance
from math_engine.spike_model import calculate_listing_spike_cone
from agents.orchestrator import analyze_ipo
from data.sample_ipos import SAMPLE_IPOS


class TestBeneishMScore(unittest.TestCase):
    def test_clean_company_calculation(self):
        """Test a clean financial profile yields M-score < -1.78 (Low Risk)."""
        clean_inputs = {
            "receivables_t": 500.0, "receivables_prev": 490.0,
            "sales_t": 10000.0, "sales_prev": 9000.0,
            "cogs_t": 6000.0, "cogs_prev": 5500.0,
            "current_assets_t": 4000.0, "current_assets_prev": 3800.0,
            "ppe_t": 2000.0, "ppe_prev": 1900.0,
            "total_assets_t": 8000.0, "total_assets_prev": 7500.0,
            "deprec_t": 300.0, "deprec_prev": 280.0,
            "sga_t": 1500.0, "sga_prev": 1400.0,
            "net_income_t": 800.0,
            "cfo_t": 850.0,
            "current_liab_t": 2000.0, "current_liab_prev": 1900.0,
            "lt_debt_t": 500.0, "lt_debt_prev": 520.0
        }
        res = calculate_beneish_m_score(**clean_inputs)
        self.assertIn("m_score", res)
        self.assertIn("risk_classification", res)
        self.assertLess(res["m_score"], -1.78)
        self.assertFalse(res["is_high_risk"])

    def test_aggressive_accounting_flags(self):
        """Test aggressive earnings inflation produces HIGH manipulation risk (> -1.78)."""
        aggressive_inputs = {
            "receivables_t": 1200.0, "receivables_prev": 400.0,  # DSRI spikes
            "sales_t": 8000.0, "sales_prev": 7000.0,
            "cogs_t": 6000.0, "cogs_prev": 4000.0,              # GMI deteriorates
            "current_assets_t": 5000.0, "current_assets_prev": 2500.0,
            "ppe_t": 1000.0, "ppe_prev": 1000.0,
            "total_assets_t": 10000.0, "total_assets_prev": 5000.0,  # AQI shift
            "deprec_t": 100.0, "deprec_prev": 300.0,             # DEPI drop
            "sga_t": 2500.0, "sga_prev": 1500.0,
            "net_income_t": 1200.0,                              # Accruals decouple from CFO
            "cfo_t": -300.0,
            "current_liab_t": 3000.0, "current_liab_prev": 1500.0,
            "lt_debt_t": 2000.0, "lt_debt_prev": 500.0
        }
        res = calculate_beneish_m_score(**aggressive_inputs)
        self.assertGreater(res["m_score"], -1.78)
        self.assertTrue(res["is_high_risk"])
        self.assertTrue(len(res["red_flags"]) >= 1)


class TestDilutionAndGovernance(unittest.TestCase):
    def test_ofs_dilution_calculation(self):
        """Test OFS percentage and lock-in supply calculation."""
        res = calculate_dilution_and_governance(
            fresh_issue_cr=1150.0,
            ofs_cr=10170.0,
            pre_promoter_holding_pct=67.0,
            post_promoter_holding_pct=53.0,
            anchor_book_cr=3500.0,
            qib_portion_cr=4500.0
        )
        self.assertAlmostEqual(res["ofs_ratio_pct"], 89.84, places=1)
        self.assertAlmostEqual(res["fresh_ratio_pct"], 10.16, places=1)
        self.assertEqual(res["promoter_dilution_pct"], 14.0)
        self.assertEqual(res["anchor_cliff"]["day_30_unlock_cr"], 1750.0)
        self.assertEqual(res["anchor_cliff"]["day_90_unlock_cr"], 1750.0)
        self.assertTrue(len(res["red_flags"]) >= 1)

    def test_100_percent_ofs_warning(self):
        """Test 100% OFS issue triggers primary dilution warning."""
        res = calculate_dilution_and_governance(
            fresh_issue_cr=0.0,
            ofs_cr=27870.16,
            pre_promoter_holding_pct=100.0,
            post_promoter_holding_pct=82.5,
            anchor_book_cr=8300.0,
            qib_portion_cr=11000.0
        )
        self.assertEqual(res["fresh_ratio_pct"], 0.0)
        self.assertEqual(res["ofs_ratio_pct"], 100.0)
        self.assertTrue(len(res["red_flags"]) >= 1)


class TestListingSpikeCone(unittest.TestCase):
    def test_positive_gmp_cone(self):
        """Test listing return projection with positive GMP."""
        res = calculate_listing_spike_cone(
            issue_price=390.0,
            gmp_in_rupees=15.0,
            qib_subscription_x=4.56,
            nii_subscription_x=0.41,
            retail_subscription_x=1.14
        )
        cone = res["listing_cone"]
        self.assertGreater(cone["expected_price"], 380.0)
        self.assertTrue(cone["bearish_price"] <= cone["expected_price"] <= cone["bullish_price"])

    def test_subdued_demand_discount(self):
        """Test zero or negative GMP scenario."""
        res = calculate_listing_spike_cone(
            issue_price=1960.0,
            gmp_in_rupees=-10.0,
            qib_subscription_x=1.1,
            nii_subscription_x=0.3,
            retail_subscription_x=0.4
        )
        cone = res["listing_cone"]
        self.assertLess(cone["expected_price"], 1960.0)
        self.assertLess(cone["expected_gain_pct"], 0.0)


class TestOrchestratorPipeline(unittest.TestCase):
    @patch("agents.orchestrator.run_groq_inference", return_value="Mocked Agent Reasoning Output")
    def test_swiggy_analysis(self, mock_groq):
        """Test end-to-end multi-agent pipeline on Swiggy IPO data."""
        swiggy_data = SAMPLE_IPOS["SWIGGY"]
        result = analyze_ipo(swiggy_data)
        
        self.assertEqual(result["company_name"], "Swiggy Limited")
        self.assertIn("verdict", result)
        self.assertIn("conviction_score", result)
        self.assertIn("debate_stream", result)
        self.assertEqual(len(result["debate_stream"]), 3)
        self.assertIn("math_metrics", result)
        self.assertIn("beneish", result["math_metrics"])
        self.assertIn("spike_cone", result["math_metrics"])
        self.assertIn("red_flags", result)
        self.assertTrue(len(result["red_flags"]) >= 1)

    @patch("agents.orchestrator.run_groq_inference", return_value="Mocked Agent Reasoning Output")
    def test_hyundai_analysis(self, mock_groq):
        """Test end-to-end multi-agent pipeline on Hyundai Motor India (100% OFS)."""
        hyundai_data = SAMPLE_IPOS["HYUNDAI"]
        result = analyze_ipo(hyundai_data)
        
        self.assertEqual(result["company_name"], "Hyundai Motor India Limited")
        self.assertIn(result["verdict"], ["AVOID / FULLY PRICED", "CAUTION / SELECTIVE APPLY", "HIGH SPECULATIVE RISK"])
        self.assertGreaterEqual(result["conviction_score"], 70)


if __name__ == "__main__":
    unittest.main()
