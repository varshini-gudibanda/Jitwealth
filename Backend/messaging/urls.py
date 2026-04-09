from django.urls import path
from .views import SendWAMessageView, WAMessageHistoryView, UpdateWAMessageStatusView

urlpatterns = [
	path("wa/send/", SendWAMessageView.as_view(), name="wa-send"),
	path("wa/history/", WAMessageHistoryView.as_view(), name="wa-history"),
	path("wa/<int:msg_id>/status/", UpdateWAMessageStatusView.as_view(), name="wa-status-update"),
]