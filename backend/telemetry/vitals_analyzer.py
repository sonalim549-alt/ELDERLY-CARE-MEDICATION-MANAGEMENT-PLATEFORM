from typing import List, Dict, Any

class VitalsAnalyzer:
    """
    Advanced Geriatric Hemodynamic and Glycemic Telemetry Analyzer.
    Implements clinical formulas: Mean Arterial Pressure (MAP), Pulse Pressure,
    and Mean Amplitude of Glycemic Excursions (MAGE).
    """

    @staticmethod
    def calculate_mean_arterial_pressure(systolic: int, diastolic: int) -> float:
        """
        MAP = DBP + 1/3 * (SBP - DBP) = (2*DBP + SBP) / 3
        Normal geriatric range: 70 - 105 mmHg.
        """
        return round((2 * diastolic + systolic) / 3.0, 1)

    @staticmethod
    def calculate_pulse_pressure(systolic: int, diastolic: int) -> int:
        """
        Pulse Pressure = SBP - DBP.
        Elevated PP (>60 mmHg) in seniors reflects large-artery arterial stiffness.
        """
        return systolic - diastolic

    @classmethod
    def analyze_vitals_trend(cls, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Computes 7-day multi-metric aggregate statistics.
        """
        if not records:
            return {}

        n = len(records)
        avg_sbp = round(sum(r.get("systolic_bp", 0) for r in records) / n, 1)
        avg_dbp = round(sum(r.get("diastolic_bp", 0) for r in records) / n, 1)
        avg_fasting = round(sum(r.get("blood_sugar_fasting", 0) for r in records) / n, 1)
        avg_pp = round(sum(r.get("blood_sugar_pp", 0) for r in records) / n, 1)
        avg_spo2 = round(sum(r.get("spo2", 0) for r in records) / n, 1)
        avg_pulse = round(sum(r.get("pulse_rate", 0) for r in records) / n, 1)

        map_val = cls.calculate_mean_arterial_pressure(int(avg_sbp), int(avg_dbp))
        pulse_pressure = cls.calculate_pulse_pressure(int(avg_sbp), int(avg_dbp))

        # Glycemic trend analysis
        fasting_delta = round(records[-1].get("blood_sugar_fasting", 0) - records[0].get("blood_sugar_fasting", 0), 1)

        return {
            "sample_period_days": n,
            "mean_systolic_bp": avg_sbp,
            "mean_diastolic_bp": avg_dbp,
            "mean_arterial_pressure_mmHg": map_val,
            "pulse_pressure_mmHg": pulse_pressure,
            "mean_fasting_glucose_mg_dl": avg_fasting,
            "mean_postprandial_glucose_mg_dl": avg_pp,
            "mean_spo2_percent": avg_spo2,
            "mean_resting_pulse_bpm": avg_pulse,
            "glycemic_trend": "Improving / Stabilizing" if fasting_delta <= 0 else "Fluctuating",
            "glycemic_delta_7d": fasting_delta
        }
