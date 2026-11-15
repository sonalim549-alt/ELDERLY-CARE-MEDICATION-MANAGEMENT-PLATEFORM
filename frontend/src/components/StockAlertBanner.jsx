import React from 'react';
import { AlertOctagon, RefreshCw, ShoppingCart, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

export default function StockAlertBanner({ criticalMeds, onQuickRefill, isOrderingRefill }) {
  if (!criticalMeds || criticalMeds.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-linear-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl p-5 sm:p-6 shadow-xl mb-8 glow-critical border-2 border-red-400/60 animate-bounce-subtle">
      {/* Background ambient pattern */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start space-x-4">
          <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl flex-shrink-0 animate-pulse border border-white/30">
            <AlertOctagon className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-red-700 shadow-sm animate-pulse-fast">
                🚨 CRITICAL: &le; 4 Days Stock Left Alert Active
              </span>
              <span className="text-xs bg-red-900/60 px-2.5 py-0.5 rounded-full font-medium text-red-100 border border-red-400/40">
                Predictive Geriatric Refill Buffer Triggered
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black mt-1.5 tracking-tight text-white">
              Emergency Stock Refill Required for {criticalMeds.length} Medication{criticalMeds.length > 1 ? 's' : ''}
            </h3>

            <p className="text-sm text-red-50/90 mt-1 max-w-2xl leading-relaxed">
              Calculated consumption burn rate shows supply dropping below safe geriatric thresholds. 
              Prevent treatment gap risk for hypertension and diabetes management.
            </p>

            {/* List of critical medications with countdown */}
            <div className="flex flex-wrap gap-2.5 mt-3.5">
              {criticalMeds.map((med) => (
                <div 
                  key={med.id}
                  className="flex items-center space-x-2 bg-black/25 backdrop-blur-md border border-white/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-red-300 animate-ping"></span>
                  <span className="font-bold">{med.name}</span>
                  <span className="text-red-200">({med.dosage})</span>
                  <span className="bg-red-500/80 px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider text-white">
                    {med.days_left}d left • {med.total_pills} pills
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1-Click Fast-Track Order Refill CTA */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 flex-shrink-0">
          <button
            onClick={() => onQuickRefill(criticalMeds[0]?.id)}
            disabled={isOrderingRefill}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-red-700 hover:bg-red-50 font-black text-sm shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isOrderingRefill ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Dispatching Refill...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 text-red-600" />
                <span>1-Click Order Refill (+30 Pills)</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-red-100 font-medium text-center md:text-right">
            ⚡ Apollo 24|7 & Netmeds Senior Express (Within 2 Hours)
          </span>
        </div>
      </div>
    </div>
  );
}
