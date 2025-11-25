"""
Quick test script for audio processing pipeline
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from api.models import audio_chunks_collection, audio_sessions_collection, quizzes_collection
from api.tasks.audio_tasks import preprocess_audio_chunk
from datetime import datetime
import uuid

def test_database_connection():
    """Test MongoDB connection"""
    print("Testing database connection...")
    try:
        count = quizzes_collection.count_documents({})
        print(f"✓ Connected to MongoDB. Found {count} quizzes.")
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False

def test_celery_connection():
    """Test Celery/Redis connection"""
    print("\nTesting Celery connection...")
    try:
        from exam_proctoring.celery import app
        result = app.control.inspect().active()
        if result:
            print(f"✓ Celery is running. Active workers: {list(result.keys())}")
            return True
        else:
            print("✗ No Celery workers found. Start worker with:")
            print("  celery -A exam_proctoring worker --loglevel=info --pool=solo")
            return False
    except Exception as e:
        print(f"✗ Celery connection failed: {e}")
        return False

def test_audio_storage():
    """Test audio storage directories"""
    print("\nTesting audio storage...")
    try:
        from django.conf import settings
        storage_root = settings.AUDIO_STORAGE_ROOT
        
        dirs = ['raw', 'preprocessed', 'archived']
        for dir_name in dirs:
            dir_path = storage_root / dir_name
            if dir_path.exists():
                print(f"✓ {dir_name} directory exists: {dir_path}")
            else:
                print(f"✗ {dir_name} directory missing: {dir_path}")
        return True
    except Exception as e:
        print(f"✗ Storage test failed: {e}")
        return False

def test_audio_config():
    """Test audio configuration"""
    print("\nTesting audio configuration...")
    try:
        from api.utils.audio_config import get_audio_config, DEFAULT_KEYWORDS
        config = get_audio_config()
        print(f"✓ Audio config loaded:")
        print(f"  - Sample rate: {config['recording']['sample_rate']}Hz")
        print(f"  - ASR model: {config['processing']['asr_model']}")
        print(f"  - Retention: {config['storage']['retention_days']} days")
        print(f"  - Default keywords: {len(sum(DEFAULT_KEYWORDS.values(), []))} keywords")
        return True
    except Exception as e:
        print(f"✗ Config test failed: {e}")
        return False

def test_create_session():
    """Test creating audio session"""
    print("\nTesting audio session creation...")
    try:
        session_id = str(uuid.uuid4())
        session_doc = {
            'session_id': session_id,
            'quiz_id': 'test_quiz',
            'student_id': 'test_student',
            'started_at': datetime.utcnow(),
            'ended_at': None,
            'total_chunks': 0,
            'processed_chunks': 0,
            'failed_chunks': 0,
            'total_flags': 0,
            'consent_given': True,
            'consent_timestamp': datetime.utcnow(),
            'status': 'active'
        }
        
        audio_sessions_collection.insert_one(session_doc)
        print(f"✓ Created test session: {session_id}")
        
        # Cleanup
        audio_sessions_collection.delete_one({'session_id': session_id})
        print(f"✓ Cleaned up test session")
        return True
    except Exception as e:
        print(f"✗ Session creation failed: {e}")
        return False

def test_dependencies():
    """Test required Python packages"""
    print("\nTesting Python dependencies...")
    packages = {
        'librosa': 'Audio processing',
        'whisper': 'Speech recognition',
        'pydub': 'Audio conversion',
        'noisereduce': 'Noise reduction',
        'celery': 'Task queue',
        'redis': 'Message broker'
    }
    
    all_ok = True
    for package, description in packages.items():
        try:
            __import__(package)
            print(f"✓ {package}: {description}")
        except ImportError:
            print(f"✗ {package}: Missing - {description}")
            all_ok = False
    
    return all_ok

def main():
    print("=" * 60)
    print("Audio Proctoring Pipeline Test")
    print("=" * 60)
    
    tests = [
        test_dependencies,
        test_database_connection,
        test_celery_connection,
        test_audio_storage,
        test_audio_config,
        test_create_session
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"\n✗ Test failed with exception: {e}")
            results.append(False)
    
    print("\n" + "=" * 60)
    print(f"Test Results: {sum(results)}/{len(results)} passed")
    print("=" * 60)
    
    if all(results):
        print("\n✓ All tests passed! Audio proctoring is ready to use.")
        print("\nNext steps:")
        print("1. Start Django server: python manage.py runserver")
        print("2. Start Celery worker: celery -A exam_proctoring worker --loglevel=info --pool=solo")
        print("3. Create a quiz with audio proctoring enabled")
        print("4. Test as a student")
    else:
        print("\n✗ Some tests failed. Please fix the issues above.")
        print("\nRefer to AUDIO_SETUP.md for detailed setup instructions.")

if __name__ == '__main__':
    main()
