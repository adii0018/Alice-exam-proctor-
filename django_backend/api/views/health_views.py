"""
Health Check Views
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from datetime import datetime


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint to verify API is running.
    """
    return Response({
        'status': 'OK',
        'message': 'ETRIXX EXAM Django Backend is running',
        'timestamp': datetime.utcnow().isoformat()
    })
