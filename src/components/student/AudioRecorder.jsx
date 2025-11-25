import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import apiService from '../../services/api'

export default function AudioRecorder({ quizId, studentId, isActive, onConsentDeclined }) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [showConsent, setShowConsent] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const [suspiciousFlags, setSuspiciousFlags] = useState(0)
  const [lastFlagTime, setLastFlagTime] = useState(null)
  
  const streamRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const monitoringIntervalRef = useRef(null)

  // Request microphone permission and start audio monitoring
  const handleConsentAccept = async () => {
    try {
      // Try to start audio session (optional - may not be implemented)
      try {
        const sessionResponse = await apiService.post('/audio/session/start/', {
          quiz_id: quizId,
          student_id: studentId,
          consent_given: true
        })
        
        if (sessionResponse.data?.session_id) {
          setSessionId(sessionResponse.data.session_id)
        }
      } catch (apiError) {
        console.warn('Audio session API not available, continuing with local monitoring only')
        setSessionId('local-session-' + Date.now())
      }

      setShowConsent(false)

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // Keep original audio for detection
          noiseSuppression: false,
          sampleRate: 44100
        }
      })

      streamRef.current = stream
      setHasPermission(true)

      // Initialize Web Audio API for real-time analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      microphone.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      setIsMonitoring(true)
      toast.success('🎤 Audio monitoring started')

      // Start real-time audio analysis
      startAudioMonitoring()

    } catch (error) {
      console.error('Microphone permission error:', error)
      toast.error('Microphone access required for exam')
      setShowConsent(false)
      if (onConsentDeclined) {
        onConsentDeclined()
      }
    }
  }

  const handleConsentDecline = () => {
    setShowConsent(false)
    toast.error('Audio monitoring consent required for exam')
    if (onConsentDeclined) {
      onConsentDeclined()
    }
  }

  // Real-time audio analysis for suspicious sound detection
  const startAudioMonitoring = () => {
    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const detectSuspiciousAudio = () => {
      analyser.getByteFrequencyData(dataArray)
      
      // Calculate audio metrics
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      const peak = Math.max(...dataArray)
      
      // Detect sudden volume spikes (potential talking/noise)
      const volumeThreshold = 80
      const suddenSpikeThreshold = 120
      
      // Detect multiple voices (frequency analysis)
      const lowFreq = dataArray.slice(0, 50).reduce((sum, val) => sum + val, 0) / 50
      const midFreq = dataArray.slice(50, 150).reduce((sum, val) => sum + val, 0) / 100
      const highFreq = dataArray.slice(150, 300).reduce((sum, val) => sum + val, 0) / 150
      
      // Flag conditions
      const isSuddenSpike = peak > suddenSpikeThreshold
      const isConsistentNoise = average > volumeThreshold
      const isMultipleVoices = (lowFreq > 60 && midFreq > 60) || (midFreq > 70 && highFreq > 50)
      
      // Prevent spam flags (minimum 10 seconds between flags)
      const now = Date.now()
      const timeSinceLastFlag = lastFlagTime ? now - lastFlagTime : Infinity
      
      if ((isSuddenSpike || isConsistentNoise || isMultipleVoices) && timeSinceLastFlag > 10000) {
        flagSuspiciousActivity({
          type: isSuddenSpike ? 'sudden_noise' : isMultipleVoices ? 'multiple_voices' : 'background_noise',
          volume_level: peak,
          average_volume: Math.round(average),
          frequency_analysis: { low: Math.round(lowFreq), mid: Math.round(midFreq), high: Math.round(highFreq) }
        })
        setLastFlagTime(now)
      }
    }

    // Monitor every 500ms
    monitoringIntervalRef.current = setInterval(detectSuspiciousAudio, 500)
  }

  // Flag suspicious activity without recording
  const flagSuspiciousActivity = async (detectionData) => {
    try {
      // Try to send flag to API (optional)
      try {
        await apiService.createFlag({
          quiz_id: quizId,
          flag_type: 'audio_' + detectionData.type,
          description: getFlagReason(detectionData.type),
          severity: 'medium',
          metadata: detectionData
        })
      } catch (apiError) {
        console.warn('Audio flag API not available, logging locally only')
      }

      setSuspiciousFlags(prev => prev + 1)
      
      // Show warning to student
      const flagMessage = getFlagMessage(detectionData.type)
      toast.error(`⚠️ ${flagMessage}`, { duration: 4000 })
      
    } catch (error) {
      console.error('Error flagging suspicious activity:', error)
    }
  }

  // Get user-friendly flag messages
  const getFlagReason = (type) => {
    switch (type) {
      case 'sudden_noise': return 'Sudden loud noise detected'
      case 'multiple_voices': return 'Multiple voices detected'
      case 'background_noise': return 'Continuous background noise'
      default: return 'Suspicious audio activity'
    }
  }

  const getFlagMessage = (type) => {
    switch (type) {
      case 'sudden_noise': return 'Loud noise detected - Keep quiet during exam'
      case 'multiple_voices': return 'Multiple voices detected - No talking allowed'
      case 'background_noise': return 'Background noise detected - Find a quiet place'
      default: return 'Suspicious audio detected'
    }
  }

  // Stop monitoring
  const stopMonitoring = async () => {
    setIsMonitoring(false)

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current)
    }

    // End session (optional)
    if (sessionId && !sessionId.startsWith('local-session')) {
      try {
        await apiService.post('/audio/session/end/', { 
          session_id: sessionId,
          total_flags: suspiciousFlags
        })
      } catch (error) {
        console.warn('Audio session end API not available')
      }
    }

    toast.success('Audio monitoring stopped')
  }

  // Auto-start/stop based on isActive
  useEffect(() => {
    if (!isActive && isMonitoring) {
      stopMonitoring()
    }
  }, [isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring()
    }
  }, [])

  if (!isActive) return null

  return (
    <>
      {/* Consent Dialog */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎤</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Audio Monitoring Consent
                </h2>
                <p className="text-gray-400 text-sm">
                  This exam requires audio monitoring (no recording)
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-sm text-gray-300 space-y-2">
                <p>📌 Your audio will be monitored (NOT recorded)</p>
                <p>📌 Only suspicious sounds are detected and flagged</p>
                <p>📌 No audio files are stored or saved</p>
                <p>📌 Real-time analysis for exam integrity</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConsentDecline}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleConsentAccept}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg font-semibold transition-all shadow-lg"
                >
                  Accept & Continue
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By accepting, you consent to audio monitoring (no recording) during this exam
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monitoring Indicator */}
      {isMonitoring && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="bg-blue-500/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <span className="text-white font-semibold text-sm">
              🎤 Audio Monitoring
            </span>
            {suspiciousFlags > 0 && (
              <span className="text-yellow-300 text-xs font-bold">
                ⚠️ {suspiciousFlags} flags
              </span>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
