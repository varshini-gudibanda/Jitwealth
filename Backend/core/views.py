from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from core.response import success_response, error_response
from core.mongodb import mongodb


class HealthCheckView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		try:
			db = mongodb.connect()
			db.command("ping")
			return success_response(
				data={"service": "ok", "database": "ok"},
				message="Health check passed",
			)
		except Exception as e:
			return error_response(
				message="Health check failed",
				error=str(e),
				status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
