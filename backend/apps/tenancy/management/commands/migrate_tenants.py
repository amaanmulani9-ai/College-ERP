from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Executes schema migrations for shared and tenant schemas via django-tenants."

    def handle(self, *args, **options):
        self.stdout.write("Running django-tenants schema migration...")
        call_command("migrate_schemas")
        self.stdout.write(self.style.SUCCESS("All schemas migrated successfully."))
