# Use Python 3.12 slim as base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8000

# Install system dependencies required for compilation and dlib
RUN apt-get update && apt-get install -y \
    # Build essentials for compiling Python packages
    build-essential \
    cmake \
    pkg-config \
    # Dependencies for dlib
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    # Dependencies for face_recognition and OpenCV
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-0 \
    # Image processing libraries
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    # Additional dependencies
    libatlas-base-dev \
    gfortran \
    wget \
    unzip \
    # Git for pip installations from git repos
    git \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Set work directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with specific flags for problematic packages
RUN pip install --no-cache-dir numpy==2.3.1

# Install dlib with specific configuration
RUN pip install --no-cache-dir cmake
RUN pip install --no-cache-dir --verbose dlib==20.0.0

# Install face_recognition and related packages
RUN pip install --no-cache-dir face_recognition==1.3.0
RUN pip install --no-cache-dir opencv-python-headless==4.11.0.86

# Install remaining requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create necessary directories
RUN mkdir -p staticfiles
RUN mkdir -p media

# Collect static files
RUN python manage.py collectstatic --noinput --clear

# Create a non-root user for security
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:$PORT/api/debug_auth/', timeout=10)"

# Command to run the application
CMD gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 arc_backend.wsgi:application
