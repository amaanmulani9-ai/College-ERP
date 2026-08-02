# Docker Operations & Multi-Container Guide

> **Module**: `deployment/docker/`  

---

## 1. Multi-Stage Dockerfile Specifications

- **`Dockerfile.backend`**: Multi-stage build compiling dependencies and running Gunicorn with 4 workers.
- **`Dockerfile.frontend`**: Multi-stage Node 20 build compiling Vite static bundle into an Alpine Nginx image.
- **`Dockerfile.celery`**: Worker service handling asynchronous email generation, PDF rendering, and background tasks.
- **`Dockerfile.celery-beat`**: Cron scheduler for recurring database maintenance and automated reports.

---

## 2. Docker Compose Commands

```bash
# Launch Production Stack
docker-compose -f deployment/docker/docker-compose.production.yml up --build -d

# Launch Staging Stack
docker-compose -f deployment/docker/docker-compose.staging.yml up --build -d
```
