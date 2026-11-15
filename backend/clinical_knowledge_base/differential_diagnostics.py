from typing import Dict, List, Any

class GeriatricDifferentialDiagnostics:
    """
    Bayesian Clinical Decision Support System (CDSS) for Acute Geriatric Syndromes:
    1. Aspiration Pneumonia vs Community-Acquired Bacterial Pneumonia
    2. Orthostatic Hypotension vs Neurocardiogenic Syncope
    3. Hyperosmolar Hyperglycemic State (HHS) vs Diabetic Ketoacidosis (DKA)
    4. Delirium (Acute Encephalopathy) vs Dementia Baseline Progression
    """

    SYNDROME_BAYESIAN_PRIORS = {
        "Aspiration_Pneumonia": {
            "prior": 0.25,
            "likelihood_factors": {
                "dysphagia_or_cough_with_meals": 3.8,
                "right_lower_lobe_consolidation": 4.2,
                "sedative_or_antipsychotic_use": 2.1,
                "supine_feeding_position": 2.9
            }
        },
        "Orthostatic_Hypotension": {
            "prior": 0.30,
            "likelihood_factors": {
                "systolic_drop_gte_20mmHg_on_standing": 8.5,
                "diastolic_drop_gte_10mmHg_on_standing": 6.2,
                "concomitant_antihypertensive_polypharmacy": 2.4,
                "autonomic_neuropathy_in_diabetes": 3.1
            }
        },
        "Acute_Delirium": {
            "prior": 0.18,
            "likelihood_factors": {
                "acute_onset_fluctuating_course": 9.0,
                "inattention_cam_criteria": 7.5,
                "underlying_urinary_or_respiratory_infection": 4.8,
                "high_anticholinergic_burden_gte_3": 3.6
            }
        }
    }

    @classmethod
    def evaluate_syndrome_probability(cls, syndrome: str, observed_symptoms: List[str]) -> Dict[str, Any]:
        """
        Computes posterior odds using Bayesian update rule:
        Posterior Odds = Prior Odds * Product(Likelihood Ratios)
        """
        config = cls.SYNDROME_BAYESIAN_PRIORS.get(syndrome)
        if not config:
            return {"error": f"Syndrome {syndrome} not found in CDSS ontology"}

        prior_p = config["prior"]
        prior_odds = prior_p / (1.0 - prior_p)

        composite_lr = 1.0
        active_biomarkers = []

        for symptom, lr in config["likelihood_factors"].items():
            if symptom in observed_symptoms:
                composite_lr *= lr
                active_biomarkers.append({"symptom": symptom, "likelihood_ratio": lr})

        posterior_odds = prior_odds * composite_lr
        posterior_p = posterior_odds / (1.0 + posterior_odds)

        confidence_tier = "High Clinical Probability" if posterior_p >= 0.75 else "Moderate Probability" if posterior_p >= 0.40 else "Low Probability"

        return {
            "syndrome": syndrome,
            "prior_probability": prior_p,
            "posterior_probability": round(posterior_p, 3),
            "confidence_tier": confidence_tier,
            "composite_likelihood_ratio": round(composite_lr, 2),
            "matched_biomarkers": active_biomarkers,
            "clinical_guidance": cls._generate_syndrome_guidance(syndrome, posterior_p)
        }

    @staticmethod
    def _generate_syndrome_guidance(syndrome: str, probability: float) -> str:
        if syndrome == "Aspiration_Pneumonia":
            if probability >= 0.70:
                return "Elevate head of bed to 45 degrees during feeds. Speech pathology swallow evaluation required. Coverage: Ampicillin-Sulbactam or Clindamycin if beta-lactam allergic."
            return "Monitor oxygen saturation and maintain oral hygiene."
        elif syndrome == "Orthostatic_Hypotension":
            if probability >= 0.70:
                return "Advise gradual postural transitions. Hydration bolus (500mL water before rising). Consider waist-high compression stockings and review morning Amlodipine dosage timing."
            return "Routine standing and supine vital checks recommended."
        elif syndrome == "Acute_Delirium":
            if probability >= 0.70:
                return "Screen for occult UTI and pneumonia immediately. Check electrolytes and serum calcium. Deprescribe high-anticholinergic medications."
            return "Ensure well-lit environment and orienting clocks in patient room."
        return "Routine clinical surveillance."
