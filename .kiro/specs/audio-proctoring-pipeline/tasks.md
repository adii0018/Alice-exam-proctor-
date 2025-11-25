# Implementation Plan

- [x] 1. Set up backend infrastructure and dependencies


  - Install required Python packages (librosa, webrtcvad, pyannote.audio, whisper, pydub, noisereduce, celery)
  - Configure Celery with Redis as message broker
  - Create audio storage directory structure
  - Add audio processing configuration to Django settings
  - _Requirements: 2.1, 2.2, 2.3_






- [x] 2. Create MongoDB collections and data models


  - [x] 2.1 Create audio_chunks collection schema and indexes



    - Define audio_chunks document structure with all processing fields


    - Create indexes for quiz_id, student_id, chunk_id, processing_status, timestamp
    - _Requirements: 7.1, 7.2, 7.3_






  - [x] 2.2 Create audio_sessions collection schema and indexes


    - Define audio_sessions document structure for tracking recording sessions
    - Create indexes for session_id, quiz_id, student_id, status




    - _Requirements: 7.1, 11.2_





  - [ ] 2.3 Extend quizzes collection with audio proctoring settings
    - Add audio_proctoring field with enabled, custom_keywords, suspicion_threshold, language
    - Update quiz creation/update logic to handle audio settings
    - _Requirements: 10.1, 10.2, 10.3, 10.4_





  - [ ] 2.4 Extend flags collection with audio-specific fields
    - Add audio_data field with chunk_id, transcription, num_speakers, keywords_found, audio_url
    - Update flag creation logic to support audio flag types
    - _Requirements: 6.5, 8.1, 8.2_



- [ ] 3. Implement audio upload API endpoint
  - [ ] 3.1 Create audio upload view and URL routing
    - Implement POST /api/audio/upload endpoint

    - Add authentication and authorization checks





    - Validate quiz is active and student is enrolled
    - _Requirements: 1.3, 12.1_


  - [ ] 3.2 Implement audio chunk validation and storage
    - Validate audio data format and size (max 5MB)

    - Generate unique chunk_id

    - Save audio file to storage/audio/raw/{quiz_id}/{student_id}/

    - Create audio_chunks MongoDB document
    - _Requirements: 1.3, 2.4, 7.1_


  - [x] 3.3 Implement Celery task enqueueing

    - Enqueue preprocess_audio_chunk task

    - Return immediate response with chunk_id and status
    - Handle storage failures with proper error responses
    - _Requirements: 2.5, 12.3_


- [x] 4. Implement audio preprocessing pipeline stage


  - [ ] 4.1 Create preprocess_audio_chunk Celery task
    - Load raw audio file from storage
    - Convert to WAV format (16kHz, mono, 16-bit PCM) using pydub
    - Apply noise reduction using noisereduce
    - Normalize audio levels using librosa


    - _Requirements: 2.1, 2.2_


  - [ ] 4.2 Save preprocessed audio and update database
    - Save preprocessed audio to storage/audio/preprocessed/{quiz_id}/{student_id}/

    - Update audio_chunks document with preprocessed_path
    - Update processing_status to 'preprocessing_complete'
    - Enqueue detect_voice_activity task

    - _Requirements: 2.4, 2.5, 12.3_



- [ ] 5. Implement Voice Activity Detection (VAD) stage
  - [ ] 5.1 Create detect_voice_activity Celery task
    - Load preprocessed audio file

    - Apply WebRTC VAD with aggressiveness level 2

    - Identify speech segments with start/end timestamps
    - Calculate total speech duration
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 5.2 Store VAD results and route to next stage
    - Update audio_chunks document with vad_results

    - If speech detected, enqueue diarize_speakers task
    - If no speech, mark chunk as silent and skip further processing
    - Update processing_status accordingly
    - _Requirements: 3.4, 3.5_



- [x] 6. Implement speaker diarization stage

  - [ ] 6.1 Create diarize_speakers Celery task
    - Load preprocessed audio file
    - Load pyannote.audio diarization pipeline

    - Apply diarization to identify speakers

    - Assign speaker labels to segments
    - Calculate speaking time per speaker
    - _Requirements: 4.1, 4.2, 4.3, 4.4_


  - [ ] 6.2 Store diarization results and route to ASR
    - Update audio_chunks document with diarization_results

    - Enqueue transcribe_audio task
    - Update processing_status to 'diarization_complete'
    - _Requirements: 4.5_



- [x] 7. Implement Automatic Speech Recognition (ASR) stage

  - [ ] 7.1 Create transcribe_audio Celery task
    - Load preprocessed audio file
    - Load diarization results from database
    - Load Whisper ASR model (whisper-base)
    - Transcribe audio with language detection
    - _Requirements: 5.1, 5.4_






  - [ ] 7.2 Align transcriptions with speaker labels
    - Match transcription timestamps with diarization segments
    - Assign speaker labels to each transcribed phrase
    - Calculate confidence scores
    - Store transcriptions array in audio_chunks document
    - _Requirements: 5.2, 5.3, 5.5_


  - [ ] 7.3 Route to suspicion detection
    - Enqueue detect_suspicion task
    - Update processing_status to 'transcription_complete'



    - _Requirements: 5.5_

