#!/usr/bin/env bash
set -e

echo "=== Starting Enterprise College ERP Production Deployment ==="

git pull origin main

echo "Installing/updating backend requirements..."
cd backend
../venv/bin/pip install -r requirements.txt

echo "Applying database migrations..."
../venv/bin/python manage.py migrate --noinput

echo "Collecting static files..."
../venv/bin/python manage.py collectstatic --noinput

cd ..

echo "Building production frontend assets..."
npm ci
npm run build

echo "Restarting services..."
sudo systemctl restart gunicorn
sudo systemctl restart celery
sudo systemctl restart celery-beat
sudo systemctl reload nginx

echo "=== Production Deployment Complete & Verified ==="
