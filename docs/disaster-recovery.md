# Disaster Recovery Plan (DRP)

> **RTO Target**: < 30 Minutes  
> **RPO Target**: < 1 Hour  

---

## Disaster Recovery Execution Matrix

1. **Host Server Failure**: Provision replacement cloud VM, pull git release tag `v1.0.0`, run `./deployment/scripts/deploy.sh`.
2. **Database Corruption**: Restore latest automated snapshot using `./deployment/scripts/restore.sh <latest_backup.sql.gz>`.
3. **Application Regression**: Instantly roll back code and migrations to last known good tag using `./deployment/scripts/rollback.sh v1.0.0`.
