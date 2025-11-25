// JEE/NEET Style Question Card
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function JEEQuestionCard({ 
  question, 
  questionIndex, 
  answer, 
  isMarkedForReview,
  onAnswerChange, 
  onMarkForReview,
  onClearResponse 
}) {
  const [selectedOption, setSelectedOption] = useState(answer || '')
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    setSelectedOption(answer || '')
  }, [answer])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [questionIndex])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    onAnswerChange(questionIndex, option)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getQuestionType = () => {
    if (question.type) return question.type
    if (question.options && question.options.length === 4) return 'Multiple Choice'
    return 'Single Correct'
  }

  return (
    <div className="jee-question-card">
      {/* Question Header */}
      <div className="question-header">
        <div className="question-info">
          <div className="question-number">
            <span className="q-label">Question</span>
            <span className="q-num">{questionIndex + 1}</span>
          </div>
          
          <div className="question-meta">
            <div className="question-type">{getQuestionType()}</div>
            <div className="time-spent">
              <span className="time-icon">⏱️</span>
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
        </div>

        <div className="question-status">
          {selectedOption ? (
            <div className="status-badge answered">
              <span className="status-icon">✓</span>
              <span>Answered</span>
            </div>
          ) : (
            <div className="status-badge unanswered">
              <span className="status-icon">⏳</span>
              <span>Not Answered</span>
            </div>
          )}
          
          {isMarkedForReview && (
            <div className="status-badge marked">
              <span className="status-icon">🔖</span>
              <span>Marked</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="question-content">
        <div className="question-text">
          {question.question}
        </div>

        {/* Question Image (if any) */}
        {question.image && (
          <div className="question-image">
            <img src={question.image} alt="Question illustration" />
          </div>
        )}

        {/* Mathematical Formula Support */}
        {question.formula && (
          <div className="question-formula">
            <div className="formula-label">Given Formula:</div>
            <div className="formula-content">{question.formula}</div>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="answer-options">
        <div className="options-header">
          <span>Choose the correct answer:</span>
        </div>
        
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
          const isSelected = selectedOption === option
          
          return (
            <motion.label
              key={index}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="option-selector">
                <input
                  type="radio"
                  name={`question-${questionIndex}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => handleOptionSelect(option)}
                  className="option-radio"
                />
                <div className="option-indicator">
                  <div className="option-letter">{optionLetter}</div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="selection-check"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="option-content">
                <div className="option-text">{option}</div>
              </div>
            </motion.label>
          )
        })}
      </div>

      {/* Question Actions */}
      <div className="question-actions">
        <div className="action-buttons">
          <button
            onClick={onClearResponse}
            className="action-btn clear"
            disabled={!selectedOption}
          >
            <span className="btn-icon">🗑️</span>
            <span>Clear Response</span>
          </button>
          
          <button
            onClick={onMarkForReview}
            className={`action-btn mark ${isMarkedForReview ? 'marked' : ''}`}
          >
            <span className="btn-icon">🔖</span>
            <span>{isMarkedForReview ? 'Unmark' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Selected Answer Display */}
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="selected-answer"
          >
            <div className="selected-label">Your Answer:</div>
            <div className="selected-value">
              <span className="selected-option">
                {String.fromCharCode(65 + question.options.indexOf(selectedOption))}
              </span>
              <span className="selected-text">{selectedOption}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Question Instructions */}
      <div className="question-instructions">
        <div className="instruction-item">
          <span className="instruction-icon">💡</span>
          <span>Click on an option to select your answer</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">🔄</span>
          <span>You can change your answer anytime before submission</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">🔖</span>
          <span>Mark questions for review to revisit them later</span>
        </div>
      </div>
    </div>
  )
}