"""
WebSocket URL routing for Django Channels
"""
from django.urls import re_path
from api import consumers

websocket_urlpatterns = [
    re_path(r'ws/monitoring/$', consumers.MonitoringConsumer.as_asgi()),
]
