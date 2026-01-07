@echo off
REM Development run script for Chem-Lap (Windows)

echo =====================================
echo    Chem-Lap Laboratory Management
echo =====================================
echo.

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    echo Virtual environment created
) else (
    echo Virtual environment exists
)

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo Frontend dependencies installed
) else (
    echo Frontend dependencies installed
)

echo.
echo Starting services...
echo.

REM Start backend
echo Starting backend server on http://localhost:5000...
cd backend
call venv\Scripts\activate
set FLASK_DEBUG=true
start /B python app.py
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting frontend server on http://localhost:3000...
cd frontend
start /B npm start
cd ..

echo.
echo =====================================
echo Services started successfully!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo =====================================
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
echo Press Ctrl+C to stop
echo.

pause
