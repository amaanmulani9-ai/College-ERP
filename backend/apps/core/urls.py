from django.urls import path
from .views import (
    health_check,
    health_database,
    health_redis,
    health_storage,
    readiness_check,
)

app_name = "core"

urlpatterns = [
    path("health/", health_check, name="health"),
    path("health/database/", health_database, name="health_database"),
    path("health/redis/", health_redis, name="health_redis"),
    path("health/storage/", health_storage, name="health_storage"),
    path("ready/", readiness_check, name="ready"),
]
