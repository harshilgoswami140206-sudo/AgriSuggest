import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RecommendationForm from './components/RecommendationForm';
import ResultsView from './components/ResultsView';
import ExplainabilityView from './components/ExplainabilityView';
import SoilDiagnostic from './components/SoilDiagnostic';
import ClimateSimulator from './components/ClimateSimulator';
import ModelComparison from './components/ModelComparison';
import CropEncyclopedia from './components/CropEncyclopedia';
import PredictionHistory from './components/PredictionHistory';
import SensorNoticeModal from './components/SensorNoticeModal';

import { predictCrop, fetchHealth } from './services/api';
import { Sprout, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('advisor');
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);
  
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentInputs, setCurrentInputs] = useState({
    nitrogen: 90.0,
    phosphorus: 42.0,
    potassium: 43.0,
    temperature: 20.87,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.93,
    model_choice: 'ensemble'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch health on mount
  useEffect(() => {
    fetchHealth()
      .then(data => setHealthInfo(data))
      .catch(err => console.error('Health check failed:', err));

    // Run initial baseline prediction so the dashboard opens with full data!
    handlePredict(currentInputs);
  }, []);

  const handlePredict = async (payload) => {
    setIsLoading(true);
    setError(null);
    setCurrentInputs(payload);

    try {
      const data = await predictCrop(payload);
      setPredictionResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate crop recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadCropFromEncyclopedia = (crop) => {
    const centroid = crop.optimal_ranges;
    const newInputs = {
      nitrogen: centroid?.nitrogen?.mean || 80,
      phosphorus: centroid?.phosphorus?.mean || 45,
      potassium: centroid?.potassium?.mean || 45,
      temperature: centroid?.temperature?.mean || 24,
      humidity: centroid?.humidity?.mean || 75,
      ph: centroid?.ph?.mean || 6.5,
      rainfall: centroid?.rainfall?.mean || 150,
      model_choice: 'ensemble',
      top_k: 5
    };
    setActiveTab('advisor');
    handlePredict(newInputs);
  };

  const handleSelectHistoryItem = (record) => {
    const loadedInputs = {
      nitrogen: record.nitrogen,
      phosphorus: record.phosphorus,
      potassium: record.potassium,
      temperature: record.temperature,
      humidity: record.humidity,
      ph: record.ph,
      rainfall: record.rainfall,
      model_choice: record.model_used.toLowerCase().includes('random') ? 'random_forest' : 
                   (record.model_used.toLowerCase().includes('xgboost') ? 'xgboost' : 'ensemble'),
      top_k: 5
    };
    setActiveTab('advisor');
    handlePredict(loadedInputs);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSensorModal={() => setIsSensorModalOpen(true)}
        healthInfo={healthInfo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Crop Advisor */}
        {activeTab === 'advisor' && (
          <div className="space-y-8">
            <RecommendationForm 
              onPredict={handlePredict} 
              isLoading={isLoading} 
              onOpenSensorModal={() => setIsSensorModalOpen(true)}
            />

            {predictionResult && (
              <>
                <ResultsView 
                  result={predictionResult} 
                  onSwitchToClimate={() => setActiveTab('climate')}
                  onSwitchToSoil={() => setActiveTab('soil')}
                />

                <ExplainabilityView result={predictionResult} />
              </>
            )}
          </div>
        )}

        {/* Tab 2: Soil Health & NPK */}
        {activeTab === 'soil' && (
          <SoilDiagnostic 
            currentInputs={currentInputs} 
            onOpenSensorModal={() => setIsSensorModalOpen(true)}
          />
        )}

        {/* Tab 3: Climate Simulator */}
        {activeTab === 'climate' && (
          <ClimateSimulator 
            currentInputs={currentInputs} 
            initialCrop={predictionResult?.recommended_crop} 
          />
        )}

        {/* Tab 4: AI Model Benchmarks */}
        {activeTab === 'models' && (
          <ModelComparison />
        )}

        {/* Tab 5: Crop Encyclopedia */}
        {activeTab === 'encyclopedia' && (
          <CropEncyclopedia onLoadCropParams={handleLoadCropFromEncyclopedia} />
        )}

        {/* Tab 6: Prediction History */}
        {activeTab === 'history' && (
          <PredictionHistory onSelectHistoryItem={handleSelectHistoryItem} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-700">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">AgriSuggest</span>
            <span>— Precision AI Crop Recommendation & Biometeorology Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
            <span>NumPy Feature Engine</span>
            <span>•</span>
            <span>Scikit-learn RF (99.5%)</span>
            <span>•</span>
            <span>XGBoost (99.1%)</span>
            <span>•</span>
            <span>FastAPI</span>
            <span>•</span>
            <span>PostgreSQL / SQLAlchemy</span>
            <span>•</span>
            <span>React</span>
          </div>
        </div>
      </footer>

      {/* Sensor Explainer Modal */}
      <SensorNoticeModal 
        isOpen={isSensorModalOpen} 
        onClose={() => setIsSensorModalOpen(false)} 
      />

    </div>
  );
}
