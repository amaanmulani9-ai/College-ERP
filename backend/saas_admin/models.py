from django.db import models
from django_tenants.models import TenantMixin, DomainMixin

class Client(TenantMixin):
    name = models.CharField(max_length=100)
    paid_until = models.DateField()
    on_trial = models.BooleanField(default=True)
    created_on = models.DateField(auto_now_add=True)

    # White-Labeling Fields
    college_name = models.CharField(max_length=200, blank=True, null=True)
    primary_brand_color = models.CharField(max_length=7, default="#1e3a8a", help_text="HEX color code")
    custom_logo_url = models.URLField(blank=True, null=True)

    # default true, schema will be automatically created and synced when it is saved
    auto_create_schema = True

    def __str__(self):
        return self.name

class Domain(DomainMixin):
    pass

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    price_monthly = models.DecimalField(max_digits=8, decimal_places=2)
    max_students = models.IntegerField(default=500)
    features = models.TextField(help_text="JSON list of features")

    def __str__(self):
        return self.name

class BillingRecord(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.DO_NOTHING)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    paid_on = models.DateTimeField(auto_now_add=True)
    transaction_id = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.client.name} - {self.plan.name} on {self.paid_on}"
