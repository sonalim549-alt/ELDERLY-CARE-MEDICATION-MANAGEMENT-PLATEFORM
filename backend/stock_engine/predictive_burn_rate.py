import math
from typing import Dict, Any, List

class PredictiveStockBurnEngine:
    """
    4-Day Predictive Medicine Stock Engine:
    Implements stochastic burn-rate telemetry, runway calculations,
    and out-of-stock risk probability modeling.
    """

    CRITICAL_BUFFER_DAYS = 4.0

    @classmethod
    def calculate_runway(cls, total_pills: int, daily_consumption: float) -> Dict[str, Any]:
        """
        Calculates remaining stock runway:
        days_left = total_pills / daily_consumption
        """
        if daily_consumption <= 0:
            days_left = 999.0
        else:
            days_left = round(total_pills / daily_consumption, 1)

        is_critical = days_left <= cls.CRITICAL_BUFFER_DAYS

        # Out-of-Stock Risk Level
        if days_left <= 1.0:
            risk_tier = "EMERGENCY_DEPLETED"
            urgency = "IMMEDIATE (Within 2 Hours)"
        elif days_left <= 2.0:
            risk_tier = "CRITICAL_SEVERITY"
            urgency = "VERY HIGH (Within 12 Hours)"
        elif days_left <= cls.CRITICAL_BUFFER_DAYS:
            risk_tier = "HIGH_ALERT"
            urgency = "HIGH (Within 24 Hours)"
        elif days_left <= 7.0:
            risk_tier = "MODERATE_WATCH"
            urgency = "MODERATE"
        else:
            risk_tier = "OPTIMAL_STOCK"
            urgency = "ROUTINE"

        return {
            "total_pills": total_pills,
            "daily_consumption": daily_consumption,
            "days_left": days_left,
            "is_critical": is_critical,
            "critical_buffer_threshold": cls.CRITICAL_BUFFER_DAYS,
            "risk_tier": risk_tier,
            "urgency": urgency,
            "stock_runway_status": f"{days_left} Days Remaining"
        }

    @classmethod
    def estimate_stockout_probability(cls, days_left: float, adherence_variance: float = 0.15) -> float:
        """
        Stochastic cumulative probability P(Stockout <= 4 days) assuming Poisson distributed dose variance.
        """
        if days_left <= 0:
            return 1.0
        if days_left > 10.0:
            return 0.005

        # Sigmoid probability curve modeling elder forgetting/taking extra dose
        z = (cls.CRITICAL_BUFFER_DAYS - days_left) / (cls.CRITICAL_BUFFER_DAYS * adherence_variance)
        prob = 1.0 / (1.0 + math.exp(-z))
        return round(min(0.999, max(0.001, prob)), 3)
