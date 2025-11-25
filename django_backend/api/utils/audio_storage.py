"""
Audio file storage utilities
"""
import os
import uuid
import base64
from pathlib import Path
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def save_audio_file(audio_data, quiz_id, student_id, file_extension='webm'):
    """
    Save audio file to storage
    
    Args:
        audio_data (bytes or str): Audio data (bytes or base64 string)
        quiz_id (str): Quiz ID
        student_id (str): Student ID
        file_extension (str): File extension
        
    Returns:
        tuple: (chunk_id, file_path) or (None, None) on error
    """
    try:
        # Generate unique chunk ID
        chunk_id = str(uuid.uuid4())
        
        # Create directory structure
        storage_dir = settings.AUDIO_STORAGE_ROOT / 'raw' / quiz_id / student_id
        os.makedirs(storage_dir, exist_ok=True)
        
        # File path
        file_path = storage_dir / f"{chunk_id}.{file_extension}"
        
        # Decode base64 if needed
        if isinstance(audio_data, str):
            audio_bytes = base64.b64decode(audio_data)
        else:
            audio_bytes = audio_data
        
        # Validate file size
        max_size = settings.AUDIO_CONFIG['storage']['max_chunk_size_mb'] * 1024 * 1024
        if len(audio_bytes) > max_size:
            logger.error(f"Audio chunk too large: {len(audio_bytes)} bytes")
            return None, None
        
        # Write file
        with open(file_path, 'wb') as f:
            f.write(audio_bytes)
        
        logger.info(f"Saved audio chunk {chunk_id} to {file_path}")
        return chunk_id, str(file_path)
        
    except Exception as e:
        logger.error(f"Error saving audio file: {e}")
        return None, None


def get_audio_file_path(chunk_id, quiz_id, student_id, audio_type='raw'):
    """
    Get path to audio file
    
    Args:
        chunk_id (str): Chunk ID
        quiz_id (str): Quiz ID
        student_id (str): Student ID
        audio_type (str): 'raw' or 'preprocessed'
        
    Returns:
        Path: Path to audio file or None if not found
    """
    try:
        # Try different extensions
        extensions = ['webm', 'wav', 'mp3', 'ogg']
        
        for ext in extensions:
            file_path = settings.AUDIO_STORAGE_ROOT / audio_type / quiz_id / student_id / f"{chunk_id}.{ext}"
            if file_path.exists():
                return file_path
        
        logger.warning(f"Audio file not found for chunk {chunk_id}")
        return None
        
    except Exception as e:
        logger.error(f"Error getting audio file path: {e}")
        return None


def delete_audio_file(file_path):
    """
    Securely delete audio file
    
    Args:
        file_path (str or Path): Path to audio file
        
    Returns:
        bool: True if deleted, False otherwise
    """
    try:
        file_path = Path(file_path)
        
        if not file_path.exists():
            logger.warning(f"File not found: {file_path}")
            return False
        
        # Overwrite with zeros before deletion (secure deletion)
        file_size = file_path.stat().st_size
        with open(file_path, 'wb') as f:
            f.write(b'\x00' * file_size)
        
        # Delete file
        file_path.unlink()
        
        logger.info(f"Deleted audio file: {file_path}")
        return True
        
    except Exception as e:
        logger.error(f"Error deleting audio file: {e}")
        return False


def get_storage_stats():
    """
    Get storage statistics
    
    Returns:
        dict: Storage statistics
    """
    try:
        stats = {
            'raw_files': 0,
            'preprocessed_files': 0,
            'total_size_mb': 0
        }
        
        # Count raw files
        raw_dir = settings.AUDIO_STORAGE_ROOT / 'raw'
        if raw_dir.exists():
            for file_path in raw_dir.rglob('*'):
                if file_path.is_file():
                    stats['raw_files'] += 1
                    stats['total_size_mb'] += file_path.stat().st_size / (1024 * 1024)
        
        # Count preprocessed files
        preprocessed_dir = settings.AUDIO_STORAGE_ROOT / 'preprocessed'
        if preprocessed_dir.exists():
            for file_path in preprocessed_dir.rglob('*'):
                if file_path.is_file():
                    stats['preprocessed_files'] += 1
                    stats['total_size_mb'] += file_path.stat().st_size / (1024 * 1024)
        
        stats['total_size_mb'] = round(stats['total_size_mb'], 2)
        return stats
        
    except Exception as e:
        logger.error(f"Error getting storage stats: {e}")
        return {'error': str(e)}
