import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import apiService from '../../services/api'
import AudioFlagCard from './AudioFlagCard'
import AudioTimeline from './AudioTimeline'

export default function FlagMonitor() {
  const [flags, setFlags] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'timeline'
  const [flagTypeFilter, setFlagTypeFilter] = useState('all') // 'all', 'camera', 'audio'

  useEffect(() => {
    fetchFlags()
  }, [filter])

  const fetchFlags = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter === 'unresolved') {
        params.resolved = false
      } else if (filter === 'resolved') {
        params.resolved = true
      }
      
      const data = await apiService.getFlags(params)
      setFlags(data.flags || data)
    } catch (error) {
      toast.error('Failed to load flags')
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (flagId) => {
    try {
      await apiService.updateFlag(flagId, { resolved: true })
      toast.success('Flag resolved')
      fetchFlags()
    } catch (error) {
      toast.error('Failed to resolve flag')
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'red'
      case 'high':
        return 'orange'
      case 'medium':
        return 'yellow'
      case 'low':
        return 'blue'
      default:
        return 'gray'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'multiple_faces':
        return '👥'
      case 'no_face':
        return '😶'
      case 'looking_away':
        return '👀'
      case 'high_audio':
        return '🔊'
      case 'tab_switch':
        return '🔄'
      case 'dev_tools_attempt':
        return '🛠️'
      case 'dev_tools_open':
        return '⚠️'
      case 'screenshot_attempt':
        return '📸'
      case 'window_resize':
        return '↔️'
      default:
        return '🚩'
    }
  }

  const filteredFlags = flags

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              🚩 Violation Monitor
            </h2>
            <p className="text-gray-600 font-medium text-lg">Real-time proctoring violations and security alerts</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchFlags}
            className="p-3 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-theme"
          >
            🔄
          </motion.button>
        </div>

        {/* Enhanced Filters */}
        <div className="flex gap-3">
          {['all', 'unresolved', 'resolved'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-xl'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
              }`}
            >
              {f === 'all' && '📋 '}
              {f === 'unresolved' && '⚠️ '}
              {f === 'resolved' && '✅ '}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Flags List */}
      {loading ? (
        <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl p-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-4xl mb-4"
          >
            ⏳
          </motion.div>
          <p className="text-text-secondary">Loading flags...</p>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl p-12 text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-6xl mb-4"
          >
            ✅
          </motion.div>
          <h3 className="text-2xl font-bold text-text mb-2">No Flags Found</h3>
          <p className="text-text-secondary">All clear! No violations detected.</p>
        </div>
      ) : (
        <>
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition-theme ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:bg-surface/80'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg font-semibold transition-theme ${
                viewMode === 'timeline'
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:bg-surface/80'
              }`}
            >
              📊 Timeline View
            </button>
            
            {/* Flag Type Filter */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setFlagTypeFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-theme ${
                  flagTypeFilter === 'all'
                    ? 'bg-secondary text-white'
                    : 'bg-surface text-text-secondary hover:bg-surface/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFlagTypeFilter('camera')}
                className={`px-4 py-2 rounded-lg font-semibold transition-theme ${
                  flagTypeFilter === 'camera'
                    ? 'bg-secondary text-white'
                    : 'bg-surface text-text-secondary hover:bg-surface/80'
                }`}
              >
                📹 Camera
              </button>
              <button
                onClick={() => setFlagTypeFilter('audio')}
                className={`px-4 py-2 rounded-lg font-semibold transition-theme ${
                  flagTypeFilter === 'audio'
                    ? 'bg-secondary text-white'
                    : 'bg-surface text-text-secondary hover:bg-surface/80'
                }`}
              >
                🎤 Audio
              </button>
            </div>
          </div>

          {/* Timeline View */}
          {viewMode === 'timeline' && (
            <AudioTimeline 
              flags={filteredFlags.filter(f => 
                flagTypeFilter === 'all' || 
                (flagTypeFilter === 'audio' && (f.type === 'audio_multiple_speakers' || f.type === 'audio_keywords')) ||
                (flagTypeFilter === 'camera' && f.type !== 'audio_multiple_speakers' && f.type !== 'audio_keywords')
              )}
              quizDuration={60}
              onFlagClick={(flag) => {
                setViewMode('list')
                document.getElementById(flag._id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            />
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredFlags
                .filter(f => 
                  flagTypeFilter === 'all' || 
                  (flagTypeFilter === 'audio' && (f.type === 'audio_multiple_speakers' || f.type === 'audio_keywords')) ||
                  (flagTypeFilter === 'camera' && f.type !== 'audio_multiple_speakers' && f.type !== 'audio_keywords')
                )
                .map((flag, index) => {
                  // Check if it's an audio flag
                  const isAudioFlag = flag.type === 'audio_multiple_speakers' || flag.type === 'audio_keywords'
                  
                  if (isAudioFlag) {
                    return (
                      <div key={flag._id} id={flag._id}>
                        <AudioFlagCard flag={flag} />
                      </div>
                    )
                  }
                  
                  // Original camera flag rendering
                  const color = getSeverityColor(flag.severity)
                  return (
                    <motion.div
                      key={flag._id}
                      id={flag._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className={`backdrop-blur-xl bg-${color}-500/10 border border-${color}-500/20 rounded-xl p-6 hover:bg-${color}-500/20 transition-all`}
                    >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{getTypeIcon(flag.type)}</span>
                      <div>
                        <h3 className="text-text font-bold text-lg">
                          {flag.type.replace(/_/g, ' ').toUpperCase()}
                        </h3>
                        <p className="text-text-secondary text-sm">{flag.description}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`text-${color}-500`}>⚠️</span>
                        <span className={`text-${color}-500 font-semibold uppercase`}>
                          {flag.severity}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span>📅</span>
                        <span>{new Date(flag.timestamp).toLocaleString()}</span>
                      </div>
                      
                      {flag.count > 1 && (
                        <div className="flex items-center gap-2 text-text-secondary">
                          <span>🔢</span>
                          <span>Occurred {flag.count} times</span>
                        </div>
                      )}
                      
                      {flag.resolved && (
                        <div className="flex items-center gap-2 text-accent">
                          <span>✅</span>
                          <span>Resolved</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!flag.resolved && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResolve(flag._id)}
                      className="ml-4 px-4 py-2 bg-accent/20 border border-accent/30 text-accent rounded-lg hover:bg-accent/30 transition-theme whitespace-nowrap"
                    >
                      ✓ Resolve
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
            </div>
          )}
        </>
      )}

      {/* Stats Summary */}
      {filteredFlags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-text mb-4">📊 Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['critical', 'high', 'medium', 'low'].map((severity) => {
              const count = filteredFlags.filter(f => f.severity === severity).length
              const color = getSeverityColor(severity)
              return (
                <div key={severity} className={`bg-${color}-500/10 border border-${color}-500/20 rounded-lg p-4 text-center`}>
                  <div className={`text-2xl font-bold text-${color}-500 mb-1`}>{count}</div>
                  <div className="text-text-secondary text-sm capitalize">{severity}</div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
