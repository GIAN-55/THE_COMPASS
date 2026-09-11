@echo off
setlocal enabledelayedexpansion

echo Starting Compass...
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH.
    exit /b 1
)

cd /d "%~dp0"

if not exist "frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "backend\venv\" (
    echo Creating backend virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

echo Installing backend dependencies...
call backend\venv\Scripts\pip.exe install -r backend\requirements.txt -q

echo Stopping previous instances on ports 8000 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000.*LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173.*LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo Launching services...
echo.

start "Compass Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
start "Compass Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Compass is running:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo.
