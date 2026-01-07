#!/bin/bash
# Development run script for Chem-Lap

echo "====================================="
echo "   Chem-Lap Laboratory Management"
echo "====================================="
echo ""

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment exists"
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Frontend dependencies installed"
fi

echo ""
echo "Starting services..."
echo ""

# Start backend in background
echo "Starting backend server on http://localhost:5000..."
cd backend
source venv/bin/activate
export FLASK_DEBUG=true
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on http://localhost:3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "====================================="
echo "Services started successfully!"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "====================================="
echo ""
echo "Default admin credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
