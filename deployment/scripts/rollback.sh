#!/usr/bin/env bash
set -e

PREV_TAG=${1:-"v1.0.0"}

echo "=== Rolling back to target git tag: $PREV_TAG ==="
git checkout $PREV_TAG

cd backend
../venv/bin/pip install -r requirements.txt
../venv/bin/python manage.py migrate --noinput
../venv/bin/python manage.py collectstatic --noinput
cd ..

npm run build

sudo systemctl restart gunicorn
sudo systemctl restart celery
sudo systemctl restart celery-beat
sudo systemctl reload nginx

echo "=== Rollback to $PREV_TAG Complete ==="
