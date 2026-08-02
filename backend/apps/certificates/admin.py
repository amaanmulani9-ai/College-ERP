from django.contrib import admin

from .models import Certificate, CertificateAuditLog, CertificateType, Transcript


class CertificateAuditLogInline(admin.TabularInline):
    model = CertificateAuditLog
    extra = 0
    readonly_fields = ["event_type", "actor", "description", "metadata", "timestamp"]


@admin.register(CertificateType)
class CertificateTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "code"]


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ["certificate_number", "student", "certificate_type", "status", "generated_at"]
    list_filter = ["status", "certificate_type"]
    search_fields = ["certificate_number", "student__student_id", "student__profile__first_name"]
    inlines = [CertificateAuditLogInline]


@admin.register(Transcript)
class TranscriptAdmin(admin.ModelAdmin):
    list_display = ["student", "program", "cgpa", "sgpa", "earned_credits", "status", "generated_at"]
    list_filter = ["status", "program"]
    search_fields = ["student__student_id", "student__profile__first_name"]


@admin.register(CertificateAuditLog)
class CertificateAuditLogAdmin(admin.ModelAdmin):
    list_display = ["event_type", "actor", "description", "timestamp"]
    list_filter = ["event_type"]
    readonly_fields = ["certificate", "transcript", "actor", "event_type", "description", "metadata", "timestamp"]
