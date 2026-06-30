#!/usr/bin/env bash
# Vercel build hook — must not fail the deployment if migrate is unavailable.
set -u

if [ -n "${POSTGRES_HOST:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ]; then
  export DATABASE_URL="postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DATABASE:-postgres}?sslmode=require"
  echo "Running database migrations..."
  python manage.py migrate --noinput --skip-checks || echo "Warning: migrate failed; continuing build."
else
  echo "Skipping migrate: POSTGRES_HOST or POSTGRES_PASSWORD not set."
fi

echo "Vercel build script finished."
