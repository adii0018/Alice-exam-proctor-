import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioFlagCard({ flag }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle new flag structure for audio monitoring (no recording)
  const audioMetrics = flag.audio_metrics || {}
  const detectionType = flag.detection_type || flag.type
  const flagReason = flag.flag_reason || flag.description

  // Severity colors
  const severityColors = {
    low: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
    medium: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    high: 'from-red-500/20 to-red-600/20 border-red-500/30'
  }

  const severityBadgeColors = {
    low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  // Get flag type display info
  const getFlagTypeInfo = (type) => {
    const typeMap = {
      'sudden_noise': { icon: '📢', label: 'Sudden Noise', color: 'orange' },
      'multiple_voices': { icon: '👥', label: 'Multiple Voices', color: 'red' },
      'background_noise': { icon: '🔊', label: 'Background Noise', color: 'yellow' },
      'continuous_talking': { icon: '💬', label: 'Continuous Talking', color: 'red' },
      'phone_ring': { icon: '📱', label: 'Phone Ring', color: 'orange' }
    }
    return typeMap[type] || { icon: '🔊', label: 'Audio Detection', color: 'gray' }
  }

  const typeInfo = getFlagTypeInfo(detectionType)

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-xl bg-gradient-to-br ${severityColors[flag.severity]} border rounded-xl p-4 shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-xl">{typeInfo.icon}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              {typeInfo.label}
              <span className={`text-xs px-2 py-0.5 rounded-full border ${severityBadgeColors[flag.severity]}`}>
                {flag.severity.toUpperCase()}
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              🕐 {formatTimestamp(flag.timestamp)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </button>
      </div>

      {/* Quick Info */}
      <div className="flex items-center gap-4 mb-3">
        {audioMetrics.volume_level && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Peak Volume:</span>
            <span className={`font-semibold ${audioMetrics.volume_level > 100 ? 'text-red-400' : 'text-yellow-400'}`}>
              {audioMetrics.volume_level}
            </span>
          </div>
        )}
        
        {audioMetrics.average_volume && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Avg Volume:</span>
            <span className="text-blue-400 font-semibold">{audioMetrics.average_volume}</span>
          </div>
        )}
      </div>

      {/* Flag Reason */}
      <div className="bg-black/30 rounded-lg p-3 mb-3">
        <p className="text-gray-300 text-sm">
          <strong>Detected:</strong> {flagReason}
        </p>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 pt-3 space-y-3">
              {/* Audio Metrics Details */}
              {audioMetrics.frequency_analysis && (
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Frequency Analysis:</h4>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-400">Low Freq</div>
                        <div className="text-blue-400 font-semibold">{audioMetrics.frequency_analysis.low}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Mid Freq</div>
                        <div className="text-green-400 font-semibold">{audioMetrics.frequency_analysis.mid}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">High Freq</div>
                        <div className="text-purple-400 font-semibold">{audioMetrics.frequency_analysis.high}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detection Details */}
              <div>
                <h4 className="text-white font-semibold mb-2 text-sm">Detection Details:</h4>
                <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-300">
                  <div className="space-y-1">
                    <div><strong>Type:</strong> {detectionType}</div>
                    <div><strong>Timestamp:</strong> {formatTimestamp(flag.timestamp)}</div>
                    <div><strong>Severity:</strong> {flag.severity}</div>
                    {flag.reviewed !== undefined && (
                      <div><strong>Reviewed:</strong> {flag.reviewed ? 'Yes' : 'No'}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* No Audio Playback - Monitoring Only */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-400 text-sm">
                  <span>ℹ️</span>
                  <span>Audio monitoring only - no recordings available for playback</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
