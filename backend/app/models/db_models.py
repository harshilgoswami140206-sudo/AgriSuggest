from sqlalchemy import Column, Integer, Float, String, DateTime, Text, JSON, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    model_used = Column(String(50), nullable=False)
    recommended_crop = Column(String(100), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    top_predictions = Column(JSON, nullable=True)
    soil_health_index = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)

class CropProfile(Base):
    __tablename__ = "crop_profiles"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), unique=True, index=True, nullable=False)
    scientific_name = Column(String(150), nullable=True)
    category = Column(String(50), nullable=False)
    growing_season = Column(String(100), nullable=True)
    duration_days = Column(String(50), nullable=True)
    water_requirement = Column(String(50), nullable=True)
    soil_type = Column(String(150), nullable=True)
    economic_value = Column(String(50), nullable=True)
    cultivation_tips = Column(Text, nullable=True)
    ideal_n_min = Column(Float, nullable=True)
    ideal_n_max = Column(Float, nullable=True)
    ideal_p_min = Column(Float, nullable=True)
    ideal_p_max = Column(Float, nullable=True)
    ideal_k_min = Column(Float, nullable=True)
    ideal_k_max = Column(Float, nullable=True)
    ideal_temp_min = Column(Float, nullable=True)
    ideal_temp_max = Column(Float, nullable=True)
    ideal_rainfall_min = Column(Float, nullable=True)
    ideal_rainfall_max = Column(Float, nullable=True)
    ideal_ph_min = Column(Float, nullable=True)
    ideal_ph_max = Column(Float, nullable=True)

class FeedbackRecord(Base):
    __tablename__ = "feedback_records"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("prediction_history.id"), nullable=True)
    rating = Column(Integer, nullable=False)  # 1 to 5 stars
    actual_crop_grown = Column(String(100), nullable=True)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
