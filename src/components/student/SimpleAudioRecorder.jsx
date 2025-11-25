// Simple Audio Recorder - yahan audio monitoring hoti hai (optional)
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations
import toast from 'react-hot-toast' // Notifications

export default function SimpleAudioRecorder({ quizId, isActive, onConsentDeclined }) {
  // Audio monitoring ke saare states
  const [hasPermission, setHasPermission] = useState(false) // Microphone permission hai ya nahi
  const [isMonitoring, setIsMonitoring] = useState(false) // Monitoring chal rahi hai ya nahi
  const [showConsent, setShowConsent] = useState(true) // Consent dialog dikhana hai ya nahi
  const [suspiciousFlags, setSuspiciousFlags] = useState(0) // Suspicious activity count
  
  // Audio processing ke liye refs
  const streamRef = useRef(null) // Microphone stream
  const audioContextRef = useRef(null) // Web Audio API context
  const analyserRef = useRef(null) // Audio analyser
  const monitoringIntervalRef = useRef(null) // Monitoring interval

  // Microphone permission lene aur audio monitoring start karne wala function
  const handleConsentAccept = async () => {
    try {
      setShowConsent(false) // Consent dialog hide kar dete hain

      // Microphone permission maangte hain user se
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // Echo cancellation off
          noiseSuppression: false, // Noise suppression off (raw audio chahiye)
          sampleRate: 44100 // High quality audio
        }
      })

      streamRef.current = stream
      setHasPermission(true) // Permission mil gaya

      // Web Audio API setup karte hain real-time analysis ke liye
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 2048 // Analysis resolution
      analyser.smoothingTimeConstant = 0.8 // Smoothing factor
      microphone.connect(analyser) // Microphone ko analyser se connect karte hain

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      setIsMonitoring(true) // Monitoring start kar dete hain
      toast.success('🎤 Audio monitoring chalu ho gaya!') // Success message

      // Real-time audio analysis start karte hain
      startAudioMonitoring()

    } catch (error) {
      console.error('Microphone permission error:', error)
      toast.error('Microphone access nahi mila - audio monitoring ke bina continue kar rahe hain')
      setShowConsent(false)
      // Audio ke bina bhi exam continue kar sakte hain
    }
  }

  // Audio monitoring decline karne wala function
  const handleConsentDecline = () => {
    setShowConsent(false) // Consent dialog hide kar dete hain
    toast.info('Audio monitoring band - exam continue kar rahe hain') // Info message
    // Audio ke bina bhi exam continue kar sakte hain
  }

  // Real-time audio analysis for suspicious sound detection
  const startAudioMonitoring = () => {
    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    let lastFlagTime = 0

    const detectSuspiciousAudio = () => {
      analyser.getByteFrequencyData(dataArray)
      
      // Calculate audio metrics
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      const peak = Math.max(...dataArray)
      
      // Detect sudden volume spikes (potential talking/noise)
      const volumeThreshold = 80
      const suddenSpikeThreshold = 120
      
      // Flag conditions
      const isSuddenSpike = peak > suddenSpikeThreshold
      const isConsistentNoise = average > volumeThreshold
      
      // Prevent spam flags (minimum 10 seconds between flags)
      const now = Date.now()
      const timeSinceLastFlag = now - lastFlagTime
      
      if ((isSuddenSpike || isConsistentNoise) && timeSinceLastFlag > 10000) {
        flagSuspiciousActivity(isSuddenSpike ? 'sudden_noise' : 'background_noise')
        lastFlagTime = now
      }
    }

    // Monitor every 500ms
    monitoringIntervalRef.current = setInterval(detectSuspiciousAudio, 500)
  }

  // Flag suspicious activity locally
  const flagSuspiciousActivity = (type) => {
    setSuspiciousFlags(prev => prev + 1)
    
    // Show warning to student
    const flagMessage = type === 'sudden_noise' 
      ? 'Loud noise detected - Keep quiet during exam'
      : 'Background noise detected - Find a quiet place'
    
    toast.error(`⚠️ ${flagMessage}`, { duration: 4000 })
  }

  // Stop monitoring
  const stopMonitoring = () => {
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
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Audio Monitoring (Optional)
                </h2>
                <p className="text-gray-600 text-sm">
                  Enable audio monitoring for enhanced exam security
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-gray-700 space-y-2">
                <p>📌 Audio monitoring helps detect cheating</p>
                <p>📌 No audio is recorded or stored</p>
                <p>📌 Only suspicious sounds are flagged</p>
                <p>📌 You can continue without audio monitoring</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConsentDecline}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Skip Audio
                </button>
                <button
                  onClick={handleConsentAccept}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg"
                >
                  Enable Audio
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Audio monitoring is optional and helps maintain exam integrity
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
          <div className="bg-blue-500 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <span className="text-white font-semibold text-sm">
              🎤 Audio Monitoring Active
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