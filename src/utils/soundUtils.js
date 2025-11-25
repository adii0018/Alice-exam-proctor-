// Sound Utility - Different notification sounds ke liye
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
    
    // Initialize audio context
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      // Create audio context for better browser support
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  // Generate different types of notification sounds
  generateTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Volume envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Success sound - pleasant chime
  playSuccess() {
    if (!this.enabled) return;
    
    // Play a pleasant success chord
    setTimeout(() => this.generateTone(523.25, 0.2), 0);    // C5
    setTimeout(() => this.generateTone(659.25, 0.2), 100);  // E5
    setTimeout(() => this.generateTone(783.99, 0.3), 200);  // G5
  }

  // Error sound - alert tone
  playError() {
    if (!this.enabled) return;
    
    // Play alert sound
    this.generateTone(400, 0.15, 'square');
    setTimeout(() => this.generateTone(300, 0.15, 'square'), 150);
  }

  // Warning sound - attention beep
  playWarning() {
    if (!this.enabled) return;
    
    // Play warning beep
    this.generateTone(800, 0.1);
    setTimeout(() => this.generateTone(600, 0.1), 120);
  }

  // Info sound - gentle notification
  playInfo() {
    if (!this.enabled) return;
    
    // Play gentle notification
    this.generateTone(440, 0.15);
  }

  // Violation sound - urgent alert
  playViolation() {
    if (!this.enabled) return;
    
    // Play urgent violation sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.generateTone(1000, 0.1, 'square');
      }, i * 150);
    }
  }

  // Camera sound - camera shutter
  playCamera() {
    if (!this.enabled) return;
    
    // Simulate camera shutter sound
    this.generateTone(2000, 0.05, 'square');
    setTimeout(() => this.generateTone(1500, 0.05, 'square'), 50);
  }

  // Quiz start sound - fanfare
  playQuizStart() {
    if (!this.enabled) return;
    
    // Play quiz start fanfare
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((note, index) => {
      setTimeout(() => this.generateTone(note, 0.2), index * 100);
    });
  }

  // Quiz submit sound - completion
  playQuizSubmit() {
    if (!this.enabled) return;
    
    // Play completion sound
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => this.generateTone(note, 0.15), index * 80);
    });
  }

  // Time warning sound - clock ticking
  playTimeWarning() {
    if (!this.enabled) return;
    
    // Play ticking sound for time warning
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.generateTone(800, 0.05);
      }, i * 200);
    }
  }

  // Login sound - welcome chime
  playLogin() {
    if (!this.enabled) return;
    
    // Play welcome sound
    this.generateTone(440, 0.1);
    setTimeout(() => this.generateTone(554.37, 0.1), 100);
    setTimeout(() => this.generateTone(659.25, 0.2), 200);
  }

  // Logout sound - goodbye tone
  playLogout() {
    if (!this.enabled) return;
    
    // Play goodbye sound
    this.generateTone(659.25, 0.1);
    setTimeout(() => this.generateTone(554.37, 0.1), 100);
    setTimeout(() => this.generateTone(440, 0.2), 200);
  }

  // Button click sound - subtle click
  playClick() {
    if (!this.enabled) return;
    
    // Play subtle click sound
    this.generateTone(1200, 0.03, 'square');
  }

  // Hover sound - gentle beep
  playHover() {
    if (!this.enabled) return;
    
    // Play gentle hover sound
    this.generateTone(600, 0.02);
  }

  // Toggle sound on/off
  toggleSound() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playInfo(); // Play confirmation sound
    }
    return this.enabled;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Get current settings
  getSettings() {
    return {
      enabled: this.enabled,
      volume: this.volume
    };
  }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Export individual functions for easy use
export const playSuccess = () => soundManager.playSuccess();
export const playError = () => soundManager.playError();
export const playWarning = () => soundManager.playWarning();
export const playInfo = () => soundManager.playInfo();
export const playViolation = () => soundManager.playViolation();
export const playCamera = () => soundManager.playCamera();
export const playQuizStart = () => soundManager.playQuizStart();
export const playQuizSubmit = () => soundManager.playQuizSubmit();
export const playTimeWarning = () => soundManager.playTimeWarning();
export const playLogin = () => soundManager.playLogin();
export const playLogout = () => soundManager.playLogout();
export const playClick = () => soundManager.playClick();
export const playHover = () => soundManager.playHover();

export const toggleSound = () => soundManager.toggleSound();
export const setVolume = (volume) => soundManager.setVolume(volume);
export const getSoundSettings = () => soundManager.getSettings();

export default soundManager;