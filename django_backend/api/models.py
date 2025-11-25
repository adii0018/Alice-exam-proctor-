"""
MongoDB Models and Collections - yahan saare database collections define karte hain
Yeh file MongoDB collections aur unke schemas define karti hai
"""

from pymongo import MongoClient, ASCENDING, DESCENDING
from django.conf import settings
import logging

logger = logging.getLogger(__name__) # Logging ke liye

# MongoDB Connection - database se connect karte hain
try:
    client = MongoClient(settings.MONGODB_URI) # MongoDB client banate hain
    db = client[settings.DB_NAME] # Database select karte hain
    logger.info(f"MongoDB database se connect ho gaye: {settings.DB_NAME}")
except Exception as e:
    logger.error(f"MongoDB connection fail ho gaya: {e}")
    raise # Error ko re-raise kar dete hain

# Collections - saare database collections define karte hain
teachers_collection = db['teachers'] # Teachers ka data
students_collection = db['students'] # Students ka data
quizzes_collection = db['quizzes'] # Quizzes ka data
flags_collection = db['flags'] # Violation flags ka data
submissions_collection = db['submissions'] # Quiz submissions ka data
audio_chunks_collection = db['audio_chunks'] # Audio chunks ka data
audio_sessions_collection = db['audio_sessions'] # Audio sessions ka data


def create_indexes():
    """
    Database indexes banane wala function - performance improve karne ke liye
    Yeh function sirf ek baar initial setup ke time run karna hai
    """
    try:
        # Teachers collection ke liye indexes banate hain
        teachers_collection.create_index([('email', ASCENDING)], unique=True) # Email unique hona chahiye
        teachers_collection.create_index([('username', ASCENDING)], unique=True) # Username unique hona chahiye
        teachers_collection.create_index([('employee_id', ASCENDING)], unique=True) # Employee ID unique hona chahiye
        logger.info("Teachers collection ke liye indexes ban gaye")
        
        # Students collection ke liye indexes banate hain
        students_collection.create_index([('email', ASCENDING)], unique=True) # Email unique hona chahiye
        students_collection.create_index([('username', ASCENDING)], unique=True) # Username unique hona chahiye
        students_collection.create_index([('student_id', ASCENDING)], unique=True) # Student ID unique hona chahiye
        logger.info("Students collection ke liye indexes ban gaye")
        
        # Quizzes collection ke liye indexes banate hain
        quizzes_collection.create_index([('code', ASCENDING)], unique=True) # Quiz code unique hona chahiye
        quizzes_collection.create_index([('teacher_id', ASCENDING)]) # Teacher ID ke basis par search
        quizzes_collection.create_index([('is_active', ASCENDING)]) # Active/inactive quizzes filter karne ke liye
        quizzes_collection.create_index([('created_at', DESCENDING)]) # Latest quizzes pehle dikhane ke liye
        logger.info("Quizzes collection ke liye indexes ban gaye")
        
        # Flags indexes
        flags_collection.create_index([('student_id', ASCENDING)])
        flags_collection.create_index([('quiz_id', ASCENDING)])
        flags_collection.create_index([('timestamp', DESCENDING)])
        flags_collection.create_index([('resolved', ASCENDING)])
        flags_collection.create_index([
            ('student_id', ASCENDING),
            ('quiz_id', ASCENDING),
            ('type', ASCENDING),
            ('timestamp', DESCENDING)
        ])
        logger.info("Created indexes for flags collection")
        
        # Submissions indexes
        submissions_collection.create_index([
            ('quiz_id', ASCENDING),
            ('student_id', ASCENDING)
        ], unique=True)
        submissions_collection.create_index([('submitted_at', DESCENDING)])
        submissions_collection.create_index([('quiz_id', ASCENDING)])
        submissions_collection.create_index([('student_id', ASCENDING)])
        logger.info("Created indexes for submissions collection")
        
        # Audio chunks indexes
        audio_chunks_collection.create_index([('chunk_id', ASCENDING)], unique=True)
        audio_chunks_collection.create_index([
            ('quiz_id', ASCENDING),
            ('student_id', ASCENDING)
        ])
        audio_chunks_collection.create_index([('processing_status', ASCENDING)])
        audio_chunks_collection.create_index([('timestamp', DESCENDING)])
        audio_chunks_collection.create_index([('created_at', DESCENDING)])
        logger.info("Created indexes for audio_chunks collection")
        
        # Audio sessions indexes
        audio_sessions_collection.create_index([('session_id', ASCENDING)], unique=True)
        audio_sessions_collection.create_index([
            ('quiz_id', ASCENDING),
            ('student_id', ASCENDING)
        ])
        audio_sessions_collection.create_index([('status', ASCENDING)])
        audio_sessions_collection.create_index([('started_at', DESCENDING)])
        logger.info("Created indexes for audio_sessions collection")
        
        logger.info("All database indexes created successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")
        return False


