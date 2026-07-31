from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import User, TokenRecord
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)
from .services import (
    create_token_record,
    log_audit_event,
    send_password_reset_email,
    send_verification_email,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate email verification token & send email
        raw_token = create_token_record(user, token_type="email_verification", expires_in_hours=24)
        send_verification_email(user, raw_token)

        log_audit_event(request, event_type="email_verified", user=user, details={"action": "registration_initiated"})

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "message": "Registration successful. Please check your email to verify your account.",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            email = request.data.get("email")
            log_audit_event(request, event_type="login_failure", details={"email": email, "errors": serializer.errors})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        log_audit_event(request, event_type="login_success", user=user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            log_audit_event(request, event_type="logout", user=request.user)
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response({"old_password": ["Incorrect current password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        log_audit_event(request, event_type="password_change", user=user)

        return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)


class ForgotPasswordView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        try:
            user = User.objects.get(email__iexact=email)
            token = create_token_record(user, token_type="password_reset", expires_in_hours=1)
            send_password_reset_email(user, token)
            log_audit_event(request, event_type="password_reset_request", user=user)
        except User.DoesNotExist:
            pass  # Prevent email enumeration

        return Response(
            {"detail": "If an account exists with that email, a password reset link has been dispatched."},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_str = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            record = TokenRecord.objects.get(token=token_str, token_type="password_reset")
            if not record.is_valid():
                return Response({"token": ["Token has expired or already been used."]}, status=status.HTTP_400_BAD_REQUEST)

            user = record.user
            user.set_password(new_password)
            user.save()

            record.is_used = True
            record.save()

            log_audit_event(request, event_type="password_reset_confirm", user=user)
            return Response({"detail": "Password reset successfully. You can now log in."}, status=status.HTTP_200_OK)
        except TokenRecord.DoesNotExist:
            return Response({"token": ["Invalid reset token."]}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(generics.GenericAPIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_str = serializer.validated_data["token"]
        try:
            record = TokenRecord.objects.get(token=token_str, token_type="email_verification")
            if not record.is_valid():
                return Response({"token": ["Token has expired or already been used."]}, status=status.HTTP_400_BAD_REQUEST)

            user = record.user
            user.is_email_verified = True
            user.save()

            record.is_used = True
            record.save()

            log_audit_event(request, event_type="email_verified", user=user)
            return Response({"detail": "Email address verified successfully."}, status=status.HTTP_200_OK)
        except TokenRecord.DoesNotExist:
            return Response({"token": ["Invalid verification token."]}, status=status.HTTP_400_BAD_REQUEST)
