@echo off
REM Start script for chatbot backend (Windows)
REM This script starts the FastAPI server

echo 🤖 Starting Chatbot Backend...
echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  Warning: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  Please edit .env and add your OPENAI_API_KEY before continuing.
    pause
)

REM Check if virtual environment exists
if not exist venv (
    echo 📦 Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt
echo.

REM Start server
echo 🚀 Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo API documentation at: http://localhost:8000/docs
echo.
python main.py
