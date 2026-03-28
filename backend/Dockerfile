# Use an official lightweight Python image.
FROM mcr.microsoft.com/playwright/python:v1.48.0-jammy

WORKDIR /app

# Copy dependency definitions
COPY requirements.txt .

# Install dependencies (Playwright is already bundled in the base image, but we install our libraries)
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Expose FastAPI port
EXPOSE 8001

# Run the websockets uvicorn server
CMD ["python", "server.py"]
