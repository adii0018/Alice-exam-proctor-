# Audio Proctoring Pipeline - Design Document

## Overview

The Audio Proctoring Pipeline is a comprehensive system that captures, processes, and analyzes student audio during online exams to detect suspicious behavior. The system follows a multi-stage pipeline architecture where audio flows through preprocessing, voice activity detection (VAD), speaker diarization, automatic speech recognition (ASR), and suspicion detection stages before generating actionable flags for teachers.

The design integrates seamlessly with the existing exam proctoring platform, leveraging the current Django backend, MongoDB database, WebSocket infrastructure, and React frontend.

### Key Design Principles

1. **Real-time Processing**: Audio is processed in near real-time (< 10 seconds latency) to enable live monitoring
2. **Modular Architecture**: Each processing stage is independent and can be upgraded or replaced
3. **Privacy-First**: Audio data is encrypted, access-controlled, and automatically deleted after retention period
4. **Scalability**: Asynchronous processing with Celery allows handling multiple concurrent exam sessions
5. **Fault Tolerance**: Graceful degradation ensures exam continuity even if audio processing fails

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│  ┌──────────────────┐         ┌─────────────────────────────────┐  │
│  │ QuizInterface    │────────▶│  AudioRecorder Component        │  │
│  │                  │         │  - MediaRecorder API            │  │
│  │                  │         │  - 5-second chunks              │  │
│  │                  │         │  - Consent UI                   │  │
│  └──────────────────┘         └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP POST (audio/webm)
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DJANGO BACKEND (API Layer)                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Audio Upload Endpoint (/api/audio/upload)                   │  │
│  │  - Validate audio chunk                                      │  │
│  │  - Store in temporary storage                                │  │
│  │  - Enqueue processing task                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Celery Task Queue
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AUDIO PROCESSING PIPELINE                         │
│                                                                       │
│  ┌────────────────┐    ┌────────────────┐    ┌─────────────────┐  │
│  │ 1. Preprocess  │───▶│  2. VAD        │───▶│ 3. Diarization  │  │
│  │ - Convert WAV  │    │  - Detect      │    │ - Count         │  │
│  │ - Denoise      │    │    speech      │    │   speakers      │  │
│  │ - Normalize    │    │  - Extract     │    │ - Label         │  │
│  └────────────────┘    │    segments    │    │   segments      │  │
│                        └────────────────┘    └─────────────────┘  │
│                                                        │             │
│                                                        ▼             │
│  ┌────────────────┐    ┌────────────────────────────────────────┐  │
│  │ 5. Suspicion   │◀───│  4. ASR (Speech-to-Text)               │  │
│  │    Detection   │    │  - Transcribe speech                   │  │
│  │ - Keyword scan │    │  - Timestamp alignment                 │  │
│  │ - Multi-speaker│    │  - Speaker attribution                 │  │
│  │ - Generate flag│    └────────────────────────────────────────┘  │
│  └────────────────┘                                                 │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Store results
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ MongoDB          │  │ File Storage     │  │ Redis Cache     │  │
│  │ - Transcriptions │  │ - Audio files    │  │ - Processing    │  │
│  │ - Flags          │  │ - Preprocessed   │  │   status        │  │
│  │ - Metadata       │  │   chunks         │  │                 │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ WebSocket notification
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TEACHER DASHBOARD (React)                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  FlagMonitor Component                                        │  │
│  │  - Real-time audio flags                                     │  │
│  │  - Transcription viewer                                      │  │
│  │  - Audio playback                                            │  │
│  │  - Timeline visualization                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React**: UI framework
- **MediaRecorder API**: Browser audio capture
- **Web Audio API**: Audio visualization and preprocessing
- **Axios**: HTTP client for audio upload
- **WebSocket**: Real-time flag notifications

#### Backend
- **Django 4.2**: Web framework
- **Django REST Framework**: API endpoints
- **Channels**: WebSocket support
- **Celery**: Asynchronous task processing
- **Redis**: Message broker and caching

