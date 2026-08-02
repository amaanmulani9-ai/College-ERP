#!/usr/bin/env bash

HOST=${1:-"http://localhost"}

echo "=== Verifying System Health Status ==="

# Check Nginx / Frontend
curl -sf "$HOST" > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Frontend Nginx Server: UP"
else
    echo "✗ Frontend Nginx Server: DOWN"
    exit 1
fi

# Check Backend API Health
curl -sf "$HOST/api/health/" > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Django Backend API: UP"
else
    echo "✗ Django Backend API: DOWN"
    exit 1
fi

echo "=== All Infrastructure Health Checks Passed ==="
