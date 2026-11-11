import React, { useState } from 'react';
import { 
  CloudSun, 
  Thermometer, 
  CloudRain, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Droplets,
  Layers,
  Sparkles
} from 'lucide-react';
import { simulateClimate } from '../services/api';

export default function ClimateSimulator({ currentInputs, initialCrop }) {
  const [params, setParams] = useState({
    nitrogen: currentInputs?.nitrogen ?? 90,
    phosphorus: currentInputs?.phosphorus ?? 42,
    potassium: currentInputs?.potassium ?? 43,
    temperature: currentInputs?.temperature ?? 20.87,
    humidity: currentInputs?.humidity ?? 82.0,
    ph: currentInputs?.ph ?? 6.5,
    rainfall: currentInputs?.rainfall ?? 202.93,
    temp_delta: 2.5,
    rainfall_percent_delta: -20.0,
    model_choice: 'ensemble'
  });

  const [simulation, setSimulation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRunSimulation = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await simulateClimate(params);
      setSimulation(data);
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const setScenario = (name, tempD, rainD) => {
    setParams(prev => ({
      ...prev,
      temp_delta: tempD,
      rainfall_percent_delta: rainD
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <span>NumPy Monte Carlo Climate Resilience Simulator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate climate warming and precipitation disruption scenarios to test crop survival and identify resilient alternatives.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setScenario('Paris Goal (+1.5°C)', 1.5, -5)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              +1.5°C Paris Goal
            </button>
            <button
              onClick={() => setScenario('High Warming (+3°C)', 3.0, -20)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
            >
              +3.0°C Warming & -20% Rain
            </button>
            <button
              onClick={() => setScenario('Severe Drought', 3.5, -45)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition"
            >
              Severe Drought (-45%)
            </button>
            <button
              onClick={() => setScenario('Excess Monsoon', 1.0, 35)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition"
            >
              Excess Monsoon (+35%)
            </button>
          </div>
        </div>

        {/* Sliders Form */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Temperature Delta */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" />
                <span>Projected Temperature Shift (ΔT)</span>
              </span>
              <span className="text-sm font-extrabold text-amber-700">
                {params.temp_delta >= 0 ? `+${params.temp_delta}` : params.temp_delta} °C
              </span>
            </div>
            <input
              type="range"
              min="-3"
              max="6"
              step="0.5"
              value={params.temp_delta}
              onChange={(e) => setParams(p => ({ ...p, temp_delta: parseFloat(e.target.value) }))}
              className="w-full accent-amber-500 h-2 bg-amber-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>Baseline: {params.temperature.toFixed(1)}°C</span>
              <span className="font-semibold text-amber-800">
                Simulated: {(params.temperature + params.temp_delta).toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* Rainfall Delta */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center space-x-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" />
                <span>Precipitation Variance (ΔRain)</span>
              </span>
              <span className="text-sm font-extrabold text-blue-700">
                {params.rainfall_percent_delta >= 0 ? `+${params.rainfall_percent_delta}` : params.rainfall_percent_delta} %
              </span>
            </div>
            <input
              type="range"
              min="-60"
              max="60"
              step="5"
              value={params.rainfall_percent_delta}
              onChange={(e) => setParams(p => ({ ...p, rainfall_percent_delta: parseFloat(e.target.value) }))}
              className="w-full accent-blue-500 h-2 bg-blue-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>Baseline: {params.rainfall.toFixed(1)} mm</span>
              <span className="font-semibold text-blue-800">
                Simulated: {(params.rainfall * (1 + params.rainfall_percent_delta / 100)).toFixed(1)} mm
              </span>
            </div>
          </div>

        </div>

        {/* Execute Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-200 flex items-center space-x-2 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running 60 Monte Carlo Perturbations...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Climate Simulation</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Simulation Results View */}
      {simulation && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                NumPy Simulation Output (60 Synthetic Perturbations)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Simulated Climate: {simulation.simulated_temp}°C • {simulation.simulated_rainfall} mm
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              simulation.resilience_rating.includes('High Resilience')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : (simulation.resilience_rating.includes('Moderate')
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-red-50 text-red-800 border-red-200')
            }`}>
              {simulation.resilience_rating}
            </span>
          </div>

          {/* Primary Viable Crop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Most Viable Crop Under New Climate
                </span>
                <h4 className="text-3xl font-extrabold capitalize mt-1 text-white">
                  {simulation.most_viable_crop}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Under the projected shift ({simulation.temp_delta >= 0 ? `+${simulation.temp_delta}` : simulation.temp_delta}°C temperature and {simulation.rainfall_delta_percent}% rainfall), this crop showed the highest physiological survival and yield potential.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-xs text-slate-300">Viability Retention:</span>
                <span className="text-2xl font-black text-amber-300">
                  {simulation.crop_retention_rate}%
                </span>
              </div>
            </div>

            {/* Distribution of viable crops */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Crop Viability Distribution Under Microclimate Perturbation
                </h4>
                <div className="space-y-3">
                  {simulation.scenario_distribution.map((item) => (
                    <div key={item.crop}>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1 capitalize">
                        <span>{item.crop}</span>
                        <span className="font-bold text-slate-900">{item.probability_share}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${item.probability_share}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                Vectorized Monte Carlo calculations include Gaussian microclimatic fluctuations (±0.4°C temp, ±5% rainfall, ±2% humidity).
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
