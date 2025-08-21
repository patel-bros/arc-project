#!/bin/bash

# Build script for arc-backend on Render

echo "Starting build process..."

# Upgrade pip
pip install --upgrade pip

# Install system dependencies that might be needed
echo "Installing Python dependencies..."

# Install numpy first (required by many packages)
pip install numpy==2.3.1

# Install dlib with verbose output to see progress
echo "Installing dlib (this may take several minutes)..."
pip install --verbose dlib==20.0.0

# Install face recognition
pip install face_recognition==1.3.0

# Install OpenCV (headless version for server)
pip install opencv-python-headless==4.11.0.86

# Install remaining requirements
pip install -r requirements.txt

echo "Build completed successfully!"
