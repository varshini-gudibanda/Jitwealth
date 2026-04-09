from django.urls import path
from .views import MyLoginHistoryView, MemberLoginHistoryView

urlpatterns = [
	path("logins/me/", MyLoginHistoryView.as_view(), name="logins-me"),
	path("logins/member/<int:member_id>/", MemberLoginHistoryView.as_view(), name="logins-member"),
]