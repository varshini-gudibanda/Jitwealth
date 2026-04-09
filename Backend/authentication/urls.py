# urls.py
from django.urls import path
from .views import SignupView, LoginView, SendOTPView, VerifyOTPView, MeView, RefreshView

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),
    path("send-otp/", SendOTPView.as_view()),
    path("verify-otp/", VerifyOTPView.as_view()),
    path("token/refresh/", RefreshView.as_view()),
    path("me/", MeView.as_view()),
]