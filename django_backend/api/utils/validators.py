"""
Input validation utilities
"""
import re
from rest_framework import serializers


def validate_email(email):
    """
    Validate email format.
    """
    if not email:
        raise serializers.ValidationError("Email is required")
    
    email = email.strip().lower()
    
    # Basic email regex pattern
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(email_pattern, email):
        raise serializers.ValidationError("Invalid email format")
    
    return email


def validate_password(password):
    """
    Validate password strength.
    """
    if not password:
        raise serializers.ValidationError("Password is required")
    
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long")
    
    if len(password) > 128:
        raise serializers.ValidationError("Password is too long (max 128 characters)")
    
    # Check for at least one letter and one number
    if not re.search(r'[a-zA-Z]', password):
        raise serializers.ValidationError("Password must contain at least one letter")
    
    if not re.search(r'\d', password):
        raise serializers.ValidationError("Password must contain at least one number")
    
    return password


def validate_username(username):
    """
    Validate username format.
    """
    if not username:
        raise serializers.ValidationError("Username is required")
    
    username = username.strip().lower()
    
    if len(username) < 3:
        raise serializers.ValidationError("Username must be at least 3 characters long")
    
    if len(username) > 30:
        raise serializers.ValidationError("Username is too long (max 30 characters)")
    
    # Only allow alphanumeric and underscores
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        raise serializers.ValidationError("Username can only contain letters, numbers, and underscores")
    
    return username


def validate_quiz_code(code):
    """
    Validate quiz code format.
    """
    if not code:
        raise serializers.ValidationError("Quiz code is required")
    
    code = code.strip().upper()
    
    if len(code) < 4:
        raise serializers.ValidationError("Quiz code must be at least 4 characters long")
    
    if len(code) > 20:
        raise serializers.ValidationError("Quiz code is too long (max 20 characters)")
    
    # Only allow alphanumeric characters
    if not code.isalnum():
        raise serializers.ValidationError("Quiz code must be alphanumeric")
    
    return code


def validate_name(name):
    """
    Validate name format.
    """
    if not name:
        raise serializers.ValidationError("Name is required")
    
    name = name.strip()
    
    if len(name) < 2:
        raise serializers.ValidationError("Name must be at least 2 characters long")
    
    if len(name) > 100:
        raise serializers.ValidationError("Name is too long (max 100 characters)")
    
    return name


def sanitize_input(text):
    """
    Sanitize text input to prevent XSS attacks.
    """
    if not text:
        return text
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '`']
    sanitized = text
    
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    return sanitized.strip()
