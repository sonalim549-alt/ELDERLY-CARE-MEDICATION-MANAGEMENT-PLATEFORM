const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const fallbackPatient = {
  id: "PT-AYU-7281",
  name: "Rameshwar Prasad",
  age: 72,
  gender: "Male",
  blood_group: "B+",
  weight_kg: 68.5,
  height_cm: 168.0,
  chronic_conditions: [
    "Type-2 Diabetes Mellitus (12 yrs history)",
    "Essential Hypertension (Stage 2 controlled)",
    "Mild Left Ventricular Hypertrophy (LVH)",
    "Geriatric Osteoarthritis (Bilateral Knees)"
  ],
  allergies: [
    "Penicillin (Severe Urticaria / Bronchospasm)",
    "Sulfa Antibiotics (Cutaneous rash)",
    "NSAIDs (Dyspepsia / Gastric Irritation)"
  ],
  primary_caregiver: {
    name: "Rajesh Prasad",
    relation: "Son (Primary Caregiver)",
    phone: "+91 98765 43210",
    email: "rajesh.prasad@ayucare.in",
    is_emergency_primary: true
  },
  treating_doctor: {
    name: "Dr. Ananya Sharma, MD (AIIMS)",
    specialty: "Senior Geriatrician & Clinical Diabetologist",
    hospital: "AIIMS Apex Geriatric Medicine Center, New Delhi",
    phone: "+91 11 2659 8700",
    reg_no: "DMC-R-48921"
  },
  emergency_contact: "+91 98765 43210 / 108 Emergency Ambulance",
  ablation_notes: "Patient requires large-font text and audio prompts for adherence. Critical drug interaction warning active for Sulfa & Penicillin classes."
};

export const fallbackMedicines = [
  {
    id: "MED-01",
    name: "Metformin Hydrochloride",
    dosage: "500 mg",
    instructions: "1 tablet twice daily with meals (Morning & Night)",
    timing: ["Morning", "Night"],
    total_pills: 6,
    daily_consumption: 2.0,
    pill_unit: "tablets",
    days_left: 3.0,
    is_critical: true,
    category: "Antidiabetic",
    color_tag: "emerald",
    last_taken_at: "Yesterday 08:30 PM",
    adherence_status: "Pending Morning Dose",
    refill_pack_size: 30,
    requires_prescription: true
  },
  {
    id: "MED-02",
    name: "Amlodipine Besylate",
    dosage: "5 mg",
    instructions: "1 tablet early morning before breakfast for Blood Pressure",
    timing: ["Morning"],
    total_pills: 3,
    daily_consumption: 1.0,
    pill_unit: "tablets",
    days_left: 3.0,
    is_critical: true,
    category: "Cardiac / Antihypertensive",
    color_tag: "rose",
    last_taken_at: "Yesterday 07:15 AM",
    adherence_status: "Pending Morning Dose",
    refill_pack_size: 30,
    requires_prescription: true
  },
  {
    id: "MED-03",
    name: "Telmisartan",
    dosage: "40 mg",
    instructions: "1 tablet morning after breakfast for arterial hypertension",
    timing: ["Morning"],
    total_pills: 4,
    daily_consumption: 1.0,
    pill_unit: "tablets",
    days_left: 4.0,
    is_critical: true,
    category: "Cardiac / ARB",
    color_tag: "amber",
    last_taken_at: "Yesterday 08:45 AM",
    adherence_status: "Pending Morning Dose",
    refill_pack_size: 30,
    requires_prescription: true
  },
  {
    id: "MED-04",
    name: "Atorvastatin",
    dosage: "10 mg",
    instructions: "1 tablet at bedtime for lipid control and plaque stabilization",
    timing: ["Night"],
    total_pills: 24,
    daily_consumption: 1.0,
    pill_unit: "tablets",
    days_left: 24.0,
    is_critical: false,
    category: "Statin / Lipid Control",
    color_tag: "blue",
    last_taken_at: "Yesterday 09:30 PM",
    adherence_status: "Taken Yesterday",
    refill_pack_size: 30,
    requires_prescription: true
  },
  {
    id: "MED-05",
    name: "Pantoprazole Gastro-Resistant",
    dosage: "40 mg",
    instructions: "1 tablet empty stomach in the morning 30 mins before tea",
    timing: ["Morning"],
    total_pills: 18,
    daily_consumption: 1.0,
    pill_unit: "tablets",
    days_left: 18.0,
    is_critical: false,
    category: "Gastroprotective (PPI)",
    color_tag: "indigo",
    last_taken_at: "Yesterday 06:45 AM",
    adherence_status: "Pending Morning Dose",
    refill_pack_size: 30,
    requires_prescription: false
  },
  {
    id: "MED-06",
    name: "Shelcal 500 (Calcium + Vit D3)",
    dosage: "500 mg / 250 IU",
    instructions: "1 tablet daily after lunch for bone mineral density",
    timing: ["Afternoon"],
    total_pills: 28,
    daily_consumption: 1.0,
    pill_unit: "tablets",
    days_left: 28.0,
    is_critical: false,
    category: "Bone Supplement",
    color_tag: "cyan",
    last_taken_at: "Yesterday 01:30 PM",
    adherence_status: "Scheduled Afternoon",
    refill_pack_size: 30,
    requires_prescription: false
  }
];

