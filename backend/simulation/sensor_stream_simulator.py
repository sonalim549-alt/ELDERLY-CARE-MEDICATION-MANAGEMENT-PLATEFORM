import asyncio
import random
import math
from datetime import datetime
from typing import AsyncGenerator, Dict, Any

class SensorStreamSimulator:
    """
    Asynchronous Geriatric Telemetry Sensor Stream Simulator.
    Generates realistic high-frequency IoT streaming telemetry from:
    - Continuous Glucose Monitor (CGM, Dexcom/Abbott FreeStyle Libre format)
    - Bluetooth Low Energy (BLE) Pulse Oximeter (SpO2 & Plethysmogram)
    - Oscillometric Blood Pressure Cuff
    """

    def __init__(self, patient_id: str = "PT-AYU-7281", sampling_interval_sec: float = 1.0):
        self.patient_id = patient_id
        self.interval = sampling_interval_sec
        self.step_counter = 0

    async def stream_cgm_telemetry(self, total_points: int = 10) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Asynchronously streams continuous interstitial glucose readings.
        Simulates 5-minute sensor delta with sinusoidal circadian curve.
        """
        base_glucose = 115.0
        for _ in range(total_points):
            self.step_counter += 1
            # Circadian sinusoidal wave + Brownian noise
            drift = 12.0 * math.sin(self.step_counter * 0.15) + random.uniform(-2.5, 2.5)
            glucose_val = round(base_glucose + drift, 1)

            rate_of_change = round(drift * 0.08, 2)
            trend_arrow = "Flat (Stable)" if abs(rate_of_change) < 1.0 else "Rising Slowly" if rate_of_change > 0 else "Falling Slowly"

            yield {
                "timestamp": datetime.now().isoformat(),
                "sensor_type": "CGM_INTERSTITIAL_GLUCOSE",
                "patient_id": self.patient_id,
                "glucose_mg_dl": glucose_val,
                "rate_of_change_mg_dl_min": rate_of_change,
                "trend_direction": trend_arrow,
                "is_in_target_range": 70.0 <= glucose_val <= 180.0
            }
            await asyncio.sleep(self.interval)

    async def stream_pulse_oximeter(self, total_points: int = 10) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Streams SpO2 and photoplethysmogram (PPG) pulse amplitude.
        """
        for _ in range(total_points):
            spo2_val = 98 if random.random() > 0.15 else random.choice([97, 96, 99])
            pulse_bpm = round(70 + random.uniform(-3, 4))
            perfusion_index = round(random.uniform(4.5, 7.2), 2)

            yield {
                "timestamp": datetime.now().isoformat(),
                "sensor_type": "BLE_PULSE_OXIMETER",
                "patient_id": self.patient_id,
                "spo2_percent": spo2_val,
                "pulse_rate_bpm": pulse_bpm,
                "perfusion_index": perfusion_index,
                "signal_quality": "HIGH",
                "hypoxia_alarm": spo2_val < 94
            }
            await asyncio.sleep(self.interval)
