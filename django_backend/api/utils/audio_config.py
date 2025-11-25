"""
Audio processing configuration utilities
"""
from django.conf import settings
from api.models import quizzes_collection
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# Default keyword categories
DEFAULT_KEYWORDS = {
    'help_seeking': ['help', 'tell me', "what's the answer", 'give me'],
    'collaboration': ['you', 'your answer', 'same as', 'copy'],
    'cheating': ['answer key', 'solution', 'cheat sheet', 'cheat'],
    'question_discussion': ['question', 'problem', 'which one', 'answer']
}


def get_audio_config():
    """
    Get audio processing configuration from settings
    
    Returns:
        dict: Audio configuration dictionary
    """
    return settings.AUDIO_CONFIG


def get_quiz_keywords(quiz_id):
    """
    Get suspicious keywords for a specific quiz (default + custom)
    
    Args:
        quiz_id (str): Quiz ID
        
    Returns:
        list: List of suspicious keywords
    """
    try:
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        
        if not quiz:
            logger.warning(f"Quiz {quiz_id} not found, using default keywords")
            return _flatten_keywords(DEFAULT_KEYWORDS)
        
        # Get custom keywords if audio proctoring is enabled
        audio_settings = quiz.get('audio_proctoring', {})
        custom_keywords = audio_settings.get('custom_keywords', [])
        
        # Combine default and custom keywords
        all_keywords = _flatten_keywords(DEFAULT_KEYWORDS)
        
        if custom_keywords:
            all_keywords.extend(custom_keywords)
        
        # Remove duplicates and convert to lowercase
        return list(set([kw.lower() for kw in all_keywords]))
        
    except Exception as e:
        logger.error(f"Error getting quiz keywords: {e}")
        return _flatten_keywords(DEFAULT_KEYWORDS)


def get_suspicion_threshold(quiz_id):
    """
    Get suspicion threshold for a specific quiz
    
    Args:
        quiz_id (str): Quiz ID
        
    Returns:
        float: Suspicion threshold (0.0 - 1.0)
    """
    try:
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        
        if not quiz:
            return settings.AUDIO_CONFIG['processing']['suspicion_threshold']
        
        audio_settings = quiz.get('audio_proctoring', {})
        return audio_settings.get(
            'suspicion_threshold',
            settings.AUDIO_CONFIG['processing']['suspicion_threshold']
        )
        
    except Exception as e:
        logger.error(f"Error getting suspicion threshold: {e}")
        return settings.AUDIO_CONFIG['processing']['suspicion_threshold']


def is_audio_proctoring_enabled(quiz_id):
    """
    Check if audio proctoring is enabled for a quiz
    
    Args:
        quiz_id (str): Quiz ID
        
    Returns:
        bool: True if enabled, False otherwise
    """
    try:
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        
        if not quiz:
            return False
        
        audio_settings = quiz.get('audio_proctoring', {})
        return audio_settings.get('enabled', False)
        
    except Exception as e:
        logger.error(f"Error checking audio proctoring status: {e}")
        return False


def get_quiz_language(quiz_id):
    """
    Get language setting for a quiz
    
    Args:
        quiz_id (str): Quiz ID
        
    Returns:
        str: Language code or 'auto' for auto-detection
    """
    try:
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        
        if not quiz:
            return 'auto'
        
        audio_settings = quiz.get('audio_proctoring', {})
        return audio_settings.get('language', 'auto')
        
    except Exception as e:
        logger.error(f"Error getting quiz language: {e}")
        return 'auto'


def _flatten_keywords(keyword_dict):
    """
    Flatten keyword dictionary into a single list
    
    Args:
        keyword_dict (dict): Dictionary of keyword categories
        
    Returns:
        list: Flattened list of keywords
    """
    keywords = []
    for category_keywords in keyword_dict.values():
        keywords.extend(category_keywords)
    return keywords


def calculate_suspicion_score(num_speakers, keyword_matches, total_words, overlap_duration, total_duration):
    """
    Calculate suspicion score based on multiple factors
    
    Args:
        num_speakers (int): Number of detected speakers
        keyword_matches (int): Number of suspicious keyword matches
        total_words (int): Total number of words in transcription
        overlap_duration (float): Duration of overlapping speech in seconds
        total_duration (float): Total audio duration in seconds
        
    Returns:
        float: Suspicion score (0.0 - 1.0)
    """
    # Speaker score: 0 if 1 speaker, 0.5 if 2 speakers, 1.0 if 3+ speakers
    speaker_score = min((num_speakers - 1) * 0.5, 1.0)
    
    # Keyword score: ratio of keyword matches to total words
    keyword_score = (keyword_matches / max(total_words, 1)) if total_words > 0 else 0
    
    # Overlap score: ratio of overlap duration to total duration
    overlap_score = (overlap_duration / max(total_duration, 1)) if total_duration > 0 else 0
    
    # Weighted combination
    score = (
        speaker_score * 0.5 +
        keyword_score * 0.3 +
        overlap_score * 0.2
    )
    
    return min(score, 1.0)  # Cap at 1.0


def get_severity_level(suspicion_score):
    """
    Determine severity level based on suspicion score
    
    Args:
        suspicion_score (float): Suspicion score (0.0 - 1.0)
        
    Returns:
        str: Severity level ('low', 'medium', 'high')
    """
    if suspicion_score >= 0.7:
        return 'high'
    elif suspicion_score >= 0.5:
        return 'medium'
    else:
        return 'low'
