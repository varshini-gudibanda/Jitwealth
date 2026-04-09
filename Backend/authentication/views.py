from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView
from core.throttles import (
    AuthSignupThrottle,
    AuthLoginThrottle,
    AuthOTPSendThrottle,
    AuthOTPVerifyThrottle,
)

from core.response import success_response, error_response
from .serializers import (
    SignupSerializer, LoginSerializer, SendOTPSerializer, VerifyOTPSerializer
)
from .services import AuthService


def _client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


class SignupView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthSignupThrottle]

    def post(self, request):
        s = SignupSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Validation error", s.errors, status.HTTP_400_BAD_REQUEST)

        try:
            data = AuthService().signup(s.validated_data, _client_ip(request))
            return success_response(data, "Signup successful", status.HTTP_201_CREATED)
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthLoginThrottle]

    def post(self, request):
        s = LoginSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Validation error", s.errors, status.HTTP_400_BAD_REQUEST)

        try:
            data = AuthService().login(
                s.validated_data["email_id"],
                s.validated_data["password"],
                _client_ip(request),
            )
            return success_response(data, "Login successful")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_401_UNAUTHORIZED)


class SendOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthOTPSendThrottle]

    def post(self, request):
        s = SendOTPSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Validation error", s.errors, status.HTTP_400_BAD_REQUEST)

        try:
            data = AuthService().send_otp(**s.validated_data)
            return success_response(data, "OTP sent")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthOTPVerifyThrottle]

    def post(self, request):
        s = VerifyOTPSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Validation error", s.errors, status.HTTP_400_BAD_REQUEST)

        try:
            data = AuthService().verify_otp(**s.validated_data)
            return success_response(data, "OTP verified")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            data = AuthService().me(request.user.member_id)
            return success_response(data, "Profile fetched")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)


class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    throttle_scope = "auth_login"
