from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class CaregiverContact(BaseModel):
    name: str
    relation: str
    phone: str
    email: str
    is_emergency_primary: bool = True

class DoctorProfile(BaseModel):
    name: str
    specialty: str
    hospital: str
    phone: str
    reg_no: str

class PatientProfile(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    blood_group: str
    weight_kg: float
    height_cm: float
    chronic_conditions: List[str]
    allergies: List[str]
    primary_caregiver: CaregiverContact
    treating_doctor: DoctorProfile
    emergency_contact: str
    ablation_notes: str

class Medicine(BaseModel):
    id: str
    name: str
    dosage: str
    instructions: str
    timing: List[str]
    total_pills: int
    daily_consumption: float
    pill_unit: str = "tablets"
    days_left: float = 0.0
    is_critical: bool = False
    category: str
    color_tag: str
    last_taken_at: Optional[str] = None
    adherence_status: str = "Pending"
    refill_pack_size: int = 30
    requires_prescription: bool = True

    def recalculate_stock(self):
        if self.daily_consumption > 0:
            self.days_left = round(self.total_pills / self.daily_consumption, 1)
        else:
            self.days_left = 999.0
        self.is_critical = self.days_left <= 4.0
        return self

class DoseTakenRequest(BaseModel):
    slot: str = "Morning"  # Morning, Afternoon, Night
    notes: Optional[str] = None

class RefillRequest(BaseModel):
    quantity: Optional[int] = None
    pharmacy_partner: str = "Apollo 24|7 Priority Elder Delivery"

class VitalsRecord(BaseModel):
    id: str
    date: str
    time: str
    blood_sugar_fasting: float  # mg/dL (normal: 70-100)
    blood_sugar_pp: float       # mg/dL (normal: <140)
    systolic_bp: int            # mmHg (normal: 110-120)
    diastolic_bp: int           # mmHg (normal: 70-80)
    spo2: int                   # % (normal: 95-100)
    pulse_rate: int             # bpm (normal: 60-100)
    temp_f: float               # °F (normal: 98.6)
    risk_status: str            # Normal, Borderline, Critical
    clinical_notes: str

class VitalsCreateRequest(BaseModel):
    blood_sugar_fasting: float
    blood_sugar_pp: float
    systolic_bp: int
    diastolic_bp: int
    spo2: int
    pulse_rate: int
    temp_f: float = 98.6
    clinical_notes: Optional[str] = "Routine morning geriatric checkup"

class GradCamFinding(BaseModel):
    condition: str
    probability: float
    severity: str
    anatomical_location: str
    biomarker: str

class GradCamAnalysisResponse(BaseModel):
    scan_id: str
    patient_id: str
    patient_name: str
    scan_modality: str
    model_name: str
    target_layer: str
    available_layers: List[str]
    confidence_score: float
    findings: List[GradCamFinding]
    radiologist_notes: str
    geriatric_clinical_recommendation: str
    heatmap_zones: List[Dict[str, Any]]
