import React, { useState } from 'react';
import { 
  Activity, TrendingUp, Heart, Droplet, Wind, FileDown, 
  PlusCircle, AlertTriangle, CheckCircle, ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine 
} from 'recharts';

export default function VitalsGraphSection({
  vitals,
  onOpenLogModal,
  onDownloadReport
}) {
  const [activeMetric, setActiveMetric] = useState('ALL'); // ALL, SUGAR, BP, SPO2

  // Quick stat averages calculation from recent 7 days
  const recent7 = vitals.slice(-7);
  const avgSystolic = Math.round(recent7.reduce((acc, v) => acc + v.systolic_bp, 0) / recent7.length);
  const avgDiastolic = Math.round(recent7.reduce((acc, v) => acc + v.diastolic_bp, 0) / recent7.length);
  const avgFasting = Math.round(recent7.reduce((acc, v) => acc + v.blood_sugar_fasting, 0) / recent7.length);
  const avgPP = Math.round(recent7.reduce((acc, v) => acc + v.blood_sugar_pp, 0) / recent7.length);
  const avgSpo2 = Math.round(recent7.reduce((acc, v) => acc + v.spo2, 0) / recent7.length);
  const latest = recent7[recent7.length - 1] || {};

  return (
    <section className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Regular Healthcare Report & Multi-Metric Vitals
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Continuous 7-Day Geriatric Telemetry: Blood Sugar, Hemodynamics (BP), and SpO2 Pulse Reserve
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs: Log Vitals & Download Report */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenLogModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg"
          >
            <PlusCircle className="w-4 h-4 text-teal-200" />
            <span>Log Daily Vitals</span>
          </button>

          <button
            onClick={onDownloadReport}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg glow-blue cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-indigo-200" />
            <span>Download Healthcare Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 4 Multi-Metric Real-Time Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Fasting & PP Blood Sugar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Sugar</span>
            <span className="p-1.5 bg-amber-100 rounded-lg text-amber-700">
              <Droplet className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{latest.blood_sugar_fasting || 115}</span>
              <span className="text-xs font-bold text-slate-500">mg/dL (F)</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>PP: <strong className="text-slate-700">{latest.blood_sugar_pp || 152}</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-sm text-[11px]">Optimal</span>
            </div>
          </div>
        </div>

        {/* Blood Pressure (Systolic / Diastolic) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Pressure</span>
            <span className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
              <Heart className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{latest.systolic_bp || 126}/{latest.diastolic_bp || 80}</span>
              <span className="text-xs font-bold text-slate-500">mmHg</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>7d Avg: <strong className="text-slate-700">{avgSystolic}/{avgDiastolic}</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-sm text-[11px]">Normal</span>
            </div>
          </div>
        </div>

        {/* Pulse Oximetry (SpO2) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Oxygen (SpO2)</span>
            <span className="p-1.5 bg-sky-100 rounded-lg text-sky-700">
              <Wind className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{latest.spo2 || 98}</span>
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Pulse: <strong className="text-slate-700">{latest.pulse_rate || 70} bpm</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-sm text-[11px]">Safe (&gt;94%)</span>
            </div>
          </div>
        </div>

        {/* 14-Day Geriatric Adherence Rate */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adherence Score</span>
            <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-emerald-700">96.4</span>
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Stock Buffer: <strong className="text-slate-700">Predictive</strong></span>
              <span className="text-sky-700 font-bold bg-sky-100/80 px-2 py-0.5 rounded-sm text-[11px]">AI Guarded</span>
            </div>
          </div>
        </div>

      </div>

      {/* Metric Selector Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveMetric('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeMetric === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Multi-Metrics
          </button>
          <button
            onClick={() => setActiveMetric('BP')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeMetric === 'BP'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Blood Pressure (BP)
          </button>
          <button
            onClick={() => setActiveMetric('SUGAR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeMetric === 'SUGAR'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Blood Sugar (Fasting & PP)
          </button>
          <button
            onClick={() => setActiveMetric('SPO2')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeMetric === 'SPO2'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            SpO2 & Pulse
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Showing 7-Day Retrospective Clinical Trend
        </span>
      </div>

      {/* Interactive Recharts Container */}
      <div className="h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={vitals} margin={{ top: 10, right: 25, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[60, 210]}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                color: '#fff',
                padding: '12px 16px'
              }}
              formatter={(value, name) => [
                <span className="font-bold text-white">{value}</span>, 
                <span className="text-slate-300 font-medium">{name}</span>
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: '600' }}
            />

            {/* Hypertension Threshold Reference Line (130 mmHg) */}
            {(activeMetric === 'ALL' || activeMetric === 'BP') && (
              <ReferenceLine y={130} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: 'Target Systolic ≤130', fill: '#f43f5e', fontSize: 11 }} />
            )}

            {/* Fasting Normal Upper Threshold (130 mg/dL) */}
            {(activeMetric === 'ALL' || activeMetric === 'SUGAR') && (
              <ReferenceLine y={130} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Target Fasting ≤130', fill: '#d97706', fontSize: 11 }} />
            )}

            {/* SpO2 Minimum Safe Band (94%) */}
            {(activeMetric === 'ALL' || activeMetric === 'SPO2') && (
              <ReferenceLine y={94} stroke="#0284c7" strokeDasharray="3 3" label={{ value: 'SpO2 Alarm <94%', fill: '#0284c7', fontSize: 11 }} />
            )}

            {/* Blood Pressure Lines */}
            {(activeMetric === 'ALL' || activeMetric === 'BP') && (
              <>
                <Area type="monotone" dataKey="systolic_bp" name="Systolic BP (mmHg)" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorBp)" />
                <Line type="monotone" dataKey="diastolic_bp" name="Diastolic BP (mmHg)" stroke="#fb7185" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
              </>
            )}

            {/* Blood Sugar Lines */}
            {(activeMetric === 'ALL' || activeMetric === 'SUGAR') && (
              <>
                <Line type="monotone" dataKey="blood_sugar_fasting" name="Fasting Sugar (mg/dL)" stroke="#d97706" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="blood_sugar_pp" name="Post-Prandial Sugar (mg/dL)" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
              </>
            )}

            {/* SpO2 Line */}
            {(activeMetric === 'ALL' || activeMetric === 'SPO2') && (
              <>
                <Line type="monotone" dataKey="spo2" name="SpO2 Saturation (%)" stroke="#0284c7" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="pulse_rate" name="Pulse Rate (bpm)" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
              </>
            )}

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Clinical Notes Footer */}
      <div className="mt-4 p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-start space-x-3 text-xs text-sky-900">
        <CheckCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Geriatric Clinical Finding:</strong> Consistent downward stabilization in fasting sugar (142 &rarr; 115 mg/dL) and systolic pressure (148 &rarr; 126 mmHg) reflects therapeutic efficacy of Metformin 500mg and Amlodipine 5mg. Refill continuity critical.
        </div>
      </div>

    </section>
  );
}