#### Audio Processing Libraries
- **librosa**: Audio preprocessing and feature extraction
- **webrtcvad**: Voice activity detection
- **pyannote.audio**: Speaker diarization
- **Whisper (OpenAI)**: Automatic speech recognition
- **pydub**: Audio format conversion
- **noisereduce**: Noise reduction

#### Storage
- **MongoDB**: Metadata, transcriptions, flags
- **Local File System / S3**: Audio file storage
- **Redis**: Temporary processing state

## Components and Interfaces

### 1. Frontend: AudioRecorder Component

**Location**: `src/components/student/AudioRecorder.jsx`

**Responsibilities**:
- Request microphone permission with consent dialog
- Capture audio using MediaRecorder API
- Split audio into 5-second chunks
- Upload chunks to backend via HTTP POST
- Display recording indicator
- Handle network failures with retry logic
- Buffer audio locally during network outages

**Key Methods**:
```javascript
class AudioRecorder {
  async requestPermission()
  async startRecording(quizId, studentId)
  stopRecording()
  async uploadChunk(audioBlob, metadata)
  handleUploadFailure(chunk, retryCount)
  displayRecordingIndicator()
}
```

**State Management**:
```javascript
{
  isRecording: boolean,
  hasPermission: boolean,
  uploadQueue: AudioChunk[],
  failedUploads: number,
  recordingStartTime: timestamp
}
```

**Audio Format**: WebM with Opus codec (browser default), converted to WAV on backend

### 2. Backend: Audio Upload API

**Location**: `django_backend/api/views/audio_views.py`

**Endpoint**: `POST /api/audio/upload`

**Request Format**:
```json
{
  "quiz_id": "string",
  "student_id": "string",
  "chunk_index": "integer",
  "timestamp": "ISO8601",
  "audio_data": "base64 encoded audio"
}
```

**Response Format**:
```json
{
  "success": true,
  "chunk_id": "string",
  "processing_status": "queued"
}
```

**Responsibilities**:
- Validate authentication and quiz access
- Validate audio data format and size (max 5MB per chunk)
- Generate unique chunk ID
- Store audio file in temporary storage
- Create audio_chunks MongoDB document
- Enqueue Celery processing task
- Return immediate response to frontend

**Error Handling**:
- 400: Invalid audio format or missing fields
- 401: Unauthorized
- 403: Quiz not active or student not enrolled
- 413: Audio chunk too large
- 500: Storage failure

### 3. Audio Processing Pipeline (Celery Tasks)

**Location**: `django_backend/api/tasks/audio_tasks.py`

#### Task 1: Preprocess Audio

**Function**: `preprocess_audio_chunk(chunk_id)`

**Steps**:
1. Load audio file from storage
2. Convert to WAV format (16kHz, mono, 16-bit PCM)
3. Apply noise reduction using noisereduce library
4. Normalize audio levels
5. Save preprocessed audio
6. Update chunk status in MongoDB
7. Trigger VAD task

**Libraries**:
```python
from pydub import AudioSegment
import noisereduce as nr
import librosa
import soundfile as sf
```

**Output**: Preprocessed WAV file at `storage/audio/preprocessed/{chunk_id}.wav`

#### Task 2: Voice Activity Detection

**Function**: `detect_voice_activity(chunk_id)`

**Steps**:
1. Load preprocessed audio
2. Apply WebRTC VAD with aggressiveness level 2
3. Identify speech segments with timestamps
4. Calculate total speech duration
5. Store VAD results in MongoDB
6. If speech detected, trigger diarization task
7. If no speech, mark chunk as silent and skip further processing

**Libraries**:
```python
import webrtcvad
import librosa
```

**VAD Configuration**:
- Frame duration: 30ms
- Sample rate: 16kHz
- Aggressiveness: 2 (moderate)

**Output**:
```python
{
  "chunk_id": "string",
  "speech_segments": [
    {"start": 0.5, "end": 2.3},
    {"start": 3.1, "end": 4.8}
  ],
  "total_speech_duration": 3.5,
  "has_speech": true
}
```

#### Task 3: Speaker Diarization

**Function**: `diarize_speakers(chunk_id)`

