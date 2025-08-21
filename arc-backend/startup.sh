#!/bin/bash

# Startup script for arc-backend on Render

echo "Starting arc-backend deployment..."

# Wait for any dependencies to be ready
sleep 5

# Run database migrations (if using traditional DB)
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Initialize the system (creates trading pairs, etc.)
echo "Initializing system..."
python manage.py shell -c "
from core.views import initialize_trading_pairs, simulate_all_prices, initialize_merchant_wallets
try:
    initialize_trading_pairs()
    simulate_all_prices()
    initialize_merchant_wallets()
    print('System initialized successfully')
except Exception as e:
    print(f'System initialization error: {e}')
"

# Start the application
echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 arc_backend.wsgi:application
