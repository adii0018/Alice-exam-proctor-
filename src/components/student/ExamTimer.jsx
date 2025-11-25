// Enhanced Timer Component for Exam
import { motion } from 'framer-motion'

export default function ExamTimer({ timeLeft, totalTime, isWarning = false }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const percentage = (timeLeft / totalTime) * 100
  const isUrgent = timeLeft < 60
  const isCritical = timeLeft < 300

  return (
    <motion.div 
      className={`exam-timer ${isUrgent ? 'urgent' : isCritical ? 'warning' : ''}`}
      animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
    >
      <div className="timer-display">
        <div className="timer-icon">
          {isUrgent ? '🚨' : isCritical ? '⏰' : '⏱️'}
        </div>
        <div className="timer-text">
          <div className="time-value">{formatTime(timeLeft)}</div>
          <div className="time-label">
            {isUrgent ? 'URGENT!' : isCritical ? 'Hurry up!' : 'Time left'}
          </div>
        </div>
      </div>
      
      {/* Progress Ring */}
      <div className="timer-ring">
        <svg width="60" height="60" className="timer-svg">
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          <motion.circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke={isUrgent ? '#ef4444' : isCritical ? '#f59e0b' : '#10b981'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 25}`}
            strokeDashoffset={`${2 * Math.PI * 25 * (1 - percentage / 100)}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * 25}` }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 25 * (1 - percentage / 100)}` }}
            transition={{ duration: 1 }}
          />
        </svg>
      </div>
    </motion.div>
  )
}