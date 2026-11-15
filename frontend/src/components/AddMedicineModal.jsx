import React, { useState } from 'react';
import { X, Plus, Pill, AlertCircle, Check } from 'lucide-react';

export default function AddMedicineModal({ isOpen, onClose, onAddMedicine }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    instructions: '',
    timing: ['Morning'],
    total_pills: 30,
    daily_consumption: 1.0,
    category: 'Antidiabetic',
    refill_pack_size: 30
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      alert('Please fill drug name and dosage');
      return;
    }

    const daysLeft = Math.round((formData.total_pills / (formData.daily_consumption || 1)) * 10) / 10;

    const newMed = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      dosage: formData.dosage,
      instructions: formData.instructions || 'Take as advised by physician',
      timing: formData.timing,
      total_pills: parseInt(formData.total_pills) || 30,
      daily_consumption: parseFloat(formData.daily_consumption) || 1.0,
      pill_unit: 'tablets',
      days_left: daysLeft,
      is_critical: daysLeft <= 4,
      category: formData.category,
      color_tag: 'sky',
      adherence_status: 'Scheduled',
      refill_pack_size: parseInt(formData.refill_pack_size) || 30,
      requires_prescription: true
    };

    onAddMedicine(newMed);
    onClose();
  };

  const toggleTiming = (time) => {
    if (formData.timing.includes(time)) {
      if (formData.timing.length > 1) {
        setFormData({ ...formData, timing: formData.timing.filter(t => t !== time) });
      }
    } else {
      setFormData({ ...formData, timing: [...formData.timing, time] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Prescribe New Medication
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Predictive stock buffer will calculate automatically
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block mb-1 text-slate-800">Medicine Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Glimepiride, Rosuvastatin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-800">Dosage *</label>
              <input
                type="text"
                required
                placeholder="e.g. 1 mg, 10 mg"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Cardiac / Antihypertensive">Cardiac / Antihypertensive</option>
                <option value="Statin / Lipid Control">Statin / Lipid Control</option>
                <option value="Gastroprotective (PPI)">Gastroprotective (PPI)</option>
                <option value="Bone Supplement">Bone Supplement</option>
                <option value="Respiratory">Respiratory</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-800">Initial Total Pills</label>
              <input
                type="number"
                min="1"
                value={formData.total_pills}
                onChange={(e) => setFormData({ ...formData, total_pills: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Daily Consumption (Pills/Day)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={formData.daily_consumption}
                onChange={(e) => setFormData({ ...formData, daily_consumption: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-slate-800">Timing Slots</label>
            <div className="flex items-center space-x-2">
              {['Morning', 'Afternoon', 'Night'].map((slot) => {
                const active = formData.timing.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleTiming(slot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-800">Clinical Instructions</label>
            <input
              type="text"
              placeholder="e.g. Take with warm water before meals"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

          {/* Action CTAs */}
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
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Medication
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
