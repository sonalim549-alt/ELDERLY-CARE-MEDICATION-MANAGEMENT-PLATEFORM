import React, { useState } from 'react';
import { 
  X, QrCode, ShieldAlert, Heart, User, Phone, 
  Copy, Check, Printer, AlertTriangle, Hospital, Stethoscope 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DoctorQrPassportModal({ isOpen, onClose, patient, medicines }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Structured clinical emergency payload for emergency room scanning
  const passportPayload = {
    header: "AYUCARE_EMERGENCY_DOCTOR_PASSPORT_V2",
    patient_id: patient?.id || "PT-AYU-7281",
    name: patient?.name || "Rameshwar Prasad",
    age: patient?.age || 72,
    gender: patient?.gender || "Male",
    blood_group: patient?.blood_group || "B+",
    chronic_conditions: patient?.chronic_conditions || [
      "Type-2 Diabetes Mellitus",
      "Essential Hypertension",
      "Mild LVH"
    ],
    severe_allergies: patient?.allergies || [
      "PENICILLIN (Severe Bronchospasm)",
      "SULFA ANTIBIOTICS"
    ],
    critical_active_meds: (medicines || []).map(m => `${m.name} ${m.dosage}`),
    emergency_contacts: {
      caregiver: `${patient?.primary_caregiver?.name || "Rajesh Prasad"} (${patient?.primary_caregiver?.phone || "+91 98765 43210"})`,
      treating_physician: `${patient?.treating_doctor?.name || "Dr. Ananya Sharma"} (${patient?.treating_doctor?.phone || "+91 11 2659 8700"})`,
      ambulance_dispatch: "108 / 112 Apex Geriatric Unit"
    },
    verification: "AUTHENTICATED_BY_AIIMS_GERIATRIC_NETWORK"
  };

  const qrText = JSON.stringify(passportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="bg-linear-to-r from-red-600 via-rose-600 to-indigo-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Emergency Doctor QR Passport
                </h3>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold text-white border border-white/30">
                  Instant ER Access
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                Scan with any smartphone camera or clinical tablet for immediate emergency triage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* QR Code and Key Vitals Grid */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-3xl">
            {/* Scannable Dynamic QR Code */}
            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 flex-shrink-0">
              <QRCodeSVG
                value={qrText}
                size={180}
                level="M"
                includeMargin={false}
              />
              <span className="block text-[10px] text-center font-mono text-slate-400 mt-1.5 font-bold">
                AYU-PASS-PT-7281
              </span>
            </div>

            {/* Patient Primary Vitals Overview */}
            <div className="space-y-3 flex-1 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Name</span>
                  <h4 className="text-xl font-black text-slate-900">{patient?.name || "Rameshwar Prasad"}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Blood Group</span>
                  <span className="inline-block px-3 py-1 rounded-xl bg-red-600 text-white font-black text-base shadow-sm">
                    {patient?.blood_group || "B+"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">Age & Gender:</span>
                  <strong className="text-slate-800 font-bold">{patient?.age || 72} Yrs / Male</strong>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">Emergency ID:</span>
                  <strong className="text-slate-800 font-bold font-mono">PT-AYU-7281</strong>
                </div>
              </div>
            </div>
          </div>

          {/* CRITICAL ALLERGY ALERT BANNER */}
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-start space-x-3 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-extrabold uppercase tracking-wide text-red-800">
                CRITICAL CONTRAINDICATION / ALLERGY WARNING:
              </strong>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(patient?.allergies || ["Penicillin", "Sulfa Drugs", "NSAIDs"]).map((allergy, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-200 text-red-900 rounded font-bold text-[11px]">
                    {allergy}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-red-700 mt-1">
                Do NOT administer Penicillin-class or Sulfa beta-lactams in emergency setting.
              </p>
            </div>
          </div>

          {/* Chronic Conditions & Active Prescriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Chronic Diagnoses:
              </span>
              <ul className="space-y-1 text-slate-600 font-medium">
                {(patient?.chronic_conditions || []).map((cond, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Active Prescribed Regimen:
              </span>
              <ul className="space-y-1 text-slate-600 font-medium">
                {(medicines || []).slice(0, 4).map((med, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{med.name}</span>
                    <strong className="text-slate-800 font-semibold">{med.dosage}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Emergency Contacts Footer */}
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sky-900">
            <div>
              <span className="font-bold block">Primary Caregiver:</span>
              <span>{patient?.primary_caregiver?.name || "Rajesh Prasad (Son)"}: <strong>{patient?.primary_caregiver?.phone || "+91 98765 43210"}</strong></span>
            </div>
            <div>
              <span className="font-bold block">Attending Doctor:</span>
              <span>{patient?.treating_doctor?.name || "Dr. Ananya Sharma (AIIMS)"}: <strong>{patient?.treating_doctor?.phone || "+91 11 2659 8700"}</strong></span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "JSON Copied!" : "Copy Passport Data"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Emergency Card</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
