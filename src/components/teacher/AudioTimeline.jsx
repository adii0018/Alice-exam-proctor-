import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AudioTimeline({ flags, quizDuration, onFlagClick }) {
  const [hoveredFlag, setHoveredFlag] = useState(null)
  const [filterType, setFilterType] = useState('all')

  // Filter audio flags only
  const audioFlags = flags.filter(flag => 
    flag.type === 'audio_multiple_speakers' || flag.type === 'audio_keywords'
  )

  // Apply type filter
  const filteredFlags = filterType === 'all' 
    ? audioFlags 
    : audioFlags.filter(flag => flag.type === filterType)

  // Calculate position on timeline (0-100%)
  const getTimelinePosition = (timestamp) => {
    const flagTime = new Date(timestamp)
    const startTime = new Date(flags[0]?.timestamp || Date.now())
    const elapsed = (flagTime - startTime) / 1000 / 60 // minutes
    const position = (elapsed / quizDuration) * 100
    return Math.min(Math.max(position, 0), 100)
  }

  // Severity colors
  const severityColors = {
    low: 'bg-yellow-500',
    medium: 'bg-orange-500',
    high: 'bg-red-500'
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  return (
    <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text flex items-center gap-2">
            🎵 Audio Timeline
            <span className="text-sm text-text-secondary font-normal">
              ({filteredFlags.length} flags)
            </span>
          </h3>
          <p className="text-text-secondary text-sm">
            Visual timeline of audio violations during exam
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-theme ${
              filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('audio_multiple_speakers')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-theme ${
              filterType === 'audio_multiple_speakers'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface/80'
            }`}
          >
            Multiple Speakers
          </button>
          <button
            onClick={() => setFilterType('audio_keywords')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-theme ${
              filterType === 'audio_keywords'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface/80'
            }`}
          >
            Keywords
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Bar */}
        <div className="h-3 bg-surface rounded-full relative overflow-hidden border border-border">
          {/* Progress gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
          
          {/* Time markers */}
          <div className="absolute inset-0 flex justify-between px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-px h-full bg-border" />
            ))}
          </div>
        </div>

        {/* Flag Markers */}
        <div className="absolute inset-0 -top-1">
          {filteredFlags.map((flag, idx) => {
            const position = getTimelinePosition(flag.timestamp)
            
            return (
              <motion.div
                key={flag._id || idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.3 }}
                style={{ left: `${position}%` }}
                className="absolute -translate-x-1/2 cursor-pointer"
                onMouseEnter={() => setHoveredFlag(flag)}
                onMouseLeave={() => setHoveredFlag(null)}
                onClick={() => onFlagClick && onFlagClick(flag)}
              >
                <div className={`w-5 h-5 ${severityColors[flag.severity]} rounded-full border-2 border-white shadow-lg`}>
                  {/* Pulse animation for high severity */}
                  {flag.severity === 'high' && (
                    <motion.div
                      className="absolute inset-0 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Hover Tooltip */}
                {hoveredFlag?._id === flag._id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 w-64 bg-surface border border-border rounded-lg p-3 shadow-xl z-10"
                  >
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Time:</span>
                        <span className="text-text font-semibold">{formatTime(flag.timestamp)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Type:</span>
                        <span className="text-text">
                          {flag.type === 'audio_multiple_speakers' ? 'Multiple Speakers' : 'Keywords'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Severity:</span>
                        <span className={`font-semibold ${
                          flag.severity === 'high' ? 'text-red-500' :
                          flag.severity === 'medium' ? 'text-orange-500' :
                          'text-yellow-500'
                        }`}>
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>
                      {flag.audio_data?.transcription && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-text line-clamp-2">
                            {flag.audio_data.transcription.split('\n')[0]}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-surface" />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between mt-3 text-xs text-text-secondary">
          <span>0:00</span>
          <span>{Math.floor(quizDuration / 4)}:00</span>
          <span>{Math.floor(quizDuration / 2)}:00</span>
          <span>{Math.floor(3 * quizDuration / 4)}:00</span>
          <span>{quizDuration}:00</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-text-secondary">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-text-secondary">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-text-secondary">High</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredFlags.length === 0 && (
        <div className="text-center py-8">
          <p className="text-text-secondary">No audio flags to display</p>
        </div>
      )}
    </div>
  )
}