- [ ] 8. Implement suspicion detection and flag generation
  - [ ] 8.1 Create detect_suspicion Celery task
    - Load transcriptions and diarization results



    - Load quiz-specific suspicious keywords from database
    - Scan transcriptions for keyword matches
    - Count keyword occurrences by category
    - _Requirements: 6.1, 6.2_






  - [x] 8.2 Calculate suspicion score and determine severity


    - Calculate score based on num_speakers, keyword_frequency, speech_overlap
    - Determine severity level (low/medium/high) based on threshold
    - Generate reasons list for flag
    - _Requirements: 6.4_

  - [x] 8.3 Create flag and send notifications


    - If suspicion score exceeds threshold, create flag in flags collection
    - Include audio_data with chunk_id, transcription, num_speakers, keywords_found
    - Send WebSocket notification to monitoring teachers


    - Update audio_chunks document with suspicion_results
    - Update processing_status to 'completed'

    - _Requirements: 6.3, 6.5, 9.2, 9.3_




- [ ] 9. Implement error handling and retry logic
  - [ ] 9.1 Add error handling to all Celery tasks
    - Wrap task logic in try-except blocks
    - Log errors with chunk_id and stage information
    - Update processing_status to 'failed' on error



    - Implement retry logic with exponential backoff (max 3 retries)
    - _Requirements: 12.3, 12.4_


  - [x] 9.2 Implement monitoring and alerting





    - Track processing metrics (latency, error rate, success rate)
    - Send administrator alerts when error rate exceeds 5%

    - Log performance warnings when latency exceeds 30 seconds
    - _Requirements: 9.4, 12.4_

- [ ] 10. Extend WebSocket consumer for audio notifications
  - [x] 10.1 Add audio flag notification handler


    - Extend MonitoringConsumer to handle audio_flag message type
    - Implement flag_notification method for audio flags

    - Include transcription, speaker count, and severity in notification

    - _Requirements: 9.2, 9.3_


  - [x] 10.2 Implement audio playback URL generation


    - Add request_audio_playback action handler



    - Generate presigned URL for audio file access

    - Return audio_playback_url message with expiring URL
    - Implement access control (only quiz teacher can access)
    - _Requirements: 8.3_






- [ ] 11. Create frontend AudioRecorder component
  - [ ] 11.1 Implement microphone permission and consent flow
    - Create consent dialog explaining audio recording


    - Request microphone permission using navigator.mediaDevices.getUserMedia
    - Display error message if permission denied
    - Record consent timestamp


    - Display recording indicator when active


    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 11.2 Implement audio capture with MediaRecorder API

    - Initialize MediaRecorder with appropriate codec (Opus/WebM)



    - Capture audio in 5-second chunks using timeslice
    - Handle ondataavailable event to collect chunks
    - Stop recording when exam is submitted or completed

    - _Requirements: 1.1, 1.2, 1.5_


  - [x] 11.3 Implement chunk upload with retry logic


    - Convert audio blob to base64 for upload
    - POST audio chunk to /api/audio/upload endpoint

    - Implement retry logic with exponential backoff (max 3 retries)
    - Buffer failed chunks locally (max 50 chunks)
    - Resume upload when connectivity restored

    - _Requirements: 1.3, 12.1, 12.2_




  - [ ] 11.4 Integrate AudioRecorder into QuizInterface
    - Add AudioRecorder component to QuizInterface
    - Pass quizId and studentId as props
    - Check if audio proctoring is enabled for quiz
    - Start recording when quiz starts


    - Stop recording when quiz ends
    - _Requirements: 1.1, 1.5_


- [x] 12. Create teacher dashboard audio components


  - [ ] 12.1 Create AudioFlagCard component
    - Display flag severity badge and timestamp
    - Show transcription text with speaker labels
    - Highlight detected keywords in transcription
    - Display speaker count badge
    - Add audio playback controls (play/pause/seek)

    - Implement expand/collapse for full details
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 12.2 Create AudioTimeline component

    - Display visual timeline of exam duration

    - Add flag markers at occurrence times
    - Color-code markers by severity (red/orange/yellow)
    - Implement hover preview of transcription
    - Add click handler to jump to flag details
    - Implement filter by flag type

    - _Requirements: 8.5_

  - [ ] 12.3 Integrate audio components into FlagMonitor
    - Add audio flag filtering to existing FlagMonitor
    - Display AudioFlagCard for audio flags

    - Add AudioTimeline view option

    - Update real-time WebSocket handler for audio flags
    - _Requirements: 8.1, 8.4, 9.2_

