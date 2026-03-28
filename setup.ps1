# SkyGuide AI Setup & Run Script (PowerShell)

Write-Host "--- SkyGuide AI: Initializing Environment ---" -ForegroundColor Cyan

# 1. Backend Setup
Write-Host "Setting up Python Backend..." -ForegroundColor Yellow
if (Test-Path "backend\venv") {
    Write-Host "Virtual environment already exists."
} else {
    python -m venv backend\venv
    Write-Host "Created virtual environment."
}

# Activate and install
& "backend\venv\Scripts\Activate.ps1"
pip install -r backend\requirements.txt
playwright install chromium
Write-Host "Backend dependencies installed."

# 2. Frontend Setup
Write-Host "Setting up Next.js Frontend..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

Write-Host "--- Setup Complete! ---" -ForegroundColor Green
Write-Host "To run the application, use the following commands in separate terminals:"
Write-Host "Backend: python backend/server.py" -ForegroundColor SkyBlue
Write-Host "Frontend: cd frontend; npm run dev" -ForegroundColor SkyBlue
