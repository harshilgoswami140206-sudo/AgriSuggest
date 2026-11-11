import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  RefreshCw, 
  Search, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { fetchHistory, deleteHistoryItem, clearAllHistory } from '../services/api';

export default function PredictionHistory({ onSelectHistoryItem }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCrop, setFilterCrop] = useState('');

  const loadHistory = () => {
    setIsLoading(true);
    fetchHistory(50, 0, filterCrop)
      .then(res => setHistory(res.records || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, [filterCrop]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this prediction record?')) return;
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all logged prediction history?')) return;
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      alert('Failed to clear history');
    }
  };

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'ID', 'Date', 'Model', 'Crop', 'Confidence (%)', 
      'Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 
      'Humidity', 'pH', 'Rainfall', 'Soil Health Index'
    ];

    const rows = history.map(h => [
      h.id,
      h.created_at ? new Date(h.created_at).toLocaleString() : '',
      `"${h.model_used}"`,
      `"${h.recommended_crop}"`,
      h.confidence,
      h.nitrogen,
      h.phosphorus,
      h.potassium,
      h.temperature,
      h.humidity,
      h.ph,
      h.rainfall,
      h.soil_health_index || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrisuggest_predictions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-600" />
            <span>Prediction Audit Trail & Historical Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged recommendations stored in PostgreSQL / SQLite for farm management tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition flex items-center space-x-1 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition flex items-center space-x-1 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by crop name..."
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <span className="text-xs text-slate-400">
          Total Logged: <strong>{history.length}</strong>
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          Loading history records...
        </div>
      ) : history.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600">No predictions logged yet</p>
          <p className="text-xs text-slate-400 mt-1">Run a recommendation from the Crop Advisor tab to log results.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-50/70">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Recommended Crop</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">N - P - K</th>
                <th className="py-2.5 px-3">Climate (T / Rain)</th>
                <th className="py-2.5 px-3">Soil Health</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {history.map((record) => (
                <tr 
                  key={record.id}
                  className="hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => onSelectHistoryItem && onSelectHistoryItem(record)}
                >
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {record.created_at ? new Date(record.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 capitalize">
                    {record.recommended_crop}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    {record.confidence}%
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {record.model_used}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                    {record.nitrogen}-{record.phosphorus}-{record.potassium}
                  </td>
                  <td className="py-3 px-3 text-slate-700 text-[11px]">
                    {record.temperature.toFixed(1)}°C / {record.rainfall.toFixed(0)}mm
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {record.soil_health_index ? `${record.soil_health_index}/100` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => handleDelete(record.id, e)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
