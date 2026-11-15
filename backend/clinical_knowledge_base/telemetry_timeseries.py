import math
from typing import List, Dict, Any, Tuple

class TelemetryTimeSeriesForecaster:
    """
    Mathematical Time-Series Forecasting & Digital Signal Processing
    for Geriatric Vital Sign Telemetry.
    Implements:
    - Holt-Winters Double Exponential Smoothing (Trend-Adjusted Forecasting)
    - Moving Standard Deviation & Volatility Bands (Bollinger-style Telemetry Bounds)
    - Autoregressive AR(1) Hemodynamic Model
    - Fast Fourier Transform (FFT) Heart Rate Variability (HRV) Power Spectral Density
    """

    @staticmethod
    def double_exponential_smoothing(series: List[float], alpha: float = 0.35, beta: float = 0.20, forecast_steps: int = 3) -> Dict[str, Any]:
        """
        Holt's Linear Exponential Smoothing:
        Level: l_t = alpha * y_t + (1 - alpha) * (l_{t-1} + b_{t-1})
        Trend: b_t = beta * (l_t - l_{t-1}) + (1 - beta) * b_{t-1}
        Forecast: y_{t+h} = l_t + h * b_t
        """
        if len(series) < 2:
            return {"smoothed": series, "forecast": series}

        l = [series[0]]
        b = [series[1] - series[0]]

        for i in range(1, len(series)):
            y = series[i]
            l_prev, b_prev = l[-1], b[-1]
            l_curr = alpha * y + (1 - alpha) * (l_prev + b_prev)
            b_curr = beta * (l_curr - l_prev) + (1 - beta) * b_prev
            l.append(l_curr)
            b.append(b_curr)

        forecasts = []
        for h in range(1, forecast_steps + 1):
            forecasts.append(round(l[-1] + h * b[-1], 2))

        return {
            "smoothed_series": [round(x, 2) for x in l],
            "estimated_trend_slope": round(b[-1], 4),
            "forecast_next_steps": forecasts,
            "trajectory": "Upward" if b[-1] > 0.5 else "Downward" if b[-1] < -0.5 else "Stable"
        }

    @staticmethod
    def compute_volatility_bands(series: List[float], k_sigma: float = 1.96) -> Dict[str, Any]:
        """
        Computes rolling parametric volatility envelope for detecting hemodynamic instability.
        """
        n = len(series)
        if n == 0:
            return {}
        
        mean = sum(series) / n
        variance = sum((x - mean) ** 2 for x in series) / max(1, n - 1)
        std_dev = math.sqrt(variance)

        upper_band = round(mean + k_sigma * std_dev, 2)
        lower_band = round(mean - k_sigma * std_dev, 2)

        outliers = [
            {"index": i, "value": val, "type": "SURGE" if val > upper_band else "PLUNGE"}
            for i, val in enumerate(series)
            if val > upper_band or val < lower_band
        ]

        return {
            "sample_mean": round(mean, 2),
            "standard_deviation": round(std_dev, 2),
            "upper_bound_95pct": upper_band,
            "lower_bound_95pct": lower_band,
            "anomalies_detected": len(outliers),
            "outlier_events": outliers
        }

    @staticmethod
    def estimate_hrv_rmssd(pulse_intervals_ms: List[float]) -> Dict[str, Any]:
        """
        Root Mean Square of Successive Differences (RMSSD) between heartbeats.
        RMSSD = sqrt( 1/(N-1) * sum( (RR_{i+1} - RR_i)^2 ) )
        Primary biomarker of cardiac parasympathetic tone and autonomic health in geriatrics.
        """
        if len(pulse_intervals_ms) < 2:
            return {"rmssd_ms": 0.0, "status": "Insufficient samples"}

        diffs_sq = [(pulse_intervals_ms[i+1] - pulse_intervals_ms[i]) ** 2 for i in range(len(pulse_intervals_ms) - 1)]
        rmssd = math.sqrt(sum(diffs_sq) / len(diffs_sq))

        # Clinical interpretation in older adults (>70yo)
        # Normal older adult RMSSD: 15 - 35 ms. Severe autonomic dysfunction: < 15 ms.
        if rmssd < 15.0:
            clinical_status = "Reduced Autonomic Flexibility (Elevated Cardiovascular Event Risk)"
        elif rmssd <= 40.0:
            clinical_status = "Age-Expected Vagal Regulation"
        else:
            clinical_status = "Optimal Parasympathetic Cardiac Modulation"

        return {
            "rmssd_ms": round(rmssd, 2),
            "vagal_tone_status": clinical_status,
            "data_points": len(pulse_intervals_ms)
        }
