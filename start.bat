@echo off
echo ========================================================
echo   Starting AgriSuggest Crop Recommendation Platform
echo ========================================================
echo.
echo 1. Ensuring backend models are trained...
python -m backend.app.ml.train
echo.
echo 2. Launching FastAPI server on http://localhost:8000
echo    (Serving API at http://localhost:8000/api and React UI at http://localhost:8000)
echo.
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
pause
