from fastapi import APIRouter
from typing import Dict, Any
from ..ml.predictor import predictor

router = APIRouter(prefix="/analytics", tags=["Analytics & Model Evaluation"])

@router.get("/model-metrics")
def get_model_metrics():
    """
    Returns comparative evaluation metrics for Random Forest, XGBoost, and the Ensemble model:
    - Accuracy, Precision, Recall, F1-Score
    - Feature importances
    - Confusion matrices
    """
    return predictor.metrics

@router.get("/dataset-summary")
def get_dataset_summary():
    """Returns dataset distributions, sample counts per crop, and NumPy correlation matrix."""
    crops_summary = []
    centroids = predictor.crop_centroids

    for crop, stats in centroids.items():
        crops_summary.append({
            "crop": crop,
            "sample_count": stats.get("sample_count", 100),
            "n_mean": stats.get("N_mean"),
            "p_mean": stats.get("P_mean"),
            "k_mean": stats.get("K_mean"),
            "temp_mean": stats.get("temperature_mean"),
            "humidity_mean": stats.get("humidity_mean"),
            "rainfall_mean": stats.get("rainfall_mean")
        })

    return {
        "total_records": predictor.metrics.get("total_samples", 2200),
        "crops_count": len(crops_summary),
        "crops": sorted(crops_summary, key=lambda x: x["crop"]),
        "feature_correlations": predictor.metrics.get("correlations", {})
    }
