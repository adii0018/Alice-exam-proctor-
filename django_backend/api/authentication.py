"""
JWT Authentication for Django REST Framework
"""
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import authentication, exceptions
from bson import ObjectId
from api.models import teachers_collection, students_collection
import logging

logger = logging.getLogger(__name__)


class MongoUser:
    """
    Wrapper class for MongoDB user documents to make them compatible with DRF.
    """
    def __init__(self, user_dict):
        self._user_dict = user_dict
        self.is_authenticated = True
        self.is_active = user_dict.get('is_active', True)
    
    def __getitem__(self, key):
        return self._user_dict[key]
    
    def __setitem__(self, key, value):
        self._user_dict[key] = value
    
    def get(self, key, default=None):
        return self._user_dict.get(key, default)
    
    def pop(self, key, default=None):
        return self._user_dict.pop(key, default)
    
    def __contains__(self, key):
        return key in self._user_dict
    
    def keys(self):
        return self._user_dict.keys()
    
    def values(self):
        return self._user_dict.values()
    
    def items(self):
        return self._user_dict.items()
    
    def __str__(self):
        return str(self._user_dict.get('email', 'Unknown User'))
    
    def __repr__(self):
        return f"MongoUser({self._user_dict.get('email', 'Unknown')})"


class JWTAuthentication(authentication.BaseAuthentication):
    """
    Custom JWT Authentication class for DRF.
    """
    
    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header:
            return None
        
        if not auth_header.startswith('Bearer '):
            return None
        
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid token header')
        
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            user_id = payload.get('user_id')
            
            if not user_id:
                raise exceptions.AuthenticationFailed('Token payload invalid')
            
            # Search in both collections
            user = teachers_collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                user = students_collection.find_one({'_id': ObjectId(user_id)})
            
            if not user:
                raise exceptions.AuthenticationFailed('User not found')
            
            # Check if user is active
            if not user.get('is_active', True):
                raise exceptions.AuthenticationFailed('User account is disabled')
            
            # Convert ObjectId to string for JSON serialization
            user['_id'] = str(user['_id'])
            # Remove password from user object
            user.pop('password', None)
            
            # Wrap user dict in MongoUser class
            mongo_user = MongoUser(user)
            
            return (mongo_user, token)
        
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            raise exceptions.AuthenticationFailed('Authentication failed')


def generate_token(user_id):
    """
    Generate JWT token for a user.
    
    Args:
        user_id: MongoDB ObjectId of the user
        
    Returns:
        str: JWT token
    """
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


def verify_token(token):
    """
    Verify and decode JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded payload
        
    Raises:
        jwt.InvalidTokenError: If token is invalid
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise jwt.InvalidTokenError('Token has expired')
    except jwt.InvalidTokenError as e:
        raise jwt.InvalidTokenError(f'Invalid token: {str(e)}')
