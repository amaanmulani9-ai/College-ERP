from django.urls import path

from .views import (
    AvatarUploadView,
    MyProfileView,
    ProfileActivityView,
    ProfileCompletionView,
    SearchProfilesView,
    UserPreferencesView,
)

app_name = "profiles"

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my_profile"),
    path("me/avatar/", AvatarUploadView.as_view(), name="my_avatar"),
    path("me/preferences/", UserPreferencesView.as_view(), name="my_preferences"),
    path("me/timeline/", ProfileActivityView.as_view(), name="my_timeline"),
    path("me/completion/", ProfileCompletionView.as_view(), name="my_completion"),
    path("search/", SearchProfilesView.as_view(), name="search_profiles"),
]
