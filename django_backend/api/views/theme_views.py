"""
Theme Views
Handles user theme preferences and synchronization
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId

from api.models import teachers_collection, students_collection
import logging

logger = logging.getLogger(__name__)


def validate_theme_data(theme_data):
    """
    Validate theme data structure and values.
    
    Args:
        theme_data: Dictionary containing theme configuration
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not isinstance(theme_data, dict):
        return False, "Theme data must be an object"
    
    # Validate mode
    mode = theme_data.get('mode')
    if mode and mode not in ['light', 'dark']:
        return False, "Mode must be 'light' or 'dark'"
    
    # Validate scheme
    scheme = theme_data.get('scheme')
    valid_schemes = ['default', 'ocean', 'forest', 'sunset', 'custom']
    if scheme and scheme not in valid_schemes:
        return False, f"Scheme must be one of: {', '.join(valid_schemes)}"
    
    # Validate custom colors if present
    custom_colors = theme_data.get('customColors')
    if custom_colors:
        if not isinstance(custom_colors, dict):
            return False, "customColors must be an object"
        
        required_color_keys = ['primary', 'secondary', 'accent', 'background', 'surface', 'text']
        for key in required_color_keys:
            if key in custom_colors:
                color = custom_colors[key]
                if not isinstance(color, str) or not color.startswith('#'):
                    return False, f"Color '{key}' must be a valid hex color"
    
    # Validate accessibility settings if present
    accessibility = theme_data.get('accessibility')
    if accessibility:
        if not isinstance(accessibility, dict):
            return False, "accessibility must be an object"
        
        # Validate highContrast
        if 'highContrast' in accessibility and not isinstance(accessibility['highContrast'], bool):
            return False, "highContrast must be a boolean"
        
        # Validate fontSize
        font_size = accessibility.get('fontSize')
        valid_font_sizes = ['small', 'medium', 'large', 'xlarge']
        if font_size and font_size not in valid_font_sizes:
            return False, f"fontSize must be one of: {', '.join(valid_font_sizes)}"
        
        # Validate reducedMotion
        if 'reducedMotion' in accessibility and not isinstance(accessibility['reducedMotion'], bool):
            return False, "reducedMotion must be a boolean"
    
    return True, None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_theme(request):
    """
    Get the current user's theme preferences.
    
    Returns:
        200: Theme data
        404: No theme found (user should use defaults)
    """
    try:
        user = request.user
        user_id = user['_id']
        
        # Get theme from user document
        theme = user.get('theme')
        
        if not theme:
            return Response({
                'message': 'No theme preferences found',
                'theme': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Retrieved theme for user: {user['email']}")
        
        return Response({
            'theme': theme
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Get theme error: {e}")
        return Response({
            'error': True,
            'message': 'Failed to retrieve theme'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_theme(request):
    """
    Update the current user's theme preferences.
    
    Request body:
    {
        "mode": "light" | "dark",
        "scheme": "default" | "ocean" | "forest" | "sunset" | "custom",
        "customColors": {
            "primary": "#3b82f6",
            "secondary": "#8b5cf6",
            ...
        },
        "accessibility": {
            "highContrast": false,
            "fontSize": "medium",
            "reducedMotion": false
        }
    }
    
    Returns:
        200: Theme updated successfully
        400: Invalid theme data
    """
    try:
        user = request.user
        user_id = user['_id']
        role = user['role']
        
        theme_data = request.data
        
        # Validate theme data
        is_valid, error_message = validate_theme_data(theme_data)
        if not is_valid:
            return Response({
                'error': True,
                'message': error_message
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add metadata
        theme_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Update user document with theme
        collection = teachers_collection if role == 'teacher' else students_collection
        
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {
                    'theme': theme_data,
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0 and result.matched_count == 0:
            return Response({
                'error': True,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Updated theme for user: {user['email']}")
        
        return Response({
            'message': 'Theme updated successfully',
            'theme': theme_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Update theme error: {e}")
        return Response({
            'error': True,
            'message': 'Failed to update theme'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

