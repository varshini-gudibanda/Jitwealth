from django.urls import path
from .views import MeView, ChangePasswordView

urlpatterns = [
    path("me/", MeView.as_view(), name="member-me"),
    path("change-password/", ChangePasswordView.as_view(), name="member-change-password"),
]