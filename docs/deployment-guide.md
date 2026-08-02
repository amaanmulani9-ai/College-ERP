# Production Deployment Guide

> **Target Version**: v1.0.0  

---

## 1. Environment Requirements

- **Operating System**: Ubuntu 22.04 LTS / Debian 12 / Enterprise Linux 9
- **Python**: 3.12+
- **Database**: PostgreSQL 16+
- **In-Memory Store**: Redis 7.2+
- **Reverse Proxy**: Nginx with SSL/TLS 1.3

---

## 2. Step-by-Step Production Deployment

### Step A: Database Provisioning
```sql
CREATE DATABASE college_erp_db;
CREATE USER erp_admin WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE college_erp_db TO erp_admin;
```

### Step B: Environment Variables (`.env`)
```ini
DEBUG=False
SECRET_KEY=production_generated_high_entropy_key
ALLOWED_HOSTS=erp.college.edu,api.college.edu
DATABASE_URL=postgres://erp_admin:secure_password@localhost:5432/college_erp_db
REDIS_URL=redis://localhost:6379/0
```

### Step C: Execute Backend Migrations
```bash
cd backend
..\venv\Scripts\python.exe manage.py migrate
..\venv\Scripts\python.exe manage.py collectstatic --noinput
```

### Step D: Build & Serve Frontend
```bash
npm install
npm run build
```
Copy `dist/` contents to Nginx document root `/var/www/html/college-erp/`.
