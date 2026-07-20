import datetime
from django.core.management.base import BaseCommand
from django.db import connections, transaction
from django_tenants.utils import schema_context
from saas_admin.models import Client, Domain

# Import all legacy models to migrate
from main_app.models import (
    CustomUser, AdminHOD, Staff, Student, Parent, Course, Subject, Session,
    Attendance, AttendanceReport, LeaveReportStudent, LeaveReportStaff, FeedbackStudent,
    FeedbackStaff, NotificationStudent, NotificationStaff, StudentResult, Timetable,
    LiveClass, FeeType, Invoice, Payment, Scholarship, Refund, Company, JobPosting,
    Resume, Interview, OfferLetter
)

class Command(BaseCommand):
    help = 'Migrates data from legacy SQLite database into a new Postgres Tenant schema.'

    def add_arguments(self, parser):
        parser.add_argument('--domain', type=str, required=True, help='Domain for the legacy tenant (e.g., legacy.youreduerp.com)')

    def handle(self, *args, **options):
        domain_name = options['domain']
        self.stdout.write(self.style.NOTICE(f"Starting migration to tenant domain: {domain_name}"))

        # 1. Provision SaaS Admin (Public Schema) if needed
        # We ensure the public schema client exists
        with transaction.atomic(using='default'):
            public_client, created = Client.objects.get_or_create(
                schema_name='public',
                defaults={
                    'name': 'SaaS System Admin',
                    'paid_until': datetime.date(2099, 12, 31),
                    'on_trial': False
                }
            )
            if created:
                Domain.objects.create(domain='localhost', tenant=public_client, is_primary=True)
                self.stdout.write(self.style.SUCCESS("Created 'public' schema admin client."))

        # 2. Provision the Legacy Tenant
        schema_name = domain_name.replace('.', '_').replace('-', '_')
        with transaction.atomic(using='default'):
            legacy_client, created = Client.objects.get_or_create(
                schema_name=schema_name,
                defaults={
                    'name': 'Legacy College',
                    'college_name': 'Legacy College',
                    'paid_until': datetime.date(2030, 12, 31),
                    'on_trial': False
                }
            )
            if created:
                Domain.objects.create(domain=domain_name, tenant=legacy_client, is_primary=True)
                self.stdout.write(self.style.SUCCESS(f"Provisioned new tenant schema: {schema_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Tenant schema {schema_name} already exists."))

        # 3. Migrate Data
        models_to_migrate = [
            CustomUser, Course, Subject, Session, AdminHOD, Staff, Student, Parent,
            Timetable, LiveClass, Attendance, AttendanceReport, LeaveReportStudent,
            LeaveReportStaff, FeedbackStudent, FeedbackStaff, NotificationStudent,
            NotificationStaff, StudentResult, FeeType, Invoice, Scholarship, Payment,
            Refund, Company, JobPosting, Resume, Interview, OfferLetter
        ]

        # Use the context manager to route 'default' database queries to the tenant's schema
        with schema_context(legacy_client.schema_name):
            for Model in models_to_migrate:
                self.stdout.write(f"Migrating {Model.__name__}...")
                
                # Fetch from legacy_sqlite
                legacy_objects = Model.objects.using('legacy_sqlite').all()
                
                count = 0
                for obj in legacy_objects:
                    # To preserve Primary Keys (IDs), we must force an insert with the exact ID.
                    # This requires temporarily popping state.
                    obj._state.adding = True
                    obj._state.db = 'default' # Will route to Postgres tenant schema
                    
                    try:
                        # Attempt to save the object exactly as-is into Postgres
                        obj.save(force_insert=True)
                        count += 1
                    except Exception as e:
                        # Ignore IntegrityErrors if rerunning migration
                        if "already exists" not in str(e):
                            self.stderr.write(self.style.ERROR(f"Error migrating {Model.__name__} ID {obj.pk}: {e}"))
                
                self.stdout.write(self.style.SUCCESS(f"Successfully migrated {count} {Model.__name__} records."))

        self.stdout.write(self.style.SUCCESS("MIGRATION COMPLETE."))
