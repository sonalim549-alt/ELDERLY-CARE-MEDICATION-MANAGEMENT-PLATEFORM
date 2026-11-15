from datetime import datetime, timedelta
from typing import List
from models import PatientProfile, CaregiverContact, DoctorProfile, Medicine, VitalsRecord

def get_seed_patient() -> PatientProfile:
    return PatientProfile(
        id="PT-AYU-7281",
        name="Rameshwar Prasad",
        age=72,
        gender="Male",
        blood_group="B+",
        weight_kg=68.5,
        height_cm=168.0,
        chronic_conditions=[
            "Type-2 Diabetes Mellitus (12 yrs history)",
            "Essential Hypertension (Stage 2 controlled)",
            "Mild Left Ventricular Hypertrophy (LVH)",
            "Geriatric Osteoarthritis (Bilateral Knees)"
        ],
        allergies=[
            "Penicillin (Severe Urticaria / Bronchospasm)",
            "Sulfa Antibiotics (Cutaneous rash)",
            "NSAIDs (Dyspepsia / Gastric Irritation)"
        ],
        primary_caregiver=CaregiverContact(
            name="Rajesh Prasad",
            relation="Son (Primary Caregiver)",
            phone="+91 98765 43210",
            email="rajesh.prasad@ayucare.in",
            is_emergency_primary=True
        ),
        treating_doctor=DoctorProfile(
            name="Dr. Ananya Sharma, MD (AIIMS)",
            specialty="Senior Geriatrician & Clinical Diabetologist",
            hospital="AIIMS Apex Geriatric Medicine Center, New Delhi",
            phone="+91 11 2659 8700",
            reg_no="DMC-R-48921"
        ),
        emergency_contact="+91 98765 43210 / 108 Emergency Ambulance",
        ablation_notes="Patient requires large-font text and audio prompts for adherence. Critical drug interaction warning active for Sulfa & Penicillin classes."
    )

def get_seed_medicines() -> List[Medicine]:
    meds = [
        Medicine(
            id="MED-01",
            name="Metformin Hydrochloride",
            dosage="500 mg",
            instructions="1 tablet twice daily with meals (Morning & Night)",
            timing=["Morning", "Night"],
            total_pills=6,
            daily_consumption=2.0,
            pill_unit="tablets",
            category="Antidiabetic",
            color_tag="emerald",
            last_taken_at="Yesterday 08:30 PM",
            adherence_status="Pending Morning Dose",
            refill_pack_size=30,
            requires_prescription=True
        ),
        Medicine(
            id="MED-02",
            name="Amlodipine Besylate",
            dosage="5 mg",
            instructions="1 tablet early morning before breakfast for Blood Pressure",
            timing=["Morning"],
            total_pills=3,
            daily_consumption=1.0,
            pill_unit="tablets",
            category="Cardiac / Antihypertensive",
            color_tag="rose",
            last_taken_at="Yesterday 07:15 AM",
            adherence_status="Pending Morning Dose",
            refill_pack_size=30,
            requires_prescription=True
        ),
        Medicine(
            id="MED-03",
            name="Telmisartan",
            dosage="40 mg",
            instructions="1 tablet morning after breakfast for arterial hypertension",
            timing=["Morning"],
            total_pills=4,
            daily_consumption=1.0,
            pill_unit="tablets",
            category="Cardiac / ARB",
            color_tag="amber",
            last_taken_at="Yesterday 08:45 AM",
            adherence_status="Pending Morning Dose",
            refill_pack_size=30,
            requires_prescription=True
        ),
        Medicine(
            id="MED-04",
            name="Atorvastatin",
            dosage="10 mg",
            instructions="1 tablet at bedtime for lipid control and plaque stabilization",
            timing=["Night"],
            total_pills=24,
            daily_consumption=1.0,
            pill_unit="tablets",
            category="Statin / Lipid Control",
            color_tag="blue",
            last_taken_at="Yesterday 09:30 PM",
            adherence_status="Taken Yesterday",
            refill_pack_size=30,
            requires_prescription=True
        ),
        Medicine(
            id="MED-05",
            name="Pantoprazole Gastro-Resistant",
            dosage="40 mg",
            instructions="1 tablet empty stomach in the morning 30 mins before tea",
            timing=["Morning"],
            total_pills=18,
            daily_consumption=1.0,
            pill_unit="tablets",
            category="Gastroprotective (PPI)",
            color_tag="indigo",
            last_taken_at="Yesterday 06:45 AM",
            adherence_status="Pending Morning Dose",
            refill_pack_size=30,
            requires_prescription=False
        ),
        Medicine(
            id="MED-06",
            name="Shelcal 500 (Calcium + Vit D3)",
            dosage="500 mg / 250 IU",
            instructions="1 tablet daily after lunch for bone mineral density",
            timing=["Afternoon"],
            total_pills=28,
            daily_consumption=1.0,
            pill_unit="tablets",
            category="Bone Supplement",
            color_tag="cyan",
            last_taken_at="Yesterday 01:30 PM",
            adherence_status="Scheduled Afternoon",
            refill_pack_size=30,
            requires_prescription=False
        )
    ]
    # Calculate stock and critical flags
    for med in meds:
        med.recalculate_stock()
    return meds

