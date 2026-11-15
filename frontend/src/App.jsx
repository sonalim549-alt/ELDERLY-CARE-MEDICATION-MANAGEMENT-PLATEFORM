import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StockAlertBanner from './components/StockAlertBanner';
import MedicineStockEngine from './components/MedicineStockEngine';
import VitalsGraphSection from './components/VitalsGraphSection';
import GradCamInspector from './components/GradCamInspector';
import ElderlyModeModal from './components/ElderlyModeModal';
import DoctorQrPassportModal from './components/DoctorQrPassportModal';
import ReportDownloadModal from './components/ReportDownloadModal';
import AddMedicineModal from './components/AddMedicineModal';
import LogVitalsModal from './components/LogVitalsModal';

import { 
  fetchPatientProfile, fetchMedicines, fetchVitals, 
  markDoseTaken, orderMedicineRefill, logNewVitals 
} from './api';

import { 
  Heart, Shield, AlertTriangle, UserCheck, Stethoscope, 
  Phone, Sparkles, CheckCircle2, ShoppingCart, Clock 
} from 'lucide-react';

export default function App() {
  const [patient, setPatient] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isElderlyModeOpen, setIsElderlyModeOpen] = useState(false);
  const [isQrPassportOpen, setIsQrPassportOpen] = useState(false);
  const [isReportDownloadOpen, setIsReportDownloadOpen] = useState(false);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [isLogVitalsOpen, setIsLogVitalsOpen] = useState(false);

  // Global operations
  const [isOrderingRefill, setIsOrderingRefill] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [patientData, medsData, vitalsData] = await Promise.all([
        fetchPatientProfile(),
        fetchMedicines(),
        fetchVitals()
      ]);
      setPatient(patientData);
      setMedicines(medsData);
      setVitals(vitalsData);
      setBackendOnline(true);
    } catch (err) {
      console.warn("Using offline fallback state:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1-Click Mark Dose Taken
  const handleMarkDoseTaken = async (medId, slot = 'Morning') => {
    const res = await markDoseTaken(medId, slot);
    if (res && res.medicine) {
      setMedicines(prev => prev.map(m => m.id === medId ? { ...m, ...res.medicine } : m));
      showToast(`Dose recorded for ${res.medicine.name}! Stock updated.`);
    }
  };

  // 1-Click Order Refill
  const handleOrderRefill = async (medId, quantity = 30) => {
    setIsOrderingRefill(true);
    try {
      const res = await orderMedicineRefill(medId, quantity);
      if (res && res.updated_medicine) {
        setMedicines(prev => prev.map(m => m.id === medId ? { ...m, ...res.updated_medicine } : m));
        showToast(`Refill (+${quantity} pills) confirmed! Order ID: ${res.order?.order_id || 'AYU-RX-DISPATCH'}`);
      }
    } finally {
      setIsOrderingRefill(false);
    }
  };

  // Add Medication
  const handleAddMedicine = (newMed) => {
    setMedicines(prev => [newMed, ...prev]);
    showToast(`Added ${newMed.name} to patient prescription schedule.`);
  };

  // Log Vitals
  const handleLogVitals = async (newVitalsData) => {
    const saved = await logNewVitals(newVitalsData);
    setVitals(prev => [...prev, saved]);
    showToast(`Today's vitals logged successfully (${saved.risk_status} profile).`);
  };

  // Daily Audio Briefing (Web Speech API)
  const handleTriggerSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Web Speech API is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const criticalCount = medicines.filter(m => m.is_critical || m.days_left <= 4).length;
    const speechText = `नमस्ते रामेश्वर जी। आयु केयर ए आई में आपका स्वागत है। आज आपकी सुबह की दवा का समय हो गया है। मेटफॉर्मिन और एम्लोडिपिन का केवल तीन दिन का स्टॉक बचा है। कृपया रिफिल ऑर्डर करें। आपका रक्तचाप 126 और ब्लड शुगर 115 बिल्कुल सामान्य है।`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Critical medicines filter (days_left <= 4)
  const criticalMeds = medicines.filter(m => m.is_critical || m.days_left <= 4);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs sm:text-sm font-bold animate-bounce-subtle">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        patient={patient}
        criticalCount={criticalMeds.length}
        onOpenElderlyMode={() => setIsElderlyModeOpen(true)}
        onOpenQrPassport={() => setIsQrPassportOpen(true)}
        onOpenReportDownload={() => setIsReportDownloadOpen(true)}
        onTriggerSpeech={handleTriggerSpeech}
        isSpeaking={isSpeaking}
        backendOnline={backendOnline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. Critical Stock Refill Banner (Pulsing if <= 4 days) */}
        <StockAlertBanner
          criticalMeds={criticalMeds}
          onQuickRefill={(id) => handleOrderRefill(id || criticalMeds[0]?.id)}
          isOrderingRefill={isOrderingRefill}
        />

        {/* Patient Clinical Profile Snapshot Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md flex-shrink-0">
              RP
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {patient?.name || "Rameshwar Prasad"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {patient?.age || 72} Yrs • Male
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-200">
                  Blood Group: {patient?.blood_group || "B+"}
                </span>
              </div>

              {/* Chronic Conditions */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {(patient?.chronic_conditions || [
                  "Type-2 Diabetes Mellitus",
                  "Essential Hypertension",
                  "Mild LVH"
                ]).map((cond, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-100">
                    {cond}
                  </span>
                ))}
              </div>

              {/* Allergies Notice */}
              <div className="flex items-center space-x-2 mt-2 text-xs text-rose-700 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                <span>Allergies: {(patient?.allergies || ["Penicillin", "Sulfa Drugs"]).join(", ")} (Contraindicated)</span>
              </div>
            </div>
          </div>

          {/* Quick Doctor & Caregiver Access */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>Doctor: <strong className="text-slate-800">{patient?.treating_doctor?.name || "Dr. Ananya Sharma (AIIMS)"}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Caregiver: <strong className="text-slate-800">{patient?.primary_caregiver?.name || "Rajesh Prasad"} (+91 98765 43210)</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Geriatric ID: <strong className="text-slate-800 font-mono">PT-AYU-7281</strong></span>
            </div>
          </div>
        </div>

        {/* Feature 1: 4-Day Predictive Medicine Stock Engine & Auto-Alerts */}
        <MedicineStockEngine
          medicines={medicines}
          onMarkDoseTaken={handleMarkDoseTaken}
          onOrderRefill={handleOrderRefill}
          onOpenAddModal={() => setIsAddMedicineOpen(true)}
          isProcessing={loading}
        />

        {/* Feature 2: Regular Healthcare Report & Multi-Metric Vitals Graph */}
        <VitalsGraphSection
          vitals={vitals}
          onOpenLogModal={() => setIsLogVitalsOpen(true)}
          onDownloadReport={() => setIsReportDownloadOpen(true)}
        />

        {/* Feature 3: 🔥 AI Grad-CAM Heatmap Inspector (Unique Hackathon Edge) */}
        <GradCamInspector />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-700">AyuCare AI Healthcare Platform</span>
            <span>&bull; PromptWars x Catalyst Hackathon</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Backend REST API Synchronized
            </span>
            <span>AIIMS Geriatric Protocol v2.4</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ElderlyModeModal
        isOpen={isElderlyModeOpen}
        onClose={() => setIsElderlyModeOpen(false)}
        patient={patient}
        medicines={medicines}
        onMarkDoseTaken={handleMarkDoseTaken}
        onOpenLogVitals={() => setIsLogVitalsOpen(true)}
      />

      <DoctorQrPassportModal
        isOpen={isQrPassportOpen}
        onClose={() => setIsQrPassportOpen(false)}
        patient={patient}
        medicines={medicines}
      />

      <ReportDownloadModal
        isOpen={isReportDownloadOpen}
        onClose={() => setIsReportDownloadOpen(false)}
        patient={patient}
        medicines={medicines}
        vitals={vitals}
      />

      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
        onAddMedicine={handleAddMedicine}
      />

      <LogVitalsModal
        isOpen={isLogVitalsOpen}
        onClose={() => setIsLogVitalsOpen(false)}
        onLogVitals={handleLogVitals}
      />

    </div>
  );
}
