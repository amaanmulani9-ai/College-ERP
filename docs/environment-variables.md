# Environment Variable Reference Guide

| Variable | Description | Example / Default |
|---|---|---|
| `DEBUG` | Enable Django debug mode (Must be False in prod) | `False` |
| `SECRET_KEY` | Django cryptographic signing key | `high_entropy_secret_string` |
| `ALLOWED_HOSTS` | Comma-separated list of valid host headers | `erp.college.edu,api.college.edu` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/dbname` |
| `REDIS_URL` | Redis cache and Celery broker connection string | `redis://host:6379/0` |
| `EMAIL_HOST` | SMTP server hostname | `smtp.sendgrid.net` |
| `USE_S3` | Store media attachments on AWS S3 | `True` / `False` |
| `OPENAI_API_KEY` | Key for Docked AI Assistant integration | `sk-proj-...` |
