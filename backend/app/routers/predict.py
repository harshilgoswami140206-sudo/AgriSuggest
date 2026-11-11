from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..database import get_db
from ..models.db_models import PredictionHistory
from ..schemas.crop_schemas import CropPredictionRequest, ClimateSimulationRequest
from ..ml.predictor import predictor

router = APIRouter(prefix="/predict", tags=["Prediction & Simulation"])

PRESETS = [
    {
        "id": "gangetic_alluvial",
        "name": "Indo-Gangetic Alluvial Plain (Paddy/Jute Zone)",
        "description": "Rich alluvial soil, high monsoon rainfall and warm humid air.",
        "soil_type": "Deep clay loam / alluvium",
        "data": {
            "nitrogen": 88.0,
            "phosphorus": 45.0,
            "potassium": 42.0,
            "temperature": 23.5,
            "humidity": 82.5,
            "ph": 6.6,
            "rainfall": 210.0
        }
    },
    {
        "id": "deccan_black_soil",
        "name": "Deccan Black Cotton Soil (Regur Plateau)",
        "description": "High clay content, moderate rainfall, warm climate ideal for cotton and pulses.",
        "soil_type": "Deep black vertisol",
        "data": {
            "nitrogen": 118.0,
            "phosphorus": 48.0,
            "potassium": 21.0,
            "temperature": 25.8,
            "humidity": 79.0,
            "ph": 7.2,
            "rainfall": 82.0
        }
    },
    {
        "id": "arid_desert",
        "name": "Arid / Semi-Arid Sandy Basin (Mothbeans & Millets)",
        "description": "Low organic nitrogen, sandy soil, low precipitation and dry atmospheric conditions.",
        "soil_type": "Sandy / desert loam",
        "data": {
            "nitrogen": 22.0,
            "phosphorus": 55.0,
            "potassium": 20.0,
            "temperature": 28.5,
            "humidity": 48.0,
            "ph": 7.3,
            "rainfall": 45.0
        }
    },
    {
        "id": "coastal_humid",
        "name": "Tropical Humid Coastal Belt (Coconut & Papaya)",
        "description": "Heavy rainfall, humid sea breezes, coastal sandy-alluvial soil.",
        "soil_type": "Coastal sandy loam",
        "data": {
            "nitrogen": 25.0,
            "phosphorus": 18.0,
            "potassium": 32.0,
            "temperature": 27.2,
            "humidity": 95.0,
            "ph": 6.2,
            "rainfall": 175.0
        }
    },
    {
        "id": "temperate_highland",
        "name": "Temperate Mountain Slope (Apple Orchard)",
        "description": "Cool mountain temperatures, high organic matter, moderate rainfall.",
        "soil_type": "Mountain brown forest soil",
        "data": {
            "nitrogen": 28.0,
            "phosphorus": 138.0,
            "potassium": 202.0,
            "temperature": 22.0,
            "humidity": 92.0,
            "ph": 6.1,
            "rainfall": 112.0
        }
    },
    {
        "id": "semi_arid_coffee",
        "name": "Subtropical Hill Plantation (Coffee & Spice)",
        "description": "Elevated forest soils, rich in organic matter with balanced rains.",
        "soil_type": "Laterite / reddish forest loam",
        "data": {
            "nitrogen": 102.0,
            "phosphorus": 28.0,
            "potassium": 30.0,
            "temperature": 24.2,
            "humidity": 65.0,
            "ph": 6.8,
            "rainfall": 158.0
        }
    }
]

@router.get("/presets")
def get_climate_presets():
    """Returns regional agro-climatic presets to explore predictions without manual lab tests."""
    return {"presets": PRESETS}

@router.post("")
def predict_crop(request: CropPredictionRequest, db: Session = Depends(get_db)):
    """
    Predict optimal crop using Random Forest, XGBoost, or Ensemble,
    calculate NumPy nutrient ratios and biometeorological indices, and log to database.
    """
    result = predictor.predict(
        nitrogen=request.nitrogen,
        phosphorus=request.phosphorus,
        potassium=request.potassium,
        temperature=request.temperature,
        humidity=request.humidity,
        ph=request.ph,
        rainfall=request.rainfall,
        model_choice=request.model_choice or "ensemble",
        top_k=request.top_k or 5
    )

    # Persist in database
    try:
        history_entry = PredictionHistory(
            nitrogen=request.nitrogen,
            phosphorus=request.phosphorus,
            potassium=request.potassium,
            temperature=request.temperature,
            humidity=request.humidity,
            ph=request.ph,
            rainfall=request.rainfall,
            model_used=result["model_used"],
            recommended_crop=result["recommended_crop"],
            confidence=result["confidence"],
            top_predictions=result["top_predictions"],
            soil_health_index=result["soil_health"]["overall_score"],
            notes=request.notes
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        result["prediction_id"] = history_entry.id
    except Exception as e:
        db.rollback()
        # Non-fatal if DB write fails in memory fallback
        result["prediction_id"] = None
        result["db_warning"] = str(e)

    return result

@router.post("/simulate-climate")
def simulate_climate_impact(request: ClimateSimulationRequest):
    """
    NumPy Monte Carlo sensitivity simulation to test crop survival under climate change
    (temperature shifts and precipitation variance).
    """
    features = [
        request.nitrogen,
        request.phosphorus,
        request.potassium,
        request.temperature,
        request.humidity,
        request.ph,
        request.rainfall
    ]
    
    simulation_result = predictor.simulate_climate(
        base_features=features,
        temp_delta=request.temp_delta,
        rainfall_percent_delta=request.rainfall_percent_delta,
        model_choice=request.model_choice or "ensemble"
    )
    return simulation_result
