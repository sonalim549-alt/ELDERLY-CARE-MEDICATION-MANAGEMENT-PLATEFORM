import unittest
from telemetry.vitals_analyzer import VitalsAnalyzer
from telemetry.triage_engine import TriageEngine

class TestVitalsTelemetry(unittest.TestCase):

    def test_mean_arterial_pressure(self):
        # SBP: 126, DBP: 80 -> MAP = (2*80 + 126) / 3 = 286 / 3 = 95.3 mmHg
        map_val = VitalsAnalyzer.calculate_mean_arterial_pressure(126, 80)
        self.assertAlmostEqual(map_val, 95.3, places=1)

    def test_pulse_pressure(self):
        # SBP: 126, DBP: 80 -> PP = 46 mmHg
        pp = VitalsAnalyzer.calculate_pulse_pressure(126, 80)
        self.assertEqual(pp, 46)

    def test_triage_bp_normal(self):
        res = TriageEngine.stratify_bp(126, 80)
        self.assertEqual(res["category"], "OPTIMAL_GERIATRIC_BP")

    def test_triage_bp_crisis(self):
        res = TriageEngine.stratify_bp(185, 110)
        self.assertEqual(res["category"], "HYPERTENSIVE_CRISIS")

    def test_triage_glucose_normal(self):
        res = TriageEngine.stratify_glucose(115.0, 152.0)
        self.assertEqual(res["category"], "TARGET_GLYCEMIC_RANGE")

    def test_triage_hypoxia(self):
        res = TriageEngine.stratify_oxygen(88)
        self.assertEqual(res["category"], "SEVERE_HYPOXIA")

if __name__ == "__main__":
    unittest.main()
