from django.db.models import Q
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ProfileActivity, UserPreferences, UserProfile
from .serializers import (
    AvatarUploadSerializer,
    ProfileActivitySerializer,
    UpdateProfileSerializer,
    UserPreferencesSerializer,
    UserProfileSerializer,
)
from .services import (
    calculate_profile_completion,
    log_profile_activity,
    validate_avatar_file,
)


class MyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return UpdateProfileSerializer
        return UserProfileSerializer

    def perform_update(self, serializer):
        profile = serializer.save()
        log_profile_activity(
            profile,
            activity_type="profile_updated",
            description="User updated profile details.",
            request=self.request,
        )



class AvatarUploadView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AvatarUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data["file"]
        validate_avatar_file(file)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.profile_photo = file
        profile.save()

        log_profile_activity(
            profile,
            activity_type="photo_changed",
            description="User updated profile photo.",
            request=request,
        )

        return Response(UserProfileSerializer(profile).data, status=status.HTTP_200_OK)

    def delete(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.profile_photo:
            profile.profile_photo.delete()
            profile.profile_photo = None
            profile.save()

        log_profile_activity(
            profile,
            activity_type="photo_changed",
            description="User removed profile photo.",
            request=request,
        )

        return Response({"detail": "Profile photo removed."}, status=status.HTTP_200_OK)


class UserPreferencesView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPreferencesSerializer

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        prefs, _ = UserPreferences.objects.get_or_create(profile=profile)
        return prefs


class ProfileActivityView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileActivitySerializer

    def get_queryset(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return ProfileActivity.objects.filter(profile=profile)


class ProfileCompletionView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        data = calculate_profile_completion(profile)
        return Response(data, status=status.HTTP_200_OK)


class SearchProfilesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()
        if not query:
            return UserProfile.objects.none()

        return (
            UserProfile.objects.filter(
                Q(first_name__icontains=query)
                | Q(last_name__icontains=query)
                | Q(display_name__icontains=query)
                | Q(user__email__icontains=query)
                | Q(contact__mobile_number__icontains=query)
                | Q(code__icontains=query)
            )
            .select_related("user", "contact")
            .distinct()
        )
