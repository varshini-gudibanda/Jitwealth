from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from core.response import success_response, error_response
from .services import ProvinceService


class ProvinceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = ProvinceService().list_provinces()
        return success_response(data=data, message="Provinces fetched successfully")


class ProvinceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, province_id):
        try:
            data = ProvinceService().get_province(province_id)
            return success_response(data=data, message="Province fetched successfully")
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_404_NOT_FOUND)