export const fallbackVitals = [
  { id: "VIT-01", date: "Nov 09", blood_sugar_fasting: 142.0, blood_sugar_pp: 195.0, systolic_bp: 148, diastolic_bp: 92, spo2: 95, pulse_rate: 82, temp_f: 98.6, risk_status: "High", clinical_notes: "Mild morning fatigue" },
  { id: "VIT-02", date: "Nov 10", blood_sugar_fasting: 138.0, blood_sugar_pp: 188.0, systolic_bp: 144, diastolic_bp: 90, spo2: 96, pulse_rate: 78, temp_f: 98.4, risk_status: "Borderline", clinical_notes: "Post-lunch BP elevated" },
  { id: "VIT-03", date: "Nov 11", blood_sugar_fasting: 134.0, blood_sugar_pp: 179.0, systolic_bp: 140, diastolic_bp: 88, spo2: 96, pulse_rate: 76, temp_f: 98.5, risk_status: "Borderline", clinical_notes: "Adherence confirmed" },
  { id: "VIT-04", date: "Nov 12", blood_sugar_fasting: 128.0, blood_sugar_pp: 172.0, systolic_bp: 136, diastolic_bp: 85, spo2: 97, pulse_rate: 74, temp_f: 98.6, risk_status: "Normal", clinical_notes: "Stable glycemic trends" },
  { id: "VIT-05", date: "Nov 13", blood_sugar_fasting: 122.0, blood_sugar_pp: 164.0, systolic_bp: 132, diastolic_bp: 84, spo2: 97, pulse_rate: 72, temp_f: 98.4, risk_status: "Normal", clinical_notes: "Target range maintained" },
  { id: "VIT-06", date: "Nov 14", blood_sugar_fasting: 118.0, blood_sugar_pp: 158.0, systolic_bp: 128, diastolic_bp: 82, spo2: 98, pulse_rate: 72, temp_f: 98.6, risk_status: "Normal", clinical_notes: "Optimal hemodynamic control" },
  { id: "VIT-07", date: "Nov 15", blood_sugar_fasting: 115.0, blood_sugar_pp: 152.0, systolic_bp: 126, diastolic_bp: 80, spo2: 98, pulse_rate: 70, temp_f: 98.6, risk_status: "Normal", clinical_notes: "Morning vitals optimal" }
];

export async function fetchPatientProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch (err) {
    console.warn("Using offline patient profile:", err.message);
    return fallbackPatient;
  }
}

