from rest_framework.views import exception_handler
from rest_framework import status
from core.response import error_response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """Custom exception handler for DRF"""
    view = context.get("view") if context else None
    request = context.get("request") if context else None
    endpoint = request.path if request else "-"
    view_name = view.__class__.__name__ if view else "-"

    response = exception_handler(exc, context)
    
    if response is not None:
        logger.error("API error in %s at %s: %s", view_name, endpoint, str(exc))
        return error_response(
            message=str(exc),
            error=response.data,
            status_code=response.status_code
        )
    
    logger.exception("Unhandled error in %s at %s", view_name, endpoint)
    return error_response(
        message="Internal server error",
        error=str(exc),
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )