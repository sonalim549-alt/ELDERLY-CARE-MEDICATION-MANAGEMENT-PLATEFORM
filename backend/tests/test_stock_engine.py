import unittest
from stock_engine.predictive_burn_rate import PredictiveStockBurnEngine
from seed_data import get_seed_medicines

class TestPredictiveStockBurnEngine(unittest.TestCase):

    def test_runway_calculation(self):
        # 6 pills / 2 per day = 3.0 days -> critical
        res = PredictiveStockBurnEngine.calculate_runway(total_pills=6, daily_consumption=2.0)
        self.assertEqual(res["days_left"], 3.0)
        self.assertTrue(res["is_critical"])
        self.assertEqual(res["risk_tier"], "HIGH_ALERT")

    def test_safe_runway_calculation(self):
        # 24 pills / 1 per day = 24.0 days -> safe
        res = PredictiveStockBurnEngine.calculate_runway(total_pills=24, daily_consumption=1.0)
        self.assertEqual(res["days_left"], 24.0)
        self.assertFalse(res["is_critical"])
        self.assertEqual(res["risk_tier"], "OPTIMAL_STOCK")

    def test_critical_threshold_boundary(self):
        # Exactly 4 pills / 1 per day = 4.0 days -> critical (<= 4d)
        res = PredictiveStockBurnEngine.calculate_runway(total_pills=4, daily_consumption=1.0)
        self.assertEqual(res["days_left"], 4.0)
        self.assertTrue(res["is_critical"])

    def test_stockout_probability_monotonicity(self):
        prob_crit = PredictiveStockBurnEngine.estimate_stockout_probability(days_left=2.0)
        prob_safe = PredictiveStockBurnEngine.estimate_stockout_probability(days_left=15.0)
        self.assertGreater(prob_crit, prob_safe)

if __name__ == "__main__":
    unittest.main()
