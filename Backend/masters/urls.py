from django.urls import path
from .views import ProvinceListView, ProvinceDetailView

urlpatterns = [
    path("provinces/", ProvinceListView.as_view(), name="province-list"),
    path("provinces/<int:province_id>/", ProvinceDetailView.as_view(), name="province-detail"),
]