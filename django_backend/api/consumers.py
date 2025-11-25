"""
WebSocket Consumers for real-time monitoring
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import jwt
from django.conf import settings
from bson import ObjectId
from api.models import teachers_collection, students_collection
import logging

logger = logging.getLogger(__name__)


class MonitoringConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time quiz monitoring.
    Teachers can connect to receive live updates about student activity and violations.
    """
    
    async def connect(self):
        """
        Handle WebSocket connection.
        """
        # Get token from query string
        query_string = self.scope['query_string'].decode()
        token = None
        
        if 'token=' in query_string:
            token = query_string.split('token=')[1].split('&')[0]
        
        if not token:
            logger.warning("WebSocket connection rejected: No token provided")
            await self.close()
            return
        
        # Authenticate user
        user = await self.authenticate_token(token)
        
        if not user:
            logger.warning("WebSocket connection rejected: Invalid token")
            await self.close()
            return
        
        self.user = user
        self.user_id = str(user['_id'])
        
        # Accept the connection
        await self.accept()
        logger.info(f"WebSocket connected: User {self.user_id}")
    
    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnection.
        """
        # Leave all quiz monitoring rooms
        if hasattr(self, 'quiz_id'):
            await self.channel_layer.group_discard(
                f'quiz_{self.quiz_id}',
                self.channel_name
            )
            logger.info(f"User {self.user_id} left quiz {self.quiz_id} monitoring")
        
        logger.info(f"WebSocket disconnected: User {self.user_id} (code: {close_code})")
    
    async def receive(self, text_data):
        """
        Handle messages received from WebSocket.
        """
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'join_monitoring':
                # Join a quiz monitoring room
                quiz_id = data.get('quiz_id')
                if quiz_id:
                    self.quiz_id = quiz_id
                    await self.channel_layer.group_add(
                        f'quiz_{quiz_id}',
                        self.channel_name
                    )
                    logger.info(f"User {self.user_id} joined quiz {quiz_id} monitoring")
                    
                    await self.send(text_data=json.dumps({
                        'type': 'monitoring_joined',
                        'quiz_id': quiz_id,
                        'message': 'Successfully joined monitoring'
                    }))
            
            elif action == 'leave_monitoring':
                # Leave a quiz monitoring room
                if hasattr(self, 'quiz_id'):
                    await self.channel_layer.group_discard(
                        f'quiz_{self.quiz_id}',
                        self.channel_name
                    )
                    logger.info(f"User {self.user_id} left quiz {self.quiz_id} monitoring")
                    del self.quiz_id
            
            elif action == 'broadcast_flag':
                # Broadcast a new flag to all monitoring teachers
                if hasattr(self, 'quiz_id'):
                    flag_data = data.get('flag')
                    await self.channel_layer.group_send(
                        f'quiz_{self.quiz_id}',
                        {
                            'type': 'flag_notification',
                            'flag': flag_data
                        }
                    )
            
            elif action == 'request_audio_playback':
                # Generate audio playback URL
                chunk_id = data.get('chunk_id')
                if chunk_id:
                    audio_url = await self.generate_audio_playback_url(chunk_id)
                    await self.send(text_data=json.dumps({
                        'type': 'audio_playback_url',
                        'chunk_id': chunk_id,
                        'url': audio_url,
                        'expires_in': 300  # 5 minutes
                    }))
            
            elif action == 'heartbeat':
                # Respond to heartbeat ping
                await self.send(text_data=json.dumps({
                    'type': 'heartbeat_response',
                    'timestamp': data.get('timestamp')
                }))
        
        except json.JSONDecodeError:
            logger.error("Invalid JSON received in WebSocket")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            logger.error(f"Error handling WebSocket message: {e}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Error processing message'
            }))
    
    async def flag_notification(self, event):
        """
        Send flag notification to WebSocket client.
        """
        await self.send(text_data=json.dumps({
            'type': 'new_flag',
            'flag': event['flag']
        }))
    
    async def student_status(self, event):
        """
        Send student status update to WebSocket client.
        """
        await self.send(text_data=json.dumps({
            'type': 'student_status',
            'students': event['students']
        }))
    
    async def audio_flag(self, event):
        """
        Send audio flag notification to WebSocket client.
        """
        await self.send(text_data=json.dumps({
            'type': 'audio_flag',
            'flag': event['flag']
        }))
    
    @database_sync_to_async
    def generate_audio_playback_url(self, chunk_id):
        """
        Generate a temporary URL for audio playback.
        """
        try:
            from api.models import audio_chunks_collection, quizzes_collection
            from api.utils.audio_storage import get_audio_file_path
            import time
            
            # Get chunk
            chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
            if not chunk:
                return None
            
            # Verify user has access (teacher of the quiz)
            if self.user.get('role') == 'teacher':
                quiz = quizzes_collection.find_one({'_id': ObjectId(chunk['quiz_id'])})
                if not quiz or str(quiz['teacher_id']) != self.user_id:
                    logger.warning(f"Unauthorized audio access attempt by {self.user_id}")
                    return None
            
            # Get file path
            file_path = chunk.get('preprocessed_path') or chunk.get('file_path')
            if not file_path:
                return None
            
            # Generate signed URL (simplified - in production use proper signed URLs)
            # For now, return the chunk_id which can be used with an API endpoint
            return f"/api/audio/play/{chunk_id}"
        
        except Exception as e:
            logger.error(f"Error generating audio playback URL: {e}")
            return None
    
    @database_sync_to_async
    def authenticate_token(self, token):
        """
        Authenticate user from JWT token.
        """
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            user_id = payload.get('user_id')
            
            if not user_id:
                return None
            
            # Search in both collections
            user = teachers_collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                user = students_collection.find_one({'_id': ObjectId(user_id)})
            
            if not user or not user.get('is_active', True):
                return None
            
            return user
        
        except Exception as e:
            logger.error(f"Token authentication error: {e}")
            return None
