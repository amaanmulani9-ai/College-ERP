from django.core.management.base import BaseCommand
from apps.tenancy.models import Client


class Command(BaseCommand):
    help = "Lists all registered college tenants and their mapped domains."

    def handle(self, *args, **options):
        tenants = Client.objects.all().prefetch_related("domains")

        if not tenants.exists():
            self.stdout.write("No college tenants found.")
            return

        self.stdout.write(self.style.MIGRATE_HEADING("Registered College Tenants:"))
        for tenant in tenants:
            domains = ", ".join([d.domain for d in tenant.domains.all()])
            status = "ACTIVE" if tenant.is_active else "INACTIVE"
            self.stdout.write(
                f"- {tenant.name} | Schema: {tenant.schema_name} | Plan: {tenant.subscription_plan} | Status: {status} | Domains: [{domains}]"
            )