**Steps**:
1. Load preprocessed audio
2. Apply pyannote.audio diarization pipeline
3. Identify number of unique speakers
4. Assign speaker labels to segments
5. Calculate speaking time per speaker
6. Store diarization results in MongoDB
7. Trigger ASR task

**Libraries**:
```python
from pyannote.audio import Pipeline
```

**Model**: `pyannote/speaker-diarization-3.1` (Hugging Face)

**Output**:
```python
{
  "chunk_id": "string",
  "num_speakers": 2,
  "speaker_segments": [
    {"speaker": "SPEAKER_00", "start": 0.5, "end": 2.3},
    {"speaker": "SPEAKER_01", "start": 2.5, "end": 4.8}
  ],
  "speaker_durations": {
    "SPEAKER_00": 1.8,
    "SPEAKER_01": 2.3
  }
}
```

#### Task 4: Automatic Speech Recognition

**Function**: `transcribe_audio(chunk_id)`

**Steps**:
1. Load preprocessed audio
2. Load diarization results
3. Apply Whisper ASR model
4. Transcribe each speech segment
5. Align transcriptions with speaker labels
6. Store transcriptions in MongoDB
7. Trigger suspicion detection task

**Libraries**:
```python
import whisper
```

**Model**: `whisper-base` (faster) or `whisper-small` (more accurate)

**Configuration**:
- Language: Auto-detect or teacher-specified
- Task: Transcribe
- Temperature: 0.0 (deterministic)

**Output**:
```python
{
  "chunk_id": "string",
  "transcriptions": [
    {
      "speaker": "SPEAKER_00",
      "start": 0.5,
      "end": 2.3,
      "text": "What is the answer to question five?",
      "confidence": 0.92
    },
    {
      "speaker": "SPEAKER_01",
      "start": 2.5,
      "end": 4.8,
      "text": "I think it's option B",
      "confidence": 0.88
    }
  ]
}
```

#### Task 5: Suspicion Detection

**Function**: `detect_suspicion(chunk_id)`

**Steps**:
1. Load transcriptions and diarization results
2. Load quiz-specific suspicious keywords
3. Scan transcriptions for keyword matches
4. Calculate suspicion score based on:
   - Number of speakers (weight: 0.5)
   - Keyword frequency (weight: 0.3)
   - Speech overlap (weight: 0.2)
5. If suspicion score > threshold, create flag
6. Send WebSocket notification to teacher
7. Update chunk processing status to complete

**Keyword Categories**:
```python
DEFAULT_KEYWORDS = {
    "help_seeking": ["help", "tell me", "what's the answer", "give me"],
    "collaboration": ["you", "your answer", "same as", "copy"],
    "cheating": ["answer key", "solution", "cheat sheet"],
    "question_discussion": ["question", "problem", "which one"]
}
```

**Suspicion Score Calculation**:
```python
score = (
    (num_speakers - 1) * 0.5 +  # 0 if 1 speaker, 0.5 if 2 speakers, etc.
    (keyword_matches / total_words) * 0.3 +
    (overlap_duration / total_duration) * 0.2
)
```

**Flag Generation**:
- Score 0.3-0.5: Low severity (yellow flag)
- Score 0.5-0.7: Medium severity (orange flag)
- Score > 0.7: High severity (red flag)

**Output**:
```python
{
  "chunk_id": "string",
  "suspicion_score": 0.65,
  "severity": "medium",
  "reasons": [
    "Multiple speakers detected (2)",
    "Keyword 'answer' found 3 times",
    "Keyword 'help' found 1 time"
  ],
  "flag_created": true,
  "flag_id": "string"
}
```

### 4. Data Models

#### MongoDB Collections

