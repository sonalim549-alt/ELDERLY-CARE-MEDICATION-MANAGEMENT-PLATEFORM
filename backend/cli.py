#!/usr/bin/env python3
"""
AyuCare AI Command Line Interface (CLI)
Senior Healthcare & Medication Management Telemetry System
"""

import sys
import argparse
import json
from seed_data import get_seed_patient, get_seed_medicines, get_seed_vitals
from stock_engine.predictive_burn_rate import PredictiveStockBurnEngine
from stock_engine.refill_optimizer import RefillOptimizer
from telemetry.vitals_analyzer import VitalsAnalyzer
from telemetry.triage_engine import TriageEngine
from ml_engine.gradcam_deep_net import GradCamDeepNet
from ml_engine.pulmonary_classifier import PulmonaryClassifier

def show_patient():
    patient = get_seed_patient()
    print("=" * 60)
    print(f"AYUCARE AI: PATIENT PROFILE - {patient.name.upper()} (AGE {patient.age})")
    print("=" * 60)
    print(f"Blood Group: {patient.blood_group} | Gender: {patient.gender} | Weight: {patient.weight_kg} kg")
    print(f"Diagnoses: {', '.join(patient.chronic_conditions)}")
    print(f"Allergies (CONTRAINDICATED): {', '.join(patient.allergies)}")
    print(f"Attending Doctor: {patient.treating_doctor.name} ({patient.treating_doctor.hospital})")
    print(f"Primary Caregiver: {patient.primary_caregiver.name} ({patient.primary_caregiver.phone})")
    print("=" * 60)

def show_stock():
    meds = get_seed_medicines()
    print("=" * 72)
    print("AYUCARE AI: 4-DAY PREDICTIVE MEDICINE STOCK TELEMETRY")
    print("=" * 72)
    print(f"{'Medication':<28} | {'Dosage':<8} | {'Stock':<6} | {'Burn/d':<6} | {'Days':<6} | {'Alert'}")
    print("-" * 72)
    for m in meds:
        status = "🚨 CRITICAL (<= 4d)" if m.days_left <= 4.0 else "✅ SAFE"
        print(f"{m.name:<28} | {m.dosage:<8} | {m.total_pills:<6} | {m.daily_consumption:<6} | {m.days_left:<6} | {status}")
    print("=" * 72)

def run_gradcam_inference():
    classifier = PulmonaryClassifier()
    gradcam = GradCamDeepNet()
    result = classifier.evaluate_scan(patient_age=72)
    matrix = gradcam.generate_activation_matrix(rows=14, cols=14)
    print("=" * 65)
    print("AI GRAD-CAM CHEST RADIOGRAPH INFERENCE (CHEXNET DENSENET-121)")
    print("=" * 65)
    print(f"Primary Diagnosis: {result['primary_diagnosis']}")
    print(f"Secondary Diagnosis: {result['secondary_diagnosis']}")
    print(f"Pneumonia Confidence: {result['probabilities']['Pneumonia'] * 100:.1f}%")
    print(f"Cardiomegaly Confidence: {result['probabilities']['Cardiomegaly'] * 100:.1f}%")
    print(f"CURB-65 Score: {result['curb65_score']} ({result['clinical_severity']})")
    print(f"Antibiotic Warning: {result['antibiotic_stewardship_warning']}")
    print("-" * 65)
    print("Forward Tensor Activation Map (14x14 Receptive Field Sample):")
    for r in range(5):
        row_str = " ".join(f"{matrix[r][c]:.2f}" for c in range(8))
        print(f"  [{row_str} ...]")
    print("=" * 65)

def main():
    parser = argparse.ArgumentParser(description="AyuCare AI Healthcare CLI")
    parser.add_argument("--patient", action="store_true", help="Display patient profile")
    parser.add_argument("--stock", action="store_true", help="Run 4-day predictive stock telemetry")
    parser.add_argument("--gradcam", action="store_true", help="Run AI Grad-CAM inference")
    parser.add_argument("--all", action="store_true", help="Run complete diagnostic summary")

    args = parser.parse_args()

    if args.patient or args.all:
        show_patient()
    if args.stock or args.all:
        show_stock()
    if args.gradcam or args.all:
        run_gradcam_inference()
    if not (args.patient or args.stock or args.gradcam or args.all):
        show_patient()
        show_stock()
        run_gradcam_inference()

if __name__ == "__main__":
    main()
