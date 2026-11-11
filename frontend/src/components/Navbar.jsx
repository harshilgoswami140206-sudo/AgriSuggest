import React from 'react';
import { 
  Sprout, 
  FlaskConical, 
  CloudSun, 
  Cpu, 
  BookOpen, 
  History, 
  Info, 
  Database, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSensorModal, healthInfo }) {
  const tabs = [
    { id: 'advisor', label: 'Crop Advisor', icon: Sprout },
    { id: 'soil', label: 'Soil Health & NPK', icon: FlaskConical },
    { id: 'climate', label: 'Climate Simulator', icon: CloudSun },
    { id: 'models', label: 'AI Models (RF & XGB)', icon: Cpu },
    { id: 'encyclopedia', label: 'Crop Encyclopedia', icon: BookOpen },
    { id: 'history', label: 'Prediction Logs', icon: History },
  ];

  const dbLabel = healthInfo?.database?.type?.includes('PostgreSQL') 
    ? 'PostgreSQL' 
    : 'SQLite (Dev mode)';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('advisor')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Sprout className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">Agri<span className="text-emerald-600">Suggest</span></span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  AI v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Precision Crop Intelligence & Biometeorology</p>
            </div>
          </div>

          {/* Top Status Indicators */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={onOpenSensorModal}
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
              title="Click to learn how Soil Health Cards work without IoT hardware"
            >
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>No Physical Sensors Needed</span>
            </button>

            <div className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <Database className="w-3 h-3 text-slate-500" />
              <span>{dbLabel}</span>
            </div>

            <div className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>RF & XGB: 99.5%</span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
