from typing import Dict, Any

class TriageEngine:
    """
    Automated Clinical Risk Stratification Engine based on:
    - 2024 AHA/ACC Geriatric Hypertension Guidelines
    - 2024 ADA Standards of Medical Care in Type-2 Diabetes for Older Adults
    """

    @staticmethod
    def stratify_bp(systolic: int, diastolic: int) -> Dict[str, str]:
        """
        Stratifies blood pressure for seniors >= 65yo.
        Target in older adults: 120-130 / 70-80 mmHg.
        """
        if systolic >= 180 or diastolic >= 120:
            return {"category": "HYPERTENSIVE_CRISIS", "action": "Immediate Emergency Medical Evaluation"}
        elif systolic >= 140 or diastolic >= 90:
            return {"category": "STAGE_2_HYPERTENSION", "action": "Reinforce Antihypertensive Adherence; Review with Geriatrician"}
        elif (130 <= systolic <= 139) or (81 <= diastolic <= 89):
            return {"category": "STAGE_1_HYPERTENSION", "action": "Dietary Sodium Restriction & Hydration"}
        elif systolic < 90 or diastolic < 60:
            return {"category": "HYPOTENSION_FALL_RISK", "action": "Check Orthostatic Vitalls; Risk of Syncope"}
        else:
            return {"category": "OPTIMAL_GERIATRIC_BP", "action": "Continue Current Amlodipine/Telmisartan Protocol"}

    @staticmethod
    def stratify_glucose(fasting: float, pp: float) -> Dict[str, str]:
        """
        Stratifies glycemic control for older adults with diabetes.
        ADA Target for healthy elders: Fasting 80-130 mg/dL, PP < 180 mg/dL.
        """
        if fasting < 70 or pp < 70:
            return {"category": "HYPOGLYCEMIA_WARNING", "action": "Immediate Fast-Acting Carbohydrate (15g Rule)"}
        elif fasting >= 250 or pp >= 300:
            return {"category": "SEVERE_HYPERGLYCEMIA", "action": "Rule out Ketosis/HHS; Check Hydration"}
        elif fasting > 130 or pp > 180:
            return {"category": "SUBOPTIMAL_CONTROL", "action": "Ensure Metformin Compliance"}
        else:
            return {"category": "TARGET_GLYCEMIC_RANGE", "action": "Optimal Control Maintained"}

    @staticmethod
    def stratify_oxygen(spo2: int) -> Dict[str, str]:
        """
        Stratifies pulse oximetry.
        """
        if spo2 < 90:
            return {"category": "SEVERE_HYPOXIA", "action": "Immediate Supplemental Oxygen & Call 108 Ambulance"}
        elif spo2 < 94:
            return {"category": "MILD_HYPOXIA_ALERT", "action": "Perform Deep Breathing; Check for Bronchospasm/Aspiration"}
        else:
            return {"category": "NORMAL_PULMONARY_RESERVE", "action": "Optimal Oxygenation"}
