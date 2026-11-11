import json
import logging
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import xgboost as xgb

from ..config import CSV_FILE, MODELS_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FEATURE_NAMES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

def train_and_export():
    logger.info(f"Loading Crop Recommendation dataset from {CSV_FILE}...")
    if not CSV_FILE.exists():
        raise FileNotFoundError(f"Dataset not found at {CSV_FILE}")

    df = pd.read_csv(CSV_FILE)
    logger.info(f"Loaded dataset with shape {df.shape}")

    # Calculate dataset summaries and distributions using NumPy
    X = df[FEATURE_NAMES].values.astype(np.float64)
    y_raw = df["label"].values

    # Fit LabelEncoder
    le = LabelEncoder()
    y_encoded = le.fit_transform(y_raw)
    class_names = le.classes_.tolist()

    # Calculate crop centroids using NumPy
    centroids = {}
    for crop in class_names:
        crop_mask = (y_raw == crop)
        crop_data = X[crop_mask]
        
        c_means = np.mean(crop_data, axis=0)
        c_stds = np.std(crop_data, axis=0)
        c_mins = np.min(crop_data, axis=0)
        c_maxs = np.max(crop_data, axis=0)
        
        centroids[crop] = {
            "N_mean": round(float(c_means[0]), 2),
            "N_std": round(float(c_stds[0]), 2),
            "N_min": round(float(c_mins[0]), 2),
            "N_max": round(float(c_maxs[0]), 2),
            "P_mean": round(float(c_means[1]), 2),
            "P_std": round(float(c_stds[1]), 2),
            "P_min": round(float(c_mins[1]), 2),
            "P_max": round(float(c_maxs[1]), 2),
            "K_mean": round(float(c_means[2]), 2),
            "K_std": round(float(c_stds[2]), 2),
            "K_min": round(float(c_mins[2]), 2),
            "K_max": round(float(c_maxs[2]), 2),
            "temperature_mean": round(float(c_means[3]), 2),
            "temperature_std": round(float(c_stds[3]), 2),
            "temperature_min": round(float(c_mins[3]), 2),
            "temperature_max": round(float(c_maxs[3]), 2),
            "humidity_mean": round(float(c_means[4]), 2),
            "humidity_std": round(float(c_stds[4]), 2),
            "humidity_min": round(float(c_mins[4]), 2),
            "humidity_max": round(float(c_maxs[4]), 2),
            "ph_mean": round(float(c_means[5]), 2),
            "ph_std": round(float(c_stds[5]), 2),
            "ph_min": round(float(c_mins[5]), 2),
            "ph_max": round(float(c_maxs[5]), 2),
            "rainfall_mean": round(float(c_means[6]), 2),
            "rainfall_std": round(float(c_stds[6]), 2),
            "rainfall_min": round(float(c_mins[6]), 2),
            "rainfall_max": round(float(c_maxs[6]), 2),
            "sample_count": int(np.sum(crop_mask))
        }

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # Standard Scaler
    scaler = StandardScaler()
    scaler.fit(X_train)

    # 1. Train Random Forest Classifier
    logger.info("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=18,
        min_samples_split=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_acc = float(accuracy_score(y_test, rf_preds))
    rf_p, rf_r, rf_f1, _ = precision_recall_fscore_support(y_test, rf_preds, average="weighted")
    rf_cm = confusion_matrix(y_test, rf_preds).tolist()
    rf_importances = dict(zip(FEATURE_NAMES, [round(float(v), 4) for v in rf_model.feature_importances_]))

    # 2. Train XGBoost Classifier
    logger.info("Training XGBoost Classifier...")
    xgb_model = xgb.XGBClassifier(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=5,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        eval_metric="mlogloss",
        n_jobs=-1
    )
    xgb_model.fit(X_train, y_train)
    xgb_preds = xgb_model.predict(X_test)
    xgb_acc = float(accuracy_score(y_test, xgb_preds))
    xgb_p, xgb_r, xgb_f1, _ = precision_recall_fscore_support(y_test, xgb_preds, average="weighted")
    xgb_cm = confusion_matrix(y_test, xgb_preds).tolist()
    xgb_importances = dict(zip(FEATURE_NAMES, [round(float(v), 4) for v in xgb_model.feature_importances_]))

    # 3. Ensemble Evaluation (0.55 RF + 0.45 XGB)
    rf_test_probs = rf_model.predict_proba(X_test)
    xgb_test_probs = xgb_model.predict_proba(X_test)
    ensemble_probs = 0.55 * rf_test_probs + 0.45 * xgb_test_probs
    ensemble_preds = np.argmax(ensemble_probs, axis=1)
    ens_acc = float(accuracy_score(y_test, ensemble_preds))
    ens_p, ens_r, ens_f1, _ = precision_recall_fscore_support(y_test, ensemble_preds, average="weighted")
    ens_cm = confusion_matrix(y_test, ensemble_preds).tolist()

    # Dataset correlation matrix using NumPy
    corr_matrix = np.corrcoef(X.T)
    corr_dict = {
        FEATURE_NAMES[i]: {
            FEATURE_NAMES[j]: round(float(corr_matrix[i, j]), 3)
            for j in range(len(FEATURE_NAMES))
        }
        for i in range(len(FEATURE_NAMES))
    }

    metrics = {
        "random_forest": {
            "accuracy": round(rf_acc * 100, 2),
            "precision": round(float(rf_p) * 100, 2),
            "recall": round(float(rf_r) * 100, 2),
            "f1_score": round(float(rf_f1) * 100, 2),
            "feature_importance": rf_importances,
            "confusion_matrix": rf_cm
        },
        "xgboost": {
            "accuracy": round(xgb_acc * 100, 2),
            "precision": round(float(xgb_p) * 100, 2),
            "recall": round(float(xgb_r) * 100, 2),
            "f1_score": round(float(xgb_f1) * 100, 2),
            "feature_importance": xgb_importances,
            "confusion_matrix": xgb_cm
        },
        "ensemble": {
            "accuracy": round(ens_acc * 100, 2),
            "precision": round(float(ens_p) * 100, 2),
            "recall": round(float(ens_r) * 100, 2),
            "f1_score": round(float(ens_f1) * 100, 2),
            "weights": {"random_forest": 0.55, "xgboost": 0.45},
            "confusion_matrix": ens_cm
        },
        "classes": class_names,
        "feature_names": FEATURE_NAMES,
        "total_samples": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "correlations": corr_dict
    }

    # Save models
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(rf_model, MODELS_DIR / "rf_model.joblib")
    joblib.dump(xgb_model, MODELS_DIR / "xgb_model.joblib")
    joblib.dump(le, MODELS_DIR / "label_encoder.joblib")
    joblib.dump(scaler, MODELS_DIR / "scaler.joblib")

    with open(MODELS_DIR / "metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)

    with open(MODELS_DIR / "crop_centroids.json", "w") as f:
        json.dump(centroids, f, indent=2)

    logger.info("Successfully trained, evaluated, and saved models and artifacts!")
    logger.info(f"Random Forest Accuracy: {metrics['random_forest']['accuracy']}%")
    logger.info(f"XGBoost Accuracy: {metrics['xgboost']['accuracy']}%")
    logger.info(f"Ensemble Accuracy: {metrics['ensemble']['accuracy']}%")

if __name__ == "__main__":
    train_and_export()
