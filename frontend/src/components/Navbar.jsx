import React from 'react';
import { 
  Heart, AlertTriangle, QrCode, FileText, Volume2, 
  VolumeX, Activity, ShieldCheck, UserCheck, Sparkles 
} from 'lucide-react';

export default function Navbar({
  patient,
  criticalCount,
  onOpenElderlyMode,
  onOpenQrPassport,
  onOpenReportDownload,
  onTriggerSpeech,
  isSpeaking,
  backendOnline
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Mission Tag */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-sky-600 to-teal-500 shadow-md text-white">
              <Heart className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-sky-700 via-teal-700 to-indigo-800 bg-clip-text text-transparent">
                  AyuCare AI
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  v2.4 Hackathon Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Intelligent Elderly Care & Medication Ecosystem • PromptWars x Catalyst
              </p>
            </div>
          </div>

          {/* Patient Quick Card */}
          <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              RP
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-sm">
                <span>{patient?.name || "Rameshwar Prasad"}</span>
                <span className="px-1.5 py-0.2 rounded-sm bg-slate-200 text-slate-700 text-[11px] font-semibold">
                  Age {patient?.age || 72}
                </span>
                <span className="px-1.5 py-0.2 rounded-sm bg-rose-100 text-rose-700 text-[11px] font-bold">
                  {patient?.blood_group || "B+"}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600 inline" /> Son: Rajesh (+91 98765 43210)
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Daily Audio Briefing (Web Speech API) */}
            <button
              onClick={onTriggerSpeech}
              title="Daily Audio Briefing (Web Speech API)"
              className={`inline-flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                isSpeaking 
                  ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-300 animate-pulse' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600 animate-spin" />
                  <span className="hidden md:inline font-bold">Speaking...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-600" />
                  <span className="hidden md:inline">Voice Briefing</span>
                </>
              )}
            </button>

            {/* Emergency Doctor QR Passport Modal */}
            <button
              onClick={onOpenQrPassport}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition-all hover:border-slate-400"
            >
              <QrCode className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Doctor QR</span>
            </button>

            {/* Healthcare Report PDF */}
            <button
              onClick={onOpenReportDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Report PDF</span>
            </button>

            {/* 🔥 ELDERLY MODE TOGGLE (Buzurg Voice Assistant) */}
            <button
              onClick={onOpenElderlyMode}
              className="relative group inline-flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-linear-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-base sm:text-lg">👴</span>
              <span className="tracking-wide">बुजुर्ग मोड</span>
              <span className="hidden xl:inline text-xs font-semibold bg-black/20 px-1.5 py-0.5 rounded-md">
                Voice Assistant
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