def get_seed_vitals() -> List[VitalsRecord]:
    # 7-day realistic historical vitals for Rameshwar Prasad
    # Showing mild improvement as medication adherence stabilized
    today = datetime.now()
    records = []
    
    historical_metrics = [
        {"day_offset": 6, "fasting": 142.0, "pp": 195.0, "systolic": 148, "diastolic": 92, "spo2": 95, "pulse": 82, "temp": 98.6, "risk": "High", "notes": "Mild morning fatigue, skipped evening walk."},
        {"day_offset": 5, "fasting": 138.0, "pp": 188.0, "systolic": 144, "diastolic": 90, "spo2": 96, "pulse": 78, "temp": 98.4, "risk": "Borderline", "notes": "Blood pressure elevated post-lunch; advised salt reduction."},
        {"day_offset": 4, "fasting": 134.0, "pp": 179.0, "systolic": 140, "diastolic": 88, "spo2": 96, "pulse": 76, "temp": 98.5, "risk": "Borderline", "notes": "Adherence confirmed for Amlodipine & Metformin."},
        {"day_offset": 3, "fasting": 128.0, "pp": 172.0, "systolic": 136, "diastolic": 85, "spo2": 97, "pulse": 74, "temp": 98.6, "risk": "Normal", "notes": "Stable glycemic trends. Patient reports improved sleep."},
        {"day_offset": 2, "fasting": 122.0, "pp": 164.0, "systolic": 132, "diastolic": 84, "spo2": 97, "pulse": 72, "temp": 98.4, "risk": "Normal", "notes": "Post-prandial glucose within target range (<180 mg/dL)."},
        {"day_offset": 1, "fasting": 118.0, "pp": 158.0, "systolic": 128, "diastolic": 82, "spo2": 98, "pulse": 72, "temp": 98.6, "risk": "Normal", "notes": "Excellent hemodynamic control. Dr. Sharma review pending."},
        {"day_offset": 0, "fasting": 115.0, "pp": 152.0, "systolic": 126, "diastolic": 80, "spo2": 98, "pulse": 70, "temp": 98.6, "risk": "Normal", "notes": "Morning check complete. Systolic BP optimal for 72yo (126 mmHg)."}
    ]

    for item in historical_metrics:
        record_date = (today - timedelta(days=item["day_offset"])).strftime("%Y-%m-%d")
        record_id = f"VIT-{(today - timedelta(days=item['day_offset'])).strftime('%m%d')}"
        records.append(
            VitalsRecord(
                id=record_id,
                date=record_date,
                time="08:00 AM",
                blood_sugar_fasting=item["fasting"],
                blood_sugar_pp=item["pp"],
                systolic_bp=item["systolic"],
                diastolic_bp=item["diastolic"],
                spo2=item["spo2"],
                pulse_rate=item["pulse"],
                temp_f=item["temp"],
                risk_status=item["risk"],
                clinical_notes=item["notes"]
            )
        )
    return records
