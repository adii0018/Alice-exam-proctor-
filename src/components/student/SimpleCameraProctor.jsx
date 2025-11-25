// Simple Camera Proctor - AI-based cheating detection system
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations
import toast from 'react-hot-toast' // Notifications ke liye

export default function SimpleCameraProctor({ quizId, isActive, onViolation }) {
  // Camera aur monitoring ke liye saare states
  const videoRef = useRef(null) // Video element ka reference
  const [cameraReady, setCameraReady] = useState(false) // Camera ready hai ya nahi
  const [isMinimized, setIsMinimized] = useState(false) // Camera minimize hai ya nahi
  const [violations, setViolations] = useState(0) // Violation count
  const [showWarning, setShowWarning] = useState(false) // Warning dikhana hai ya nahi
  const [warningMessage, setWarningMessage] = useState('') // Warning message

  // Camera initialize karne wala function
  useEffect(() => {
    let stream = null

    const initCamera = async () => {
      try {
        // Camera permission maangte hain user se
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640, // Video width
            height: 480, // Video height
            facingMode: 'user', // Front camera use karte hain
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play() // Video play karte hain
            setCameraReady(true) // Camera ready mark kar dete hain
            toast.success('📹 Camera chalu ho gaya - monitoring start!') // Success message
          }
        }
      } catch (error) {
        console.error('Camera mein problem hai bhai:', error)
        toast.error('Camera access chahiye exam ke liye!') // Error message
      }
    }

    if (isActive) {
      initCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isActive])

  // Simple violation detection (tab switching is handled in QuizInterface)
  const handleViolation = (type, message) => {
    setViolations(prev => prev + 1)
    setWarningMessage(message)
    setShowWarning(true)
    toast.error(message, { duration: 3000 })

    // Notify parent component
    if (onViolation) {
      onViolation(type, message)
    }

    // Hide warning after 3 seconds
    setTimeout(() => setShowWarning(false), 3000)
  }

  if (!isActive) return null

  // Responsive positioning
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const cameraWidth = isMobile ? 200 : 280
  const cameraHeight = isMobile ? 150 : 210

  return (
    <motion.div
      drag={!isMobile}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        top: 0,
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - (isMobile ? 220 : 300) : 0,
        bottom: typeof window !== 'undefined' ? window.innerHeight - (isMobile ? 250 : 350) : 0,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        x: typeof window !== 'undefined' ? (isMobile ? 10 : window.innerWidth - 320) : 0, 
        y: isMobile ? 10 : 20 
      }}
      animate={{ 
        opacity: 1, 
        scale: isMinimized ? (isMobile ? 0.6 : 0.4) : 1,
      }}
      className={`fixed z-50 ${isMobile ? 'top-2 right-2' : 'cursor-move'}`}
      style={{ touchAction: isMobile ? 'auto' : 'none' }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl p-3 shadow-2xl"
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-3 h-3 rounded-full bg-red-500"
            />
            <span className="text-gray-700 text-xs font-semibold">
              {cameraReady ? 'LIVE' : 'Loading...'}
            </span>
          </div>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-colors"
          >
            {isMinimized ? '🔼' : '🔽'}
          </button>
        </div>

        {/* Camera Feed */}
        <div className={`relative ${isMinimized ? 'hidden' : 'block'}`}>
          <video
            ref={videoRef}
            width={cameraWidth}
            height={cameraHeight}
            className="rounded-xl w-full bg-gray-100"
            style={{ transform: 'scaleX(-1)' }}
            autoPlay
            playsInline
            muted
          />

          {/* Status Overlay */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
            📹 Proctoring
          </div>

          {/* Violations Count */}
          {violations > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              ⚠️ {violations}
            </div>
          )}
        </div>

        {/* Minimized View */}
        {isMinimized && (
          <div className="text-center py-2">
            <div className="text-lg">📹</div>
            <div className="text-xs text-gray-600">Camera Active</div>
            {violations > 0 && (
              <div className="text-xs text-red-500 font-bold">⚠️ {violations} flags</div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className={`${isMinimized ? 'mt-1' : 'mt-2'} text-center`}>
          <span className="text-xs text-gray-500">
            🤖 AI Monitoring {isMinimized ? '' : 'Active'}
          </span>
        </div>
      </motion.div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-20 left-0 right-0 bg-red-500 border-2 border-red-400 rounded-xl p-3 shadow-2xl"
          >
            <div className="flex items-start gap-2">
              <motion.div 
                className="text-xl"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚠️
              </motion.div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm mb-1">Violation Detected!</h4>
                <p className="text-white/90 text-xs">{warningMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}