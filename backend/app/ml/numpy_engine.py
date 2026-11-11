import numpy as np
from typing import Dict, List, Tuple, Any

class NumpyAgriEngine:
    """
    NumPy-powered numerical processing engine for precision agriculture:
    - Feature transformations and nutrient ratio matrices
    - Crop centroid distance & similarity metrics
    - Vapor Pressure Deficit (VPD) and climate stress indices
    - Soil Health Index (SHI) synthesis
    - Dual-model probability ensembling & Shannon entropy uncertainty quantification
    - Vectorized Monte Carlo climate change sensitivity simulation
    """

    def __init__(self, crop_centroids: Dict[str, Dict[str, float]] = None):
        self.crop_centroids = crop_centroids or {}

    def set_crop_centroids(self, centroids: Dict[str, Dict[str, float]]):
        self.crop_centroids = centroids

    @staticmethod
    def calculate_nutrient_ratios(n: float, p: float, k: float) -> Dict[str, Any]:
        """
        Computes nutrient proportions, ratio vectors, and balance metrics via NumPy.
        """
        npk_vec = np.array([n, p, k], dtype=np.float64)
        total_npk = np.sum(npk_vec)
        
        # Avoid division by zero
        safe_total = total_npk if total_npk > 0 else 1e-6
        proportions = npk_vec / safe_total
        
        # Standard Agronomical N:P:K ideal balance benchmark (e.g. 4:2:1 -> [4/7, 2/7, 1/7])
        ideal_proportions = np.array([4.0/7.0, 2.0/7.0, 1.0/7.0], dtype=np.float64)
        
        # Euclidean deviation from ideal cereal/general agronomical balance
        balance_deviation = float(np.linalg.norm(proportions - ideal_proportions))
        
        # Balance rating (100 = perfect balance, drops with deviation)
        balance_score = max(0.0, min(100.0, float(100.0 * (1.0 - balance_deviation * 1.5))))
        
        return {
            "total_npk_ppm": round(float(total_npk), 2),
            "n_ratio": round(float(proportions[0] * 100), 1),
            "p_ratio": round(float(proportions[1] * 100), 1),
            "k_ratio": round(float(proportions[2] * 100), 1),
            "np_ratio": round(float(n / (p + 1e-4)), 2),
            "nk_ratio": round(float(n / (k + 1e-4)), 2),
            "pk_ratio": round(float(p / (k + 1e-4)), 2),
            "nutrient_balance_score": round(balance_score, 1),
            "balance_status": "Balanced" if balance_score > 70 else ("Moderately Imbalanced" if balance_score > 45 else "Severely Imbalanced")
        }

    @staticmethod
    def calculate_climate_metrics(temperature: float, humidity: float, rainfall: float) -> Dict[str, Any]:
        """
        Computes biometeorological parameters:
        - Vapor Pressure Deficit (VPD) in kPa using Tetens formula
        - Thermal comfort score for plant metabolism
        - Aridity / Moisture Index
        """
        t = np.float64(temperature)
        h = np.float64(humidity)
        r = np.float64(rainfall)

        # Tetens equation for saturation vapor pressure (es) in kPa
        es = 0.61078 * np.exp((17.27 * t) / (t + 237.3))
        # Actual vapor pressure (ea)
        ea = es * (h / 100.0)
        # VPD = es - ea
        vpd = float(np.maximum(0.0, es - ea))

        # Thermal comfort Gaussian bell curve centered around 25°C
        thermal_comfort = float(100.0 * np.exp(-((t - 25.0) ** 2) / (2.0 * (9.0 ** 2))))

        # De Martonne Aridity Index modified for single period: I = Rainfall / (Temp + 10)
        moisture_index = float(r / (t + 10.0))

        # Classification
        if vpd < 0.4:
            transpiration_zone = "Low (High Humidity / Fog risk)"
        elif vpd <= 1.25:
            transpiration_zone = "Optimal (Healthy Photosynthesis)"
        elif vpd <= 1.6:
            transpiration_zone = "Elevated (Moderate plant water stress)"
        else:
            transpiration_zone = "High (Severe Stomatal Closure / Arid stress)"

        return {
            "vpd_kpa": round(vpd, 3),
            "transpiration_zone": transpiration_zone,
            "thermal_comfort_score": round(thermal_comfort, 1),
            "moisture_availability_index": round(moisture_index, 2),
            "climate_type": "Wet & Humid" if r > 180 and h > 75 else ("Arid / Dry" if r < 70 and h < 50 else "Moderate / Subtropical")
        }

    @staticmethod
    def calculate_soil_health_index(n: float, p: float, k: float, ph: float) -> Dict[str, Any]:
        """
        Synthesizes a 0-100 Soil Health Index using vectorized multi-criteria penalization.
        """
        # pH score: optimal 6.2 - 7.2
        if 6.2 <= ph <= 7.2:
            ph_score = 100.0
        elif 5.5 <= ph <= 8.0:
            ph_score = 100.0 - (abs(ph - 6.7) / 1.3) * 35.0
        else:
            ph_score = max(10.0, 65.0 - abs(ph - 6.7) * 20.0)

        # Macro-nutrient adequacy scores
        n_score = float(np.clip(100.0 - abs(n - 70.0) * 0.7, 15.0, 100.0))
        p_score = float(np.clip(100.0 - abs(p - 50.0) * 0.9, 15.0, 100.0))
        k_score = float(np.clip(100.0 - abs(k - 45.0) * 0.9, 15.0, 100.0))

        weights = np.array([0.30, 0.25, 0.25, 0.20], dtype=np.float64)
        scores = np.array([ph_score, n_score, p_score, k_score], dtype=np.float64)
        
        overall_shi = float(np.dot(weights, scores))

        # Determine diagnostic recommendations
        recommendations = []
        if ph < 6.0:
            recommendations.append("Soil is acidic. Consider applying agricultural lime (calcium carbonate) or wood ash to raise pH.")
        elif ph > 7.8:
            recommendations.append("Soil is alkaline. Add gypsum, organic matter, or elemental sulfur to neutralize alkalinity.")
        else:
            recommendations.append("Soil pH is in the optimal agronomic range for nutrient bioavailability.")

        if n < 40:
            recommendations.append("Nitrogen is depleted. Supplement with organic compost, green manure, urea, or leguminous crop rotation.")
        elif n > 110:
            recommendations.append("Nitrogen is excessive. Reduce synthetic fertilizers to prevent vegetative overgrowth and leaching.")

        if p < 25:
            recommendations.append("Phosphorus is deficient. Apply bone meal, rock phosphate, or single superphosphate (SSP).")
        if k < 25:
            recommendations.append("Potassium is low. Apply muriate of potash (MOP) or composted bio-residue for disease resistance.")

        return {
            "overall_score": round(overall_shi, 1),
            "ph_rating": "Optimal" if 6.0 <= ph <= 7.5 else ("Acidic" if ph < 6.0 else "Alkaline"),
            "ph_subscore": round(float(ph_score), 1),
            "nitrogen_status": "Low" if n < 40 else ("Adequate" if n <= 90 else "High"),
            "phosphorus_status": "Low" if p < 25 else ("Adequate" if p <= 70 else "High"),
            "potassium_status": "Low" if k < 25 else ("Adequate" if k <= 70 else "High"),
            "fertilizer_recommendations": recommendations
        }

    def compute_crop_similarity(self, user_features: List[float], crop_name: str) -> float:
        """
        Calculates cosine similarity and normalized Euclidean distance to crop centroid.
        """
        if crop_name not in self.crop_centroids:
            return 50.0
            
        centroid = self.crop_centroids[crop_name]
        c_vec = np.array([
            centroid["N_mean"], centroid["P_mean"], centroid["K_mean"],
            centroid["temperature_mean"], centroid["humidity_mean"],
            centroid["ph_mean"], centroid["rainfall_mean"]
        ], dtype=np.float64)

        u_vec = np.array(user_features, dtype=np.float64)
        c_std = np.array([
            centroid.get("N_std", 1.0) or 1.0, centroid.get("P_std", 1.0) or 1.0,
            centroid.get("K_std", 1.0) or 1.0, centroid.get("temperature_std", 1.0) or 1.0,
            centroid.get("humidity_std", 1.0) or 1.0, centroid.get("ph_std", 1.0) or 1.0,
            centroid.get("rainfall_std", 1.0) or 1.0
        ], dtype=np.float64)

        # Standardized Euclidean Distance
        std_dist = float(np.sqrt(np.sum(((u_vec - c_vec) / np.maximum(c_std, 1e-4)) ** 2)))
        similarity = max(5.0, min(99.0, 100.0 / (1.0 + 0.25 * std_dist)))
        return round(similarity, 1)

    @staticmethod
    def ensemble_probabilities(
        rf_probs: np.ndarray, 
        xgb_probs: np.ndarray, 
        rf_weight: float = 0.55, 
        xgb_weight: float = 0.45
    ) -> Tuple[np.ndarray, float]:
        """
        Blends class probability distributions from Random Forest and XGBoost.
        Also calculates Shannon Entropy as an uncertainty measure.
        """
        # Weighted linear combination
        blended = (rf_weight * rf_probs) + (xgb_weight * xgb_probs)
        # Normalize with softmax or sum
        blended = blended / np.sum(blended)

        # Shannon Entropy H(X) = -sum(p * log2(p))
        safe_p = np.clip(blended, 1e-12, 1.0)
        entropy = -float(np.sum(safe_p * np.log2(safe_p)))

        return blended, round(entropy, 3)

    def simulate_climate_perturbations(
        self,
        base_features: List[float],
        temp_delta: float,
        rainfall_percent_delta: float,
        model_predict_fn,
        n_samples: int = 50
    ) -> Dict[str, Any]:
        """
        NumPy Monte Carlo simulation:
        Generates synthetic climatic scenarios around the proposed shift (with microclimate noise)
        to evaluate crop resilience under warming or drought/flood conditions.
        """
        # base_features: [N, P, K, temp, humidity, ph, rainfall]
        base_vec = np.array(base_features, dtype=np.float64)
        
        # New target climate
        new_temp = base_vec[3] + temp_delta
        new_rain = base_vec[6] * (1.0 + (rainfall_percent_delta / 100.0))
        
        # Create N perturbed samples using NumPy normal distribution
        samples = np.tile(base_vec, (n_samples, 1))
        # Add slight natural variability: +/- 0.5C temp, +/- 5% humidity, +/- 8% rainfall
        noise_temp = np.random.normal(0, 0.4, size=n_samples)
        noise_rain = np.random.normal(0, np.maximum(5.0, new_rain * 0.05), size=n_samples)
        noise_humidity = np.random.normal(0, 2.0, size=n_samples)

        samples[:, 3] = np.clip(new_temp + noise_temp, 5.0, 50.0)
        samples[:, 4] = np.clip(samples[:, 4] + noise_humidity, 10.0, 100.0)
        samples[:, 6] = np.clip(new_rain + noise_rain, 5.0, 350.0)

        # Run model on perturbed samples
        predictions = model_predict_fn(samples)
        
        unique, counts = np.unique(predictions, return_counts=True)
        freq_map = dict(zip(unique, counts))
        sorted_crops = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)
        
        top_crop = sorted_crops[0][0]
        top_freq = sorted_crops[0][1]
        retention_rate = float((top_freq / n_samples) * 100.0)

        return {
            "baseline_temp": round(float(base_vec[3]), 1),
            "simulated_temp": round(float(new_temp), 1),
            "temp_delta": round(temp_delta, 1),
            "baseline_rainfall": round(float(base_vec[6]), 1),
            "simulated_rainfall": round(float(new_rain), 1),
            "rainfall_delta_percent": round(rainfall_percent_delta, 1),
            "most_viable_crop": top_crop,
            "crop_retention_rate": round(retention_rate, 1),
            "resilience_rating": "High Resilience" if retention_rate >= 80 else ("Moderate Resilience" if retention_rate >= 50 else "High Climate Sensitivity / Crop Transition Expected"),
            "scenario_distribution": [
                {"crop": crop, "probability_share": round(float(cnt / n_samples * 100), 1)}
                for crop, cnt in sorted_crops[:4]
            ]
        }
