"""
Flag utility functions
"""
from datetime import datetime, timedelta
from bson import ObjectId
from api.models import flags_collection
import logging

logger = logging.getLogger(__name__)


def should_aggregate_flag(student_id, quiz_id, flag_type):
    """
    Check if a similar flag exists within the last 30 seconds.
    If yes, return the existing flag for aggregation.
    
    Args:
        student_id (str): Student ID
        quiz_id (str): Quiz ID
        flag_type (str): Type of flag
        
    Returns:
        dict or None: Existing flag if found, None otherwise
    """
    thirty_seconds_ago = datetime.utcnow() - timedelta(seconds=30)
    
    existing_flag = flags_collection.find_one({
        'student_id': student_id,
        'quiz_id': quiz_id,
        'type': flag_type,
        'timestamp': {'$gte': thirty_seconds_ago},
        'resolved': False
    })
    
    return existing_flag


def increase_flag_severity(flag_id):
    """
    Increase the severity of an existing flag.
    
    Args:
        flag_id (ObjectId): Flag ID
        
    Returns:
        str: New severity level
    """
    severity_map = {
        'low': 'medium',
        'medium': 'high',
        'high': 'critical'
    }
    
    flag = flags_collection.find_one({'_id': flag_id})
    
    if not flag:
        return None
    
    current_severity = flag.get('severity', 'low')
    new_severity = severity_map.get(current_severity, 'critical')
    current_count = flag.get('count', 1)
    
    # Update flag
    flags_collection.update_one(
        {'_id': flag_id},
        {
            '$set': {
                'severity': new_severity,
                'count': current_count + 1,
                'updated_at': datetime.utcnow()
            }
        }
    )
    
    logger.info(f"Flag {flag_id} severity increased to {new_severity}, count: {current_count + 1}")
    
    return new_severity


def get_severity_for_type(flag_type):
    """
    Get default severity level for a flag type.
    
    Args:
        flag_type (str): Type of flag
        
    Returns:
        str: Severity level
    """
    severity_map = {
        'multiple_faces': 'high',
        'no_face': 'medium',
        'looking_away': 'medium',
        'high_audio': 'medium',
        'tab_switch': 'high',
        'screen_share': 'critical',
        'suspicious_activity': 'medium',
        'audio_multiple_speakers': 'high',
        'audio_keywords': 'medium',
        'dev_tools_attempt': 'high',
        'dev_tools_open': 'critical',
        'screenshot_attempt': 'medium',
        'window_resize': 'medium'
    }
    
    return severity_map.get(flag_type, 'low')


def create_audio_flag(student_id, quiz_id, flag_type, severity, description, audio_data):
    """
    Create an audio proctoring flag.
    
    Args:
        student_id (str): Student ID
        quiz_id (str): Quiz ID
        flag_type (str): Type of audio flag ('audio_multiple_speakers' or 'audio_keywords')
        severity (str): Severity level ('low', 'medium', 'high')
        description (str): Flag description
        audio_data (dict): Audio-specific data (chunk_id, transcription, num_speakers, keywords_found, audio_url)
        
    Returns:
        str: Created flag ID
    """
    flag_data = {
        'student_id': student_id,
        'quiz_id': quiz_id,
        'type': flag_type,
        'description': description,
        'timestamp': datetime.utcnow(),
        'severity': severity,
        'resolved': False,
        'count': 1,
        'audio_data': audio_data
    }
    
    result = flags_collection.insert_one(flag_data)
    flag_id = str(result.inserted_id)
    
    logger.info(f"Audio flag created: {flag_type} for student {student_id} in quiz {quiz_id}, severity: {severity}")
    
    return flag_id


def get_flag_statistics(quiz_id=None, student_id=None):
    """
    Get flag statistics.
    
    Args:
        quiz_id (str, optional): Filter by quiz ID
        student_id (str, optional): Filter by student ID
        
    Returns:
        dict: Statistics
    """
    query = {}
    
    if quiz_id:
        query['quiz_id'] = quiz_id
    
    if student_id:
        query['student_id'] = student_id
    
    total_flags = flags_collection.count_documents(query)
    
    resolved_flags = flags_collection.count_documents({**query, 'resolved': True})
    unresolved_flags = total_flags - resolved_flags
    
    # Count by severity
    severity_counts = {}
    for severity in ['low', 'medium', 'high', 'critical']:
        count = flags_collection.count_documents({**query, 'severity': severity})
        severity_counts[severity] = count
    
    # Count by type
    type_counts = {}
    for flag_type in ['multiple_faces', 'no_face', 'looking_away', 'high_audio', 'tab_switch', 'screen_share', 'audio_multiple_speakers', 'audio_keywords', 'dev_tools_attempt', 'dev_tools_open', 'screenshot_attempt', 'window_resize']:
        count = flags_collection.count_documents({**query, 'type': flag_type})
        if count > 0:
            type_counts[flag_type] = count
    
    return {
        'total_flags': total_flags,
        'resolved_flags': resolved_flags,
        'unresolved_flags': unresolved_flags,
        'severity_counts': severity_counts,
        'type_counts': type_counts
    }
