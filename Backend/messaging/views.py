from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from core.response import success_response, error_response
from core.permissions import IsAdminMember, is_admin_member
from .serializers import SendWAMessageSerializer, UpdateWAMessageStatusSerializer
from .services import WAMessageService


class SendWAMessageView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		serializer = SendWAMessageSerializer(data=request.data)
		if not serializer.is_valid():
			return error_response("Validation error", serializer.errors, status.HTTP_400_BAD_REQUEST)

		target_member_id = serializer.validated_data["member_id"]
		request_member_id = getattr(request.user, "member_id", None)
		if request_member_id is None:
			return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

		if target_member_id != request_member_id and not is_admin_member(request.user):
			return error_response("Forbidden", status_code=status.HTTP_403_FORBIDDEN)

		try:
			data = WAMessageService().queue_message(
				member_id=target_member_id,
				msg_type=serializer.validated_data["msg_type"],
				msg=serializer.validated_data["msg"],
			)
			return success_response(
				data=data,
				message="WhatsApp message queued",
				status_code=status.HTTP_201_CREATED,
			)
		except ValueError as e:
			return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class WAMessageHistoryView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		member_id = request.query_params.get("member_id")
		page = int(request.query_params.get("page", 1))
		page_size = int(request.query_params.get("page_size", 20))

		if not member_id:
			return error_response("member_id is required", status_code=status.HTTP_400_BAD_REQUEST)

		target_member_id = int(member_id)
		request_member_id = getattr(request.user, "member_id", None)
		if request_member_id is None:
			return error_response("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

		if target_member_id != request_member_id and not is_admin_member(request.user):
			return error_response("Forbidden", status_code=status.HTTP_403_FORBIDDEN)

		try:
			data = WAMessageService().get_history(
				member_id=target_member_id,
				page=page,
				page_size=page_size,
			)
			return success_response(data=data, message="WhatsApp history fetched")
		except ValueError as e:
			return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)


class UpdateWAMessageStatusView(APIView):
	permission_classes = [IsAuthenticated, IsAdminMember]

	def patch(self, request, msg_id):
		serializer = UpdateWAMessageStatusSerializer(data=request.data)
		if not serializer.is_valid():
			return error_response("Validation error", serializer.errors, status.HTTP_400_BAD_REQUEST)

		try:
			data = WAMessageService().update_send_status(
				msg_id=msg_id,
				send_status=serializer.validated_data["send_status"],
			)
			return success_response(data=data, message="Message status updated")
		except ValueError as e:
			return error_response(str(e), status_code=status.HTTP_400_BAD_REQUEST)
