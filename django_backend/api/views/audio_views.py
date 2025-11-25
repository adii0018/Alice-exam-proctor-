"""
Audio proctoring API views
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId
import uuid
import logging

from api.models import (
    audio_chunks_collection,
    audio_sessions_collection,
    quizzes_collection,
    students_collection
)
from api.utils.audio_storage import save_audio_file, get_audio_file_path
from api.utils.audio_config import is_audio_proctoring_enabled
# Temporarily disabled until audio processing libraries are installed
# from api.tasks.audio_tasks import preprocess_audio_chunk

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_audio_chunk(request):
    """
    Upload audio chunk for processing
    
    POST /api/audio/upload
    {
        "quiz_id": "string",
        "student_id": "string",
        "session_id": "string",
        "chunk_index": integer,
        "timestamp": "ISO8601",
        "audio_data": "base64 encoded audio"
    }
    """
    try:
        # Extract data
        quiz_id = request.data.get('quiz_id')
        student_id = request.data.get('student_id')
        session_id = request.data.get('session_id')
        chunk_index = request.data.get('chunk_index')
        timestamp = request.data.get('timestamp')
        audio_data = request.data.get('audio_data')
        
        # Validate required fields
        if not all([quiz_id, student_id, session_id, chunk_index is not None, timestamp, audio_data]):
            return Response({
                'success': False,
                'error': 'Missing required fields'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify user is the student
        user_id = str(request.user.get('_id'))
        if user_id != student_id:
            return Response({
                'success': False,
                'error': 'Unauthorized: Can only upload your own audio'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verify quiz exists and is active
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        if not quiz:
            return Response({
                'success': False,
                'error': 'Quiz not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not quiz.get('is_active', False):
            return Response({
                'success': False,
                'error': 'Quiz is not active'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verify audio proctoring is enabled
        if not is_audio_proctoring_enabled(quiz_id):
            return Response({
                'success': False,
                'error': 'Audio proctoring not enabled for this quiz'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Verify student exists
        student = students_collection.find_one({'_id': ObjectId(student_id)})
        if not student:
            return Response({
                'success': False,
                'error': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Save audio file
        chunk_id, file_path = save_audio_file(audio_data, quiz_id, student_id)
        
        if not chunk_id:
            return Response({
                'success': False,
                'error': 'Failed to save audio file'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Create audio chunk document
        chunk_doc = {
            'chunk_id': chunk_id,
            'quiz_id': quiz_id,
            'student_id': student_id,
            'session_id': session_id,
            'chunk_index': chunk_index,
            'timestamp': datetime.fromisoformat(timestamp.replace('Z', '+00:00')),
            'duration': 5.0,  # Default 5 seconds
            'file_path': file_path,
            'preprocessed_path': None,
            'processing_status': 'queued',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'vad_results': None,
            'diarization_results': None,
            'transcriptions': None,
            'suspicion_results': None,
            'error_message': None
        }
        
        audio_chunks_collection.insert_one(chunk_doc)
        logger.info(f"Created audio chunk document: {chunk_id}")
        
        # Update session statistics
        audio_sessions_collection.update_one(
            {'session_id': session_id},
            {
                '$inc': {'total_chunks': 1},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
        
        # Enqueue preprocessing task
        # Temporarily disabled until audio processing libraries are installed
        # preprocess_audio_chunk.delay(chunk_id)
        logger.info(f"Audio chunk uploaded (processing disabled): {chunk_id}")
        
        return Response({
            'success': True,
            'chunk_id': chunk_id,
            'processing_status': 'queued'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error uploading audio chunk: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_audio_session(request):
    """
    Start audio recording session
    
    POST /api/audio/session/start
    {
        "quiz_id": "string",
        "student_id": "string",
        "consent_given": boolean
    }
    """
    try:
        quiz_id = request.data.get('quiz_id')
        student_id = request.data.get('student_id')
        consent_given = request.data.get('consent_given', False)
        
        # Validate required fields
        if not all([quiz_id, student_id]):
            return Response({
                'success': False,
                'error': 'Missing required fields'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify user is the student
        user_id = str(request.user.get('_id'))
        if user_id != student_id:
            return Response({
                'success': False,
                'error': 'Unauthorized'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check consent
        if not consent_given:
            return Response({
                'success': False,
                'error': 'Audio recording consent required'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Create session
        session_id = str(uuid.uuid4())
        session_doc = {
            'session_id': session_id,
            'quiz_id': quiz_id,
            'student_id': student_id,
            'started_at': datetime.utcnow(),
            'ended_at': None,
            'total_chunks': 0,
            'processed_chunks': 0,
            'failed_chunks': 0,
            'total_flags': 0,
            'consent_given': consent_given,
            'consent_timestamp': datetime.utcnow(),
            'status': 'active'
        }
        
        audio_sessions_collection.insert_one(session_doc)
        logger.info(f"Created audio session: {session_id}")
        
        return Response({
            'success': True,
            'session_id': session_id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error starting audio session: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def flag_suspicious_audio(request):
    """
    Flag suspicious audio activity without recording
    
    POST /api/audio/flag
    {
        "quiz_id": "string",
        "student_id": "string", 
        "session_id": "string",
        "timestamp": "ISO8601",
        "detection_type": "string",
        "audio_metrics": object,
        "flag_reason": "string"
    }
    """
    try:
        # Extract data
        quiz_id = request.data.get('quiz_id')
        student_id = request.data.get('student_id')
        session_id = request.data.get('session_id')
        timestamp = request.data.get('timestamp')
        detection_type = request.data.get('detection_type')
        audio_metrics = request.data.get('audio_metrics', {})
        flag_reason = request.data.get('flag_reason')
        
        # Validate required fields
        if not all([quiz_id, student_id, session_id, timestamp, detection_type, flag_reason]):
            return Response({
                'success': False,
                'error': 'Missing required fields'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify user is the student
        user_id = str(request.user.get('_id'))
        if user_id != student_id:
            return Response({
                'success': False,
                'error': 'Unauthorized: Can only flag your own audio'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Create flag document
        flag_doc = {
            'flag_id': str(uuid.uuid4()),
            'quiz_id': quiz_id,
            'student_id': student_id,
            'session_id': session_id,
            'timestamp': datetime.fromisoformat(timestamp.replace('Z', '+00:00')),
            'detection_type': detection_type,
            'flag_reason': flag_reason,
            'audio_metrics': audio_metrics,
            'severity': get_flag_severity(detection_type),
            'created_at': datetime.utcnow(),
            'reviewed': False,
            'reviewer_id': None,
            'review_notes': None
        }
        
        # Insert flag into flags collection (reusing existing collection)
        from api.models import flags_collection
        flags_collection.insert_one(flag_doc)
        
        # Update session statistics
        audio_sessions_collection.update_one(
            {'session_id': session_id},
            {
                '$inc': {'total_flags': 1},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
        
        logger.info(f"Audio flag created: {flag_doc['flag_id']} - {detection_type}")
        
        return Response({
            'success': True,
            'flag_id': flag_doc['flag_id'],
            'message': 'Suspicious activity flagged'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error flagging suspicious audio: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_flag_severity(detection_type):
    """Get flag severity based on detection type"""
    severity_map = {
        'sudden_noise': 'medium',
        'multiple_voices': 'high', 
        'background_noise': 'low',
        'continuous_talking': 'high',
        'phone_ring': 'medium'
    }
    return severity_map.get(detection_type, 'medium')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_audio_session(request):
    """
    End audio monitoring session
    
    POST /api/audio/session/end
    {
        "session_id": "string",
        "total_flags": integer (optional)
    }
    """
    try:
        session_id = request.data.get('session_id')
        total_flags = request.data.get('total_flags', 0)
        
        if not session_id:
            return Response({
                'success': False,
                'error': 'Missing session_id'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update session
        update_data = {
            'ended_at': datetime.utcnow(),
            'status': 'completed'
        }
        
        if total_flags is not None:
            update_data['total_flags'] = total_flags
        
        result = audio_sessions_collection.update_one(
            {'session_id': session_id},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return Response({
                'success': False,
                'error': 'Session not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Ended audio session: {session_id} with {total_flags} flags")
        
        return Response({
            'success': True,
            'message': 'Session ended successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error ending audio session: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_session_status(request, session_id):
    """
    Get audio session status
    
    GET /api/audio/session/{session_id}
    """
    try:
        session = audio_sessions_collection.find_one({'session_id': session_id})
        
        if not session:
            return Response({
                'success': False,
                'error': 'Session not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Remove MongoDB _id
        session.pop('_id', None)
        
        # Convert datetime to ISO format
        if session.get('started_at'):
            session['started_at'] = session['started_at'].isoformat()
        if session.get('ended_at'):
            session['ended_at'] = session['ended_at'].isoformat()
        if session.get('consent_timestamp'):
            session['consent_timestamp'] = session['consent_timestamp'].isoformat()
        
        return Response({
            'success': True,
            'session': session
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error getting session status: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def play_audio_chunk(request, chunk_id):
    """
    Stream audio file for playback
    
    GET /api/audio/play/{chunk_id}
    """
    try:
        from django.http import FileResponse, HttpResponse
        from pathlib import Path
        
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        
        if not chunk:
            return Response({
                'success': False,
                'error': 'Chunk not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify access control (teacher of quiz only)
        user_id = str(request.user.get('_id'))
        user_role = request.user.get('role')
        
        if user_role == 'teacher':
            quiz = quizzes_collection.find_one({'_id': ObjectId(chunk['quiz_id'])})
            if not quiz or str(quiz['teacher_id']) != user_id:
                return Response({
                    'success': False,
                    'error': 'Unauthorized access'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({
                'success': False,
                'error': 'Only teachers can play audio'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get audio file path (prefer preprocessed)
        file_path = chunk.get('preprocessed_path') or chunk.get('file_path')
        
        if not file_path:
            return Response({
                'success': False,
                'error': 'Audio file not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        file_path = Path(file_path)
        
        if not file_path.exists():
            return Response({
                'success': False,
                'error': 'Audio file not found on disk'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Determine content type
        content_type = 'audio/wav' if file_path.suffix == '.wav' else 'audio/webm'
        
        # Stream the file
        response = FileResponse(
            open(file_path, 'rb'),
            content_type=content_type
        )
        
        # Support range requests for seeking
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = file_path.stat().st_size
        
        return response
        
    except Exception as e:
        logger.error(f"Error playing audio chunk: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chunk_details(request, chunk_id):
    """
    Get audio chunk processing details
    
    GET /api/audio/chunk/{chunk_id}
    """
    try:
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        
        if not chunk:
            return Response({
                'success': False,
                'error': 'Chunk not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify access control (teacher of quiz only)
        user_id = str(request.user.get('_id'))
        user_role = request.user.get('role')
        
        if user_role == 'teacher':
            quiz = quizzes_collection.find_one({'_id': ObjectId(chunk['quiz_id'])})
            if not quiz or str(quiz['teacher_id']) != user_id:
                return Response({
                    'success': False,
                    'error': 'Unauthorized access'
                }, status=status.HTTP_403_FORBIDDEN)
        elif user_role == 'student':
            if chunk['student_id'] != user_id:
                return Response({
                    'success': False,
                    'error': 'Unauthorized access'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # Remove MongoDB _id and file paths
        chunk.pop('_id', None)
        chunk.pop('file_path', None)
        chunk.pop('preprocessed_path', None)
        
        # Convert datetime to ISO format
        if chunk.get('timestamp'):
            chunk['timestamp'] = chunk['timestamp'].isoformat()
        if chunk.get('created_at'):
            chunk['created_at'] = chunk['created_at'].isoformat()
        if chunk.get('updated_at'):
            chunk['updated_at'] = chunk['updated_at'].isoformat()
        
        return Response({
            'success': True,
            'chunk': chunk
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error getting chunk details: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
