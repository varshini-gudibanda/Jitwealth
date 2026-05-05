from rest_framework.response import Response
from rest_framework import status

def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Standard success response format"""
    return Response({
        'success': True,
        'message': message,
        'data': data,
        'error': None
    }, status=status_code)

def error_response(message="Error", error=None, status_code=status.HTTP_400_BAD_REQUEST):
    """Standard error response format"""
    return Response({
        'success': False,
        'message': message,
        'data': None,
        'error': error
    }, status=status_code)