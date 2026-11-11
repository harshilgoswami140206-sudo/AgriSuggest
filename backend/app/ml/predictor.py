import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
import joblib
import numpy as np

from ..config import MODELS_DIR
from .numpy_engine import NumpyAgriEngine
from .crop_database import CROP_METADATA

logger = logging.getLogger(__name__)

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

class CropPredictor:
    def __init__(self):
        self.rf_model = None
        self.xgb_model = None
        self.label_encoder = None
        self.scaler = None
        self.metrics = {}
        self.crop_centroids = {}
        self.numpy_engine = NumpyAgriEngine()
        self.load_artifacts()

    def load_artifacts(self):
        try:
            rf_path = MODELS_DIR / "rf_model.joblib"
            xgb_path = MODELS_DIR / "xgb_model.joblib"
            le_path = MODELS_DIR / "label_encoder.joblib"
            scaler_path = MODELS_DIR / "scaler.joblib"
            metrics_path = MODELS_DIR / "metrics.json"
            centroids_path = MODELS_DIR / "crop_centroids.json"

            if rf_path.exists():
                self.rf_model = joblib.load(rf_path)
            if xgb_path.exists():
                self.xgb_model = joblib.load(xgb_path)
            if le_path.exists():
                self.label_encoder = joblib.load(le_path)
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
            if metrics_path.exists():
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)
            if centroids_path.exists():
                with open(centroids_path, "r") as f:
                    self.crop_centroids = json.load(f)
                self.numpy_engine.set_crop_centroids(self.crop_centroids)

            logger.info("Successfully loaded ML models and metadata.")
        except Exception as e:
            logger.error(f"Error loading artifacts: {e}")

    def predict(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float,
        model_choice: str = "ensemble",
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Runs model inference with NumPy feature processing, dual model evaluation,
        uncertainty quantification, and rich agronomical profile mapping.
        """
        feature_vector = np.array(
            [[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]],
            dtype=np.float64
        )

        # 1. Compute probabilities
        rf_probs = self.rf_model.predict_proba(feature_vector)[0]
        xgb_probs = self.xgb_model.predict_proba(feature_vector)[0]

        normalized_choice = model_choice.lower().strip()
        if "random" in normalized_choice or normalized_choice == "rf":
            active_probs = rf_probs
            selected_model_name = "Random Forest"
            uncertainty_entropy = -float(np.sum(np.clip(rf_probs, 1e-12, 1.0) * np.log2(np.clip(rf_probs, 1e-12, 1.0))))
        elif "xgboost" in normalized_choice or normalized_choice == "xgb":
            active_probs = xgb_probs
            selected_model_name = "XGBoost"
            uncertainty_entropy = -float(np.sum(np.clip(xgb_probs, 1e-12, 1.0) * np.log2(np.clip(xgb_probs, 1e-12, 1.0))))
        else:
            # Ensemble (0.55 RF + 0.45 XGB)
            active_probs, uncertainty_entropy = self.numpy_engine.ensemble_probabilities(
                rf_probs, xgb_probs, rf_weight=0.55, xgb_weight=0.45
            )
            selected_model_name = "Ensemble (RF + XGBoost)"

        # Sort top K predictions using NumPy argsort
        sorted_indices = np.argsort(active_probs)[::-1][:top_k]
        top_predictions = []

        for rank, idx in enumerate(sorted_indices, 1):
            crop_name = self.label_encoder.classes_[idx]
            prob = float(active_probs[idx])
            meta = CROP_METADATA.get(crop_name, {})
            similarity = self.numpy_engine.compute_crop_similarity(
                [nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall],
                crop_name
            )

            top_predictions.append({
                "rank": rank,
                "crop": crop_name,
                "probability": round(prob * 100, 2),
                "similarity_score": similarity,
                "rf_probability": round(float(rf_probs[idx]) * 100, 2),
                "xgb_probability": round(float(xgb_probs[idx]) * 100, 2),
                "category": meta.get("category", "Field Crop"),
                "scientific_name": meta.get("scientific_name", ""),
                "growing_season": meta.get("growing_season", "Seasonal"),
                "duration_days": meta.get("duration_days", "100-120 days"),
                "water_requirement": meta.get("water_requirement", "Moderate"),
                "icon": meta.get("icon", "🌱"),
                "color": meta.get("color", "#16a34a"),
                "cultivation_tips": meta.get("cultivation_tips", ""),
                "economic_value": meta.get("economic_value", "")
            })

        best_crop = top_predictions[0]["crop"]
        best_prob = top_predictions[0]["probability"]

        # 2. NumPy Agronomical & Climate Processing
        nutrient_analysis = self.numpy_engine.calculate_nutrient_ratios(nitrogen, phosphorus, potassium)
        climate_analysis = self.numpy_engine.calculate_climate_metrics(temperature, humidity, rainfall)
        soil_health = self.numpy_engine.calculate_soil_health_index(nitrogen, phosphorus, potassium, ph)

        # 3. Explainability & Comparison to Optimal Centroid
        centroid = self.crop_centroids.get(best_crop, {})
        feature_comparison = []
        user_vals = [nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]
        units = ["ppm (kg/ha)", "ppm (kg/ha)", "ppm (kg/ha)", "°C", "%", "pH", "mm"]

        for name, u_val, unit in zip(FEATURE_NAMES, user_vals, units):
            opt_mean = centroid.get(f"{name}_mean", u_val)
            opt_min = centroid.get(f"{name}_min", u_val * 0.8)
            opt_max = centroid.get(f"{name}_max", u_val * 1.2)
            
            # Status
            if u_val < opt_min:
                status = "Below Optimal Range"
            elif u_val > opt_max:
                status = "Above Optimal Range"
            else:
                status = "Within Ideal Range"

            feature_comparison.append({
                "feature": name,
                "unit": unit,
                "input_value": round(float(u_val), 1),
                "optimal_mean": round(float(opt_mean), 1),
                "optimal_min": round(float(opt_min), 1),
                "optimal_max": round(float(opt_max), 1),
                "status": status
            })

        # Confidence categorization
        if best_prob >= 75.0:
            confidence_level = "High Confidence"
        elif best_prob >= 50.0:
            confidence_level = "Moderate Confidence"
        else:
            confidence_level = "Marginal Confidence (Multiple viable crops)"

        return {
            "recommended_crop": best_crop,
            "confidence": best_prob,
            "confidence_level": confidence_level,
            "model_used": selected_model_name,
            "entropy_uncertainty": round(uncertainty_entropy, 3),
            "top_predictions": top_predictions,
            "feature_comparison": feature_comparison,
            "nutrient_analysis": nutrient_analysis,
            "climate_analysis": climate_analysis,
            "soil_health": soil_health,
            "input_parameters": {
                "N": nitrogen,
                "P": phosphorus,
                "K": potassium,
                "temperature": temperature,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall
            }
        }

    def simulate_climate(
        self,
        base_features: List[float],
        temp_delta: float,
        rainfall_percent_delta: float,
        model_choice: str = "ensemble"
    ) -> Dict[str, Any]:
        """
        Runs Monte Carlo climate sensitivity analysis using NumPy.
        """
        def batch_predict(samples_2d: np.ndarray) -> np.ndarray:
            if "rf" in model_choice.lower():
                preds = self.rf_model.predict(samples_2d)
            elif "xgb" in model_choice.lower():
                preds = self.xgb_model.predict(samples_2d)
            else:
                # ensemble
                p_rf = self.rf_model.predict_proba(samples_2d)
                p_xgb = self.xgb_model.predict_proba(samples_2d)
                ens = 0.55 * p_rf + 0.45 * p_xgb
                preds = np.argmax(ens, axis=1)
            return self.label_encoder.inverse_transform(preds)

        return self.numpy_engine.simulate_climate_perturbations(
            base_features=base_features,
            temp_delta=temp_delta,
            rainfall_percent_delta=rainfall_percent_delta,
            model_predict_fn=batch_predict,
            n_samples=60
        )

# Global singleton predictor instance
predictor = CropPredictor()
