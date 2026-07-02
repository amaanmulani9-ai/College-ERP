FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=college_management_system.settings

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
# Add missing dependencies for SaaS setup
RUN pip install --upgrade pip \
    && pip install gunicorn django-tenants \
    && pip install -r requirements.txt

# Copy project
COPY backend/ /app/
COPY frontend/ /app/frontend/

# Ensure staticfiles directory exists and is writable
RUN mkdir -p /app/staticfiles && chmod 777 /app/staticfiles

# Collect static files (needs mock DB url so settings load)
RUN DATABASE_URL=postgres://mock:mock@localhost:5432/mock python manage.py collectstatic --noinput || true

# Copy entrypoint script
COPY scripts/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Run entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Start gunicorn
CMD ["gunicorn", "college_management_system.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
