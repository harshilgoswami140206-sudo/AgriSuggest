from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..ml.crop_database import CROP_METADATA
from ..ml.predictor import predictor

router = APIRouter(prefix="/crops", tags=["Crop Encyclopedia"])

@router.get("")
def list_crops():
    """Returns the full catalog of 22 supported crops with agronomical profiles and optimal centroid parameters."""
    crop_list = []
    centroids = predictor.crop_centroids

    for crop_name, meta in CROP_METADATA.items():
        c_stats = centroids.get(crop_name, {})
        crop_list.append({
            "name": crop_name,
            "display_name": crop_name.capitalize(),
            "category": meta.get("category", "Agricultural Crop"),
            "scientific_name": meta.get("scientific_name", ""),
            "growing_season": meta.get("growing_season", "Seasonal"),
            "duration_days": meta.get("duration_days", "100-120 days"),
            "water_requirement": meta.get("water_requirement", "Moderate"),
            "soil_type": meta.get("soil_type", "Loam"),
            "economic_value": meta.get("economic_value", "Commercial"),
            "icon": meta.get("icon", "🌱"),
            "color": meta.get("color", "#16a34a"),
            "cultivation_tips": meta.get("cultivation_tips", ""),
            "optimal_ranges": {
                "nitrogen": {"mean": c_stats.get("N_mean"), "min": c_stats.get("N_min"), "max": c_stats.get("N_max")},
                "phosphorus": {"mean": c_stats.get("P_mean"), "min": c_stats.get("P_min"), "max": c_stats.get("P_max")},
                "potassium": {"mean": c_stats.get("K_mean"), "min": c_stats.get("K_min"), "max": c_stats.get("K_max")},
                "temperature": {"mean": c_stats.get("temperature_mean"), "min": c_stats.get("temperature_min"), "max": c_stats.get("temperature_max")},
                "humidity": {"mean": c_stats.get("humidity_mean"), "min": c_stats.get("humidity_min"), "max": c_stats.get("humidity_max")},
                "ph": {"mean": c_stats.get("ph_mean"), "min": c_stats.get("ph_min"), "max": c_stats.get("ph_max")},
                "rainfall": {"mean": c_stats.get("rainfall_mean"), "min": c_stats.get("rainfall_min"), "max": c_stats.get("rainfall_max")}
            }
        })

    return {
        "total_crops": len(crop_list),
        "crops": sorted(crop_list, key=lambda x: x["name"])
    }

@router.get("/{crop_name}")
def get_crop_detail(crop_name: str):
    """Fetches in-depth agricultural profile, optimal ranges, and cultivation guides for a specific crop."""
    normalized = crop_name.lower().strip()
    if normalized not in CROP_METADATA:
        raise HTTPException(status_code=404, detail=f"Crop '{crop_name}' not found in database.")

    meta = CROP_METADATA[normalized]
    c_stats = predictor.crop_centroids.get(normalized, {})

    return {
        "name": normalized,
        "display_name": normalized.capitalize(),
        **meta,
        "centroid_statistics": c_stats
    }
