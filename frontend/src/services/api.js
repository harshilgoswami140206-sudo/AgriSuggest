const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function fetchPresets() {
  const res = await fetch(`${API_BASE}/predict/presets`);
  if (!res.ok) throw new Error('Failed to fetch climate presets');
  return res.json();
}

export async function predictCrop(payload) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Prediction request failed');
  }
  return res.json();
}

export async function simulateClimate(payload) {
  const res = await fetch(`${API_BASE}/predict/simulate-climate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Climate simulation failed');
  }
  return res.json();
}

export async function analyzeSoil(payload) {
  const res = await fetch(`${API_BASE}/soil/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Soil analysis failed');
  return res.json();
}

export async function fetchModelMetrics() {
  const res = await fetch(`${API_BASE}/analytics/model-metrics`);
  if (!res.ok) throw new Error('Failed to fetch model metrics');
  return res.json();
}

export async function fetchDatasetSummary() {
  const res = await fetch(`${API_BASE}/analytics/dataset-summary`);
  if (!res.ok) throw new Error('Failed to fetch dataset summary');
  return res.json();
}

export async function fetchCrops() {
  const res = await fetch(`${API_BASE}/crops`);
  if (!res.ok) throw new Error('Failed to fetch crops list');
  return res.json();
}

export async function fetchCropDetail(cropName) {
  const res = await fetch(`${API_BASE}/crops/${cropName}`);
  if (!res.ok) throw new Error(`Failed to fetch crop detail for ${cropName}`);
  return res.json();
}

export async function fetchHistory(limit = 25, offset = 0, cropFilter = '') {
  let url = `${API_BASE}/history?limit=${limit}&offset=${offset}`;
  if (cropFilter) url += `&crop_filter=${encodeURIComponent(cropFilter)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function deleteHistoryItem(id) {
  const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete history item');
  return res.json();
}

export async function clearAllHistory() {
  const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear history');
  return res.json();
}
