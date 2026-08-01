from django.contrib import admin

from .models import ProfileActivity, UserAddress, UserContact, UserPreferences, UserProfile


class UserContactInline(admin.StackedInline):
    model = UserContact
    extra = 0


class UserAddressInline(admin.TabularInline):
    model = UserAddress
    extra = 0


class UserPreferencesInline(admin.StackedInline):
    model = UserPreferences
    extra = 0


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("get_full_name", "user_email", "code", "gender", "is_active", "created_at")
    list_filter = ("gender", "is_active", "created_at")
    search_fields = ("first_name", "last_name", "display_name", "user__email", "code")
    inlines = [UserContactInline, UserAddressInline, UserPreferencesInline]

    def user_email(self, obj):
        return obj.user.email

    user_email.short_description = "User Email"


@admin.register(ProfileActivity)
class ProfileActivityAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "activity_type", "profile", "ip_address")
    list_filter = ("activity_type", "timestamp")
    search_fields = ("profile__user__email", "description", "ip_address")
    readonly_fields = (
        "id",
        "profile",
        "activity_type",
        "description",
        "details",
        "ip_address",
        "user_agent",
        "timestamp",
    )
