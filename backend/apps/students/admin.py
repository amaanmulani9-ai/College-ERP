from django.contrib import admin

from .models import Student, StudentStatusHistory


class StudentStatusHistoryInline(admin.TabularInline):
    model = StudentStatusHistory
    extra = 0
    readonly_fields = ("previous_status", "new_status", "changed_by", "reason", "timestamp")


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "student_id",
        "get_student_name",
        "enrollment_number",
        "program",
        "department",
        "status",
        "is_deleted",
        "created_at",
    )
    list_filter = ("status", "program", "department", "category", "is_deleted")
    search_fields = (
        "student_id",
        "enrollment_number",
        "roll_number",
        "profile__first_name",
        "profile__last_name",
        "profile__user__email",
    )
    inlines = [StudentStatusHistoryInline]

    def get_student_name(self, obj):
        return obj.profile.get_full_name()

    get_student_name.short_description = "Student Name"


@admin.register(StudentStatusHistory)
class StudentStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ("student", "previous_status", "new_status", "changed_by", "timestamp")
    list_filter = ("new_status", "timestamp")
    search_fields = ("student__student_id", "student__enrollment_number", "reason")
    readonly_fields = ("id", "student", "previous_status", "new_status", "changed_by", "reason", "timestamp")
