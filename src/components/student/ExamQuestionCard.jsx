// Enhanced Question Card for Exam
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function ExamQuestionCard({ question, questionIndex, answer, onAnswerChange }) {
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

  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="exam-question-card"
    >
      {/* Question Header */}
      <div className="question-header">
        <div className="question-number">
          <div className="number-badge">
            {questionIndex + 1}
          </div>
          <div className="question-meta">
            <div className="question-type">Multiple Choice</div>
            <div className="time-spent">⏱️ {formatTime(timeSpent)}</div>
          </div>
        </div>
        
        <div className="question-status">
          {selectedOption ? (
            <div className="status-badge answered">
              <span>✅</span>
              <span>Answered</span>
            </div>
          ) : (
            <div className="status-badge unanswered">
              <span>⏳</span>
              <span>Not Answered</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
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
      </div>

      {/* Answer Options */}
      <div className="answer-options">
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
          const isSelected = selectedOption === option
          
          return (
            <motion.label
              key={index}
              className={`option-card ${isSelected ? 'selected' : ''}`}
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

      {/* Question Footer */}
      <div className="question-footer">
        <div className="question-info">
          <div className="info-item">
            <span className="info-icon">📝</span>
            <span>Select one answer</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔄</span>
            <span>You can change your answer</span>
          </div>
        </div>
        
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="selected-answer"
          >
            <span className="selected-label">Selected:</span>
            <span className="selected-value">{selectedOption}</span>
          </motion.div>
        )}
      </div>

      {/* Confidence Meter (Optional) */}
      <div className="confidence-meter">
        <div className="confidence-label">How confident are you?</div>
        <div className="confidence-options">
          {['😰', '😐', '😊', '😎'].map((emoji, index) => (
            <button
              key={index}
              className="confidence-btn"
              title={['Not sure', 'Somewhat sure', 'Confident', 'Very confident'][index]}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}