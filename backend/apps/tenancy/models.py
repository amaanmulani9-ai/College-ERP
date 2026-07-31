import uuid
from django.db import models
from django_tenants.models import DomainMixin, TenantMixin


class Client(TenantMixin):
    PLAN_CHOICES = [
        ("free", "Free Trial"),
        ("standard", "Standard"),
        ("enterprise", "Enterprise"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    contact_email = models.EmailField(blank=True, default="")
    contact_phone = models.CharField(max_length=20, blank=True, default="")
    is_active = models.BooleanField(default=True)
    subscription_plan = models.CharField(max_length=50, choices=PLAN_CHOICES, default="standard")
    trial_expiry = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    auto_create_schema = True
    auto_drop_schema = False

    class Meta:
        ordering = ["name"]
        verbose_name = "College Tenant"
        verbose_name_plural = "College Tenants"

    def __str__(self):
        return f"{self.name} ({self.schema_name})"


class Domain(DomainMixin):
    class Meta:
        verbose_name = "Tenant Domain"
        verbose_name_plural = "Tenant Domains"

    def __str__(self):
        return self.domain
