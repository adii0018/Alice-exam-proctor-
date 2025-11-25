"""
Custom Exception Handler for Django REST Framework
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the response format
        custom_response = {
            'error': True,
            'message': str(exc),
            'status_code': response.status_code,
            'details': response.data if isinstance(response.data, dict) else {'detail': response.data}
        }
        
        # Log the error
        logger.error(
            f"API Error: {exc} | Status: {response.status_code} | "
            f"Path: {context['request'].path} | Method: {context['request'].method}"
        )
        
        return Response(custom_response, status=response.status_code)
    
    # Handle unhandled exceptions
    logger.critical(f"Unhandled exception: {exc}", exc_info=True)
    
    return Response({
        'error': True,
        'message': 'An unexpected error occurred',
        'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
