"""
Celery tasks for audio processing pipeline
NOTE: Audio processing features require additional libraries (librosa, noisereduce, pydub, whisper)
These are optional and the system will work without them (audio features will be disabled)
"""
from celery import shared_task
from datetime import datetime
from pathlib import Path
import logging

from django.conf import settings
from api.models import audio_chunks_collection
from api.utils.audio_storage import get_audio_file_path

logger = logging.getLogger(__name__)

# Check if audio processing libraries are available
AUDIO_PROCESSING_AVAILABLE = False
try:
    import librosa
    import soundfile as sf
    import noisereduce as nr
    from pydub import AudioSegment
    import numpy as np
    AUDIO_PROCESSING_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Audio processing libraries not available: {e}. Audio proctoring features will be disabled.")


@shared_task(bind=True, max_retries=3)
def preprocess_audio_chunk(self, chunk_id):
    """
    Preprocess audio chunk: convert to WAV, denoise, normalize
    
    Args:
        chunk_id (str): Audio chunk ID
    """
    if not AUDIO_PROCESSING_AVAILABLE:
        logger.error(f"Audio processing libraries not available. Cannot process chunk: {chunk_id}")
        return {'error': 'Audio processing not available'}
    
    try:
        logger.info(f"Starting preprocessing for chunk: {chunk_id}")
        
        # Get chunk document
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        if not chunk:
            logger.error(f"Chunk not found: {chunk_id}")
            return
        
        # Update status
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'preprocessing',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Get file path
        raw_file_path = Path(chunk['file_path'])
        if not raw_file_path.exists():
            raise FileNotFoundError(f"Audio file not found: {raw_file_path}")
        
        # Load audio file
        logger.info(f"Loading audio file: {raw_file_path}")
        
        # Convert to WAV using pydub (handles various formats)
        audio = AudioSegment.from_file(str(raw_file_path))
        
        # Convert to mono
        if audio.channels > 1:
            audio = audio.set_channels(1)
        
        # Set sample rate to 16kHz
        audio = audio.set_frame_rate(16000)
        
        # Export to temporary WAV file
        temp_wav = raw_file_path.parent / f"{chunk_id}_temp.wav"
        audio.export(str(temp_wav), format='wav')
        
        # Load with librosa for processing
        y, sr = librosa.load(str(temp_wav), sr=16000, mono=True)
        
        # Apply noise reduction
        logger.info(f"Applying noise reduction for chunk: {chunk_id}")
        y_denoised = nr.reduce_noise(y=y, sr=sr, prop_decrease=0.8)
        
        # Normalize audio
        logger.info(f"Normalizing audio for chunk: {chunk_id}")
        y_normalized = librosa.util.normalize(y_denoised)
        
        # Save preprocessed audio
        preprocessed_dir = settings.AUDIO_STORAGE_ROOT / 'preprocessed' / chunk['quiz_id'] / chunk['student_id']
        preprocessed_dir.mkdir(parents=True, exist_ok=True)
        
        preprocessed_path = preprocessed_dir / f"{chunk_id}.wav"
        sf.write(str(preprocessed_path), y_normalized, sr)
        
        # Clean up temp file
        temp_wav.unlink()
        
        # Calculate duration
        duration = len(y_normalized) / sr
        
        # Update database
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'preprocessed_path': str(preprocessed_path),
                    'duration': duration,
                    'processing_status': 'preprocessing_complete',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Preprocessing complete for chunk: {chunk_id}")
        
        # Trigger next stage: VAD
        detect_voice_activity.delay(chunk_id)
        
    except Exception as e:
        logger.error(f"Error preprocessing chunk {chunk_id}: {e}")
        
        # Update status to failed
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'failed',
                    'error_message': str(e),
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Retry task
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def detect_voice_activity(self, chunk_id):
    """
    Detect voice activity in audio chunk
    
    Args:
        chunk_id (str): Audio chunk ID
    """
    try:
        logger.info(f"Starting VAD for chunk: {chunk_id}")
        
        # Get chunk document
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        if not chunk:
            logger.error(f"Chunk not found: {chunk_id}")
            return
        
        # Update status
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'vad',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Load preprocessed audio
        preprocessed_path = Path(chunk['preprocessed_path'])
        if not preprocessed_path.exists():
            raise FileNotFoundError(f"Preprocessed audio not found: {preprocessed_path}")
        
        y, sr = librosa.load(str(preprocessed_path), sr=16000, mono=True)
        
        # Simple energy-based VAD (placeholder for webrtcvad)
        # Calculate frame energy
        frame_length = int(0.03 * sr)  # 30ms frames
        hop_length = frame_length // 2
        
        # Calculate RMS energy for each frame
        rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
        
        # Threshold for speech detection
        threshold = np.mean(rms) * 0.5
        
        # Detect speech segments
        speech_frames = rms > threshold
        
        # Convert frames to time segments
        speech_segments = []
        in_speech = False
        start_time = 0
        
        for i, is_speech in enumerate(speech_frames):
            time = i * hop_length / sr
            
            if is_speech and not in_speech:
                start_time = time
                in_speech = True
            elif not is_speech and in_speech:
                speech_segments.append({
                    'start': round(start_time, 2),
                    'end': round(time, 2)
                })
                in_speech = False
        
        # Close last segment if still in speech
        if in_speech:
            speech_segments.append({
                'start': round(start_time, 2),
                'end': round(len(y) / sr, 2)
            })
        
        # Calculate total speech duration
        total_speech_duration = sum(seg['end'] - seg['start'] for seg in speech_segments)
        has_speech = total_speech_duration > 0.5  # At least 0.5 seconds of speech
        
        # Store VAD results
        vad_results = {
            'has_speech': has_speech,
            'speech_segments': speech_segments,
            'total_speech_duration': round(total_speech_duration, 2)
        }
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'vad_results': vad_results,
                    'processing_status': 'vad_complete',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        logger.info(f"VAD complete for chunk: {chunk_id}, has_speech: {has_speech}")
        
        # If speech detected, trigger diarization
        if has_speech:
            diarize_speakers.delay(chunk_id)
        else:
            # Mark as completed (no further processing needed)
            audio_chunks_collection.update_one(
                {'chunk_id': chunk_id},
                {'$set': {'processing_status': 'completed'}}
            )
            logger.info(f"No speech detected in chunk: {chunk_id}, skipping further processing")
        
    except Exception as e:
        logger.error(f"Error in VAD for chunk {chunk_id}: {e}")
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'failed',
                    'error_message': str(e),
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def diarize_speakers(self, chunk_id):
    """
    Perform speaker diarization
    
    Args:
        chunk_id (str): Audio chunk ID
    """
    try:
        logger.info(f"Starting diarization for chunk: {chunk_id}")
        
        # Get chunk document
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        if not chunk:
            logger.error(f"Chunk not found: {chunk_id}")
            return
        
        # Update status
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'diarization',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Load preprocessed audio
        preprocessed_path = Path(chunk['preprocessed_path'])
        if not preprocessed_path.exists():
            raise FileNotFoundError(f"Preprocessed audio not found: {preprocessed_path}")
        
        # Simple speaker counting based on spectral clustering (placeholder for pyannote.audio)
        y, sr = librosa.load(str(preprocessed_path), sr=16000, mono=True)
        
        # Extract MFCC features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        
        # Simple heuristic: if variance in MFCCs is high, likely multiple speakers
        mfcc_variance = np.var(mfccs, axis=1).mean()
        
        # Threshold for multiple speakers (this is a simplified approach)
        num_speakers = 2 if mfcc_variance > 100 else 1
        
        # Create speaker segments based on VAD results
        vad_results = chunk.get('vad_results', {})
        speech_segments = vad_results.get('speech_segments', [])
        
        speaker_segments = []
        speaker_durations = {}
        
        for i, segment in enumerate(speech_segments):
            speaker_label = f"SPEAKER_{i % num_speakers:02d}"
            speaker_segments.append({
                'speaker': speaker_label,
                'start': segment['start'],
                'end': segment['end']
            })
            
            duration = segment['end'] - segment['start']
            speaker_durations[speaker_label] = speaker_durations.get(speaker_label, 0) + duration
        
        # Store diarization results
        diarization_results = {
            'num_speakers': num_speakers,
            'speaker_segments': speaker_segments,
            'speaker_durations': {k: round(v, 2) for k, v in speaker_durations.items()}
        }
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'diarization_results': diarization_results,
                    'processing_status': 'diarization_complete',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Diarization complete for chunk: {chunk_id}, speakers: {num_speakers}")
        
        # Trigger transcription
        transcribe_audio.delay(chunk_id)
        
    except Exception as e:
        logger.error(f"Error in diarization for chunk {chunk_id}: {e}")
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'failed',
                    'error_message': str(e),
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def transcribe_audio(self, chunk_id):
    """
    Transcribe audio using Whisper ASR
    
    Args:
        chunk_id (str): Audio chunk ID
    """
    try:
        logger.info(f"Starting transcription for chunk: {chunk_id}")
        
        # Get chunk document
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        if not chunk:
            logger.error(f"Chunk not found: {chunk_id}")
            return
        
        # Update status
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'transcription',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Load preprocessed audio
        preprocessed_path = Path(chunk['preprocessed_path'])
        if not preprocessed_path.exists():
            raise FileNotFoundError(f"Preprocessed audio not found: {preprocessed_path}")
        
        # Load Whisper model (using base model for speed)
        import whisper
        model = whisper.load_model(settings.AUDIO_CONFIG['processing']['asr_model'])
        
        # Transcribe
        result = model.transcribe(
            str(preprocessed_path),
            language=None,  # Auto-detect
            task='transcribe',
            temperature=0.0
        )
        
        # Get diarization results
        diarization_results = chunk.get('diarization_results', {})
        speaker_segments = diarization_results.get('speaker_segments', [])
        
        # Align transcription with speaker segments
        transcriptions = []
        
        for segment in result.get('segments', []):
            # Find matching speaker
            speaker = 'SPEAKER_00'
            for sp_seg in speaker_segments:
                if sp_seg['start'] <= segment['start'] <= sp_seg['end']:
                    speaker = sp_seg['speaker']
                    break
            
            transcriptions.append({
                'speaker': speaker,
                'start': round(segment['start'], 2),
                'end': round(segment['end'], 2),
                'text': segment['text'].strip(),
                'confidence': round(segment.get('confidence', 0.9), 2)
            })
        
        # Store transcriptions
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'transcriptions': transcriptions,
                    'processing_status': 'transcription_complete',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Transcription complete for chunk: {chunk_id}")
        
        # Trigger suspicion detection
        detect_suspicion.delay(chunk_id)
        
    except Exception as e:
        logger.error(f"Error in transcription for chunk {chunk_id}: {e}")
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'failed',
                    'error_message': str(e),
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        raise self.retry(exc=e, countdown=60)


