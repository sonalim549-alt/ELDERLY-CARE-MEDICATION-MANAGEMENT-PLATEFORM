import React, { useState } from 'react';
import { X, Activity, Heart, Droplet, Wind, ShieldAlert, CheckCircle } from 'lucide-react';

export default function LogVitalsModal({ isOpen, onClose, onLogVitals }) {
  const [vitals, setVitals] = useState({
    blood_sugar_fasting: 115,
    blood_sugar_pp: 152,
    systolic_bp: 126,
    diastolic_bp: 80,
    spo2: 98,
    pulse_rate: 70,
    temp_f: 98.6,
    clinical_notes: 'Routine morning telemetry check'
  });

  if (!isOpen) return null;

  // Real-time Clinical Risk Triage
  const computeRisk = () => {
    if (vitals.systolic_bp >= 160 || vitals.diastolic_bp >= 100 || vitals.blood_sugar_fasting >= 180 || vitals.spo2 < 92) {
      return { status: 'Critical', color: 'bg-red-100 text-red-800 border-red-300' };
    }
    if (vitals.systolic_bp >= 140 || vitals.diastolic_bp >= 90 || vitals.blood_sugar_fasting >= 135 || vitals.spo2 < 95) {
      return { status: 'Borderline', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { status: 'Normal', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  const risk = computeRisk();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogVitals({
      blood_sugar_fasting: parseFloat(vitals.blood_sugar_fasting),
      blood_sugar_pp: parseFloat(vitals.blood_sugar_pp),
      systolic_bp: parseInt(vitals.systolic_bp),
      diastolic_bp: parseInt(vitals.diastolic_bp),
      spo2: parseInt(vitals.spo2),
      pulse_rate: parseInt(vitals.pulse_rate),
      temp_f: parseFloat(vitals.temp_f),
      clinical_notes: vitals.clinical_notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Log Daily Geriatric Vitals
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Telemetry integrates into 7-day trend chart
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Triage Alert Pill */}
        <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${risk.color}`}>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Automated Clinical Triage:</span>
          </div>
          <span className="uppercase tracking-wider">{risk.status} Range</span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-semibold text-slate-700">
          
          {/* Blood Sugar Section */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-amber-700 font-bold uppercase tracking-wider text-[11px]">
              <Droplet className="w-3.5 h-3.5" />
              <span>Blood Sugar (mg/dL)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-600">Fasting Glucose</label>
                <input
                  type="number"
                  required
                  value={vitals.blood_sugar_fasting}
                  onChange={(e) => setVitals({ ...vitals, blood_sugar_fasting: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">Post-Prandial (PP)</label>
                <input
                  type="number"
                  required
                  value={vitals.blood_sugar_pp}
                  onChange={(e) => setVitals({ ...vitals, blood_sugar_pp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Blood Pressure Section */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 font-bold uppercase tracking-wider text-[11px]">
              <Heart className="w-3.5 h-3.5" />
              <span>Blood Pressure (mmHg)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-600">Systolic (Top)</label>
                <input
                  type="number"
                  required
                  value={vitals.systolic_bp}
                  onChange={(e) => setVitals({ ...vitals, systolic_bp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-600">Diastolic (Bottom)</label>
                <input
                  type="number"
                  required
                  value={vitals.diastolic_bp}
                  onChange={(e) => setVitals({ ...vitals, diastolic_bp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SpO2 & Pulse */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-800">SpO2 Saturation (%)</label>
              <input
                type="number"
                min="70"
                max="100"
                required
                value={vitals.spo2}
                onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Pulse (bpm)</label>
              <input
                type="number"
                min="40"
                max="180"
                required
                value={vitals.pulse_rate}
                onChange={(e) => setVitals({ ...vitals, pulse_rate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block mb-1 text-slate-800">Observation Notes</label>
            <input
              type="text"
              value={vitals.clinical_notes}
              onChange={(e) => setVitals({ ...vitals, clinical_notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Record Vitals
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
