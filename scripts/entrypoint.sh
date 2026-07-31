#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
    DB_HOST=$(echo "$DATABASE_URL" | sed -E 's#^[^@]+@([^:/]+).*#\1#')
    DB_PORT=$(echo "$DATABASE_URL" | sed -E 's#.*:([0-9]+)/.*#\1#')
    DB_PORT=${DB_PORT:-5432}

    echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
    while ! nc -z "$DB_HOST" "$DB_PORT"; do
        sleep 1
    done
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Running database migrations..."
    if python manage.py help migrate_schemas >/dev/null 2>&1; then
        python manage.py migrate_schemas --shared --noinput
    else
        python manage.py migrate --noinput
    fi
fi

if [ "${RUN_COLLECTSTATIC:-true}" = "true" ]; then
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

exec "$@"
