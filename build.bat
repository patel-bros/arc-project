@echo off
REM Build script for Windows
REM Usage: build.bat [development|production]

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

echo 🚀 Configuring for %ENVIRONMENT% environment...

REM Copy root environment file to active .env
echo 📦 Setting up root environment...
copy .env.%ENVIRONMENT% .env
echo ✅ Root environment set to %ENVIRONMENT%

REM Copy environment file to backend
echo 📦 Setting up backend environment...
cd arc-backend
copy ..\.env.%ENVIRONMENT% .env
echo ✅ Backend environment set to %ENVIRONMENT%
cd ..

REM Update extension config if it exists
if exist "arc-extension\config.js" (
    echo 📦 Updating extension config...
    cd arc-extension
    if "%ENVIRONMENT%"=="production" (
        powershell -Command "(gc config.js) -replace \"const CURRENT_ENV = 'development'\", \"const CURRENT_ENV = 'production'\" | Out-File -encoding UTF8 config.js"
    ) else (
        powershell -Command "(gc config.js) -replace \"const CURRENT_ENV = 'production'\", \"const CURRENT_ENV = 'development'\" | Out-File -encoding UTF8 config.js"
    )
    echo ✅ Extension configured for %ENVIRONMENT%
    cd ..
)

echo.
echo 🎉 All projects configured for %ENVIRONMENT% environment!
echo.
echo Next steps:
if "%ENVIRONMENT%"=="production" (
    echo - Backend: Deploy to Railway ^(reads .env automatically^)
    echo - Frontend: Deploy to Vercel ^(reads VITE_ vars automatically^)
    echo - Extension: Load updated config in Chrome
) else (
    echo - Backend: cd arc-backend ^&^& python manage.py runserver
    echo - Curve: cd curve ^&^& npm run dev
    echo - Dashboard: cd arc-web-dashboard ^&^& npm run dev
    echo - Extension: Load in Chrome Developer Mode
)
echo.
echo Environment variables loaded from: .env.%ENVIRONMENT%
