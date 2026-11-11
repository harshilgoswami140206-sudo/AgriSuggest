import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BarChart3, 
  CheckCircle, 
  GitCompare, 
  Layers, 
  ShieldCheck, 
  Flame, 
  TrendingUp,
  Award
} from 'lucide-react';
import { fetchModelMetrics } from '../services/api';

export default function ModelComparison() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchModelMetrics()
      .then(res => setMetrics(res))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm">Loading AI model metrics & confusion matrices...</p>
      </div>
    );
  }

  if (!metrics) return null;

  const { random_forest, xgboost, ensemble, classes } = metrics;

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>AI Model Performance & Dual-Engine Benchmarks</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical evaluation on 2,200 multi-spectral crop records across 22 classes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Dataset: 2,200 Samples (Stratified 80/20)
            </span>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Random Forest */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Random Forest</span>
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                150 Estimators
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-4xl font-black text-slate-900">{random_forest.accuracy}%</span>
              <span className="text-xs font-semibold text-slate-400">Accuracy</span>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-200/70 pt-3 text-slate-600">
              <div className="flex justify-between">
                <span>Weighted Precision:</span>
                <span className="font-bold text-slate-900">{random_forest.precision}%</span>
              </div>
              <div className="flex justify-between">
                <span>Weighted Recall:</span>
                <span className="font-bold text-slate-900">{random_forest.recall}%</span>
              </div>
              <div className="flex justify-between">
                <span>F1-Score:</span>
                <span className="font-bold text-slate-900">{random_forest.f1_score}%</span>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-slate-400">
              Bagging ensemble that reduces variance and handles non-linear boundaries.
            </div>
          </div>

          {/* Card 2: XGBoost */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-amber-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>XGBoost Classifier</span>
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Gradient Boosted
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-4xl font-black text-slate-900">{xgboost.accuracy}%</span>
              <span className="text-xs font-semibold text-slate-400">Accuracy</span>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-slate-200/70 pt-3 text-slate-600">
              <div className="flex justify-between">
                <span>Weighted Precision:</span>
                <span className="font-bold text-slate-900">{xgboost.precision}%</span>
              </div>
              <div className="flex justify-between">
                <span>Weighted Recall:</span>
                <span className="font-bold text-slate-900">{xgboost.recall}%</span>
              </div>
              <div className="flex justify-between">
                <span>F1-Score:</span>
                <span className="font-bold text-slate-900">{xgboost.f1_score}%</span>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-slate-400">
              Second-order gradient descent boosting with L1/L2 tree regularization.
            </div>
          </div>

          {/* Card 3: Blended Ensemble */}
          <div className="p-5 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Blended Ensemble (Production)</span>
              </span>
              <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                Optimal Blending
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-4xl font-black text-emerald-900">{ensemble.accuracy}%</span>
              <span className="text-xs font-semibold text-emerald-700">Accuracy</span>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-emerald-200 pt-3 text-slate-700">
              <div className="flex justify-between">
                <span>Weighted Precision:</span>
                <span className="font-bold text-slate-900">{ensemble.precision}%</span>
              </div>
              <div className="flex justify-between">
                <span>Weighted Recall:</span>
                <span className="font-bold text-slate-900">{ensemble.recall}%</span>
              </div>
              <div className="flex justify-between">
                <span>Ensemble Weights:</span>
                <span className="font-bold text-emerald-800">55% RF + 45% XGB</span>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-emerald-700">
              Softmax calibrated blending with Shannon entropy uncertainty estimation.
            </div>
          </div>

        </div>

      </div>

      {/* Feature Importance Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Feature Importance Comparison (Random Forest vs XGBoost)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Quantifies which agronomic and climatic attributes drive the decision boundaries most heavily.
        </p>

        <div className="space-y-4">
          {Object.keys(random_forest.feature_importance).map((feat) => {
            const rfVal = random_forest.feature_importance[feat];
            const xgbVal = xgboost.feature_importance[feat];
            const maxVal = Math.max(rfVal, xgbVal, 0.35);

            return (
              <div key={feat} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="capitalize font-bold text-slate-800">
                    {feat === 'N' ? 'Nitrogen (N)' :
                     feat === 'P' ? 'Phosphorus (P)' :
                     feat === 'K' ? 'Potassium (K)' : feat}
                  </span>
                  <div className="space-x-3 text-[11px]">
                    <span className="text-emerald-700 font-semibold">RF: {(rfVal * 100).toFixed(1)}%</span>
                    <span className="text-amber-700 font-semibold">XGB: {(xgbVal * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Bars */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${(rfVal / maxVal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${(xgbVal / maxVal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 text-emerald-700">
            <span className="w-3 h-3 bg-emerald-600 rounded-sm"></span>
            <span>Random Forest (Mean Decrease in Impurity)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-700">
            <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
            <span>XGBoost (Gain Metric)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
