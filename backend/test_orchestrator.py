import unittest
from unittest.mock import patch, MagicMock
import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agents.orchestrator import get_groq_api_keys, run_groq_inference, analyze_ipo
from data.sample_ipos import SAMPLE_IPOS


class TestOrchestratorMechanisms(unittest.TestCase):
    def test_key_rotation_retrieval(self):
        """Test API key gathering filters empty values and maintains unique order."""
        with patch.dict(os.environ, {
            "GROQ_API_KEY": "test_key_1",
            "GROQ_API_KEY_2": "test_key_2",
            "GROQ_API_KEY_3": "test_key_1",  # Duplicate should be omitted
            "GROQ_API_KEY_BACKUP": ""
        }):
            keys = get_groq_api_keys()
            self.assertEqual(keys, ["test_key_1", "test_key_2"])

    @patch("groq.Groq")
    def test_groq_model_fallback(self, mock_groq_class):
        """Test fallback across candidate models when primary model fails."""
        mock_client = MagicMock()
        mock_groq_class.return_value = mock_client
        
        # First call fails, second call succeeds
        mock_chat = MagicMock()
        mock_choice = MagicMock()
        mock_choice.message.content = "Multi-agent consensus generated."
        mock_chat.choices = [mock_choice]
        
        mock_client.chat.completions.create.side_effect = [
            Exception("Model 404 access denied"),
            mock_chat
        ]
        
        res = run_groq_inference("System prompt", "User prompt", api_key="dummy_key")
        self.assertEqual(res, "Multi-agent consensus generated.")
        self.assertEqual(mock_client.chat.completions.create.call_count, 2)

    def test_deterministic_offline_fallback(self):
        """Test orchestrator produces robust deterministic debate stream even when offline."""
        swiggy = SAMPLE_IPOS["SWIGGY"]
        with patch("agents.orchestrator.run_groq_inference", return_value=""):
            result = analyze_ipo(swiggy)
            self.assertEqual(len(result["debate_stream"]), 3)
            self.assertTrue("Valuation Auditor" in [r["agent"] for r in result["debate_stream"]])
            self.assertTrue("Demand Forecaster" in [r["agent"] for r in result["debate_stream"]])
            self.assertTrue("Dilution Auditor" in [r["agent"] for r in result["debate_stream"]])
            self.assertIn("forensic", result["summary"].lower())


if __name__ == "__main__":
    unittest.main()
