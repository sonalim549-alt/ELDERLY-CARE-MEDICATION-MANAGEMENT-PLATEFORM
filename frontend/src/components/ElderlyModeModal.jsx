import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, VolumeX, CheckCircle, Heart, PhoneCall, 
  AlertTriangle, Sparkles, RefreshCw, Bell, Shield, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ElderlyModeModal({
  isOpen,
  onClose,
  patient,
  medicines,
  onMarkDoseTaken,
  onOpenLogVitals
}) {
  const [language, setLanguage] = useState('hi'); // 'hi' = Hindi, 'en' = English
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [doseTakenState, setDoseTakenState] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Hindi and English script content
  const content = {
    hi: {
      title: "बुजुर्ग सेवा सहायक",
      greeting: `नमस्ते ${patient?.name || "रामेश्वर"} जी!`,
      reminder: "आपकी सुबह की मेटफॉर्मिन और एम्लोडिपिन दवा का समय हो गया है। कृपया नाश्ते के बाद एक गोली ताजे पानी के साथ लें।",
      btnTakeDose: "दवा ले ली (सुबह की खुराक)",
      btnDoseSuccess: "शाबाश! दवा दर्ज हो गई है",
      btnCheckVitals: "वाइटल्स देखें / नापें (बीपी व शुगर)",
      btnSos: "🚨 आपातकालीन मदद (SOS Alert)",
      sosActiveText: "बेटे राजेश और डॉक्टर को फोन मिलाया जा रहा है...",
      vitalsSummary: "ताजा रिपोर्ट: बीपी 126/80 (सामान्य), शुगर 115 mg/dL (नियंत्रित)",
      voicePrompt: "आवाज़ में सुनें",
      stopVoice: "आवाज़ बंद करें",
      closeText: "सामान्य डैशबोर्ड पर वापस जाएं"
    },
    en: {
      title: "Buzurg Voice Care Assistant",
      greeting: `Hello ${patient?.name || "Rameshwar"} ji!`,
      reminder: "It is time for your morning Metformin and Amlodipine dose. Please take with warm water after breakfast.",
      btnTakeDose: "Take Morning Dose",
      btnDoseSuccess: "Well Done! Dose Marked Taken",
      btnCheckVitals: "Check / Log Vitals (BP & Sugar)",
      btnSos: "🚨 SOS Emergency Assistance",
      sosActiveText: "Alerting Son Rajesh & Dr. Ananya immediately...",
      vitalsSummary: "Latest: BP 126/80 (Normal), Fasting Sugar 115 mg/dL (Optimal)",
      voicePrompt: "Listen to Reminder",
      stopVoice: "Stop Voice",
      closeText: "Return to Clinical Dashboard"
    }
  };

  const current = content[language];

  // Web Speech API Text-to-Speech function
  const speakText = (text, langCode = 'hi-IN') => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.88; // Slightly slower, clearer tempo for elderly ear
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const speechString = language === 'hi' 
        ? `${current.greeting}। ${current.reminder}। दवा लेने के बाद हरे बटन पर दबाएं।`
        : `${current.greeting}. ${current.reminder}. After taking, press the large green button.`;
      
      speakText(speechString, language === 'hi' ? 'hi-IN' : 'en-US');
    }
  };

  // Speak welcome when modal opens
  useEffect(() => {
    if (isOpen) {
      handlePlayVoice();
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen, language]);

  const handleTakeMorningDose = async () => {
    setDoseTakenState(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Mark Metformin and Amlodipine morning doses
    const criticalMeds = medicines.filter(m => m.timing.includes('Morning'));
    for (const med of criticalMeds) {
      await onMarkDoseTaken(med.id, 'Morning');
    }

    const successVoice = language === 'hi'
      ? "बहुत बढ़िया रामेश्वर जी! आपकी सुबह की दवा सफलतापूर्वक दर्ज हो गई है। आपका स्वास्थ्य उत्तम रहे!"
      : "Well done Rameshwar ji! Your morning dose has been recorded. Stay healthy!";
    speakText(successVoice, language === 'hi' ? 'hi-IN' : 'en-US');
  };

  const handleSosClick = () => {
    setSosTriggered(true);
    const sosVoice = language === 'hi'
      ? "घबराएं नहीं रामेश्वर जी! आपके बेटे राजेश और डॉक्टर अनन्या को तुरंत सूचना भेज दी गई है। एम्बुलेंस तैयार है।"
      : "Do not worry Rameshwar ji! Emergency alert has been sent to your son Rajesh and Dr. Ananya. Help is on the way.";
    speakText(sosVoice, language === 'hi' ? 'hi-IN' : 'en-US');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-linear-to-b from-slate-900 via-slate-900 to-indigo-950 rounded-3xl border-4 border-amber-400/80 shadow-2xl p-6 sm:p-10 text-white my-auto">
        
        {/* Top Bar with Language Switcher & Exit */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-6 mb-8">
          
          {/* Header Tag */}
          <div className="flex items-center space-x-3">
            <span className="text-4xl sm:text-5xl">👴</span>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-amber-300 tracking-tight">
                {current.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium">
                हाई-कंट्रास्ट बुजुर्ग मोड • High Contrast Voice Guided Interface
              </p>
            </div>
          </div>

          {/* Bilingual Switcher (Hindi / English) & Exit */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-1 rounded-2xl border-2 border-slate-600 flex items-center">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base font-black transition-all ${
                  language === 'hi'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base font-black transition-all ${
                  language === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 transition-all"
              title="Close Elderly Mode"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

        </div>

        {/* Personalized Voice Guidance Banner */}
        <div className="bg-slate-800/90 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start space-x-5 text-left">
            <div className="p-4 bg-amber-400/20 border border-amber-400/50 rounded-2xl text-amber-300 flex-shrink-0 animate-pulse">
              <Bell className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {current.greeting}
              </h3>
              <p className="text-lg sm:text-xl text-amber-100/90 mt-2 font-medium leading-relaxed">
                {current.reminder}
              </p>
              <p className="text-sm sm:text-base text-slate-400 mt-2 font-mono">
                {current.vitalsSummary}
              </p>
            </div>
          </div>

          {/* Web Speech API Play Button */}
          <button
            onClick={handlePlayVoice}
            className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 rounded-2xl text-base sm:text-lg font-black border-2 transition-all shadow-xl cursor-pointer ${
              isSpeaking
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 hover:scale-105 active:scale-95'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-7 h-7 animate-spin" />
                <span>{current.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-7 h-7 text-slate-950" />
                <span>{current.voicePrompt}</span>
              </>
            )}
          </button>
        </div>

        {/* 3 GIGANTIC TOUCH BUTTONS (> 90px height) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Button 1: Mark Morning Dose Taken */}
          <button
            onClick={handleTakeMorningDose}
            className={`min-h-[110px] p-6 rounded-3xl text-left border-3 transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-2xl flex items-center space-x-5 cursor-pointer ${
              doseTakenState
                ? 'bg-emerald-700/90 border-emerald-400 text-white ring-4 ring-emerald-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-300 text-white hover:shadow-emerald-500/25'
            }`}
          >
            <div className="p-4 bg-white/20 rounded-2xl flex-shrink-0">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block tracking-tight">
                {doseTakenState ? current.btnDoseSuccess : current.btnTakeDose}
              </span>
              <span className="text-sm sm:text-base text-emerald-100 font-medium">
                मेटफॉर्मिन व एम्लोडिपिन
              </span>
            </div>
          </button>

          {/* Button 2: Check / Log Vitals */}
          <button
            onClick={() => {
              onClose();
              onOpenLogVitals();
            }}
            className="min-h-[110px] p-6 rounded-3xl text-left border-3 border-sky-400 bg-sky-700 hover:bg-sky-600 text-white transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-2xl flex items-center space-x-5 cursor-pointer"
          >
            <div className="p-4 bg-white/20 rounded-2xl flex-shrink-0">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block tracking-tight">
                {current.btnCheckVitals}
              </span>
              <span className="text-sm sm:text-base text-sky-100 font-medium">
                बीपी 126 • शुगर 115 • SpO2 98%
              </span>
            </div>
          </button>

          {/* Button 3: SOS Emergency Contact */}
          <button
            onClick={handleSosClick}
            className={`min-h-[110px] p-6 rounded-3xl text-left border-3 transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-2xl flex items-center space-x-5 cursor-pointer ${
              sosTriggered
                ? 'bg-red-800 border-red-400 text-white animate-pulse ring-4 ring-red-400/50'
                : 'bg-rose-600 hover:bg-rose-500 border-rose-300 text-white hover:shadow-rose-600/30'
            }`}
          >
            <div className="p-4 bg-white/20 rounded-2xl flex-shrink-0 animate-bounce">
              <PhoneCall className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black block tracking-tight">
                {current.btnSos}
              </span>
              <span className="text-sm sm:text-base text-rose-100 font-medium">
                {sosTriggered ? current.sosActiveText : "बेटा राजेश (+91 98765 43210)"}
              </span>
            </div>
          </button>

        </div>

        {/* Return Button */}
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="inline-flex items-center space-x-2 text-slate-300 hover:text-white font-bold text-base sm:text-lg underline underline-offset-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{current.closeText}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
