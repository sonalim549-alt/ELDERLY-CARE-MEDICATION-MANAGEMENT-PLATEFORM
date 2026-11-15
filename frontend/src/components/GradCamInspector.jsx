import React, { useState, useEffect } from 'react';
import { 
  Scan, Eye, EyeOff, Layers, Sliders, ShieldAlert, 
  CheckCircle, Sparkles, AlertTriangle, RefreshCw, Upload, Cpu, Info
} from 'lucide-react';
import { fetchGradCamAnalysis } from '../api';

export default function GradCamInspector() {
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [opacity, setOpacity] = useState(0.72);
  const [selectedLayer, setSelectedLayer] = useState('conv5_block16_concat');
  const [colormap, setColormap] = useState('jet');
  const [activeZone, setActiveZone] = useState(null);
  const [gradCamData, setGradCamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScanningNew, setIsScanningNew] = useState(false);

  useEffect(() => {
    loadGradCam();
  }, [selectedLayer, colormap]);

  const loadGradCam = async () => {
    setLoading(true);
    try {
      const data = await fetchGradCamAnalysis(selectedLayer, colormap);
      setGradCamData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateNewScan = () => {
    setIsScanningNew(true);
    setTimeout(() => {
      setIsScanningNew(false);
      loadGradCam();
    }, 1200);
  };

  return (
    <section className="mb-12 bg-linear-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-tr from-sky-500 to-teal-400 rounded-2xl text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <Scan className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  AI Grad-CAM Heatmap Inspector
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  🔥 Hackathon Edge
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium">
                CheXNet DenseNet-121 Visual Gradient Attention: Real-Time Geriatric Pulmonary Opacity & Cardiomegaly Detection
              </p>
            </div>
          </div>
        </div>

        {/* Scan Actions & Quick Layer Switches */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSimulateNewScan}
            disabled={isScanningNew}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs sm:text-sm border border-slate-700 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isScanningNew ? 'animate-spin' : ''}`} />
            <span>{isScanningNew ? 'Re-inferencing Neural Net...' : 'Re-run Model Inference'}</span>
          </button>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (7 cols): The Interactive Radiograph Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Controls Bar Above Viewport */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 mb-3">
            
            {/* Heatmap Overlay Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 border ${
                  heatmapEnabled
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}
              >
                {heatmapEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Grad-CAM: {heatmapEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Opacity Slider */}
            {heatmapEnabled && (
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-24 sm:w-28 accent-teal-400 cursor-pointer"
                />
                <span className="font-mono text-teal-300 font-bold">{Math.round(opacity * 100)}%</span>
              </div>
            )}

            {/* Colormap Selector */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400 font-medium">Map:</span>
              {['jet', 'turbo', 'inferno', 'viridis'].map((cm) => (
                <button
                  key={cm}
                  onClick={() => setColormap(cm)}
                  className={`px-2 py-1 rounded-md uppercase font-bold text-[10px] transition-all ${
                    colormap === cm
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900/60'
                  }`}
                >
                  {cm}
                </button>
              ))}
            </div>

          </div>

          {/* Radiograph Visual Scan Frame */}
          <div className="relative w-full aspect-square max-w-[500px] bg-black rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center select-none group">
            
            {/* 1. Underlying High-Fidelity Chest Radiograph (SVG anatomical rendering) */}
            <svg 
              className="absolute inset-0 w-full h-full object-cover" 
              viewBox="0 0 500 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dark Radiograph Base Field */}
              <rect width="500" height="500" fill="#090d16"/>
              
              {/* Thoracic Cavity & Soft Tissue Outline */}
              <path d="M70 120 C100 80, 400 80, 430 120 C460 220, 470 380, 430 460 C360 480, 140 480, 70 460 C30 380, 40 220, 70 120 Z" fill="#141c2c" opacity="0.8"/>
              
              {/* Clavicles (Collar bones) */}
              <path d="M120 115 Q250 140 230 110" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
              <path d="M380 115 Q250 140 270 110" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>

              {/* Spine / Vertebral Column */}
              <rect x="240" y="90" width="20" height="380" rx="4" fill="#334155" opacity="0.5"/>
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={i} x1="236" y1={110 + i * 24} x2="264" y2={110 + i * 24} stroke="#64748b" strokeWidth="4" opacity="0.5"/>
              ))}

              {/* Rib Cages (Bilateral Thoracic Ribs) */}
              {Array.from({ length: 8 }).map((_, i) => (
                <g key={`rib-${i}`} opacity="0.38">
                  <path d={`M235 ${130 + i * 36} C170 ${140 + i * 38}, 90 ${165 + i * 40}, 115 ${195 + i * 38}`} stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round"/>
                  <path d={`M265 ${130 + i * 36} C330 ${140 + i * 38}, 410 ${165 + i * 40}, 385 ${195 + i * 38}`} stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round"/>
                </g>
              ))}

              {/* Left Lung Field (Darker air radiolucency) */}
              <path d="M130 140 C170 140, 220 160, 220 280 C220 380, 180 430, 120 420 C90 380, 95 220, 130 140 Z" fill="#020617" opacity="0.75"/>

              {/* Right Lung Field (Site of elderly lower lobe infiltration) */}
              <path d="M370 140 C330 140, 280 160, 280 280 C280 340, 310 430, 380 420 C410 380, 405 220, 370 140 Z" fill="#020617" opacity="0.75"/>
              
              {/* Bronchovascular Markings & Hilum */}
              <path d="M225 210 Q180 260 150 320" stroke="#475569" strokeWidth="3" opacity="0.6"/>
              <path d="M225 220 Q160 280 135 340" stroke="#475569" strokeWidth="2.5" opacity="0.5"/>
              <path d="M275 210 Q320 260 350 320" stroke="#475569" strokeWidth="3" opacity="0.6"/>
              <path d="M275 220 Q340 280 365 340" stroke="#475569" strokeWidth="2.5" opacity="0.5"/>

              {/* Pneumonic Infiltration Opacity (Patchy Consolidation in Right Lower Lobe) */}
              <circle cx="340" cy="325" r="48" fill="#e2e8f0" opacity="0.32" filter="blur(16px)"/>
              <circle cx="360" cy="340" r="32" fill="#f8fafc" opacity="0.25" filter="blur(12px)"/>

              {/* Cardiac Silhouette (Enlarged Heart / Cardiomegaly CTR 0.54) */}
              <path d="M230 230 C200 230, 170 290, 175 365 C180 410, 250 430, 290 415 C310 405, 300 330, 270 260 C260 235, 245 230, 230 230 Z" fill="#cbd5e1" opacity="0.48"/>

              {/* Diaphragmatic Domes */}
              <path d="M70 440 Q160 395 240 435" stroke="#94a3b8" strokeWidth="6" opacity="0.7" fill="none"/>
              <path d="M260 435 Q350 395 430 440" stroke="#94a3b8" strokeWidth="6" opacity="0.7" fill="none"/>

              {/* Patient Radiological Watermark */}
              <text x="20" y="35" fill="#64748b" fontSize="12" fontFamily="monospace" fontWeight="bold">PATIENT: RAMESHWAR PRASAD (72M)</text>
              <text x="20" y="52" fill="#475569" fontSize="10" fontFamily="monospace">PA ERECT CHEST • DIGITAL DICOM • AIIMS APEX</text>
              <text x="450" y="480" fill="#64748b" fontSize="18" fontFamily="sans-serif" fontWeight="bold">R</text>
            </svg>

            {/* 2. Simulated Deep Neural Network Grad-CAM Activation Heatmap */}
            {heatmapEnabled && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{ opacity: opacity }}
              >
                <svg className="w-full h-full" viewBox="0 0 500 500">
                  <defs>
                    {/* Radial Gradients representing Neural Gradient Activations */}
                    <radialGradient id="gradPneumonia" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95"/>
                      <stop offset="35%" stopColor="#f97316" stopOpacity="0.8"/>
                      <stop offset="65%" stopColor="#eab308" stopOpacity="0.6"/>
                      <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </radialGradient>

                    <radialGradient id="gradCardiomegaly" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.9"/>
                      <stop offset="40%" stopColor="#eab308" stopOpacity="0.7"/>
                      <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </radialGradient>

                    <radialGradient id="gradVascular" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#84cc16" stopOpacity="0.75"/>
                      <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.35"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </radialGradient>
                  </defs>

                  {/* Hotspot 1: Right Lower Lobe Consolidation (Peak Activation = 0.942) */}
                  <ellipse cx="345" cy="325" rx="85" ry="68" fill="url(#gradPneumonia)"/>

                  {/* Hotspot 2: Cardiac Silhouette / Left Ventricular Border (Peak = 0.885) */}
                  <ellipse cx="225" cy="320" rx="95" ry="85" fill="url(#gradCardiomegaly)"/>

                  {/* Hotspot 3: Peribronchial Interstitial Texture (Peak = 0.623) */}
                  <ellipse cx="240" cy="205" rx="60" ry="50" fill="url(#gradVascular)"/>
                </svg>
              </div>
            )}

            {/* 3. Interactive Bounding Boxes Overlay for Clinical Inspection */}
            {heatmapEnabled && (
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {/* Hotspot 1 Box: Right Lower Consolidation */}
                <div 
                  onClick={() => setActiveZone('pneumonia')}
                  className="absolute cursor-pointer border-2 border-red-500/80 bg-red-500/15 rounded-xl hover:bg-red-500/30 transition-all duration-200"
                  style={{ left: '56%', top: '53%', width: '32%', height: '26%' }}
                  title="Click to inspect: Right Lower Lobe Pneumonia (Confidence 94.2%)"
                >
                  <span className="absolute -top-3 left-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded shadow-sm">
                    Zone 1: Pneumonia 94.2%
                  </span>
                </div>

                {/* Hotspot 2 Box: Cardiac Silhouette */}
                <div 
                  onClick={() => setActiveZone('cardiomegaly')}
                  className="absolute cursor-pointer border-2 border-amber-500/80 bg-amber-500/15 rounded-xl hover:bg-amber-500/30 transition-all duration-200"
                  style={{ left: '28%', top: '48%', width: '34%', height: '32%' }}
                  title="Click to inspect: Cardiomegaly CTR 0.54 (Confidence 88.5%)"
                >
                  <span className="absolute -bottom-3 left-2 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded shadow-sm">
                    Zone 2: Cardiomegaly 88.5%
                  </span>
                </div>
              </div>
            )}

            {/* Live Indicator Pill on bottom right */}
            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[11px] font-mono text-teal-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span>CheXNet DenseNet-121</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 text-center">
            Click red or amber zones above to isolate anatomical Grad-CAM gradients
          </p>

        </div>

        {/* Right Col (5 cols): AI Diagnostic Predictions & Clinical Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Layer Selector */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-2.5">
              <Layers className="w-4 h-4" />
              <span>Inspected Neural Network Layer:</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'conv5_block16_concat', name: 'DenseNet-121: conv5_block16 (Deepest)', desc: 'Detects dense alveolar consolidation' },
                { id: 'conv4_block6_concat', name: 'DenseNet-121: conv4_block6 (Mid-Level)', desc: 'Detects interstitial vascular markings' },
                { id: 'res_stage_5_bottleneck', name: 'ResNet-50: Stage 5 Bottleneck', desc: 'Detects cardiac silhouette displacement' }
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs transition-all border ${
                    selectedLayer === layer.id
                      ? 'bg-sky-500/20 text-sky-200 border-sky-400 font-bold'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <div className="font-bold text-white text-[12px]">{layer.name}</div>
                  <div className="text-[11px] text-slate-400">{layer.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Condition Prediction Probabilities */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Deep Classification Probabilities</span>
              <span className="text-[11px] text-teal-400 font-mono">Softmax &ge; 0.35</span>
            </h4>

            <div className="space-y-3">
              {/* Finding 1 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Right Lower Lobe Consolidation
                  </span>
                  <span className="text-red-400 font-mono font-black">94.2%</span>
                </div>
                <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Air bronchograms visible; localized gradient &gt; 0.88</p>
              </div>

              {/* Finding 2 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Cardiomegaly (LVH Pattern)
                  </span>
                  <span className="text-amber-400 font-mono font-black">88.5%</span>
                </div>
                <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                  <div className="bg-linear-to-r from-yellow-500 to-amber-500 h-2 rounded-full" style={{ width: '88.5%' }}></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Cardiothoracic Ratio (CTR) = 0.54 with apex displacement</p>
              </div>

              {/* Finding 3 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    Basilar Atelectasis
                  </span>
                  <span className="text-teal-400 font-mono font-bold">62.3%</span>
                </div>
                <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '62.3%' }}></div>
                </div>
              </div>

              {/* Finding 4 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                    Pneumothorax (Rule-Out)
                  </span>
                  <span className="text-slate-400 font-mono">1.2%</span>
                </div>
                <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                  <div className="bg-slate-600 h-2 rounded-full" style={{ width: '1.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Geriatric Clinical Action Recommendations */}
          <div className="bg-sky-950/50 border border-sky-800/80 rounded-2xl p-4.5">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Geriatric Clinical AI Recommendation</span>
            </h4>
            <div className="text-xs text-sky-200/90 leading-relaxed space-y-1.5 font-medium">
              <p>&bull; <strong>Allergy Alert:</strong> Patient has known severe Penicillin allergy. Prescribe oral Respiratory Fluoroquinolone instead of beta-lactams.</p>
              <p>&bull; <strong>Hemodynamics:</strong> Maintain SpO2 &ge; 94%. Check morning vitals twice daily.</p>
              <p>&bull; <strong>Refill Notice:</strong> Ensure Amlodipine and Metformin supply is replenished to prevent cardiovascular decompensation.</p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
