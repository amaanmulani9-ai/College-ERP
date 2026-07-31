from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, TokenRecord
from .validators import EnterprisePasswordValidator


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "profile_photo",
            "date_of_birth",
            "gender",
            "preferred_language",
            "time_zone",
            "is_email_verified",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_email_verified", "is_active", "is_staff", "is_superuser", "created_at", "updated_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
            "gender",
            "preferred_language",
            "time_zone",
        ]

    def validate_password(self, value):
        EnterprisePasswordValidator().validate(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "Invalid credentials."})

        if user.is_locked_out():
            raise serializers.ValidationError(
                {"detail": f"Account locked due to repeated failed attempts. Try again after {user.lockout_until}."}
            )

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Account is deactivated. Please contact college administration."})

        authenticated_user = authenticate(username=email, password=password)
        if not authenticated_user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.lockout_until = timezone.now() + timedelta(minutes=15)
            user.save(update_fields=["failed_login_attempts", "lockout_until"])
            raise serializers.ValidationError({"email": "Invalid credentials."})

        # Reset failed attempts on success
        if user.failed_login_attempts > 0 or user.lockout_until:
            user.failed_login_attempts = 0
            user.lockout_until = None
            user.save(update_fields=["failed_login_attempts", "lockout_until"])

        data["user"] = authenticated_user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        EnterprisePasswordValidator().validate(value)
        return value


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        EnterprisePasswordValidator().validate(value)
        return value


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