@shared_task
def cleanup_expired_audio():
    """
    Periodic task to cleanup expired audio files
    Runs daily to delete audio older than retention period
    """
    try:
        from datetime import timedelta
        
        logger.info("Starting audio cleanup task")
        
        retention_days = settings.AUDIO_CONFIG['storage']['retention_days']
        cutoff_date = datetime.utcnow() - timedelta(days=retention_days)
        
        # Find expired chunks
        expired_chunks = audio_chunks_collection.find({
            'created_at': {'$lt': cutoff_date}
        })
        
        deleted_count = 0
        for chunk in expired_chunks:
            try:
                # Delete audio files
                from api.utils.audio_storage import delete_audio_file
                
                if chunk.get('file_path'):
                    delete_audio_file(chunk['file_path'])
                
                if chunk.get('preprocessed_path'):
                    delete_audio_file(chunk['preprocessed_path'])
                
                # Delete database record
                audio_chunks_collection.delete_one({'_id': chunk['_id']})
                deleted_count += 1
                
            except Exception as e:
                logger.error(f"Error deleting chunk {chunk.get('chunk_id')}: {e}")
        
        logger.info(f"Audio cleanup complete: deleted {deleted_count} chunks")
        return {'deleted_count': deleted_count}
        
    except Exception as e:
        logger.error(f"Error in cleanup task: {e}")
        return {'error': str(e)}


