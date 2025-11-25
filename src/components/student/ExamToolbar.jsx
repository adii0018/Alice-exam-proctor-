// Toolbar Component for Exam
import { motion } from 'framer-motion'
import ExamTimer from './ExamTimer'

export default function ExamToolbar({ 
  quiz, 
  timeLeft, 
  completionPercentage, 
  violationCount,
  onToggleSidebar,
  onToggleStats,
  onToggleHelp,
  onToggleFullscreen
}) {
  const totalTime = quiz.duration * 60

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="exam-toolbar"
    >
      {/* Left Section */}
      <div className="toolbar-left">
        <div className="exam-info">
          <div className="exam-title">
            <h2>{quiz.title}</h2>
            <div className="exam-meta">
              <span className="exam-id">ID: {quiz._id?.slice(-6) || 'EXAM'}</span>
              <span className="separator">•</span>
              <span className="exam-duration">{quiz.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="toolbar-center">
        <ExamTimer 
          timeLeft={timeLeft} 
          totalTime={totalTime}
          isWarning={timeLeft < 300}
        />
      </div>

      {/* Right Section */}
      <div className="toolbar-right">
        {/* Status Indicators */}
        <div className="status-indicators">
          <div className="status-item">
            <div className="status-icon">📊</div>
            <div className="status-text">
              <div className="status-value">{completionPercentage}%</div>
              <div className="status-label">Complete</div>
            </div>
          </div>

          {violationCount > 0 && (
            <div className="status-item warning">
              <div className="status-icon">⚠️</div>
              <div className="status-text">
                <div className="status-value">{violationCount}</div>
                <div className="status-label">Violations</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="toolbar-actions">
          <motion.button
            onClick={onToggleSidebar}
            className="toolbar-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Question Overview"
          >
            <span className="btn-icon">📋</span>
          </motion.button>

          <motion.button
            onClick={onToggleStats}
            className="toolbar-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Statistics"
          >
            <span className="btn-icon">📊</span>
          </motion.button>

          <motion.button
            onClick={onToggleHelp}
            className="toolbar-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Help & Instructions"
          >
            <span className="btn-icon">❓</span>
          </motion.button>

          <motion.button
            onClick={onToggleFullscreen}
            className="toolbar-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Toggle Fullscreen"
          >
            <span className="btn-icon">⛶</span>
          </motion.button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="connection-status">
        <div className="connection-indicator online">
          <div className="connection-dot" />
          <span>Connected</span>
        </div>
      </div>
    </motion.div>
  )
}