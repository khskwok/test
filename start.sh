#!/bin/bash

echo "🚀 Starting AWS Professional Architect Exam Preparation Agent..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo "📋 Checking dependencies..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ Node.js and npm are required but not installed."
    exit 1
fi

echo "✅ Dependencies check passed"

# Set up backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
python seed_data.py

# Start backend server in background
echo "🚀 Starting backend server..."
python app.py &
BACKEND_PID=$!

cd ..

# Set up frontend
echo "🔧 Setting up frontend..."
cd frontend

# Install Node.js dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start frontend server in background
echo "🚀 Starting frontend server..."
npm start &
FRONTEND_PID=$!

cd ..

echo "🎉 AWS Professional Architect Exam Prep Agent is starting up!"
echo ""
echo "📊 Backend API: http://localhost:8000"
echo "🌐 Frontend App: http://localhost:3000"
echo ""
echo "⏱️  Please wait a moment for both servers to fully start..."
echo "🔄 The frontend will automatically open in your browser"
echo ""
echo "To stop the servers, press Ctrl+C"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup INT

# Wait for both processes
wait