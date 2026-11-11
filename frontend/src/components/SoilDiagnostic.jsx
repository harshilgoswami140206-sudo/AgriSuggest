import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  Leaf, 
  Beaker, 
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { analyzeSoil } from '../services/api';

export default function SoilDiagnostic({ currentInputs, onOpenSensorModal }) {
  const [soilInputs, setSoilInputs] = useState({
    nitrogen: currentInputs?.nitrogen ?? 90,
    phosphorus: currentInputs?.phosphorus ?? 42,
    potassium: currentInputs?.potassium ?? 43,
    ph: currentInputs?.ph ?? 6.5
  });

  const [diagnostic, setDiagnostic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const data = await analyzeSoil(soilInputs);
      setDiagnostic(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [soilInputs]);

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <span>Soil Health & Stoichiometric NPK Diagnostic</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Vectorized soil health indexing, nutrient deficit calculation, and organic fertilizer dosing.
            </p>
          </div>

          <button
            onClick={onOpenSensorModal}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Soil Health Card Guide</span>
          </button>
        </div>

        {/* Live Input Adjusters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Nitrogen (N)</span>
              <span className="text-emerald-700 font-bold">{soilInputs.nitrogen} kg/ha</span>
            </div>
            <input
              type="range"
              min="0"
              max="140"
              value={soilInputs.nitrogen}
              onChange={(e) => setSoilInputs(p => ({ ...p, nitrogen: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Phosphorus (P)</span>
              <span className="text-emerald-700 font-bold">{soilInputs.phosphorus} kg/ha</span>
            </div>
            <input
              type="range"
              min="5"
              max="145"
              value={soilInputs.phosphorus}
              onChange={(e) => setSoilInputs(p => ({ ...p, phosphorus: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Potassium (K)</span>
              <span className="text-emerald-700 font-bold">{soilInputs.potassium} kg/ha</span>
            </div>
            <input
              type="range"
              min="5"
              max="205"
              value={soilInputs.potassium}
              onChange={(e) => setSoilInputs(p => ({ ...p, potassium: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Soil pH</span>
              <span className="text-emerald-700 font-bold">{soilInputs.ph.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="3.5"
              max="9.5"
              step="0.1"
              value={soilInputs.ph}
              onChange={(e) => setSoilInputs(p => ({ ...p, ph: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

        </div>

      </div>

      {/* Diagnostic Outputs */}
      {diagnostic && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Card 1: Soil Health Index */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Composite Soil Health Index</span>
              </div>
              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-5xl font-black text-slate-900">
                  {diagnostic.soil_health_index}
                </span>
                <span className="text-slate-400 text-sm font-semibold">/ 100</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">pH Class:</span>
                  <span className="font-bold text-slate-800">{diagnostic.ph_rating}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nitrogen Level:</span>
                  <span className="font-bold text-slate-800">{diagnostic.nitrogen_status}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Phosphorus Level:</span>
                  <span className="font-bold text-slate-800">{diagnostic.phosphorus_status}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500">Potassium Level:</span>
                  <span className="font-bold text-slate-800">{diagnostic.potassium_status}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Evaluated with multi-criteria Gaussian penalty weighting across biological pH availability.
            </div>
          </div>

          {/* Card 2: Stoichiometric Balance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>Stoichiometric N:P:K Proportions</span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">Nitrogen Share</span>
                    <span className="font-bold text-slate-900">{diagnostic.nutrient_ratios.n_ratio}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${diagnostic.nutrient_ratios.n_ratio}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">Phosphorus Share</span>
                    <span className="font-bold text-slate-900">{diagnostic.nutrient_ratios.p_ratio}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${diagnostic.nutrient_ratios.p_ratio}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">Potassium Share</span>
                    <span className="font-bold text-slate-900">{diagnostic.nutrient_ratios.k_ratio}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${diagnostic.nutrient_ratios.k_ratio}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total NPK:</span>
                  <span className="font-bold text-slate-900">{diagnostic.nutrient_ratios.total_npk_ppm} kg/ha</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500">N:P:K Balance Score:</span>
                  <span className="font-bold text-emerald-700">{diagnostic.nutrient_ratios.nutrient_balance_score} / 100</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Optimal baseline ratio: 4:2:1 (N:P:K) for cereal and field crops.
            </div>
          </div>

          {/* Card 3: Actionable Fertilizer Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Beaker className="w-4 h-4 text-emerald-600" />
                <span>Fertilizer Dosage & Organic Alternatives</span>
              </div>

              <div className="mt-4 space-y-3">
                {diagnostic.fertilizer_plan && diagnostic.fertilizer_plan.length > 0 ? (
                  diagnostic.fertilizer_plan.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                      <div className="font-bold text-emerald-950 flex items-center justify-between">
                        <span>{item.nutrient}</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                          {item.action}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium mt-1">{item.quantity_guide}</p>
                      <p className="text-slate-500 mt-1 text-[11px] italic">
                        <strong>Eco-alternative:</strong> {item.organic_alternative}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center space-x-2 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Macro-nutrients are currently well-balanced. Minimal synthetic supplementation needed.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              {diagnostic.sensor_free_note}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
