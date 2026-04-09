from rest_framework.views import exception_handler
from rest_framework import status
from core.response import error_response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """Custom exception handler for DRF"""
    response = exception_handler(exc, context)
    
    if response is not None:
        logger.error(f"API Error: {str(exc)}")
        return error_response(
            message=str(exc),
            error=response.data,
            status_code=response.status_code
        )
    
    logger.error(f"Unhandled Error: {str(exc)}")
    return error_response(
        message="Internal server error",
        error=str(exc),
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )