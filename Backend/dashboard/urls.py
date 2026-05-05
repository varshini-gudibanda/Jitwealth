from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalculatorViewSet, MyDashboardOverviewView, MemberDashboardOverviewView

router = DefaultRouter()
router.register(r'calculator', CalculatorViewSet, basename='calculator')

urlpatterns = [
    path("overview/", MyDashboardOverviewView.as_view(), name="dashboard-overview"),
    path("member/<int:member_id>/overview/", MemberDashboardOverviewView.as_view(), name="dashboard-member-overview"),
    path("", include(router.urls)),
]
