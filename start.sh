#!/bin/bash

# Start script for chatbot backend
# This script starts the FastAPI server

echo "🤖 Starting Chatbot Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  Please edit .env and add your OPENAI_API_KEY before continuing."
    echo "Press Enter when ready..."
    read
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt
echo ""

# Start server
echo "🚀 Starting FastAPI server..."
echo "Server will be available at: http://localhost:8000"
echo "API documentation at: http://localhost:8000/docs"
echo ""
python main.py
