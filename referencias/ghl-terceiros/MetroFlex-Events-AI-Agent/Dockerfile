FROM python:3.9-slim

WORKDIR /app

# Copy requirements
COPY AI_Agent/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY AI_Agent/ ./AI_Agent/

# Expose port
EXPOSE 8080

# Run gunicorn
CMD cd AI_Agent && gunicorn app:app --bind 0.0.0.0:8080 --workers 2 --timeout 120
