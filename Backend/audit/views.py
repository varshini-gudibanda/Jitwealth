from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from core.response import success_response, error_response
from .services import LoginAuditService


class MyLoginHistoryView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		member_id = getattr(request.user, "member_id", None)
		if member_id is None:
			return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

		page = int(request.query_params.get("page", 1))
		page_size = int(request.query_params.get("page_size", 20))

		try:
			data = LoginAuditService().get_my_login_history(
				member_id=member_id,
				page=page,
				page_size=page_size,
			)
			return success_response(data=data, message="Login history fetched")
		except ValueError as e:
			return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class MemberLoginHistoryView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, member_id):
		page = int(request.query_params.get("page", 1))
		page_size = int(request.query_params.get("page_size", 20))

		try:
			data = LoginAuditService().get_member_login_history(
				member_id=member_id,
				page=page,
				page_size=page_size,
			)
			return success_response(data=data, message="Member login history fetched")
		except ValueError as e:
			return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)