**audio_chunks Collection**:
```python
{
    "_id": ObjectId,
    "chunk_id": String (UUID),
    "quiz_id": String,
    "student_id": String,
    "chunk_index": Integer,
    "timestamp": ISODate,
    "duration": Float,  # seconds
    "file_path": String,
    "preprocessed_path": String,
    "processing_status": String,  # queued, processing, completed, failed
    "created_at": ISODate,
    "updated_at": ISODate,
    
    # Processing results
    "vad_results": {
        "has_speech": Boolean,
        "speech_segments": Array,
        "total_speech_duration": Float
    },
    "diarization_results": {
        "num_speakers": Integer,
        "speaker_segments": Array,
        "speaker_durations": Object
    },
    "transcriptions": Array,
    "suspicion_results": {
        "score": Float,
        "severity": String,
        "reasons": Array,
        "keywords_found": Array
    }
}
```

**Indexes**:
```python
audio_chunks_collection.create_index([("quiz_id", ASCENDING), ("student_id", ASCENDING)])
audio_chunks_collection.create_index([("chunk_id", ASCENDING)], unique=True)
audio_chunks_collection.create_index([("processing_status", ASCENDING)])
audio_chunks_collection.create_index([("timestamp", DESCENDING)])
```

**audio_sessions Collection**:
```python
{
    "_id": ObjectId,
    "session_id": String (UUID),
    "quiz_id": String,
    "student_id": String,
    "started_at": ISODate,
    "ended_at": ISODate,
    "total_chunks": Integer,
    "processed_chunks": Integer,
    "failed_chunks": Integer,
    "total_flags": Integer,
    "consent_given": Boolean,
    "consent_timestamp": ISODate,
    "status": String  # active, completed, terminated
}
```

**Update flags Collection** (extend existing):
```python
{
    # ... existing fields ...
    "type": String,  # Add "audio_multiple_speakers", "audio_keywords"
    "audio_data": {
        "chunk_id": String,
        "transcription": String,
        "num_speakers": Integer,
        "keywords_found": Array,
        "audio_url": String  # Presigned URL for playback
    }
}
```

**Update quizzes Collection** (extend existing):
```python
{
    # ... existing fields ...
    "audio_proctoring": {
        "enabled": Boolean,
        "custom_keywords": Array,
        "suspicion_threshold": Float,  # default 0.5
        "language": String  # default "auto"
    }
}
```

### 5. File Storage Structure

```
storage/
├── audio/
│   ├── raw/
│   │   └── {quiz_id}/
│   │       └── {student_id}/
│   │           └── {chunk_id}.webm
│   ├── preprocessed/
│   │   └── {quiz_id}/
│   │       └── {student_id}/
│   │           └── {chunk_id}.wav
│   └── archived/
│       └── {date}/
│           └── {quiz_id}/
│               └── {student_id}/
│                   └── {chunk_id}.wav
```

**Storage Configuration**:
- Raw audio: Retained for 7 days
- Preprocessed audio: Retained for 90 days (configurable)
- Archived audio: Compressed and moved after quiz completion
- Automatic cleanup: Celery beat task runs daily

### 6. WebSocket Integration

**Extend existing MonitoringConsumer** (`django_backend/api/consumers.py`):

**New Message Types**:
```python
# Server to Client
{
    "type": "audio_flag",
    "flag": {
        "flag_id": "string",
        "student_id": "string",
        "quiz_id": "string",
        "severity": "high",
        "transcription": "What is the answer?",
        "num_speakers": 2,
        "timestamp": "ISO8601"
    }
}

# Client to Server
{
    "action": "request_audio_playback",
    "chunk_id": "string"
}

# Server to Client
{
    "type": "audio_playback_url",
    "chunk_id": "string",
    "url": "presigned_url",
    "expires_in": 300
}
```

### 7. Teacher Dashboard Components

#### AudioFlagCard Component

**Location**: `src/components/teacher/AudioFlagCard.jsx`

**Features**:
- Display transcription text
- Show speaker count badge
- Highlight detected keywords
- Audio playback controls
- Timestamp and severity indicator
- Expand/collapse details

