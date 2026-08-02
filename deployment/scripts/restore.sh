#!/usr/bin/env bash
set -e

BACKUP_FILE=$1
DB_NAME=${POSTGRES_DB:-"college_erp"}
DB_USER=${POSTGRES_USER:-"erp_user"}

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore.sh /path/to/backup.sql.gz"
    exit 1
fi

echo "=== Restoring Database ($DB_NAME) from $BACKUP_FILE ==="
gunzip -c "$BACKUP_FILE" | psql -U $DB_USER -d $DB_NAME

echo "=== Restore Complete ==="
