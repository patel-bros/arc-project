#!/bin/bash

# Render build script for Django with dlib and face_recognition
echo "Starting build process..."

# Exit on any error
set -e

# Update pip and install basic tools
echo "Upgrading pip and installing build tools..."
pip install --upgrade pip setuptools wheel

# Install system-level dependencies if available (this may not work on Render)
echo "Installing Python dependencies..."

# Install numpy first (required by many packages)
pip install numpy==2.1.1

# Install cmake
pip install cmake

# Install dlib with fallback options
echo "Installing dlib..."
pip install dlib==19.24.6 || pip install dlib==19.24.4 || pip install dlib

# Install face recognition packages
echo "Installing face recognition..."
pip install face_recognition==1.3.0
pip install opencv-python-headless==4.10.0.84

# Install remaining requirements
echo "Installing remaining requirements..."
pip install -r requirements.txt

# Run Django commands
echo "Running Django setup..."
python manage.py collectstatic --noinput --clear

echo "Build completed successfully!"