# Collection Schemas (for documentation purposes)
"""
Teachers Collection Schema:
{
    _id: ObjectId,
    name: String,
    email: String (unique, indexed),
    username: String (unique, indexed),
    password: String (bcrypt hash),
    role: "teacher",
    department: String,
    employee_id: String (unique, indexed),
    created_at: ISODate,
    updated_at: ISODate,
    is_active: Boolean,
    profile_image: String (optional),
    theme: {
        mode: String,  # 'light' or 'dark'
        scheme: String,  # 'default', 'ocean', 'forest', 'sunset', 'custom'
        customColors: {
            primary: String,
            secondary: String,
            accent: String,
            background: String,
            surface: String,
            text: String
        },
        accessibility: {
            highContrast: Boolean,
            fontSize: String,  # 'small', 'medium', 'large', 'xlarge'
            reducedMotion: Boolean
        },
        updated_at: String (ISO date)
    }
}

Students Collection Schema:
{
    _id: ObjectId,
    name: String,
    email: String (unique, indexed),
    username: String (unique, indexed),
    password: String (bcrypt hash),
    role: "student",
    student_id: String (unique, indexed),
    class_section: String,
    enrollment_year: String,
    created_at: ISODate,
    updated_at: ISODate,
    is_active: Boolean,
    profile_image: String (optional),
    theme: {
        mode: String,  # 'light' or 'dark'
        scheme: String,  # 'default', 'ocean', 'forest', 'sunset', 'custom'
        customColors: {
            primary: String,
            secondary: String,
            accent: String,
            background: String,
            surface: String,
            text: String
        },
        accessibility: {
            highContrast: Boolean,
            fontSize: String,  # 'small', 'medium', 'large', 'xlarge'
            reducedMotion: Boolean
        },
        updated_at: String (ISO date)
    }
}

Quizzes Collection Schema:
{
    _id: ObjectId,
    title: String,
    code: String (unique, indexed),
    teacher_id: String (indexed),
    description: String,
    duration: Number (minutes),
    questions: [
        {
            question: String,
            options: [String],
            correct: Number (index)
        }
    ],
    created_at: ISODate,
    updated_at: ISODate,
    is_active: Boolean,
    start_time: ISODate (optional),
    end_time: ISODate (optional),
    settings: {
        shuffle_questions: Boolean,
        shuffle_options: Boolean,
        show_results: Boolean,
        allow_review: Boolean
    },
    audio_proctoring: {
        enabled: Boolean,
        custom_keywords: [String],
        suspicion_threshold: Float,  # 0.0 - 1.0, default 0.5
        language: String  # 'auto', 'en', 'hi', etc.
    }
}

Flags Collection Schema:
{
    _id: ObjectId,
    student_id: String (indexed),
    quiz_id: String (indexed),
    type: String (indexed),  # no_face, multiple_faces, audio_multiple_speakers, audio_keywords, etc.
    description: String,
    timestamp: ISODate (indexed),
    severity: String,
    resolved: Boolean (indexed),
    resolved_by: String (optional),
    resolved_at: ISODate (optional),
    resolution_note: String (optional),
    count: Number (default: 1),
    audio_data: {  # Only present for audio flags
        chunk_id: String,
        transcription: String,
        num_speakers: Integer,
        keywords_found: [String],
        audio_url: String  # Presigned URL for playback
    }
}

Submissions Collection Schema:
{
    _id: ObjectId,
    quiz_id: String (indexed),
    student_id: String (indexed),
    answers: Object,
    submitted_at: ISODate (indexed),
    score: Number,
    total_questions: Number,
    correct_answers: Number,
    total_flags: Number,
    time_taken: Number (seconds),
    status: String
}

Audio Chunks Collection Schema:
{
    _id: ObjectId,
    chunk_id: String (UUID, unique, indexed),
    quiz_id: String (indexed),
    student_id: String (indexed),
    session_id: String,
    chunk_index: Integer,
    timestamp: ISODate (indexed),
    duration: Float,
    file_path: String,
    preprocessed_path: String,
    processing_status: String (indexed),  # queued, preprocessing, vad, diarization, transcription, suspicion, completed, failed
    created_at: ISODate (indexed),
    updated_at: ISODate,
    
    # Processing results
    vad_results: {
        has_speech: Boolean,
        speech_segments: [
            {start: Float, end: Float}
        ],
        total_speech_duration: Float
    },
    diarization_results: {
        num_speakers: Integer,
        speaker_segments: [
            {speaker: String, start: Float, end: Float}
        ],
        speaker_durations: Object
    },
    transcriptions: [
        {
            speaker: String,
            start: Float,
            end: Float,
            text: String,
            confidence: Float
        }
    ],
    suspicion_results: {
        score: Float,
        severity: String,
        reasons: [String],
        keywords_found: [String]
    },
    error_message: String (optional)
}

Audio Sessions Collection Schema:
{
    _id: ObjectId,
    session_id: String (UUID, unique, indexed),
    quiz_id: String (indexed),
    student_id: String (indexed),
    started_at: ISODate (indexed),
    ended_at: ISODate,
    total_chunks: Integer,
    processed_chunks: Integer,
    failed_chunks: Integer,
    total_flags: Integer,
    consent_given: Boolean,
    consent_timestamp: ISODate,
    status: String (indexed)  # active, completed, terminated
}
"""
