from django.contrib import admin
from .models import Designation, Employee, EmployeeStatusHistory


class EmployeeStatusHistoryInline(admin.TabularInline):
    model = EmployeeStatusHistory
    extra = 0
    readonly_fields = ("previous_status", "new_status", "changed_by", "reason", "timestamp")


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "department", "category", "is_active")
    list_filter = ("category", "department", "is_active")
    search_fields = ("name", "code")


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("employee_id", "get_employee_name", "employee_number", "department", "designation", "employment_type", "employment_status", "is_deleted")
    list_filter = ("employment_status", "employment_type", "department", "designation__category", "is_deleted")
    search_fields = ("employee_id", "employee_number", "profile__first_name", "profile__last_name", "work_email")
    inlines = [EmployeeStatusHistoryInline]

    def get_employee_name(self, obj):
        return obj.profile.get_full_name()
    get_employee_name.short_description = "Employee Name"


@admin.register(EmployeeStatusHistory)
class EmployeeStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ("employee", "previous_status", "new_status", "changed_by", "timestamp")
    list_filter = ("new_status", "timestamp")
    search_fields = ("employee__employee_id", "employee__employee_number", "reason")
    readonly_fields = ("id", "employee", "previous_status", "new_status", "changed_by", "reason", "timestamp")
