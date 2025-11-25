// JEE/NEET Style Review Screen
import { motion } from 'framer-motion'
import { useState } from 'react'

function ReviewScreen({ 
  quiz, 
  answers, 
  markedForReview, 
  questionTimes,
  onNavigateToQuestion, 
  onSubmit, 
  onBack 
}) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Calculate statistics
  const stats = {
    total: quiz.questions.length,
    answered: Object.keys(answers).length,
    notAnswered: quiz.questions.length - Object.keys(answers).length,
    marked: markedForReview.size || 0,
    answeredMarked: markedForReview ? Array.from(markedForReview).filter(q => answers[q] !== undefined).length : 0
  }

  const getQuestionStatus = (index) => {
    if (markedForReview && markedForReview.has && markedForReview.has(index)) {
      return answers[index] !== undefined ? 'answered-marked' : 'marked'
    }
    if (answers[index] !== undefined) {
      return 'answered'
    }
    return 'not-answered'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return '#10b981'
      case 'not-answered': return '#ef4444'
      case 'marked': return '#8b5cf6'
      case 'answered-marked': return '#f59e0b'
      default: return '#e5e7eb'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'answered': return 'Answered'
      case 'not-answered': return 'Not Answered'
      case 'marked': return 'Marked for Review'
      case 'answered-marked': return 'Answered & Marked'
      default: return 'Not Visited'
    }
  }

  const filteredQuestions = quiz.questions.filter((_, index) => {
    const status = getQuestionStatus(index)
    switch (selectedFilter) {
      case 'answered': return status === 'answered' || status === 'answered-marked'
      case 'not-answered': return status === 'not-answered'
      case 'marked': return status === 'marked' || status === 'answered-marked'
      case 'all':
      default: return true
    }
  })

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const totalTimeSpent = questionTimes ? Object.values(questionTimes).reduce((sum, time) => sum + time, 0) : 0

  if (showConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="submission-confirmation"
      >
        <div className="confirmation-content">
          <div className="confirmation-header">
            <div className="confirmation-icon">⚠️</div>
            <h2>Confirm Submission</h2>
            <p>Are you sure you want to submit your exam?</p>
          </div>

          <div className="confirmation-stats">
            <div className="stat-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.answered}</div>
                <div className="stat-label">Answered</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.notAnswered}</div>
                <div className="stat-label">Not Answered</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.marked}</div>
                <div className="stat-label">Marked</div>
              </div>
            </div>
          </div>

          {stats.notAnswered > 0 && (
            <div className="confirmation-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-text">
                You have {stats.notAnswered} unanswered questions. 
                These will be marked as incorrect.
              </div>
            </div>
          )}

          <div className="confirmation-actions">
            <button
              onClick={() => setShowConfirmation(false)}
              className="btn secondary"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="btn primary submit"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="review-screen">
      {/* Header */}
      <div className="review-header">
        <div className="header-left">
          <h1>Review Your Answers</h1>
          <p>Review your responses before final submission</p>
        </div>
        
        <div className="header-actions">
          <button onClick={onBack} className="btn secondary">
            Back to Exam
          </button>
          <button 
            onClick={() => setShowConfirmation(true)} 
            className="btn primary"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="review-stats">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Questions</div>
            </div>
          </div>
          
          <div className="stat-card answered">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.answered}</div>
              <div className="stat-label">Answered</div>
            </div>
          </div>
          
          <div className="stat-card not-answered">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <div className="stat-value">{stats.notAnswered}</div>
              <div className="stat-label">Not Answered</div>
            </div>
          </div>
          
          <div className="stat-card marked">
            <div className="stat-icon">🔖</div>
            <div className="stat-content">
              <div className="stat-value">{stats.marked}</div>
              <div className="stat-label">Marked for Review</div>
            </div>
          </div>
          
          <div className="stat-card time">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(Math.round(totalTimeSpent / 1000))}</div>
              <div className="stat-label">Time Spent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="review-filters">
        <div className="filter-title">Filter Questions:</div>
        <div className="filter-buttons">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setSelectedFilter('answered')}
            className={`filter-btn ${selectedFilter === 'answered' ? 'active' : ''}`}
          >
            Answered ({stats.answered})
          </button>
          <button
            onClick={() => setSelectedFilter('not-answered')}
            className={`filter-btn ${selectedFilter === 'not-answered' ? 'active' : ''}`}
          >
            Not Answered ({stats.notAnswered})
          </button>
          <button
            onClick={() => setSelectedFilter('marked')}
            className={`filter-btn ${selectedFilter === 'marked' ? 'active' : ''}`}
          >
            Marked ({stats.marked})
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="review-questions">
        {filteredQuestions.map((question, index) => {
          const originalIndex = quiz.questions.indexOf(question)
          const status = getQuestionStatus(originalIndex)
          const userAnswer = answers[originalIndex]
          const timeSpent = questionTimes ? questionTimes[originalIndex] || 0 : 0

          return (
            <motion.div
              key={originalIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="review-question"
            >
              <div className="question-header">
                <div className="question-info">
                  <div className="question-number">Q{originalIndex + 1}</div>
                  <div 
                    className="question-status"
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    {getStatusLabel(status)}
                  </div>
                </div>
                
                <div className="question-meta">
                  <div className="time-spent">
                    ⏱️ {formatTime(Math.round(timeSpent / 1000))}
                  </div>
                  <button
                    onClick={() => {
                      onBack()
                      onNavigateToQuestion(originalIndex)
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="question-content">
                <div className="question-text">
                  {question.question.length > 100 
                    ? `${question.question.substring(0, 100)}...` 
                    : question.question
                  }
                </div>

                <div className="question-answer">
                  {userAnswer ? (
                    <div className="answer-display">
                      <span className="answer-label">Your Answer:</span>
                      <span className="answer-value">
                        {question.options ? 
                          `${String.fromCharCode(65 + question.options.indexOf(userAnswer))} - ${userAnswer}` :
                          userAnswer
                        }
                      </span>
                    </div>
                  ) : (
                    <div className="no-answer">
                      <span className="no-answer-text">No answer selected</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Final Actions */}
      <div className="review-footer">
        <div className="footer-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-text">
            Please review all your answers carefully. Once submitted, you cannot make changes.
          </div>
        </div>
        
        <div className="footer-actions">
          <button onClick={onBack} className="btn secondary large">
            Back to Exam
          </button>
          <button 
            onClick={() => setShowConfirmation(true)} 
            className="btn primary large"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewScreen