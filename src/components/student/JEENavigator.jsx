// JEE/NEET Style Navigation Component
import { motion } from 'framer-motion'

export default function JEENavigator({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSaveAndNext,
  onMarkForReview,
  onClearResponse,
  isMarkedForReview,
  hasAnswer
}) {
  const canGoPrevious = currentQuestion > 0
  const canGoNext = currentQuestion < totalQuestions - 1

  return (
    <div className="jee-navigator">
      {/* Navigation Info */}
      <div className="nav-info">
        <div className="question-counter">
          <span className="current">{currentQuestion + 1}</span>
          <span className="separator">of</span>
          <span className="total">{totalQuestions}</span>
        </div>
        
        <div className="nav-status">
          {hasAnswer ? (
            <div className="status-item answered">
              <span className="status-icon">✓</span>
              <span>Answered</span>
            </div>
          ) : (
            <div className="status-item unanswered">
              <span className="status-icon">⏳</span>
              <span>Not Answered</span>
            </div>
          )}
          
          {isMarkedForReview && (
            <div className="status-item marked">
              <span className="status-icon">🔖</span>
              <span>Marked</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="nav-primary">
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

        <motion.button
          onClick={onSaveAndNext}
          disabled={!canGoNext}
          className={`nav-btn primary ${!canGoNext ? 'disabled' : ''}`}
          whileHover={canGoNext ? { scale: 1.05 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          <span className="btn-text">Save & Next</span>
          <span className="btn-icon">➡️</span>
        </motion.button>
      </div>

      {/* Secondary Actions */}
      <div className="nav-secondary">
        <motion.button
          onClick={onMarkForReview}
          className={`nav-btn mark ${isMarkedForReview ? 'marked' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">🔖</span>
          <span className="btn-text">
            {isMarkedForReview ? 'Unmark for Review' : 'Mark for Review'}
          </span>
        </motion.button>

        <motion.button
          onClick={onClearResponse}
          disabled={!hasAnswer}
          className={`nav-btn clear ${!hasAnswer ? 'disabled' : ''}`}
          whileHover={hasAnswer ? { scale: 1.05 } : {}}
          whileTap={hasAnswer ? { scale: 0.95 } : {}}
        >
          <span className="btn-icon">🗑️</span>
          <span className="btn-text">Clear Response</span>
        </motion.button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="nav-shortcuts">
        <div className="shortcuts-title">Keyboard Shortcuts:</div>
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>←</kbd>
            <span>Previous</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>→</kbd>
            <span>Next</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>M</kbd>
            <span>Mark</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>D</kbd>
            <span>Clear</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="nav-progress">
        <div className="progress-label">Question Progress</div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="progress-text">
          {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}% Complete
        </div>
      </div>

      {/* Navigation Tips */}
      <div className="nav-tips">
        <div className="tip-item">
          <span className="tip-icon">💡</span>
          <span>Use "Save & Next" to move forward efficiently</span>
        </div>
        <div className="tip-item">
          <span className="tip-icon">🔖</span>
          <span>Mark difficult questions to review later</span>
        </div>
        <div className="tip-item">
          <span className="tip-icon">⌨️</span>
          <span>Use keyboard shortcuts for faster navigation</span>
        </div>
      </div>
    </div>
  )
}