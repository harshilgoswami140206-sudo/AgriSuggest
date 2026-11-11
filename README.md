# 🌾 AgriSuggest — Intelligent Crop Recommendation Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![NumPy](https://img.shields.io/badge/NumPy-Vectorized_Calculations-013243.svg)](https://numpy.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Random_Forest_99.5%25-F7931E.svg)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Classifier_99.1%25-EB5424.svg)](https://xgboost.readthedocs.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supported-336791.svg)](https://www.postgresql.org/)

An end-to-end precision agriculture decision-support platform that recommends optimal crops based on soil macro-nutrients and climatic parameters. 

**Zero Physical Sensors Required**: The platform is explicitly architected so farmers do not need expensive, error-prone IoT soil probes. Input parameters are sourced directly from standard laboratory **Soil Health Cards (SHC)** or built-in regional agro-ecological presets.

---

## 🌟 Key Features

1. **Benchmark AI Models (Dual Model + Ensemble)**:
   - **Random Forest Classifier**: 150 bagged decision trees achieving **99.55% accuracy** on the standard 2,200 sample crop benchmark across 22 crops.
   - **XGBoost Classifier**: Second-order gradient-boosted decision trees achieving **99.09% accuracy**.
   - **Softmax Calibrated Ensemble**: Blends predictions (55% RF + 45% XGB) with Shannon Entropy uncertainty estimation to output top-k recommendations with probability distributions.

2. **NumPy Numerical Feature Processing Engine**:
   - **Stoichiometric Nutrient Balance**: Vectorized computation of N, P, and K proportions, ratio matrices (N:P, N:K, P:K), and Euclidean deviation from the optimal agronomical balance benchmark (4:2:1).
   - **Crop Centroid Similarity**: Standardized Euclidean and Mahalanobis distance from field inputs to precomputed 7-dimensional centroids across all 22 crops.
   - **Biometeorological Physics**: Calculates **Vapor Pressure Deficit (VPD in kPa)** using Tetens saturation vapor pressure equations to model foliar transpiration stress, plant thermal comfort Gaussian scores, and moisture availability indices.
   - **Monte Carlo Climate Resilience Simulation**: Vectorized perturbation testing (generating 60 synthetic microclimate fluctuations) to test crop retention and recommend heat/drought-tolerant alternatives under climate change (+1.5°C to +4°C, ±40% rain).
   - **Soil Health Index (SHI)**: Multi-criteria composite index (0–100) with biological pH penalization and specific fertilizer dosage calculations (Urea, SSP, DAP, MOP, plus organic alternatives).

3. **Modern Full-Stack Architecture**:
   - **Backend**: FastAPI with async endpoints, Pydantic schemas, and interactive OpenAPI documentation at `/docs`.
   - **Database**: PostgreSQL support via SQLAlchemy ORM with automatic fallback to SQLite (`crop_platform.db`) for zero-configuration standalone execution.
   - **Frontend**: Responsive React 18 application with Tailwind CSS, Lucide icons, interactive gauges, real-time sliders, and audit logging.

4. **Comprehensive Agronomy & Crop Encyclopedia**:
   - Detailed agricultural dossiers for all 22 benchmark crops: Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas, Mothbeans, Mungbean, Blackgram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, and Coffee.
   - Includes botanical names, growing seasons (Kharif, Rabi, Zaid), harvest duration, water requirements, economic utility, and expert agronomist cultivation tips.

---

## 🏗️ Architecture Overview

