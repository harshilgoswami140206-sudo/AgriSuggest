Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Starting AgriSuggest Crop Recommendation Platform" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""

# Ensure models are trained
Write-Host "Checking / verifying ML models and artifacts..." -ForegroundColor Yellow
python -m backend.app.ml.train

Write-Host ""
Write-Host "Launching FastAPI backend + React production build on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Swagger Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
