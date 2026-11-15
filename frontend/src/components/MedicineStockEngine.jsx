import React, { useState } from 'react';
import { 
  Pill, AlertCircle, CheckCircle2, ShoppingBag, Clock, 
  Flame, PlusCircle, Check, Info, ShieldAlert, Sparkles, RefreshCw, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MedicineStockEngine({
  medicines,
  onMarkDoseTaken,
  onOrderRefill,
  onOpenAddModal,
  isProcessing
}) {
  const [filter, setFilter] = useState('ALL');
  const [takingMedId, setTakingMedId] = useState(null);
  const [refillingMedId, setRefillingMedId] = useState(null);

  const categories = [
    { key: 'ALL', label: 'All Medications' },
    { key: 'CRITICAL', label: '🚨 Critical Stock (≤ 4 Days)' },
    { key: 'Cardiac / Antihypertensive', label: 'Cardiac & BP' },
    { key: 'Antidiabetic', label: 'Antidiabetic' },
    { key: 'Gastroprotective (PPI)', label: 'Gastroprotective' },
    { key: 'Bone Supplement', label: 'Supplements' }
  ];

  const filteredMeds = medicines.filter(med => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return med.is_critical || med.days_left <= 4;
    return med.category.toLowerCase().includes(filter.toLowerCase());
  });

  const handleTakeDose = async (med) => {
    setTakingMedId(med.id);
    try {
      await onMarkDoseTaken(med.id, med.timing[0] || 'Morning');
      // Trigger joyful celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.75 }
      });
    } finally {
      setTakingMedId(null);
    }
  };

  const handleRefill = async (med) => {
    setRefillingMedId(med.id);
    try {
      await onOrderRefill(med.id, med.refill_pack_size || 30);
    } finally {
      setRefillingMedId(null);
    }
  };

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-sky-100 rounded-xl text-sky-700">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                4-Day Predictive Medicine Stock Engine
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Automated pill burn-rate formula: <code className="bg-slate-100 text-sky-800 px-1.5 py-0.5 rounded text-xs font-semibold">days_left = total_pills &divide; daily_consumption</code>
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
              filter === cat.key
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-xs'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeds.map((med) => {
          const isCritical = med.is_critical || med.days_left <= 4;
          const daysLeftNumber = Number(med.days_left);
          
          return (
            <div
              key={med.id}
              className={`relative bg-white rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                isCritical 
                  ? 'border-red-300 ring-2 ring-red-400/30 glow-critical shadow-lg' 
                  : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                {/* Header: Critical Status Badge & Category */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {med.category}
                  </span>

                  {isCritical ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-300 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                      <span>CRITICAL: &le; 4 Days Stock Left</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SAFE: {med.days_left}d Left</span>
                    </span>
                  )}
                </div>

                {/* Medicine Title & Dosage */}
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {med.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                    {med.dosage}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Burn rate: {med.daily_consumption} {med.pill_unit}/day
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {med.instructions}
                </p>

                {/* Timing Badges */}
                <div className="flex items-center space-x-1.5 mt-3">
                  {med.timing.map(time => (
                    <span 
                      key={time}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{time}</span>
                    </span>
                  ))}
                  {med.last_taken_at && (
                    <span className="text-[11px] text-emerald-700 font-medium ml-auto flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {med.adherence_status}
                    </span>
                  )}
                </div>

                {/* Pill Stock Visual Gauge */}
                <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Inventory Status:</span>
                    <span className={isCritical ? "text-red-700 font-black" : "text-slate-800"}>
                      {med.total_pills} {med.pill_unit} ({med.days_left} Days remaining)
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isCritical 
                          ? 'bg-linear-to-r from-red-500 to-rose-600 animate-pulse' 
                          : 'bg-linear-to-r from-teal-500 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, (med.total_pills / 30) * 100))}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-medium">
                    <span>Empty (0)</span>
                    <span className="text-red-600 font-bold">&le; 4 Days Buffer</span>
                    <span>Full (30+)</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-slate-100">
                {/* 1-Click Mark Dose Taken */}
                <button
                  onClick={() => handleTakeDose(med)}
                  disabled={takingMedId === med.id || med.total_pills <= 0}
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {takingMedId === med.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Dose Taken</span>
                    </>
                  )}
                </button>

                {/* 1-Click Order Refill */}
                <button
                  onClick={() => handleRefill(med)}
                  disabled={refillingMedId === med.id}
                  className={`inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-50 cursor-pointer ${
                    isCritical
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                  }`}
                >
                  {refillingMedId === med.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Ordering...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Refill (+30)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
