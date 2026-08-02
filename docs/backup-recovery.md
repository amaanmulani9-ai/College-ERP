# Database Backup & Recovery Procedures

> **Scripts**: `deployment/scripts/backup.sh` & `deployment/scripts/restore.sh`  

---

## 1. Automated Daily Backups

Add the following entry to root crontab (`sudo crontab -e`):
```cron
0 2 * * * /var/www/college-erp/deployment/scripts/backup.sh >> /var/log/erp-backup.log 2>&1
```

---

## 2. Manual Backup & Restore Commands

```bash
# Execute manual backup
./deployment/scripts/backup.sh

# Restore from compressed sql backup
./deployment/scripts/restore.sh /var/backups/college-erp/db_backup_20260802_020000.sql.gz
```
