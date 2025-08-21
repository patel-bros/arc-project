# Alternative Dockerfile optimized for Render
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8000
ENV DEBIAN_FRONTEND=noninteractive

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    pkg-config \
    libopenblas-dev \
    liblapack-dev \
    libjpeg-dev \
    libpng-dev \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip setuptools wheel

# Set work directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies with fallbacks
RUN pip install --no-cache-dir numpy==2.1.1 && \
    pip install --no-cache-dir cmake && \
    (pip install --no-cache-dir dlib==19.24.6 || \
     pip install --no-cache-dir dlib==19.24.4 || \
     pip install --no-cache-dir dlib) && \
    pip install --no-cache-dir face_recognition==1.3.0 && \
    pip install --no-cache-dir opencv-python-headless==4.10.0.84 && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create directories and collect static files
RUN mkdir -p staticfiles media && \
    python manage.py collectstatic --noinput --clear

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Expose port
EXPOSE $PORT

# Run application
CMD gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120 arc_backend.wsgi:application
