"""
API URL Configuration - yahan saare API endpoints define karte hain
"""
from django.urls import path
from api.views import auth_views, quiz_views, flag_views, health_views, audio_views, theme_views, ai_views

urlpatterns = [
    # Health check - server chal raha hai ya nahi check karne ke liye
    path('health/', health_views.health_check, name='health_check'),
    
    # Authentication endpoints - login/register ke liye
    path('auth/register/', auth_views.register, name='register'), # Naya user register karne ke liye
    path('auth/login/', auth_views.login, name='login'), # User login karne ke liye
    path('auth/me/', auth_views.get_current_user, name='current_user'), # Current user info get karne ke liye
    
    # Quiz endpoints - quiz management ke liye
    path('quizzes/', quiz_views.quiz_list_create, name='quiz_list_create'), # Quizzes list aur create karne ke liye
    path('quizzes/by-code/<str:code>/', quiz_views.quiz_by_code, name='quiz_by_code'), # Quiz code se quiz get karne ke liye
    path('quizzes/<str:quiz_id>/', quiz_views.quiz_detail, name='quiz_detail'), # Specific quiz details get karne ke liye
    path('quizzes/<str:quiz_id>/submit/', quiz_views.submit_quiz, name='submit_quiz'), # Quiz submit karne ke liye
    
    # Flag endpoints - violation flags manage karne ke liye
    path('flags/', flag_views.flag_list_create, name='flag_list_create'), # Flags list aur create karne ke liye
    path('flags/<str:flag_id>/', flag_views.flag_detail, name='flag_detail'), # Specific flag details get karne ke liye
    
    # Submission endpoints
    path('submissions/', quiz_views.submission_list, name='submission_list'),
    path('submissions/<str:submission_id>/', quiz_views.submission_detail, name='submission_detail'),
    
    # Audio proctoring endpoints - audio monitoring ke liye
    path('audio/upload/', audio_views.upload_audio_chunk, name='upload_audio_chunk'), # Audio chunks upload karne ke liye
    path('audio/flag/', audio_views.flag_suspicious_audio, name='flag_suspicious_audio'), # Suspicious audio flag karne ke liye
    path('audio/session/start/', audio_views.start_audio_session, name='start_audio_session'), # Audio session start karne ke liye
    path('audio/session/end/', audio_views.end_audio_session, name='end_audio_session'), # Audio session end karne ke liye
    path('audio/session/<str:session_id>/', audio_views.get_session_status, name='get_session_status'), # Session status check karne ke liye
    path('audio/chunk/<str:chunk_id>/', audio_views.get_chunk_details, name='get_chunk_details'), # Audio chunk details get karne ke liye
    path('audio/play/<str:chunk_id>/', audio_views.play_audio_chunk, name='play_audio_chunk'), # Audio chunk play karne ke liye
    
    # Theme endpoints
    path('user/theme/', theme_views.get_user_theme, name='get_user_theme'),
    path('user/theme/update/', theme_views.update_user_theme, name='update_user_theme'),
    
    # AI Assistant endpoints - Alice AI chat functionality
    path('chat/', ai_views.chat, name='ai_chat'),
    path('conversations/', ai_views.get_conversations, name='get_conversations'),
    path('conversations/<str:conversation_id>/', ai_views.get_conversation, name='get_conversation'),
    path('user/create/', ai_views.create_user, name='create_ai_user'),
    path('ai/health/', ai_views.ai_health_check, name='ai_health_check'),
]
