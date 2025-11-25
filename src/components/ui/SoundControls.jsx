// Sound Controls Component - Sound settings ke liye
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toggleSound, setVolume, getSoundSettings, playInfo } from '../../utils/soundUtils';

export default function SoundControls({ className = '' }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.5);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Load sound settings from localStorage
    const savedSettings = localStorage.getItem('soundSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSoundEnabled(settings.enabled);
      setVolumeState(settings.volume);
      setVolume(settings.volume);
    }
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
    
    // Save to localStorage
    const settings = { enabled: newState, volume };
    localStorage.setItem('soundSettings', JSON.stringify(settings));
  };

  const handleVolumeChange = (newVolume) => {
    setVolumeState(newVolume);
    setVolume(newVolume);
    
    // Save to localStorage
    const settings = { enabled: soundEnabled, volume: newVolume };
    localStorage.setItem('soundSettings', JSON.stringify(settings));
    
    // Play test sound
    playInfo();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Sound Toggle Button */}
      <motion.button
        onClick={() => setShowControls(!showControls)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
          soundEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={soundEnabled ? 'Sound On' : 'Sound Off'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Sound Controls Panel */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="absolute top-12 right-0 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-4 shadow-2xl w-64 z-50"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">🔊 Sound Settings</h3>
              <button
                onClick={() => setShowControls(false)}
                className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Enable Sounds</span>
              <button
                onClick={handleToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5"
                  animate={{ x: soundEnabled ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Volume Control */}
            {soundEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Volume</span>
                  <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            {/* Sound Test Buttons */}
            {soundEnabled && (
              <div className="space-y-2">
                <div className="text-sm text-gray-700 mb-2">Test Sounds:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => import('../../utils/soundUtils').then(m => m.playSuccess())}
                    className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    ✅ Success
                  </button>
                  <button
                    onClick={() => import('../../utils/soundUtils').then(m => m.playError())}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    ❌ Error
                  </button>
                  <button
                    onClick={() => import('../../utils/soundUtils').then(m => m.playWarning())}
                    className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    ⚠️ Warning
                  </button>
                  <button
                    onClick={() => import('../../utils/soundUtils').then(m => m.playViolation())}
                    className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    🚨 Violation
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}