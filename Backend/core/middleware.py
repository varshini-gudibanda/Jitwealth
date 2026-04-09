import uuid

from core.log_context import set_request_id, clear_request_id


class RequestIdMiddleware:
    """Attach request_id to request/response and logging context."""

    HEADER_NAME = "HTTP_X_REQUEST_ID"
    RESPONSE_HEADER_NAME = "X-Request-ID"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = request.META.get(self.HEADER_NAME) or str(uuid.uuid4())
        request.request_id = request_id
        set_request_id(request_id)

        try:
            response = self.get_response(request)
        finally:
            clear_request_id()

        response[self.RESPONSE_HEADER_NAME] = request_id
        return response
