import React from 'react';
import { X, CheckCircle, FileText, Cpu, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SensorNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">No Physical Soil Sensors Needed</h3>
              <p className="text-xs text-slate-500">Accessible Precision Agriculture for Every Farmer</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="mt-4 space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-900">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">
              <strong>100% Sensor-Free Operation:</strong> You do <em>not</em> need to purchase or install electronic IoT soil probes. The AgriSuggest platform is designed to take parameters directly from standard agricultural testing reports or regional baseline surveys.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>How to Source Your Input Parameters</span>
            </h4>
            <ul className="mt-2 space-y-2.5 text-xs sm:text-sm pl-2">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Government / Extension Soil Health Card (SHC):</strong> Wet chemistry laboratory tests (Kjeldahl digestion for N, Olsen extraction for P, Flame photometry for K) give exact N-P-K (kg/ha) and pH.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Regional Agro-Ecological Presets:</strong> Use our one-click regional presets (Alluvial Plains, Black Cotton Soils, Arid Sand, Tropical Coastline) based on standard soil survey baselines.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                <span><strong>Meteorological Forecasts:</strong> Rainfall, humidity, and temperature can be obtained from local weather bulletins (e.g. Indian Meteorological Department / Open-Meteo).</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-semibold text-slate-900 flex items-center space-x-2 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Why Avoid In-Situ Hardware Sensors?</span>
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Low-cost optical and capacitive in-soil NPK probes often suffer from heavy ionic interference, temperature drift, and biofouling. Using laboratory soil test card values combined with Machine Learning provides significantly higher predictive accuracy (99.55% benchmark accuracy).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            Understood & Proceed
          </button>
        </div>

      </div>
    </div>
  );
}
