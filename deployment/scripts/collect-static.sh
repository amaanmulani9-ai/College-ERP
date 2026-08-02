#!/usr/bin/env bash
set -e

echo "=== Collecting Django Static Assets ==="
cd backend
../venv/bin/python manage.py collectstatic --noinput
echo "=== Static Assets Collected ==="