@shared_task(bind=True, max_retries=3)
def detect_suspicion(self, chunk_id):
    """
    Detect suspicious patterns and generate flags
    
    Args:
        chunk_id (str): Audio chunk ID
    """
    try:
        logger.info(f"Starting suspicion detection for chunk: {chunk_id}")
        
        # Get chunk document
        chunk = audio_chunks_collection.find_one({'chunk_id': chunk_id})
        if not chunk:
            logger.error(f"Chunk not found: {chunk_id}")
            return
        
        # Update status
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'suspicion_detection',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Get processing results
        transcriptions = chunk.get('transcriptions', [])
        diarization_results = chunk.get('diarization_results', {})
        num_speakers = diarization_results.get('num_speakers', 1)
        
        # Get quiz keywords
        from api.utils.audio_config import (
            get_quiz_keywords,
            get_suspicion_threshold,
            calculate_suspicion_score,
            get_severity_level
        )
        
        keywords = get_quiz_keywords(chunk['quiz_id'])
        threshold = get_suspicion_threshold(chunk['quiz_id'])
        
        # Scan for keywords
        keywords_found = []
        total_words = 0
        
        full_text = ' '.join([t['text'] for t in transcriptions]).lower()
        words = full_text.split()
        total_words = len(words)
        
        for keyword in keywords:
            if keyword.lower() in full_text:
                keywords_found.append(keyword)
        
        # Calculate overlap duration (simplified)
        overlap_duration = 0
        
        # Calculate suspicion score
        score = calculate_suspicion_score(
            num_speakers=num_speakers,
            keyword_matches=len(keywords_found),
            total_words=total_words,
            overlap_duration=overlap_duration,
            total_duration=chunk.get('duration', 5.0)
        )
        
        severity = get_severity_level(score)
        
        # Generate reasons
        reasons = []
        if num_speakers > 1:
            reasons.append(f"Multiple speakers detected ({num_speakers})")
        if keywords_found:
            reasons.append(f"Suspicious keywords found: {', '.join(keywords_found[:3])}")
        
        # Store suspicion results
        suspicion_results = {
            'score': round(score, 3),
            'severity': severity,
            'reasons': reasons,
            'keywords_found': keywords_found
        }
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'suspicion_results': suspicion_results,
                    'processing_status': 'completed',
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        logger.info(f"Suspicion detection complete for chunk: {chunk_id}, score: {score}")
        
        # Create flag if threshold exceeded
        if score >= threshold:
            from api.models import flags_collection, audio_sessions_collection
            
            flag_type = 'audio_multiple_speakers' if num_speakers > 1 else 'audio_keywords'
            description = f"Audio violation: {', '.join(reasons)}"
            
            # Create transcription text
            transcription_text = '\n'.join([
                f"[{t['speaker']}]: {t['text']}"
                for t in transcriptions
            ])
            
            flag_doc = {
                'student_id': chunk['student_id'],
                'quiz_id': chunk['quiz_id'],
                'type': flag_type,
                'description': description,
                'timestamp': chunk['timestamp'],
                'severity': severity,
                'resolved': False,
                'count': 1,
                'audio_data': {
                    'chunk_id': chunk_id,
                    'transcription': transcription_text,
                    'num_speakers': num_speakers,
                    'keywords_found': keywords_found,
                    'audio_url': None  # Will be generated on request
                }
            }
            
            result = flags_collection.insert_one(flag_doc)
            flag_id = str(result.inserted_id)
            
            logger.info(f"Created audio flag: {flag_id}")
            
            # Update session flag count
            audio_sessions_collection.update_one(
                {'session_id': chunk['session_id']},
                {'$inc': {'total_flags': 1}}
            )
            
            # Send WebSocket notification
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            
            channel_layer = get_channel_layer()
            
            flag_notification = {
                'type': 'audio_flag',
                'flag': {
                    'flag_id': flag_id,
                    'student_id': chunk['student_id'],
                    'quiz_id': chunk['quiz_id'],
                    'severity': severity,
                    'transcription': transcription_text[:200],  # First 200 chars
                    'num_speakers': num_speakers,
                    'timestamp': chunk['timestamp'].isoformat()
                }
            }
            
            async_to_sync(channel_layer.group_send)(
                f"quiz_{chunk['quiz_id']}",
                flag_notification
            )
            
            logger.info(f"Sent WebSocket notification for flag: {flag_id}")
        
        # Update session processed count
        from api.models import audio_sessions_collection
        audio_sessions_collection.update_one(
            {'session_id': chunk['session_id']},
            {'$inc': {'processed_chunks': 1}}
        )
        
    except Exception as e:
        logger.error(f"Error in suspicion detection for chunk {chunk_id}: {e}")
        
        audio_chunks_collection.update_one(
            {'chunk_id': chunk_id},
            {
                '$set': {
                    'processing_status': 'failed',
                    'error_message': str(e),
                    'updated_at': datetime.utcnow()
                }
            }
        )
        
        # Update session failed count
        from api.models import audio_sessions_collection
        audio_sessions_collection.update_one(
            {'session_id': chunk['session_id']},
            {'$inc': {'failed_chunks': 1}}
        )
        
        raise self.retry(exc=e, countdown=60)
