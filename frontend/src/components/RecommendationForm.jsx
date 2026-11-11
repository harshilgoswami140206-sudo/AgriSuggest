import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Layers, 
  RotateCcw,
  Info
} from 'lucide-react';
import { fetchPresets } from '../services/api';

export default function RecommendationForm({ onPredict, isLoading, onOpenSensorModal }) {
  const [formData, setFormData] = useState({
    nitrogen: 90.0,
    phosphorus: 42.0,
    potassium: 43.0,
    temperature: 20.87,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.93,
    model_choice: 'ensemble',
    top_k: 5,
    notes: ''
  });

  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState('gangetic_alluvial');

  useEffect(() => {
    fetchPresets()
      .then(res => {
        if (res.presets) {
          setPresets(res.presets);
        }
      })
      .catch(err => console.error('Presets error:', err));
  }, []);

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setFormData(prev => ({
      ...prev,
      ...preset.data
    }));
  };

  const handleChange = (field, val) => {
    const numVal = parseFloat(val);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(numVal) ? val : numVal
    }));
    setActivePreset(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleReset = () => {
    setFormData({
      nitrogen: 90.0,
      phosphorus: 42.0,
      potassium: 43.0,
      temperature: 20.87,
      humidity: 82.0,
      ph: 6.5,
      rainfall: 202.93,
      model_choice: 'ensemble',
      top_k: 5,
      notes: ''
    });
    setActivePreset(null);
  };

  // Helper for pH coloring
  const getPhColor = (ph) => {
    if (ph < 6.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (ph > 7.5) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getPhLabel = (ph) => {
    if (ph < 5.5) return 'Strongly Acidic';
    if (ph < 6.5) return 'Slightly Acidic';
    if (ph <= 7.5) return 'Neutral (Ideal)';
    if (ph <= 8.5) return 'Moderately Alkaline';
    return 'Strongly Alkaline';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header & Presets Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Input Soil & Climate Conditions</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input test card parameters or select a regional preset. No physical sensors required.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSensorModal}
            className="self-start sm:self-auto flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-100/70 text-amber-900 border border-amber-200 hover:bg-amber-200/70 transition"
          >
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>How it works without sensors</span>
          </button>
        </div>

        {/* Quick Regional Presets */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            One-Click Regional Agro-Climatic Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-1'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                  title={preset.description}
                >
                  {preset.name.split(' (')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SECTION 1: Soil Fertility Parameters */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Soil Macro-Nutrients & pH</span>
              </span>
              <span className="text-xs text-slate-500">From Soil Health Card</span>
            </div>

            {/* Nitrogen (N) */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Nitrogen (N)</span>
                <span className="font-bold text-emerald-700">{formData.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="1"
                value={formData.nitrogen}
                onChange={(e) => handleChange('nitrogen', e.target.value)}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0 (Deficient)</span>
                <span>70 (Optimal)</span>
                <span>140 (Heavy)</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Phosphorus (P)</span>
                <span className="font-bold text-emerald-700">{formData.phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="145"
                step="1"
                value={formData.phosphorus}
                onChange={(e) => handleChange('phosphorus', e.target.value)}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5 (Low)</span>
                <span>50 (Moderate)</span>
                <span>145 (Very High)</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Potassium (K)</span>
                <span className="font-bold text-emerald-700">{formData.potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="205"
                step="1"
                value={formData.potassium}
                onChange={(e) => handleChange('potassium', e.target.value)}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5 (Low)</span>
                <span>45 (Optimal)</span>
                <span>205 (High / Fruit Vines)</span>
              </div>
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
                <span>Soil pH</span>
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getPhColor(formData.ph)}`}>
                    {getPhLabel(formData.ph)}
                  </span>
                  <span className="font-bold text-slate-900">{formData.ph.toFixed(1)}</span>
                </div>
              </div>
              <input
                type="range"
                min="3.5"
                max="9.5"
                step="0.1"
                value={formData.ph}
                onChange={(e) => handleChange('ph', e.target.value)}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span className="text-red-500">3.5 (Acidic)</span>
                <span className="text-emerald-600 font-semibold">6.5 - 7.5 (Neutral)</span>
                <span className="text-indigo-500">9.5 (Alkaline)</span>
              </div>
            </div>

          </div>

          {/* SECTION 2: Climate & Meteorological Conditions */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <CloudRain className="w-4 h-4 text-teal-600" />
                <span>Atmospheric & Meteorological Conditions</span>
              </span>
              <span className="text-xs text-slate-500">Local Climate / Forecast</span>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mean Temperature</span>
                </span>
                <span className="font-bold text-amber-700">{formData.temperature.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="8"
                max="45"
                step="0.5"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>8°C (Cool/Mountain)</span>
                <span>25°C (Temperate)</span>
                <span>45°C (Tropical Heat)</span>
              </div>
            </div>

            {/* Humidity */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Relative Humidity</span>
                </span>
                <span className="font-bold text-blue-700">{formData.humidity.toFixed(0)} %</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                step="1"
                value={formData.humidity}
                onChange={(e) => handleChange('humidity', e.target.value)}
                className="w-full accent-blue-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>15% (Dry Arid)</span>
                <span>60% (Moderate)</span>
                <span>100% (Saturated Monsoon)</span>
              </div>
            </div>

            {/* Rainfall */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Rainfall Precipitation</span>
                </span>
                <span className="font-bold text-cyan-700">{formData.rainfall.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="1"
                value={formData.rainfall}
                onChange={(e) => handleChange('rainfall', e.target.value)}
                className="w-full accent-cyan-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>20 mm (Drought/Dryland)</span>
                <span>120 mm (Medium)</span>
                <span>300 mm (Monsoon Flood)</span>
              </div>
            </div>

            {/* Model Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Recommendation Engine:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ensemble', label: 'Ensemble Blended', badge: '99.55%' },
                  { id: 'random_forest', label: 'Random Forest', badge: '99.55%' },
                  { id: 'xgboost', label: 'XGBoost', badge: '99.09%' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, model_choice: m.id }))}
                    className={`p-2 rounded-lg text-left border transition-all text-xs ${
                      formData.model_choice === m.id
                        ? 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="truncate">{m.label}</div>
                    <div className="text-[10px] text-emerald-600 font-bold">{m.badge} Acc</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all transform active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Agronomic Matrices...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recommend Optimal Crops</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
