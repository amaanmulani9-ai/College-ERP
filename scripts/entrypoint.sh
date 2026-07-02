#!/bin/sh

if [ "$DATABASE_URL" != "" ]
then
    echo "Waiting for postgres..."

    # Extract host and port from postgres url
    # e.g. postgresql://user:password@db:5432/dbname
    DB_HOST=$(echo $DATABASE_URL | cut -d@ -f2 | cut -d: -f1)
    DB_PORT=$(echo $DATABASE_URL | cut -d@ -f2 | cut -d: -f2 | cut -d/ -f1)

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Run tenant migrations
echo "Running schema migrations..."
python manage.py migrate_schemas --shared
python manage.py migrate_schemas --tenant

exec "$@"
