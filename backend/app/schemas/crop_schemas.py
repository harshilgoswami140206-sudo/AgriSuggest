from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CropPredictionRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha or ppm)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content in soil (kg/ha or ppm)")
    potassium: float = Field(..., ge=0, le=250, description="Potassium content in soil (kg/ha or ppm)")
    temperature: float = Field(..., ge=-5, le=60, description="Air temperature in Celsius")
    humidity: float = Field(..., ge=5, le=100, description="Relative humidity in percentage (%)")
    ph: float = Field(..., ge=3.0, le=10.0, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=450, description="Seasonal rainfall in mm")
    model_choice: Optional[str] = Field("ensemble", description="Model choice: ensemble, random_forest, or xgboost")
    top_k: Optional[int] = Field(5, ge=1, le=10, description="Number of top crop suggestions to return")
    notes: Optional[str] = Field(None, description="Optional notes or farm name")

    model_config = {
        "json_schema_extra": {
            "example": {
                "nitrogen": 90.0,
                "phosphorus": 42.0,
                "potassium": 43.0,
                "temperature": 20.87,
                "humidity": 82.0,
                "ph": 6.5,
                "rainfall": 202.93,
                "model_choice": "ensemble",
                "top_k": 5
            }
        }
    }

class ClimateSimulationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=250)
    temperature: float = Field(..., ge=-5, le=60)
    humidity: float = Field(..., ge=5, le=100)
    ph: float = Field(..., ge=3.0, le=10.0)
    rainfall: float = Field(..., ge=0, le=450)
    temp_delta: float = Field(2.0, ge=-10.0, le=15.0, description="Temperature shift in °C (+ or -)")
    rainfall_percent_delta: float = Field(-15.0, ge=-80.0, le=150.0, description="Rainfall change in % (+ or -)")
    model_choice: Optional[str] = Field("ensemble")

class SoilAnalysisRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=250)
    ph: float = Field(..., ge=3.0, le=10.0)

class FeedbackCreateRequest(BaseModel):
    prediction_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    actual_crop_grown: Optional[str] = None
    comment: Optional[str] = None
