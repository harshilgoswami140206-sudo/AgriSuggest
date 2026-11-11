import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Droplet, 
  Calendar, 
  Clock, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Percent
} from 'lucide-react';

export default function ResultsView({ result, onSwitchToClimate, onSwitchToSoil }) {
  if (!result || !result.top_predictions || result.top_predictions.length === 0) {
    return null;
  }

  const primary = result.top_predictions[0];
  const alternatives = result.top_predictions.slice(1);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top 1 Hero Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        
        {/* Background glow decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          
          {/* Header line */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-emerald-700/60">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-700/80 rounded-lg text-emerald-200">
                <Trophy className="w-4 h-4 text-amber-300" />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                Primary Recommendation • Rank #1
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs bg-emerald-700/50 text-emerald-200 px-3 py-1 rounded-full border border-emerald-600/50">
                {result.model_used}
              </span>
              <span className="text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-medium">
                {result.confidence_level}
              </span>
            </div>
          </div>

          {/* Main Hero Details */}
          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-5xl sm:text-6xl border border-white/20 shadow-inner">
                {primary.icon}
              </div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 inline-block mb-1">
                  {primary.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold capitalize tracking-tight text-white">
                  {primary.crop}
                </h1>
                <p className="text-sm italic text-emerald-200/80">
                  {primary.scientific_name}
                </p>
              </div>
            </div>

            {/* Confidence Gauge */}
            <div className="w-full md:w-auto p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between md:justify-center md:flex-col text-right md:text-center min-w-[180px]">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-medium block">
                  Match Probability
                </span>
                <span className="text-3xl sm:text-4xl font-black text-amber-300">
                  {primary.probability}%
                </span>
              </div>
              <div className="w-28 md:w-36 bg-black/30 rounded-full h-2 mt-2 overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(primary.probability, 100)}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-emerald-200/70 mt-1 block">
                Centroid Similarity: {primary.similarity_score}%
              </span>
            </div>

          </div>

          {/* Key Agronomy Attributes Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <div className="flex items-center space-x-1.5 text-emerald-300 text-xs mb-1">
                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                <span>Water Demand</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">{primary.water_requirement}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <div className="flex items-center space-x-1.5 text-emerald-300 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Growing Season</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">{primary.growing_season}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <div className="flex items-center space-x-1.5 text-emerald-300 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Maturity Duration</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">{primary.duration_days}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <div className="flex items-center space-x-1.5 text-emerald-300 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Economic Utility</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white">{primary.economic_value}</p>
            </div>
          </div>

          {/* Cultivation Tips */}
          {primary.cultivation_tips && (
            <div className="mt-5 p-4 rounded-xl bg-emerald-950/50 border border-emerald-700/60 flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                <strong className="text-amber-200">Agronomist Recommendation: </strong>
                {primary.cultivation_tips}
              </div>
            </div>
          )}

          {/* Direct Action Links */}
          <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-wrap gap-3">
            <button
              onClick={onSwitchToClimate}
              className="px-4 py-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-600/60 text-xs font-semibold text-emerald-100 border border-emerald-500/40 flex items-center space-x-1.5 transition"
            >
              <span>Test Climate Resilience for {primary.crop}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onSwitchToSoil}
              className="px-4 py-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-600/60 text-xs font-semibold text-emerald-100 border border-emerald-500/40 flex items-center space-x-1.5 transition"
            >
              <span>View Soil Health & Fertilizer Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Alternative Crops (Ranks 2-5) */}
      {alternatives.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Viable Alternative Crops (Multi-Model Probability Breakdown)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Secondary suitable crops based on soil nutrient margins and weather tolerance.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">Ranks #2 - #{alternatives.length + 1}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {alternatives.map((alt) => (
              <div 
                key={alt.crop}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{alt.icon}</span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Rank #{alt.rank}
                        </span>
                        <h4 className="text-base font-bold capitalize text-slate-900">
                          {alt.crop}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {alt.probability}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 italic mt-1">{alt.scientific_name}</p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-medium text-slate-700">{alt.category}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Water:</span>
                      <span className="font-medium text-slate-700">{alt.water_requirement.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Centroid Sim:</span>
                      <span className="font-medium text-emerald-600">{alt.similarity_score}%</span>
                    </div>
                  </div>

                  {/* Dual Model Probability Comparison */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[10px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Random Forest:</span>
                      <span className="font-semibold text-slate-700">{alt.rf_probability}%</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>XGBoost:</span>
                      <span className="font-semibold text-slate-700">{alt.xgb_probability}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/40">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${Math.min(alt.probability * 2.5, 100)}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
