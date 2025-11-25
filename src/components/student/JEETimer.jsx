// JEE/NEET Style Timer Component
import { motion } from 'framer-motion'

export default function JEETimer({ timeLeft, totalTime }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft < 60) return '#ef4444' // Red - Critical
    if (timeLeft < 300) return '#f59e0b' // Yellow - Warning
    if (timeLeft < 900) return '#f97316' // Orange - Caution
    return '#10b981' // Green - Safe
  }

  const getTimerStatus = () => {
    if (timeLeft < 60) return 'CRITICAL'
    if (timeLeft < 300) return 'WARNING'
    if (timeLeft < 900) return 'CAUTION'
    return 'TIME LEFT'
  }

  const percentage = (timeLeft / totalTime) * 100

  return (
    <div className="jee-timer">
      <div className="timer-container">
        <div className="timer-display">
          <div className="timer-label">{getTimerStatus()}</div>
          <motion.div 
            className="timer-value"
            style={{ color: getTimerColor() }}
            animate={timeLeft < 60 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: timeLeft < 60 ? Infinity : 0 }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="timer-progress">
          <div className="progress-bg">
            <motion.div
              className="progress-fill"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: getTimerColor()
              }}
              initial={{ width: '100%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Time Indicators */}
        <div className="time-indicators">
          <div className="indicator safe">
            <div className="indicator-dot" style={{ backgroundColor: '#10b981' }} />
            <span>Safe</span>
          </div>
          <div className="indicator caution">
            <div className="indicator-dot" style={{ backgroundColor: '#f97316' }} />
            <span>Caution</span>
          </div>
          <div className="indicator warning">
            <div className="indicator-dot" style={{ backgroundColor: '#f59e0b' }} />
            <span>Warning</span>
          </div>
          <div className="indicator critical">
            <div className="indicator-dot" style={{ backgroundColor: '#ef4444' }} />
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* Auto-submit Warning */}
      {timeLeft < 300 && (
        <motion.div
          className="auto-submit-warning"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            {timeLeft < 60 
              ? 'Exam will auto-submit in less than 1 minute!' 
              : 'Exam will auto-submit when time expires'
            }
          </span>
        </motion.div>
      )}
    </div>
  )
}