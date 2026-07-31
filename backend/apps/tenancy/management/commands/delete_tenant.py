from django.core.management.base import BaseCommand
from apps.tenancy.models import Client


class Command(BaseCommand):
    help = "Deletes a college tenant schema."

    def add_arguments(self, parser):
        parser.add_argument("--schema", type=str, required=True, help="PostgreSQL Schema Name to Delete")

    def handle(self, *args, **options):
        schema_name = options["schema"]

        try:
            tenant = Client.objects.get(schema_name=schema_name)
            tenant_name = tenant.name
            tenant.delete(force_drop=True)
            self.stdout.write(self.style.SUCCESS(f"Successfully deleted tenant '{tenant_name}' [Schema: {schema_name}]."))
        except Client.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"Tenant schema '{schema_name}' does not exist."))
