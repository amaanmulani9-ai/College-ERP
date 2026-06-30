from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.


class UserModel(UserAdmin):
    ordering = ('email',)


admin.site.register(CustomUser, UserModel)
admin.site.register(Staff)
admin.site.register(Student)
admin.site.register(Course)
admin.site.register(Book)
admin.site.register(IssuedBook)
admin.site.register(Library)
admin.site.register(Subject)
admin.site.register(Session)

# --- Register New ERP Models ---
admin.site.register(FeeRecord)
admin.site.register(FeePayment)
admin.site.register(Timetable)
admin.site.register(PlacementDrive)
admin.site.register(PlacementRegistration)
admin.site.register(CertificateRequest)
admin.site.register(StudentRegistration)
