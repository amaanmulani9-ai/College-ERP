#!/usr/bin/env bash
set -e

BACKUP_DIR="/var/backups/college-erp"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME=${POSTGRES_DB:-"college_erp"}
DB_USER=${POSTGRES_USER:-"erp_user"}

mkdir -p $BACKUP_DIR

echo "=== Backing up PostgreSQL Database ($DB_NAME) ==="
pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

echo "=== Backing up Media Attachments ==="
tar -czf "$BACKUP_DIR/media_backup_$TIMESTAMP.tar.gz" backend/media/

echo "=== Backup Complete: $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz ==="
