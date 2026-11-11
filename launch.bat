@echo off
title AgriSuggest - Crop Recommendation Platform
color 0A

echo ============================================================
echo   Starting AgriSuggest Crop Recommendation Platform...
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking environment & dependencies...
python -c "import fastapi, uvicorn, sklearn, xgboost, numpy, pandas" 2>nul
if %errorlevel% neq 0 (
    echo Installing missing Python dependencies...
    python -m pip install -r backend\requirements.txt
)

echo [2/3] Starting AgriSuggest backend server...
:: Check if port 8000 is already active
powershell -Command "(Test-NetConnection -ComputerName 127.0.0.1 -Port 8000 -WarningAction SilentlyContinue).TcpTestSucceeded" | find "True" >nul
if %errorlevel% neq 0 (
    start "AgriSuggest Backend" /min python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
    timeout /t 3 /nobreak >nul
) else (
    echo Server is already running on port 8000!
)

echo [3/3] Opening AgriSuggest Platform in your default browser...
start http://localhost:8000

echo.
echo ============================================================
echo   AGRISUGGEST IS NOW LIVE!
echo ============================================================
echo   Application URL : http://localhost:8000
echo   API Docs        : http://localhost:8000/docs
echo.
echo   Press any key or close this window when done.
echo ============================================================
pause >nul
