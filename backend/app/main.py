import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import BASE_DIR
from .database import engine, Base, get_active_db_type
from .ml.predictor import predictor
from .routers import predict, crops, analytics, soil, history

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agrisuggest")

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title="AgriSuggest - Crop Recommendation Platform",
    description="Precision AI & biometeorological platform that recommends optimal crops based on soil nutrients and climatic parameters.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(predict.router, prefix="/api")
app.include_router(crops.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(soil.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/api/health")
def health_check():
    """System health check and diagnostic status."""
    return {
        "status": "online",
        "service": "AgriSuggest Crop Recommendation Platform",
        "database": {
            "type": get_active_db_type(),
            "status": "connected"
        },
        "models": {
            "random_forest": predictor.rf_model is not None,
            "xgboost": predictor.xgb_model is not None,
            "classes_count": len(predictor.label_encoder.classes_) if predictor.label_encoder else 0
        },
        "dataset_records": predictor.metrics.get("total_samples", 2200),
        "sensor_free_design": True
    }

# Mount frontend build if available
frontend_dist = BASE_DIR.parent / "frontend" / "dist"
if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