**UI Layout**:
```
┌─────────────────────────────────────────────────┐
│ 🔊 Audio Flag - Multiple Speakers Detected      │
│ ⚠️ HIGH SEVERITY                    🕐 12:34:56 │
├─────────────────────────────────────────────────┤
│ Student: John Doe                               │
│ Speakers: 2                                     │
│                                                 │
│ Transcription:                                  │
│ [SPEAKER 1]: "What is the answer to question 5?"│
│ [SPEAKER 2]: "I think it's option B"           │
│                                                 │
│ Keywords: answer (2), question (1)              │
│                                                 │
│ [▶️ Play Audio] [📄 View Full Context]         │
└─────────────────────────────────────────────────┘
```

#### AudioTimeline Component

**Location**: `src/components/teacher/AudioTimeline.jsx`

**Features**:
- Visual timeline of exam duration
- Flag markers at occurrence times
- Color-coded by severity
- Hover to preview transcription
- Click to jump to flag details
- Filter by flag type

### 8. Configuration Management

**Location**: `django_backend/api/utils/audio_config.py`

**Default Configuration**:
```python
AUDIO_CONFIG = {
    "recording": {
        "chunk_duration": 5,  # seconds
        "sample_rate": 16000,
        "channels": 1,
        "format": "wav"
    },
    "processing": {
        "vad_aggressiveness": 2,
        "diarization_model": "pyannote/speaker-diarization-3.1",
        "asr_model": "whisper-base",
        "suspicion_threshold": 0.5
    },
    "storage": {
        "retention_days": 90,
        "max_chunk_size_mb": 5,
        "compression_enabled": true
    },
    "keywords": {
        "default": [
            "answer", "help", "tell me", "what's the answer",
            "give me", "solution", "cheat", "copy"
        ]
    }
}
```

## Error Handling

### Frontend Error Scenarios

1. **Microphone Permission Denied**:
   - Display error modal explaining requirement
   - Prevent exam access
   - Provide instructions to enable microphone

2. **Network Upload Failure**:
   - Retry up to 3 times with exponential backoff (1s, 2s, 4s)
   - Buffer chunks locally (max 50 chunks = 4 minutes)
   - Display warning to student about connectivity
   - Resume upload when connection restored

3. **Browser Compatibility**:
   - Check MediaRecorder API support
   - Fallback to Web Audio API if needed
   - Display browser upgrade message if unsupported

### Backend Error Scenarios

1. **Invalid Audio Format**:
   - Return 400 error with specific format requirements
   - Log error for monitoring
   - Continue processing other chunks

2. **Processing Pipeline Failure**:
   - Catch exceptions at each stage
   - Log error with chunk_id and stage
   - Mark chunk as failed in database
   - Send alert if failure rate > 5%
   - Continue processing subsequent chunks

3. **Model Loading Failure**:
   - Retry model loading up to 3 times
   - Use cached model if available
   - Fall back to simpler model (e.g., whisper-tiny)
   - Alert administrators

4. **Storage Failure**:
   - Retry storage operation
   - Use fallback storage location
   - Queue for later retry if persistent
   - Alert administrators

### Monitoring and Alerts

**Metrics to Track**:
- Audio upload success rate
- Processing latency per stage
- Model inference time
- Storage usage
- Error rates by type
- Active recording sessions

**Alert Thresholds**:
- Upload failure rate > 5%
- Processing latency > 30 seconds
- Error rate > 10%
- Storage usage > 80%

## Testing Strategy

### Unit Tests

1. **Frontend AudioRecorder**:
   - Test microphone permission flow
   - Test chunk creation and upload
   - Test retry logic
   - Test local buffering
   - Mock MediaRecorder API

2. **Backend API Endpoints**:
   - Test audio upload validation
   - Test authentication and authorization
   - Test error responses
   - Test file storage

3. **Processing Pipeline**:
   - Test each stage independently
   - Test with sample audio files
   - Test error handling
   - Test edge cases (silence, noise, multiple speakers)

### Integration Tests

1. **End-to-End Audio Flow**:
   - Upload audio chunk
   - Verify processing completion
   - Check database records
   - Verify flag creation
   - Test WebSocket notification

2. **Concurrent Processing**:
   - Simulate multiple students
   - Verify queue handling
   - Check resource usage
   - Test race conditions

### Performance Tests

