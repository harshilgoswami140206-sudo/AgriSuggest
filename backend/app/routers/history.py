from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.db_models import PredictionHistory, FeedbackRecord
from ..schemas.crop_schemas import FeedbackCreateRequest

router = APIRouter(prefix="/history", tags=["Prediction History & Feedback"])

@router.get("")
def get_prediction_history(
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    crop_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Fetches logged crop recommendations with sorting, filtering, and pagination."""
    query = db.query(PredictionHistory)
    if crop_filter:
        query = query.filter(PredictionHistory.recommended_crop.ilike(f"%{crop_filter}%"))
    
    total = query.count()
    records = query.order_by(PredictionHistory.created_at.desc()).offset(offset).limit(limit).all()

    formatted = []
    for r in records:
        formatted.append({
            "id": r.id,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "nitrogen": r.nitrogen,
            "phosphorus": r.phosphorus,
            "potassium": r.potassium,
            "temperature": r.temperature,
            "humidity": r.humidity,
            "ph": r.ph,
            "rainfall": r.rainfall,
            "model_used": r.model_used,
            "recommended_crop": r.recommended_crop,
            "confidence": r.confidence,
            "top_predictions": r.top_predictions,
            "soil_health_index": r.soil_health_index,
            "notes": r.notes
        })

    return {
        "total_records": total,
        "limit": limit,
        "offset": offset,
        "records": formatted
    }

@router.delete("/{prediction_id}")
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """Deletes a specific prediction entry."""
    record = db.query(PredictionHistory).filter(PredictionHistory.id == prediction_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction record not found.")
    
    db.delete(record)
    db.commit()
    return {"message": f"Prediction {prediction_id} successfully deleted."}

@router.delete("")
def clear_all_history(db: Session = Depends(get_db)):
    """Clears all historical prediction logs."""
    count = db.query(PredictionHistory).delete()
    db.commit()
    return {"message": f"Successfully deleted {count} prediction records."}

@router.post("/{prediction_id}/feedback")
def submit_feedback(prediction_id: int, request: FeedbackCreateRequest, db: Session = Depends(get_db)):
    """Submits user validation feedback and satisfaction rating for a prediction."""
    feedback = FeedbackRecord(
        prediction_id=prediction_id,
        rating=request.rating,
        actual_crop_grown=request.actual_crop_grown,
        comment=request.comment
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return {"message": "Feedback submitted successfully", "feedback_id": feedback.id}
