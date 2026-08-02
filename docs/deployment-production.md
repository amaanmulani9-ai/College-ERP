# Production Deployment Operations Guide

> **Module**: `deployment/`  
> **Version**: v1.0.1-deployment-part1  

---

## 1. Overview & Topology

The production infrastructure consists of:
- **Nginx**: Reverse proxy, SSL termination, static file serving, rate limiting.
- **Gunicorn WSGI**: Multi-worker Django application server.
- **Celery & Celery Beat**: Asynchronous task worker and periodic task scheduler.
- **PostgreSQL 16**: Primary relational database with multi-tenant schema isolation.
- **Redis 7.2**: In-memory cache, session store, and Celery message broker.

---

## 2. Quick Deployment Command

```bash
cd deployment/scripts
./deploy.sh
```
