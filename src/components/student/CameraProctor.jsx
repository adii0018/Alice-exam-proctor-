import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import apiService from '../../services/api'
import { playCamera, playViolation, playWarning, playSuccess } from '../../utils/soundUtils'

export default function CameraProctor({ quizId, isActive, onViolation }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [model, setModel] = useState(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [faceCount, setFaceCount] = useState(0)
  const [violations, setViolations] = useState({
    noFace: 0,
    multipleFaces: 0,
    lookingAway: 0,
  })
  const [gazeDirection, setGazeDirection] = useState('center')
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [showPositionControls, setShowPositionControls] = useState(false)
  const detectionIntervalRef = useRef(null)
  const lastViolationRef = useRef({})
  const consecutiveViolationsRef = useRef({ noFace: 0, multipleFaces: 0, lookingAway: 0 })
  const gazeAwayCountRef = useRef(0)

  // Initialize camera and model
  useEffect(() => {
    let stream = null

    const initCamera = async () => {
      try {
        // Check if camera is available
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        
        if (videoDevices.length === 0) {
          throw new Error('No camera found on this device')
        }

        // Request camera permission
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user',
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            setCameraReady(true)
            playCamera(); // Play camera activation sound
            toast.success('📹 Camera chalu ho gaya - monitoring start!')
          }
        }

        // Load face detection model
        await tf.ready()
        const loadedModel = await blazeface.load()
        setModel(loadedModel)
        playSuccess(); // Play success sound for AI loading
        toast.success('🤖 AI Proctoring enabled - face detection active!')
      } catch (error) {
        console.error('❌ Camera initialization error:', error)
        
        // More detailed error messages
        let errorMessage = 'Camera access required for exam'
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied! Please allow camera access and refresh.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found! Please connect a camera and try again.'
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is being used by another app! Please close other apps and try again.'
        } else if (error.message.includes('No camera found')) {
          errorMessage = 'No camera detected on this device!'
        }
        
        toast.error(errorMessage, { duration: 5000 })
      }
    }

    if (isActive) {
      initCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [isActive])

  // Face detection loop
  useEffect(() => {
    if (!model || !cameraReady || !isActive) return

    const detectFaces = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return

      try {
        const predictions = await model.estimateFaces(videoRef.current, false)
        const numFaces = predictions.length

        setFaceCount(numFaces)

        // Draw bounding boxes and detect gaze
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

          predictions.forEach(prediction => {
            const start = prediction.topLeft
            const end = prediction.bottomRight
            const size = [end[0] - start[0], end[1] - start[1]]

            // Draw box
            ctx.strokeStyle = numFaces === 1 ? '#10b981' : '#ef4444'
            ctx.lineWidth = 3
            ctx.strokeRect(start[0], start[1], size[0], size[1])

            // Eye tracking - detect if looking away
            if (numFaces === 1 && prediction.landmarks) {
              const leftEye = prediction.landmarks[0]
              const rightEye = prediction.landmarks[1]
              const nose = prediction.landmarks[2]
              
              // Calculate face center
              const faceCenter = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
              
              // Calculate horizontal offset of nose from face center
              const noseOffset = nose[0] - faceCenter[0]
              const faceWidth = size[0]
              const offsetRatio = Math.abs(noseOffset) / faceWidth
              
              // Detect gaze direction
              let currentGaze = 'center'
              if (offsetRatio > 0.15) {
                currentGaze = noseOffset > 0 ? 'right' : 'left'
              }
              
              setGazeDirection(currentGaze)
              
              // Draw eye indicators
              ctx.fillStyle = currentGaze === 'center' ? '#10b981' : '#f59e0b'
              ctx.beginPath()
              ctx.arc(leftEye[0], leftEye[1], 4, 0, 2 * Math.PI)
              ctx.fill()
              ctx.beginPath()
              ctx.arc(rightEye[0], rightEye[1], 4, 0, 2 * Math.PI)
              ctx.fill()
            }
          })
        }

        // Check violations with consecutive detection
        const now = Date.now()

        // No face detected
        if (numFaces === 0) {
          consecutiveViolationsRef.current.noFace += 1
          consecutiveViolationsRef.current.multipleFaces = 0
          consecutiveViolationsRef.current.lookingAway = 0
          
          // Trigger violation after 3 consecutive detections (3 seconds)
          if (consecutiveViolationsRef.current.noFace >= 3) {
            if (!lastViolationRef.current.noFace || now - lastViolationRef.current.noFace > 10000) {
              playViolation(); // Play violation sound
              handleViolation('no_face', '⚠️ No face detected! Please stay in front of camera')
              lastViolationRef.current.noFace = now
            }
          }
        }
        // Multiple faces detected
        else if (numFaces > 1) {
          consecutiveViolationsRef.current.multipleFaces += 1
          consecutiveViolationsRef.current.noFace = 0
          consecutiveViolationsRef.current.lookingAway = 0
          
          // Trigger violation after 2 consecutive detections (2 seconds)
          if (consecutiveViolationsRef.current.multipleFaces >= 2) {
            if (!lastViolationRef.current.multipleFaces || now - lastViolationRef.current.multipleFaces > 10000) {
              playViolation(); // Play violation sound
              handleViolation('multiple_faces', `🚨 ${numFaces} faces detected! Only you should be visible`)
              lastViolationRef.current.multipleFaces = now
            }
          }
        }
        // Single face - check gaze direction
        else {
          consecutiveViolationsRef.current.noFace = 0
          consecutiveViolationsRef.current.multipleFaces = 0
          
          // Track looking away
          if (gazeDirection !== 'center') {
            gazeAwayCountRef.current += 1
            consecutiveViolationsRef.current.lookingAway += 1
            
            // Trigger violation after 5 consecutive detections (5 seconds of looking away)
            if (consecutiveViolationsRef.current.lookingAway >= 5) {
              if (!lastViolationRef.current.lookingAway || now - lastViolationRef.current.lookingAway > 15000) {
                playWarning(); // Play warning sound for looking away
                handleViolation('looking_away', `👀 Looking ${gazeDirection}! Please focus on the screen`)
                lastViolationRef.current.lookingAway = now
              }
            }
          } else {
            consecutiveViolationsRef.current.lookingAway = 0
            setShowWarning(false)
          }
        }
      } catch (error) {
        console.error('Detection error:', error)
      }
    }

    // Run detection every 1 second (1000ms)
    detectionIntervalRef.current = setInterval(detectFaces, 1000)
    
    // Run initial detection immediately
    detectFaces()

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [model, cameraReady, isActive, quizId])

  const handleViolation = async (type, message) => {
    // Update local violations count
    setViolations(prev => ({
      ...prev,
      [type === 'no_face' ? 'noFace' : type === 'multiple_faces' ? 'multipleFaces' : 'lookingAway']: prev[type === 'no_face' ? 'noFace' : type === 'multiple_faces' ? 'multipleFaces' : 'lookingAway'] + 1,
    }))

    // Show warning
    setWarningMessage(message)
    setShowWarning(true)
    toast.error(message, { duration: 3000 })

    // Create flag in backend
    try {
      await apiService.createFlag({
        quiz_id: quizId,
        flag_type: type,
        description: message,
        severity: type === 'multiple_faces' ? 'high' : 'medium',
      })

      // Notify parent component
      if (onViolation) {
        onViolation(type)
      }
    } catch (error) {
      console.error('Failed to create flag:', error)
    }

    // Hide warning after 3 seconds
    setTimeout(() => setShowWarning(false), 3000)
  }

  if (!isActive) return null

  // Position presets
  const positionPresets = [
    { name: 'Top Right', x: window.innerWidth - 420, y: 20, icon: '↗️' },
    { name: 'Top Left', x: 20, y: 20, icon: '↖️' },
    { name: 'Bottom Right', x: window.innerWidth - 420, y: window.innerHeight - 400, icon: '↘️' },
    { name: 'Bottom Left', x: 20, y: window.innerHeight - 400, icon: '↙️' },
    { name: 'Center', x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 200, icon: '🎯' }
  ]

  // Responsive positioning
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const cameraWidth = isMobile ? 240 : 320
  const cameraHeight = isMobile ? 180 : 240

  return (
    <motion.div
      ref={containerRef}
      drag={!isMobile}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        setPosition({ x: info.point.x, y: info.point.y })
      }}
      dragConstraints={{
        top: 0,
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - (isMobile ? 260 : 400) : 0,
        bottom: typeof window !== 'undefined' ? window.innerHeight - (isMobile ? 300 : 400) : 0,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        x: typeof window !== 'undefined' ? (isMobile ? 10 : window.innerWidth - 420) : 10, 
        y: isMobile ? 10 : 20 
      }}
      animate={{ 
        opacity: 1, 
        scale: isMinimized ? (isMobile ? 0.7 : 0.5) : 1,
        x: position.x || (typeof window !== 'undefined' ? (isMobile ? 10 : window.innerWidth - 420) : 10),
        y: position.y || (isMobile ? 10 : 20)
      }}
      className={`fixed z-[9999] ${isMobile ? 'top-2 right-2' : isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ 
        touchAction: isMobile ? 'auto' : 'none',
        pointerEvents: 'auto',
        position: 'fixed'
      }}
    >
      <motion.div
        className="backdrop-blur-xl bg-surface/90 border border-border rounded-2xl p-4 shadow-2xl"
        whileHover={{ scale: 1.02 }}
      >
        {/* Control Buttons */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {/* Drag Handle */}
          {!isMobile && (
            <div className="bg-surface border border-border rounded-full px-3 py-1 text-xs text-text font-semibold cursor-move flex items-center gap-1">
              <span className="text-blue-400">📹</span>
              {isDragging ? 'Moving...' : 'Drag'}
            </div>
          )}
          
          {/* Position Controls Button */}
          <button
            onClick={() => setShowPositionControls(!showPositionControls)}
            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-colors"
            title="Position Controls"
          >
            📍
          </button>
          
          {/* Minimize/Maximize Button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-theme"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? '🔼' : '🔽'}
          </button>
        </div>

        {/* Position Controls Panel */}
        <AnimatePresence>
          {showPositionControls && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute -top-16 left-0 right-0 bg-surface/95 backdrop-blur-xl border border-border rounded-xl p-3 shadow-2xl"
            >
              <div className="text-xs text-text-secondary mb-2 text-center font-semibold">
                📍 Quick Positions
              </div>
              <div className="grid grid-cols-5 gap-1">
                {positionPresets.map((preset, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setPosition({ x: preset.x, y: preset.y })
                      setShowPositionControls(false)
                    }}
                    className="w-8 h-8 bg-primary/20 hover:bg-primary/40 border border-primary/30 rounded-lg flex items-center justify-center text-xs transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={preset.name}
                  >
                    {preset.icon}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Feed - Always rendered but visibility controlled */}
        <div className={`relative ${isMinimized ? 'hidden' : 'block'}`}>
          <video
            ref={videoRef}
            width={cameraWidth}
            height={cameraHeight}
            className="rounded-xl w-full"
            style={{ transform: 'scaleX(-1)' }}
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            width={cameraWidth}
            height={cameraHeight}
            className="absolute top-0 left-0 rounded-xl pointer-events-none w-full"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Status Indicator */}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className={`w-3 h-3 rounded-full ${
                faceCount === 1 ? 'bg-accent' : 'bg-red-500'
              }`}
            />
            <span className="text-text text-xs font-semibold bg-surface/80 px-2 py-1 rounded">
              {cameraReady ? 'LIVE' : 'Loading...'}
            </span>
          </div>

          {/* Face Count */}
          <div className="absolute top-2 right-2 bg-surface/80 px-3 py-1 rounded-lg border border-border">
            <span className={`text-sm font-bold ${
              faceCount === 1 ? 'text-accent' : 'text-red-500'
            }`}>
              {faceCount === 0 ? 'No Face' : faceCount === 1 ? '✓ Verified' : `⚠️ ${faceCount} Faces`}
            </span>
          </div>
        </div>

        {/* Violations Summary - Always visible */}
        <div className={`${isMinimized ? 'mt-2' : 'mt-3'} grid grid-cols-3 gap-2 text-xs`}>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-center">
            <div className="text-red-500 font-bold">{violations.noFace}</div>
            <div className="text-text-secondary text-[10px]">No Face</div>
          </div>
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2 text-center">
            <div className="text-orange-500 font-bold">{violations.multipleFaces}</div>
            <div className="text-text-secondary text-[10px]">Multiple</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 text-center">
            <div className="text-yellow-500 font-bold">{violations.lookingAway}</div>
            <div className="text-text-secondary text-[10px]">Gaze</div>
          </div>
        </div>

        {/* AI Badge */}
        <div className="mt-2 text-center">
          <span className="text-xs text-text-secondary">
            🤖 AI {isMinimized ? 'Active' : 'Proctoring Active'}
          </span>
        </div>
      </motion.div>

      {/* Warning Modal - Positioned relative to camera */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-24 left-0 right-0 backdrop-blur-xl bg-red-500/95 border-2 border-red-400 rounded-xl p-3 shadow-2xl"
          >
            <div className="flex items-start gap-2">
              <motion.div 
                className="text-2xl"
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
