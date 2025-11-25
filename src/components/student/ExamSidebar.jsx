// Sidebar Component for Exam
import { motion } from 'framer-motion'

export default function ExamSidebar({ 
  quiz, 
  currentQuestion, 
  answers, 
  onNavigate, 
  onClose 
}) {
  const answeredCount = Object.keys(answers).length
  const unansweredQuestions = quiz.questions
    .map((_, index) => index)
    .filter(index => !answers.hasOwnProperty(index))

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current'
    if (answers.hasOwnProperty(index)) return 'answered'
    return 'unanswered'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current': return '👉'
      case 'answered': return '✅'
      default: return '⏳'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'blue'
      case 'answered': return 'green'
      default: return 'gray'
    }
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="exam-sidebar"
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <div className="title-icon">📋</div>
          <div>
            <h3>Question Overview</h3>
            <p>{answeredCount}/{quiz.questions.length} completed</p>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      {/* Progress Summary */}
      <div className="progress-summary">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="progress-stats">
          <div className="stat-item answered">
            <span className="stat-icon">✅</span>
            <span className="stat-text">{answeredCount} Answered</span>
          </div>
          <div className="stat-item unanswered">
            <span className="stat-icon">⏳</span>
            <span className="stat-text">{quiz.questions.length - answeredCount} Remaining</span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="question-grid">
        <div className="grid-header">
          <h4>All Questions</h4>
          <div className="grid-legend">
            <div className="legend-item">
              <span className="legend-dot current"></span>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot unanswered"></span>
              <span>Unanswered</span>
            </div>
          </div>
        </div>

        <div className="questions-container">
          {quiz.questions.map((question, index) => {
            const status = getQuestionStatus(index)
            const statusIcon = getStatusIcon(status)
            const statusColor = getStatusColor(status)

            return (
              <motion.button
                key={index}
                onClick={() => onNavigate(index)}
                className={`question-item ${status}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <div className="question-number">
                  <span className="number">{index + 1}</span>
                  <span className="status-icon">{statusIcon}</span>
                </div>
                
                <div className="question-preview">
                  <div className="question-text">
                    {question.question.length > 50 
                      ? `${question.question.substring(0, 50)}...` 
                      : question.question
                    }
                  </div>
                  
                  {answers[index] && (
                    <div className="selected-answer">
                      Selected: {answers[index].length > 30 
                        ? `${answers[index].substring(0, 30)}...` 
                        : answers[index]
                      }
                    </div>
                  )}
                </div>

                <div className={`question-status ${statusColor}`}>
                  <div className="status-dot" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sidebar-actions">
        <h4>Quick Actions</h4>
        
        <div className="action-buttons">
          <motion.button
            onClick={() => {
              if (unansweredQuestions.length > 0) {
                onNavigate(unansweredQuestions[0])
              }
            }}
            disabled={unansweredQuestions.length === 0}
            className="action-btn primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="btn-icon">🎯</span>
            <span className="btn-text">Next Unanswered</span>
          </motion.button>

          <motion.button
            onClick={() => onNavigate(0)}
            className="action-btn secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="btn-icon">⬆️</span>
            <span className="btn-text">Go to Start</span>
          </motion.button>

          <motion.button
            onClick={() => onNavigate(quiz.questions.length - 1)}
            className="action-btn secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="btn-icon">⬇️</span>
            <span className="btn-text">Go to End</span>
          </motion.button>
        </div>
      </div>

      {/* Exam Tips */}
      <div className="sidebar-tips">
        <h4>💡 Quick Tips</h4>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">⏰</span>
            <span className="tip-text">Manage your time wisely</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📖</span>
            <span className="tip-text">Read questions carefully</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <span className="tip-text">Review before submitting</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}