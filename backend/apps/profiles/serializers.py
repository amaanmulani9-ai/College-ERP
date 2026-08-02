from rest_framework import serializers

from .models import ProfileActivity, UserAddress, UserContact, UserPreferences, UserProfile
from .services import calculate_profile_completion


class UserContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserContact
        fields = [
            "primary_email",
            "secondary_email",
            "mobile_number",
            "alternate_mobile",
            "emergency_contact_name",
            "emergency_contact_number",
        ]


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = [
            "id",
            "address_type",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "country",
            "postal_code",
            "latitude",
            "longitude",
        ]


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = [
            "theme",
            "dark_mode",
            "notification_preferences",
            "time_format",
            "date_format",
            "language",
            "dashboard_layout",
        ]


class ProfileActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileActivity
        fields = ["id", "activity_type", "description", "details", "ip_address", "timestamp"]


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    full_name = serializers.CharField(source="get_full_name", read_only=True)
    contact = UserContactSerializer(read_only=True)
    addresses = UserAddressSerializer(many=True, read_only=True)
    preferences = UserPreferencesSerializer(read_only=True)
    completion = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "email",
            "code",
            "first_name",
            "middle_name",
            "last_name",
            "full_name",
            "display_name",
            "profile_photo",
            "cover_photo",
            "signature_image",
            "gender",
            "date_of_birth",
            "blood_group",
            "nationality",
            "preferred_language",
            "time_zone",
            "biography",
            "is_active",
            "contact",
            "addresses",
            "preferences",
            "completion",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "email", "created_at", "updated_at"]

    def get_completion(self, obj):
        return calculate_profile_completion(obj)


class UpdateProfileSerializer(serializers.ModelSerializer):
    contact = UserContactSerializer(required=False)

    class Meta:
        model = UserProfile
        fields = [
            "code",
            "first_name",
            "middle_name",
            "last_name",
            "display_name",
            "gender",
            "date_of_birth",
            "blood_group",
            "nationality",
            "preferred_language",
            "time_zone",
            "biography",
            "contact",
        ]

    def update(self, instance, validated_data):
        contact_data = validated_data.pop("contact", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if contact_data:
            contact, _ = UserContact.objects.get_or_create(profile=instance)
            for c_attr, c_val in contact_data.items():
                setattr(contact, c_attr, c_val)
            contact.save()

        return instance


class AvatarUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
