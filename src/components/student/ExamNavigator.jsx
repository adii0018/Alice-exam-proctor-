// Navigation Component for Exam
import { motion } from 'framer-motion'

export default function ExamNavigator({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmit, 
  onCancel,
  isLastQuestion 
}) {
  const canGoPrevious = currentQuestion > 0
  const canGoNext = currentQuestion < totalQuestions - 1

  return (
    <div className="exam-navigator">
      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <div className="nav-left">
          <motion.button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`nav-btn secondary ${!canGoPrevious ? 'disabled' : ''}`}
            whileHover={canGoPrevious ? { scale: 1.05 } : {}}
            whileTap={canGoPrevious ? { scale: 0.95 } : {}}
          >
            <span className="btn-icon">⬅️</span>
            <span className="btn-text">Previous</span>
          </motion.button>
        </div>

        <div className="nav-center">
          <div className="question-indicator">
            <span className="current-q">{currentQuestion + 1}</span>
            <span className="separator">/</span>
            <span className="total-q">{totalQuestions}</span>
          </div>
        </div>

        <div className="nav-right">
          {isLastQuestion ? (
            <motion.button
              onClick={onSubmit}
              className="nav-btn primary submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">✅</span>
              <span className="btn-text">Submit Exam</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={onNext}
              disabled={!canGoNext}
              className={`nav-btn primary ${!canGoNext ? 'disabled' : ''}`}
              whileHover={canGoNext ? { scale: 1.05 } : {}}
              whileTap={canGoNext ? { scale: 0.95 } : {}}
            >
              <span className="btn-text">Next</span>
              <span className="btn-icon">➡️</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <motion.button
          onClick={onCancel}
          className="action-btn cancel"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">❌</span>
          <span className="btn-text">Cancel Exam</span>
        </motion.button>

        <div className="action-divider" />

        <div className="keyboard-shortcuts">
          <div className="shortcut-hint">
            <kbd>←</kbd> Previous
          </div>
          <div className="shortcut-hint">
            <kbd>→</kbd> Next
          </div>
          <div className="shortcut-hint">
            <kbd>Enter</kbd> Submit
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="progress-dots">
        {Array.from({ length: Math.min(totalQuestions, 20) }, (_, index) => {
          const questionIndex = Math.floor((index / 20) * totalQuestions)
          const isCurrent = questionIndex === currentQuestion
          const isNearCurrent = Math.abs(questionIndex - currentQuestion) <= 2
          
          return (
            <motion.div
              key={index}
              className={`progress-dot ${isCurrent ? 'current' : ''}`}
              animate={{
                scale: isCurrent ? 1.2 : isNearCurrent ? 1 : 0.8,
                opacity: isCurrent ? 1 : isNearCurrent ? 0.7 : 0.3
              }}
              transition={{ duration: 0.3 }}
            />
          )
        })}
      </div>
    </div>
  )
}