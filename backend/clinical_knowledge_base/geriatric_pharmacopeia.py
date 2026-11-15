from typing import Dict, List, Any, Optional

class GeriatricPharmacopeia:
    """
    Geriatric Pharmacopeia & Clinical Pharmacology Engine
    Implements:
    - 2023 Updated AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults
    - Anticholinergic Cognitive Burden (ACB) Scale
    - Renal eGFR Drug Dose Titration Matrix
    - Critical Drug-Drug Interaction (DDI) Checker
    """

    # AGS Beers Criteria: Medications with heightened adverse event profile in >= 65yo
    BEERS_CRITERIA_REGISTRY = {
        "NSAIDs": {
            "drugs": ["ibuprofen", "naproxen", "diclofenac", "indomethacin", "ketorolac"],
            "risk": "High risk of GI ulceration, bleeding, acute kidney injury (AKI), and fluid retention worsening heart failure.",
            "recommendation": "Avoid chronic use. Consider topical NSAIDs or acetaminophen with caution."
        },
        "Benzodiazepines": {
            "drugs": ["diazepam", "lorazepam", "alprazolam", "clonazepam"],
            "risk": "Marked increase in fall risk, ataxia, daytime somnolence, and accelerated cognitive impairment.",
            "recommendation": "Avoid. Use non-pharmacological sleep hygiene or melatonin receptor agonists."
        },
        "First-Generation Antihistamines": {
            "drugs": ["diphenhydramine", "hydroxyzine", "chlorpheniramine", "promethazine"],
            "risk": "Strong anticholinergic toxicity: urinary retention, dry mouth, blurred vision, acute delirium.",
            "recommendation": "Avoid. Use second-generation non-sedating agents (e.g. cetirizine, fexofenadine)."
        },
        "Sulfonylureas (Long-Acting)": {
            "drugs": ["glyburide", "chlorpropamide"],
            "risk": "Prolonged life-threatening hypoglycemia in older adults due to delayed renal elimination.",
            "recommendation": "Avoid. Prefer Metformin, DPP-4 inhibitors (e.g. Linagliptin), or short-acting agents."
        }
    }

    # Severe Drug-Drug Interactions (DDI)
    DRUG_INTERACTIONS = [
        {
            "drug_pair": ("metformin", "radiopaque_contrast"),
            "severity": "CRITICAL",
            "warning": "Lactic acidosis hazard. Withhold Metformin 48 hours prior to contrast imaging and verify eGFR."
        },
        {
            "drug_pair": ("amlodipine", "simvastatin"),
            "severity": "HIGH",
            "warning": "CYP3A4 inhibition increases statin systemic exposure. Limit Simvastatin dose to <= 20mg/day."
        },
        {
            "drug_pair": ("telmisartan", "potassium_sparing_diuretics"),
            "severity": "HIGH",
            "warning": "Dual renin-angiotensin-aldosterone blockade dramatically elevates risk of severe hyperkalemia."
        },
        {
            "drug_pair": ("atorvastatin", "clarithromycin"),
            "severity": "HIGH",
            "warning": "Macrolide CYP3A4 inhibition elevates rhabdomyolysis risk. Temporarily suspend statin."
        }
    ]

    # Anticholinergic Cognitive Burden (ACB) Scale (0 = None, 1 = Mild, 2 = Moderate, 3 = Severe)
    ACB_SCALE = {
        "pantoprazole": 0,
        "metformin": 0,
        "amlodipine": 0,
        "telmisartan": 0,
        "atorvastatin": 0,
        "atenolol": 1,
        "prednisone": 1,
        "cimetidine": 2,
        "amitriptyline": 3,
        "oxybutynin": 3,
        "diphenhydramine": 3
    }

    @classmethod
    def evaluate_regimen_beers_risk(cls, active_medications: List[str]) -> List[Dict[str, Any]]:
        """
        Screens active medications against the 2023 AGS Beers Criteria.
        """
        flags = []
        meds_lower = [m.lower() for m in active_medications]

        for category, data in cls.BEERS_CRITERIA_REGISTRY.items():
            for drug in data["drugs"]:
                for m in meds_lower:
                    if drug in m:
                        flags.append({
                            "matched_medication": m,
                            "beers_category": category,
                            "clinical_risk": data["risk"],
                            "geriatric_recommendation": data["recommendation"]
                        })
        return flags

    @classmethod
    def check_drug_interactions(cls, active_medications: List[str]) -> List[Dict[str, Any]]:
        """
        Exhaustive pairwise cross-examination of prescribed medications.
        """
        warnings = []
        meds_lower = [m.lower() for m in active_medications]

        for i in range(len(meds_lower)):
            for j in range(i + 1, len(meds_lower)):
                m1, m2 = meds_lower[i], meds_lower[j]
                for ddi in cls.DRUG_INTERACTIONS:
                    p1, p2 = ddi["drug_pair"]
                    if (p1 in m1 and p2 in m2) or (p1 in m2 and p2 in m1):
                        warnings.append({
                            "pair": (m1, m2),
                            "severity": ddi["severity"],
                            "warning": ddi["warning"]
                        })
        return warnings

    @classmethod
    def calculate_total_acb_score(cls, active_medications: List[str]) -> Dict[str, Any]:
        """
        Computes cumulative Anticholinergic Cognitive Burden (ACB) score.
        A score >= 3 is linked to 50% increased risk of cognitive decline and mortality in seniors.
        """
        total_acb = 0
        breakdown = {}

        for med in active_medications:
            med_lower = med.lower()
            score = 0
            for drug_key, s in cls.ACB_SCALE.items():
                if drug_key in med_lower:
                    score = s
                    break
            total_acb += score
            breakdown[med] = score

        risk_level = "Low (ACB 0-1)" if total_acb <= 1 else "Moderate (ACB 2)" if total_acb == 2 else "HIGH RISK OF DELIRIUM / COGNITIVE DECLINE (ACB >= 3)"

        return {
            "total_acb_score": total_acb,
            "cognitive_risk_level": risk_level,
            "drug_breakdown": breakdown,
            "is_safe": total_acb < 3
        }

    @classmethod
    def calculate_egfr_cockcroft_gault(cls, age: int, weight_kg: float, serum_creatinine_mg_dl: float, is_female: bool = False) -> float:
        """
        Cockcroft-Gault Equation for Creatinine Clearance (CrCl / eGFR):
        CrCl = [(140 - Age) * Weight(kg)] / (72 * Serum Creatinine) * (0.85 if female)
        Essential for titrating Metformin dose in geriatric diabetes.
        """
        if serum_creatinine_mg_dl <= 0:
            return 90.0
        
        crcl = ((140 - age) * weight_kg) / (72.0 * serum_creatinine_mg_dl)
        if is_female:
            crcl *= 0.85
        return round(crcl, 1)

    @classmethod
    def verify_metformin_renal_safety(cls, egfr: float, total_daily_mg: float = 1000.0) -> Dict[str, Any]:
        """
        FDA Guidance on Metformin use based on renal clearance (eGFR):
        - eGFR >= 60: Normal dosing (up to 2000-2550 mg/day)
        - eGFR 45-59: Continue therapy; monitor renal panel every 3-6 months
        - eGFR 30-44: Maximum recommended dose 1000 mg/day
        - eGFR < 30: CONTRAINDICATED (High risk of Lactic Acidosis)
        """
        if egfr >= 60:
            return {"status": "SAFE", "max_safe_dose_mg": 2000, "recommendation": "Standard therapeutic dosing permissible."}
        elif egfr >= 45:
            return {"status": "MILD_IMPAIRMENT", "max_safe_dose_mg": 1500, "recommendation": "Safe at current dose. Recheck eGFR quarterly."}
        elif egfr >= 30:
            return {"status": "MODERATE_IMPAIRMENT", "max_safe_dose_mg": 1000, "recommendation": "Limit total daily dose to <= 1000mg. Close observation."}
        else:
            return {"status": "CONTRAINDICATED", "max_safe_dose_mg": 0, "recommendation": "Discontinue Metformin immediately. Transition to insulin/DPP-4i."}
