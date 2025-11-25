#!/usr/bin/env python3
"""
Simple script to test quiz creation via API
"""
import requests
import json

# API endpoint
API_BASE = "http://localhost:8000/api"

def test_quiz_creation():
    # First, let's check if API is running
    try:
        response = requests.get(f"{API_BASE}/health/")
        print(f"✅ API Health: {response.json()}")
    except Exception as e:
        print(f"❌ API not accessible: {e}")
        return

    # Test quiz data
    quiz_data = {
        "title": "Test Quiz for Students",
        "description": "A simple test quiz to check functionality",
        "duration": 10,  # 10 minutes
        "code": "TEST123",
        "questions": [
            {
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correct": 1
            },
            {
                "question": "What is the capital of France?",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "correct": 2
            },
            {
                "question": "Which programming language is this project built with?",
                "options": ["Java", "Python", "JavaScript", "C++"],
                "correct": 1
            }
        ],
        "audio_proctoring": {
            "enabled": False,
            "custom_keywords": [],
            "suspicion_threshold": 0.5,
            "language": "auto"
        }
    }

    # Try to create quiz (this will fail without auth, but we can see the response)
    try:
        response = requests.post(f"{API_BASE}/quizzes/", json=quiz_data)
        if response.status_code == 201:
            print(f"✅ Quiz created successfully: {response.json()}")
        else:
            print(f"⚠️ Quiz creation response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Quiz creation failed: {e}")

    # Try to get quizzes
    try:
        response = requests.get(f"{API_BASE}/quizzes/")
        if response.status_code == 200:
            quizzes = response.json()
            print(f"✅ Found {len(quizzes)} quizzes in database")
            for quiz in quizzes:
                print(f"  - {quiz.get('title', 'Untitled')} (Code: {quiz.get('code', 'No code')})")
        else:
            print(f"⚠️ Get quizzes response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Get quizzes failed: {e}")

    # Try to get quiz by code
    try:
        response = requests.get(f"{API_BASE}/quizzes/by-code/TEST123/")
        if response.status_code == 200:
            quiz = response.json()
            print(f"✅ Found quiz by code: {quiz.get('title', 'Untitled')}")
        else:
            print(f"⚠️ Get quiz by code response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Get quiz by code failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing Quiz Creation and Retrieval...")
    test_quiz_creation()