from django.core.management.base import BaseCommand
from apps.tenancy.models import Client, Domain


class Command(BaseCommand):
    help = "Creates a new college tenant schema and maps its domain."

    def add_arguments(self, parser):
        parser.add_argument("--name", type=str, required=True, help="College Name")
        parser.add_argument("--slug", type=str, required=True, help="College Slug")
        parser.add_argument("--schema", type=str, required=True, help="PostgreSQL Schema Name")
        parser.add_argument("--domain", type=str, required=True, help="College Domain (e.g., collegea.localhost)")
        parser.add_argument("--email", type=str, default="", help="Contact Email")
        parser.add_argument("--plan", type=str, default="standard", help="Subscription Plan (free, standard, enterprise)")

    def handle(self, *args, **options):
        name = options["name"]
        slug = options["slug"]
        schema_name = options["schema"]
        domain_name = options["domain"]
        email = options["email"]
        plan = options["plan"]

        if Client.objects.filter(schema_name=schema_name).exists():
            self.stderr.write(self.style.ERROR(f"Schema '{schema_name}' already exists!"))
            return

        tenant = Client.objects.create(
            name=name,
            slug=slug,
            schema_name=schema_name,
            contact_email=email,
            subscription_plan=plan,
            is_active=True,
        )

        domain = Domain.objects.create(
            domain=domain_name,
            tenant=tenant,
            is_primary=True,
        )

        self.stdout.write(
            self.style.SUCCESS(f"Successfully created tenant '{name}' [Schema: {schema_name}] mapped to domain '{domain.domain}'.")
        )
