#!/usr/bin/env bash
set -euo pipefail

# Run migrations only when Supabase/Postgres env vars are configured on Vercel.
if [ -n "${POSTGRES_HOST:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ]; then
  export DATABASE_URL="postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DATABASE:-postgres}?sslmode=require"
  python manage.py migrate --noinput
else
  echo "Skipping migrate: POSTGRES_HOST or POSTGRES_PASSWORD not set."
fi