1. **Load Testing**:
   - Simulate 100 concurrent students
   - Measure upload throughput
   - Measure processing latency
   - Monitor resource usage

2. **Stress Testing**:
   - Test with degraded network
   - Test with high error rates
   - Test storage limits
   - Test recovery mechanisms

### Manual Testing

1. **Audio Quality**:
   - Test with various microphones
   - Test with background noise
   - Test with multiple speakers
   - Test with different languages

2. **User Experience**:
   - Test consent flow
   - Test recording indicator
   - Test error messages
   - Test teacher dashboard

## Security Considerations

### Data Privacy

1. **Encryption**:
   - Audio files encrypted at rest (AES-256)
   - HTTPS for all audio uploads
   - Encrypted database fields for transcriptions

2. **Access Control**:
   - Students can only upload to their own sessions
   - Teachers can only access their quiz audio
   - Administrators have full access with audit logging

3. **Data Retention**:
   - Automatic deletion after retention period
   - Secure deletion (overwrite files)
   - Audit trail of deletions

### Consent Management

1. **Explicit Consent**:
   - Clear consent dialog before recording
   - Explanation of data usage
   - Option to decline (prevents exam access)
   - Consent timestamp recorded

2. **Privacy Policy**:
   - Link to audio recording policy
   - Data retention information
   - Access rights information

### Compliance

1. **GDPR Compliance**:
   - Right to access audio data
   - Right to deletion
   - Data processing agreement
   - Consent management

2. **FERPA Compliance** (US Education):
   - Student data protection
   - Access controls
   - Audit logging

## Performance Optimization

### Frontend Optimizations

1. **Audio Compression**:
   - Use Opus codec for efficient compression
   - Adjust bitrate based on network speed
   - Compress before upload

2. **Batch Uploads**:
   - Upload multiple chunks in parallel (max 3)
   - Prioritize recent chunks
   - Use HTTP/2 multiplexing

### Backend Optimizations

1. **Asynchronous Processing**:
   - Celery workers for parallel processing
   - Separate queues for each stage
   - Priority queue for real-time processing

2. **Model Optimization**:
   - Load models once and cache in memory
   - Use GPU acceleration if available
   - Batch processing for multiple chunks
   - Use quantized models for faster inference

3. **Database Optimization**:
   - Proper indexing
   - Batch inserts for transcriptions
   - Connection pooling
   - Query optimization

4. **Caching**:
   - Cache quiz configurations
   - Cache keyword lists
   - Cache model outputs for duplicate audio

## Deployment Considerations

### Infrastructure Requirements

1. **Compute Resources**:
   - CPU: 4+ cores per worker
   - RAM: 8GB+ per worker (for ML models)
   - GPU: Optional but recommended for ASR
   - Storage: 100GB+ for audio files

2. **Services**:
   - Redis: Message broker and cache
   - Celery: 4+ workers for processing
   - MongoDB: Replica set for high availability
   - File Storage: S3 or local with backup

### Scaling Strategy

1. **Horizontal Scaling**:
   - Add more Celery workers
   - Load balance API servers
   - Shard MongoDB by quiz_id

2. **Vertical Scaling**:
   - Increase worker resources
   - Use larger models for better accuracy
   - Add GPU acceleration

### Monitoring and Logging

1. **Application Monitoring**:
   - Celery task monitoring (Flower)
   - API endpoint metrics
   - Error tracking (Sentry)
   - Performance monitoring (New Relic/DataDog)

2. **Infrastructure Monitoring**:
   - CPU/RAM usage
   - Disk space
   - Network bandwidth
   - Queue lengths

## Future Enhancements

1. **Advanced Features**:
   - Emotion detection in speech
   - Language-specific keyword lists
   - Speaker identification (voice biometrics)
   - Real-time transcription display

2. **ML Improvements**:
   - Fine-tune models on exam audio
   - Custom wake word detection
   - Anomaly detection in audio patterns
   - Confidence scoring improvements

3. **Integration**:
   - Export audio evidence for academic integrity cases
   - Integration with LMS platforms
   - Automated report generation
   - Analytics dashboard for audio proctoring effectiveness
