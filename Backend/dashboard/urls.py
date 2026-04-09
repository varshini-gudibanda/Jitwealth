from django.urls import path
from .views import MyDashboardOverviewView, MemberDashboardOverviewView

urlpatterns = [
    path("overview/", MyDashboardOverviewView.as_view(), name="dashboard-overview"),
    path("member/<int:member_id>/overview/", MemberDashboardOverviewView.as_view(), name="dashboard-member-overview"),
]
