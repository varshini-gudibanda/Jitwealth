from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from core.response import success_response, error_response
from .serializers import MemberProfileUpdateSerializer, ChangePasswordSerializer
from .services import MemberService


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            member_id = getattr(request.user, "member_id", None)
            if member_id is None:
                return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

            data = MemberService().get_me(member_id)
            return success_response(data=data, message="Profile fetched successfully")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        serializer = MemberProfileUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        try:
            member_id = getattr(request.user, "member_id", None)
            if member_id is None:
                return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

            data = MemberService().update_me(member_id, serializer.validated_data)
            return success_response(data=data, message="Profile updated successfully")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        try:
            member_id = getattr(request.user, "member_id", None)
            if member_id is None:
                return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

            data = MemberService().change_password(
                member_id=member_id,
                old_password=serializer.validated_data["old_password"],
                new_password=serializer.validated_data["new_password"],
            )
            return success_response(data=data, message="Password changed successfully")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)
