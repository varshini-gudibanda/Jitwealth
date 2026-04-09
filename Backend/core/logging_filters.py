import logging

from core.log_context import get_request_id


class RequestIdFilter(logging.Filter):
    """Inject request_id into log records."""

    def filter(self, record):
        record.request_id = get_request_id()
        return True