export async function fetchMedicines() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/medicines`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch (err) {
    console.warn("Using offline medicines:", err.message);
    return fallbackMedicines;
  }
}

export async function fetchMedicineAlerts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/medicines/alerts`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch (err) {
    const critical = fallbackMedicines.filter(m => m.is_critical);
    return {
      total_critical: critical.length,
      has_critical_alerts: critical.length > 0,
      alerts: critical.map(m => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        total_pills: m.total_pills,
        days_left: m.days_left,
        urgency: m.days_left <= 2 ? "CRITICAL" : "HIGH ALERT",
        message: `CRITICAL: ${m.days_left} Days Stock Left (${m.total_pills} ${m.pill_unit} remaining)`
      }))
    };
  }
}

export async function markDoseTaken(medId, slot = "Morning") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/medicines/${medId}/take`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, notes: "Marked via AyuCare UI" })
    });
    if (!res.ok) throw new Error("Failed to mark dose");
    return await res.json();
  } catch (err) {
    console.warn("Simulating dose taken locally:", err.message);
    const med = fallbackMedicines.find(m => m.id === medId);
    if (med) {
      med.total_pills = Math.max(0, med.total_pills - 1);
      med.days_left = Math.round((med.total_pills / med.daily_consumption) * 10) / 10;
      med.is_critical = med.days_left <= 4;
      med.last_taken_at = "Just now";
      med.adherence_status = `Taken Today (${slot})`;
      return { success: true, medicine: med, days_left: med.days_left };
    }
    return { success: false };
  }
}

export async function orderMedicineRefill(medId, quantity = 30) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/medicines/${medId}/refill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity, pharmacy_partner: "Apollo 24|7 Priority Geriatric Refill" })
    });
    if (!res.ok) throw new Error("Refill request failed");
    return await res.json();
  } catch (err) {
    console.warn("Simulating refill locally:", err.message);
    const med = fallbackMedicines.find(m => m.id === medId);
    if (med) {
      med.total_pills += quantity;
      med.days_left = Math.round((med.total_pills / med.daily_consumption) * 10) / 10;
      med.is_critical = med.days_left <= 4;
      med.adherence_status = "Refill Dispensed (+30 Pills)";
      return {
        success: true,
        order: {
          order_id: `AYU-RX-${Date.now().toString().slice(-6)}`,
          quantity_added: quantity,
          estimated_delivery: "Within 2 Hours (Senior Citizen Fast-Track)",
          status: "Confirmed & Dispatched"
        },
        updated_medicine: med
      };
    }
    return { success: false };
  }
}

export async function fetchVitals() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vitals`);
    if (!res.ok) throw new Error("Backend unavailable");
    return await res.json();
  } catch (err) {
    console.warn("Using offline vitals:", err.message);
    return fallbackVitals;
  }
}

