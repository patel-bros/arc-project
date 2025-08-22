#!/bin/bash

# Build script for different environments
# Usage: ./build.sh [development|production]

ENVIRONMENT=${1:-development}

echo "🚀 Configuring for $ENVIRONMENT environment..."

# Copy root environment file to active .env
echo "📦 Setting up root environment..."
cp .env.$ENVIRONMENT .env
echo "✅ Root environment set to $ENVIRONMENT"

# Copy environment file to backend
echo "📦 Setting up backend environment..."
cd arc-backend
cp ../.env.$ENVIRONMENT .env
echo "✅ Backend environment set to $ENVIRONMENT"
cd ..

# Update extension config if it exists
if [ -f "arc-extension/config.js" ]; then
    echo "📦 Updating extension config..."
    cd arc-extension
    if [ "$ENVIRONMENT" = "production" ]; then
        sed -i "s/const CURRENT_ENV = 'development'/const CURRENT_ENV = 'production'/" config.js
    else
        sed -i "s/const CURRENT_ENV = 'production'/const CURRENT_ENV = 'development'/" config.js
    fi
    echo "✅ Extension configured for $ENVIRONMENT"
    cd ..
fi

echo ""
echo "🎉 All projects configured for $ENVIRONMENT environment!"
echo ""
echo "Next steps:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "- Backend: Deploy to Railway (reads .env automatically)"
    echo "- Frontend: Deploy to Vercel (reads VITE_ vars automatically)"
    echo "- Extension: Load updated config in Chrome"
else
    echo "- Backend: cd arc-backend && python manage.py runserver"
    echo "- Curve: cd curve && npm run dev"
    echo "- Dashboard: cd arc-web-dashboard && npm run dev"
    echo "- Extension: Load in Chrome Developer Mode"
fi
echo ""
echo "Environment variables loaded from: .env.$ENVIRONMENT"
