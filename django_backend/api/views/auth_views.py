"""
Authentication Views
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId

from api.models import teachers_collection, students_collection
from api.authentication import generate_token
from api.utils.validators import validate_email, validate_password, validate_username, validate_name
from api.utils.password_utils import hash_password, verify_password
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user (student or teacher).
    
    Request body:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "password": "password123",
        "role": "student" or "teacher",
        
        // For students:
        "student_id": "STU001",
        "class_section": "10-A",
        "enrollment_year": "2024",
        
        // For teachers:
        "department": "Mathematics",
        "employee_id": "EMP001"
    }
    """
    try:
        # Get and validate required fields
        name = validate_name(request.data.get('name'))
        email = validate_email(request.data.get('email'))
        username = validate_username(request.data.get('username'))
        password = validate_password(request.data.get('password'))
        role = request.data.get('role', '').lower()
        
        if role not in ['student', 'teacher']:
            return Response({
                'error': True,
                'message': 'Role must be either "student" or "teacher"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email already exists
        existing_user = teachers_collection.find_one({'email': email})
        if not existing_user:
            existing_user = students_collection.find_one({'email': email})
        
        if existing_user:
            return Response({
                'error': True,
                'message': 'Email already registered'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if username already exists
        existing_username = teachers_collection.find_one({'username': username})
        if not existing_username:
            existing_username = students_collection.find_one({'username': username})
        
        if existing_username:
            return Response({
                'error': True,
                'message': 'Username already taken'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Prepare user data
        user_data = {
            'name': name,
            'email': email,
            'username': username,
            'password': hashed_password,
            'role': role,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'is_active': True
        }
        
        # Role-specific fields
        if role == 'student':
            student_id = request.data.get('student_id', '').strip()
            class_section = request.data.get('class_section', '').strip()
            enrollment_year = request.data.get('enrollment_year', '').strip()
            
            if not student_id:
                return Response({
                    'error': True,
                    'message': 'student_id is required for students'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if student_id already exists
            if students_collection.find_one({'student_id': student_id}):
                return Response({
                    'error': True,
                    'message': 'Student ID already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user_data.update({
                'student_id': student_id,
                'class_section': class_section,
                'enrollment_year': enrollment_year
            })
            
            result = students_collection.insert_one(user_data)
            user_data['_id'] = str(result.inserted_id)
            
        else:  # teacher
            department = request.data.get('department', '').strip()
            employee_id = request.data.get('employee_id', '').strip()
            
            if not employee_id:
                return Response({
                    'error': True,
                    'message': 'employee_id is required for teachers'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if employee_id already exists
            if teachers_collection.find_one({'employee_id': employee_id}):
                return Response({
                    'error': True,
                    'message': 'Employee ID already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user_data.update({
                'department': department,
                'employee_id': employee_id
            })
            
            result = teachers_collection.insert_one(user_data)
            user_data['_id'] = str(result.inserted_id)
        
        # Remove password from response
        user_data.pop('password')
        
        # Generate token
        token = generate_token(result.inserted_id)
        
        logger.info(f"New {role} registered: {email}")
        
        return Response({
            'message': f'{role.capitalize()} registered successfully',
            'token': token,
            'user': user_data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return Response({
            'error': True,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT token.
    
    Request body:
    {
        "email": "john@example.com",
        "password": "password123"
    }
    """
    try:
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        
        if not email or not password:
            return Response({
                'error': True,
                'message': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Search for user in both collections
        user = teachers_collection.find_one({'email': email})
        if not user:
            user = students_collection.find_one({'email': email})
        
        if not user:
            return Response({
                'error': True,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if user is active
        if not user.get('is_active', True):
            return Response({
                'error': True,
                'message': 'Account is disabled'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verify password
        if not verify_password(password, user['password']):
            return Response({
                'error': True,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate token
        token = generate_token(user['_id'])
        
        # Prepare user data for response
        user_data = {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'username': user['username'],
            'role': user['role']
        }
        
        # Add role-specific fields
        if user['role'] == 'student':
            user_data.update({
                'student_id': user.get('student_id'),
                'class_section': user.get('class_section'),
                'enrollment_year': user.get('enrollment_year')
            })
        else:
            user_data.update({
                'department': user.get('department'),
                'employee_id': user.get('employee_id')
            })
        
        logger.info(f"User logged in: {email}")
        
        return Response({
            'message': 'Login successful',
            'token': token,
            'user': user_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Login error: {e}")
        return Response({
            'error': True,
            'message': 'Login failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get current authenticated user details.
    Requires JWT token in Authorization header.
    """
    try:
        user = request.user
        
        user_data = {
            'id': user['_id'],
            'name': user['name'],
            'email': user['email'],
            'username': user['username'],
            'role': user['role'],
            'is_active': user.get('is_active', True)
        }
        
        # Add role-specific fields
        if user['role'] == 'student':
            user_data.update({
                'student_id': user.get('student_id'),
                'class_section': user.get('class_section'),
                'enrollment_year': user.get('enrollment_year')
            })
        else:
            user_data.update({
                'department': user.get('department'),
                'employee_id': user.get('employee_id')
            })
        
        return Response(user_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Get current user error: {e}")
        return Response({
            'error': True,
            'message': 'Failed to get user details'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