```
crop-recommendation-platform/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI application entry & static bundle mounting
│   │   ├── config.py              # Configuration, directory paths & DB settings
│   │   ├── database.py            # SQLAlchemy engine (PostgreSQL + SQLite fallback)
│   │   ├── models/
│   │   │   └── db_models.py       # PredictionHistory, CropProfile, FeedbackRecord
│   │   ├── schemas/
│   │   │   └── crop_schemas.py    # Pydantic validation schemas
│   │   ├── ml/
│   │   │   ├── train.py           # Training pipeline for RF & XGBoost
│   │   │   ├── predictor.py       # Dual-model inference, Top-K, Explainable AI
│   │   │   ├── numpy_engine.py    # NumPy calculations (VPD, NPK balance, Monte Carlo)
│   │   │   └── crop_database.py   # Comprehensive metadata for 22 crops
│   │   └── routers/
│   │       ├── predict.py         # /api/predict & /api/predict/simulate-climate
│   │       ├── crops.py           # /api/crops & /api/crops/{crop_name}
│   │       ├── analytics.py       # /api/analytics/model-metrics
│   │       ├── soil.py            # /api/soil/analyze
│   │       └── history.py         # /api/history & feedback
│   ├── models_saved/              # Serialized .joblib models & centroids.json
│   ├── data/
│   │   └── Crop_recommendation.csv # 2,200 record benchmark dataset
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecommendationForm.jsx   # Soil & climate sliders with presets
│   │   │   ├── ResultsView.jsx          # Top-1 Hero card & alternatives
│   │   │   ├── ExplainabilityView.jsx   # XAI centroid comparison & VPD
│   │   │   ├── SoilDiagnostic.jsx       # NPK ratio balance & fertilizer dosing
│   │   │   ├── ClimateSimulator.jsx     # NumPy Monte Carlo scenario tester
│   │   │   ├── ModelComparison.jsx      # RF vs XGBoost metrics & feature importance
│   │   │   ├── CropEncyclopedia.jsx     # Catalog of 22 crops with search/filter
│   │   │   ├── PredictionHistory.jsx    # Historical audit trail & CSV export
│   │   │   └── SensorNoticeModal.jsx    # Sensor-free explainer modal
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── start.bat                      # Windows one-click startup
├── start.ps1                      # PowerShell startup script
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js (already installed in local AppData)

### 2. Run with One-Click Script
On Windows, simply double-click:
```cmd
start.bat
```
or run in PowerShell:
```powershell
.\start.ps1
```

This will automatically:
1. Verify / train the Random Forest & XGBoost models.
2. Initialize database tables.
3. Start the FastAPI server on **`http://localhost:8000`**.
4. Serve the compiled React UI directly at **`http://localhost:8000`** and Swagger docs at **`http://localhost:8000/docs`**.

---

### 3. Development Mode (Running Frontend Dev Server Separately)

If you wish to make live modifications to the React UI with hot-reloading:

**Terminal 1 (Backend):**
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend with Vite):**
```bash
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser. All `/api` requests are automatically proxied to port 8000.

---

## 🗄️ PostgreSQL Configuration

The application natively supports **PostgreSQL**. Set the `DATABASE_URL` environment variable:

```bash
# Example for PostgreSQL connection:
set DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/crop_db
```

If PostgreSQL is not running or unreachable, the system automatically and gracefully falls back to local SQLite (`backend/crop_platform.db`), logging a clear diagnostic message without crashing.

---

## 📊 Dataset & Model Evaluation

The system trains on the standard **Crop Recommendation Dataset** containing 2,200 records (100 samples per crop across 22 classes):

| Metric | Random Forest (150 trees) | XGBoost Classifier | Blended Ensemble |
| :--- | :---: | :---: | :---: |
| **Accuracy** | **99.55%** | **99.09%** | **99.55%** |
| **Precision (Weighted)** | **99.57%** | **99.12%** | **99.57%** |
| **Recall (Weighted)** | **99.55%** | **99.09%** | **99.55%** |
| **F1-Score** | **99.55%** | **99.09%** | **99.55%** |

### Top Predictive Feature Importances:
1. **Rainfall Precipitation**: ~23.4%
2. **Relative Humidity**: ~20.9%
3. **Potassium (K)**: ~18.8%
4. **Phosphorus (P)**: ~15.1%
5. **Nitrogen (N)**: ~11.8%
6. **Temperature**: ~6.2%
7. **Soil pH**: ~3.8%

---

## 🌾 Why No Physical Soil Sensors Are Needed

Physical in-situ electronic soil sensors (resistive or capacitive probes) frequently suffer from:
- Rapid calibration drift and biofouling.
- High ionic interference from soil salts and moisture variation.
- High hardware, solar powering, and maintenance costs prohibitive for smallholder farmers.

**The AgriSuggest Solution**:
- **Soil Health Cards (SHC)**: Farmers input laboratory wet-chemistry results (Kjeldahl digestion for N, Olsen extraction for P, Flame photometry for K, and glass electrode pH) which provide accurate benchmarks.
- **Regional Presets**: For exploratory planning, users can select one-click presets representing standard agro-climatic zones (e.g. Indo-Gangetic Alluvial, Deccan Black Soil, Coastal Humid, Temperate Highlands).