export async function logNewVitals(vitalsData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vitalsData)
    });
    if (!res.ok) throw new Error("Failed to log vitals");
    return await res.json();
  } catch (err) {
    console.warn("Logging vitals locally:", err.message);
    const newRecord = {
      id: `VIT-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      ...vitalsData,
      risk_status: (vitalsData.systolic_bp >= 140 || vitalsData.blood_sugar_fasting >= 135) ? "Borderline" : "Normal"
    };
    fallbackVitals.push(newRecord);
    return newRecord;
  }
}

export async function fetchGradCamAnalysis(layer = "conv5_block16_concat", colormap = "jet", threshold = 0.35) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/gradcam/sample?layer=${layer}&colormap=${colormap}&threshold=${threshold}`);
    if (!res.ok) throw new Error("Grad-CAM backend unavailable");
    return await res.json();
  } catch (err) {
    console.warn("Using offline Grad-CAM analysis:", err.message);
    return {
      scan_id: "XRAY-GER-2026-904",
      patient_id: "PT-AYU-7281",
      patient_name: "Rameshwar Prasad (Age 72)",
      scan_modality: "High-Resolution Digital PA Chest Radiograph (16-bit DICOM)",
      model_name: "CheXNet-DenseNet121-Geriatric-v2.4",
      target_layer: layer,
      available_layers: ["conv5_block16_concat", "conv4_block6_concat", "res_stage_5_bottleneck"],
      confidence_score: 94.2,
      findings: [
        {
          condition: "Right Lower Lobe Consolidation (Pneumonia)",
          probability: 94.2,
          severity: "Moderate - Early Infiltration",
          anatomical_location: "Right retrocardiac & basilar bronchopulmonary segment",
          biomarker: "Air bronchograms visible; localized gradient activation > 0.88"
        },
        {
          condition: "Cardiomegaly (LV Hypertrophy Pattern)",
          probability: 88.5,
          severity: "Mild to Moderate (CTR = 0.54)",
          anatomical_location: "Cardiac silhouette, transverse thoracic diameter enlargement",
          biomarker: "Left ventricular contour displacement toward left hemithorax"
        },
        {
          condition: "Basilar Atelectasis",
          probability: 62.3,
          severity: "Sub-segmental",
          anatomical_location: "Bilateral costophrenic recesses",
          biomarker: "Mild haziness without blunt obliteration of sulcus"
        },
        {
          condition: "Pneumothorax",
          probability: 1.2,
          severity: "Negative / Rule-out",
          anatomical_location: "Apical pleural interfaces",
          biomarker: "Intact visceral pleural line; normal peripheral vascular arborization"
        }
      ],
      radiologist_notes: "PA Chest Radiograph demonstrates asymmetric patchy consolidation in the right lower lobe consistent with early bacterial bronchopneumonia in a 72-year-old male. Cardiac silhouette demonstrates mild cardiomegaly (CTR 0.54). Grad-CAM visual gradients confirm deep neural attention localized to right lower paracardiac field.",
      geriatric_clinical_recommendation: "1. Empirical coverage with respiratory fluoroquinolone (due to penicillin allergy).\n2. Monitor continuous SpO2 pulse oximetry (target >= 94%).\n3. Repeat chest radiograph in 10 days.",
      heatmap_zones: [
        { id: "zone-1", label: "Consolidation Hotspot (Alpha: 0.92)", cx: 68, cy: 64, rx: 18, ry: 14, peak_activation: 0.942, condition: "Pneumonia", color_peak: "#ef4444" },
        { id: "zone-2", label: "Cardiac Contour Silhouette (Alpha: 0.84)", cx: 44, cy: 60, rx: 22, ry: 19, peak_activation: 0.885, condition: "Cardiomegaly", color_peak: "#f97316" },
        { id: "zone-3", label: "Bronchovascular Congestion (Alpha: 0.65)", cx: 48, cy: 40, rx: 14, ry: 12, peak_activation: 0.623, condition: "Vascular Engorgement", color_peak: "#84cc16" }
      ]
    };
  }
}

export async function fetchDoctorQrData() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/passport/qr-data`);
    if (!res.ok) throw new Error("Passport endpoint unavailable");
    return await res.json();
  } catch (err) {
    return {
      passport_id: "AYU-PASS-PT-AYU-7281",
      patient: {
        name: "Rameshwar Prasad",
        age: 72,
        blood_group: "B+",
        conditions: fallbackPatient.chronic_conditions,
        allergies: fallbackPatient.allergies,
        active_medications: fallbackMedicines.map(m => `${m.name} (${m.dosage})`),
        critical_stock_warning: ["Metformin Hydrochloride", "Amlodipine Besylate", "Telmisartan"]
      },
      caregiver: fallbackPatient.primary_caregiver,
      attending_physician: fallbackPatient.treating_doctor,
      emergency_dispatch_ambulance: "108 / 112 Apex Geriatric Unit"
    };
  }
}
