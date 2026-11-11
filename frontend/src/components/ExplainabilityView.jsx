import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Activity, 
  Wind, 
  Thermometer, 
  Droplet,
  Compass,
  Cpu
} from 'lucide-react';

export default function ExplainabilityView({ result }) {
  if (!result || !result.feature_comparison) return null;

  const { feature_comparison, climate_analysis, nutrient_analysis, entropy_uncertainty } = result;

  const getStatusBadge = (status) => {
    if (status === 'Within Ideal Range') {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Optimal</span>
        </span>
      );
    } else if (status === 'Below Optimal Range') {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>Low</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <AlertCircle className="w-3 h-3 text-blue-600" />
          <span>High</span>
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Explainable AI: Why Was {result.recommended_crop.toUpperCase()} Recommended?</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical alignment between your field inputs and the crop's multi-dimensional feature centroid.
          </p>
        </div>

        {/* Entropy certainty */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium self-start sm:self-auto border border-slate-200">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Shannon Entropy: <strong>{entropy_uncertainty} bits</strong></span>
          <span className="text-[10px] text-emerald-600 font-semibold">(High Certainty)</span>
        </div>
      </div>

      {/* Feature Alignment Table / Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-50/70">
              <th className="py-2.5 px-3">Agronomic Parameter</th>
              <th className="py-2.5 px-3">Your Field Input</th>
              <th className="py-2.5 px-3">Optimal Crop Centroid (Mean)</th>
              <th className="py-2.5 px-3">Viable Range (Min - Max)</th>
              <th className="py-2.5 px-3 text-right">Alignment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {feature_comparison.map((f) => (
              <tr key={f.feature} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-800">
                  {f.feature === 'N' ? 'Nitrogen (N)' :
                   f.feature === 'P' ? 'Phosphorus (P)' :
                   f.feature === 'K' ? 'Potassium (K)' :
                   f.feature === 'temperature' ? 'Temperature' :
                   f.feature === 'humidity' ? 'Relative Humidity' :
                   f.feature === 'ph' ? 'Soil pH' : 'Rainfall Precipitation'}
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">
                  {f.input_value} <span className="font-normal text-slate-400 text-[11px]">{f.unit}</span>
                </td>
                <td className="py-3 px-3 font-medium text-emerald-700">
                  {f.optimal_mean} <span className="font-normal text-slate-400 text-[11px]">{f.unit}</span>
                </td>
                <td className="py-3 px-3 text-slate-500">
                  {f.optimal_min} – {f.optimal_max} <span className="text-slate-400 text-[10px]">{f.unit}</span>
                </td>
                <td className="py-3 px-3 text-right">
                  {getStatusBadge(f.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Biometeorological & Physics Derived Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* VPD Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
            <Wind className="w-4 h-4 text-teal-600" />
            <span>Vapor Pressure Deficit (VPD)</span>
          </div>
          <div className="text-xl font-black text-teal-700">
            {climate_analysis.vpd_kpa} <span className="text-xs font-normal text-slate-500">kPa</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Zone: <strong className="text-slate-700">{climate_analysis.transpiration_zone}</strong>
          </p>
          <div className="text-[10px] text-slate-400 mt-1">
            Computed via NumPy using Tetens formula for foliar transpiration kinetics.
          </div>
        </div>

        {/* Thermal Comfort */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
            <Thermometer className="w-4 h-4 text-amber-600" />
            <span>Plant Thermal Comfort</span>
          </div>
          <div className="text-xl font-black text-amber-700">
            {climate_analysis.thermal_comfort_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Climate Regime: <strong className="text-slate-700">{climate_analysis.climate_type}</strong>
          </p>
          <div className="text-[10px] text-slate-400 mt-1">
            Enzymatic optimum bell-curve model centered at 25°C.
          </div>
        </div>

        {/* NPK Proportions */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>NPK Stoichiometric Balance</span>
          </div>
          <div className="text-xl font-black text-emerald-700">
            {nutrient_analysis.nutrient_balance_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Proportions: <strong className="text-slate-700">N:{nutrient_analysis.n_ratio}% P:{nutrient_analysis.p_ratio}% K:{nutrient_analysis.k_ratio}%</strong>
          </p>
          <div className="text-[10px] text-slate-400 mt-1">
            Status: <span className="font-semibold text-emerald-700">{nutrient_analysis.balance_status}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
