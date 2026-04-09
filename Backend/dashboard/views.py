from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from core.response import success_response, error_response
from .services import DashboardService


class MyDashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        member_id = getattr(request.user, "member_id", None)
        if member_id is None:
            return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        try:
            data = DashboardService().member_overview(member_id)
            return success_response(data=data, message="Dashboard overview fetched")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)


class MemberDashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, member_id):
        try:
            data = DashboardService().member_overview(member_id)
            return success_response(data=data, message="Member dashboard overview fetched")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)
