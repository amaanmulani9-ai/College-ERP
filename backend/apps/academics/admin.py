from django.contrib import admin

from .models import (
    AcademicSession,
    Department,
    Faculty,
    Program,
    Semester,
    Subject,
    SubjectOffering,
)


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "dean", "display_order", "is_active", "is_deleted")
    list_filter = ("is_active", "is_deleted")
    search_fields = ("name", "code")


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "faculty", "hod", "is_active", "is_deleted")
    list_filter = ("faculty", "is_active", "is_deleted")
    search_fields = ("name", "code", "email")


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "department", "degree_level", "duration_years", "total_credits", "is_active")
    list_filter = ("degree_level", "department", "is_active")
    search_fields = ("name", "code")


@admin.register(AcademicSession)
class AcademicSessionAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "is_current", "is_active")
    list_filter = ("is_current", "is_active")
    search_fields = ("name",)


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ("name", "program", "semester_number", "credits", "is_active")
    list_filter = ("program", "semester_number", "is_active")
    search_fields = ("name", "program__name")


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "semester", "credits", "is_elective", "is_active")
    list_filter = ("is_elective", "semester__program", "is_active")
    search_fields = ("code", "name")


@admin.register(SubjectOffering)
class SubjectOfferingAdmin(admin.ModelAdmin):
    list_display = ("subject", "session", "department", "capacity", "status")
    list_filter = ("session", "department", "status")
    search_fields = ("subject__code", "subject__name")
