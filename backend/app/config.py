import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models_saved"

CSV_FILE = DATA_DIR / "Crop_recommendation.csv"

# PostgreSQL connection string with fallback to SQLite for local standalone development
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/crop_db"
)
SQLITE_FALLBACK_URL = f"sqlite:///{BASE_DIR / 'crop_platform.db'}"

MODELS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)
