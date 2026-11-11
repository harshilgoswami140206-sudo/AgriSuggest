import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Droplet, 
  Calendar, 
  Clock, 
  Sparkles,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { fetchCrops } from '../services/api';

export default function CropEncyclopedia({ onLoadCropParams }) {
  const [crops, setCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCrops()
      .then(res => setCrops(res.crops || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', 'Cereal Grain', 'Pulse / Legume', 'Horticultural Fruit', 'Fiber / Cash Crop', 'Commercial'];

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crop.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crop.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && crop.category?.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0]);
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Crop Encyclopedia & Optimal Agronomic Baselines</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive profiles for all 22 benchmark crops with centroid conditions and cultivation guides.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing {filteredCrops.length} of {crops.length} crops
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by crop, scientific name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div className="flex overflow-x-auto gap-1.5 pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Crops */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm">Loading crop catalog...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCrops.map((crop) => (
            <div 
              key={crop.name}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {crop.category}
                      </span>
                      <h3 className="text-base font-bold capitalize text-slate-900 mt-1">
                        {crop.display_name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs italic text-slate-500 mt-1.5">{crop.scientific_name}</p>

                {/* Optimal Centroids */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Optimal N-P-K:</span>
                    <span className="font-bold text-slate-800">
                      {crop.optimal_ranges?.nitrogen?.mean} - {crop.optimal_ranges?.phosphorus?.mean} - {crop.optimal_ranges?.potassium?.mean} kg/ha
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ideal Temp:</span>
                    <span className="font-semibold text-slate-700">{crop.optimal_ranges?.temperature?.mean} °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ideal Rainfall:</span>
                    <span className="font-semibold text-slate-700">{crop.optimal_ranges?.rainfall?.mean} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ideal pH:</span>
                    <span className="font-semibold text-slate-700">{crop.optimal_ranges?.ph?.mean}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Season:</strong> {crop.growing_season}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Droplet className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span><strong>Water:</strong> {crop.water_requirement.split(' ')[0]}</span>
                  </div>
                </div>

                {crop.cultivation_tips && (
                  <p className="mt-3 text-[11px] text-slate-500 line-clamp-2">
                    {crop.cultivation_tips}
                  </p>
                )}
              </div>

              {/* Load button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onLoadCropParams(crop)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center space-x-1"
                >
                  <span>Test in Advisor</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