- [ ] 13. Implement quiz configuration UI for audio proctoring
  - [ ] 13.1 Add audio proctoring settings to QuizCreator
    - Add toggle to enable/disable audio proctoring

    - Add custom keywords input field (comma-separated)
    - Add suspicion threshold slider (0.0 - 1.0)
    - Add language selection dropdown
    - Display default keywords with option to modify
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_



  - [ ] 13.2 Update quiz creation/update API to handle audio settings
    - Validate audio_proctoring settings in quiz creation
    - Store audio settings in quizzes collection
    - Return audio settings in quiz details API
    - _Requirements: 10.1, 10.2, 10.3_


- [ ] 14. Implement audio file storage and cleanup
  - [ ] 14.1 Create storage utility functions
    - Implement save_audio_file function with directory creation
    - Implement get_audio_file_path function
    - Implement delete_audio_file function with secure deletion
    - Add file size validation and error handling


    - _Requirements: 7.1, 7.4_


  - [ ] 14.2 Create Celery beat task for automatic cleanup
    - Create cleanup_expired_audio periodic task
    - Query audio_chunks older than retention period (90 days)
    - Delete audio files from storage

    - Update database records or delete documents
    - Log cleanup operations
    - _Requirements: 7.4, 7.5_

- [ ] 15. Implement audio configuration management
  - [ ] 15.1 Create audio_config.py utility module
    - Define AUDIO_CONFIG dictionary with all settings

    - Implement get_audio_config function
    - Implement get_quiz_keywords function (default + custom)
    - Implement get_suspicion_threshold function
    - _Requirements: 10.2, 10.3, 10.4_

  - [ ] 15.2 Create default keyword lists
    - Define DEFAULT_KEYWORDS by category (help_seeking, collaboration, cheating, question_discussion)
    - Implement keyword matching logic (case-insensitive, partial match)
    - _Requirements: 6.2, 10.4_

- [ ] 16. Add audio proctoring to student consent and privacy
  - [ ] 16.1 Create privacy policy document for audio recording
    - Write privacy policy explaining audio data collection
    - Explain data usage, storage, and retention
    - Explain access rights and deletion process
    - Add link to privacy policy in consent dialog
    - _Requirements: 11.5_

  - [ ] 16.2 Implement consent tracking
    - Store consent_given and consent_timestamp in audio_sessions
    - Prevent exam access if consent declined
    - Notify teacher when student declines consent
    - _Requirements: 11.2, 11.3_

- [ ] 17. Create audio processing status API endpoints
  - [ ] 17.1 Create endpoint to get audio session status
    - Implement GET /api/audio/session/{session_id} endpoint
    - Return session details with processing statistics
    - Include total_chunks, processed_chunks, failed_chunks, total_flags
    - _Requirements: 9.4_

  - [ ] 17.2 Create endpoint to get audio chunk details
    - Implement GET /api/audio/chunk/{chunk_id} endpoint
    - Return chunk processing results (VAD, diarization, transcription, suspicion)
    - Include processing_status and timestamps
    - Implement access control (teacher of quiz only)
    - _Requirements: 8.2, 8.3_

- [ ] 18. Implement audio playback functionality
  - [ ] 18.1 Create audio file serving endpoint
    - Implement GET /api/audio/play/{chunk_id} endpoint
    - Generate presigned URL or stream audio file
    - Implement access control and expiration
    - Support range requests for seeking
    - _Requirements: 8.3_

  - [ ] 18.2 Create AudioPlayer component
    - Implement audio player with play/pause/seek controls
    - Display waveform visualization
    - Show current time and duration
    - Highlight transcription text synchronized with playback
    - _Requirements: 8.3_

- [ ] 19. Add comprehensive logging and monitoring
  - [ ] 19.1 Implement structured logging for audio pipeline
    - Log audio upload events with metadata
    - Log processing stage completion with timing
    - Log errors with full context
    - Log flag generation events
    - _Requirements: 12.3, 12.4_

  - [ ] 19.2 Create monitoring dashboard metrics
    - Track upload success rate metric
    - Track processing latency per stage metric
    - Track error rate by type metric
    - Track active recording sessions metric
    - Track storage usage metric
    - _Requirements: 9.4, 12.4, 12.5_

- [ ] 20. Write integration tests for audio pipeline
  - [ ] 20.1 Create test audio files and fixtures
    - Create sample audio files (silence, single speaker, multiple speakers)
    - Create test quiz with audio proctoring enabled
    - Create test student and teacher accounts
    - _Requirements: All_

  - [ ] 20.2 Write end-to-end audio processing tests
    - Test audio upload endpoint
    - Test complete processing pipeline
    - Test flag generation for multiple speakers
    - Test flag generation for keywords
    - Test WebSocket notification delivery
    - _Requirements: All_

  - [ ] 20.3 Write error handling and edge case tests
    - Test invalid audio format handling
    - Test network failure retry logic
    - Test processing failure recovery
    - Test concurrent processing
    - Test storage failure handling
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
