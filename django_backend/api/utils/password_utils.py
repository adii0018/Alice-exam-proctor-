"""
Password hashing and verification utilities
"""
import bcrypt
import logging

logger = logging.getLogger(__name__)


def hash_password(password):
    """
    Hash a password using bcrypt with 12 rounds.
    
    Args:
        password (str): Plain text password
        
    Returns:
        str: Hashed password
    """
    try:
        # Generate salt and hash password
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"Error hashing password: {e}")
        raise


def verify_password(password, hashed_password):
    """
    Verify a password against its hash.
    
    Args:
        password (str): Plain text password
        hashed_password (str): Hashed password
        
    Returns:
        bool: True if password matches, False otherwise
    """
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        return False
