// Progress Indicator for Exam
import { motion } from 'framer-motion'

export default function ExamProgress({ currentQuestion, totalQuestions, answeredQuestions }) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100
  const completionPercentage = (answeredQuestions / totalQuestions) * 100

  return (
    <div className="exam-progress">
      <div className="progress-header">
        <div className="progress-info">
          <span className="current-question">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="completion-status">
            {answeredQuestions}/{totalQuestions} answered ({Math.round(completionPercentage)}%)
          </span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          {/* Completion Progress (Green) */}
          <motion.div
            className="progress-bar completion"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Current Position (Blue) */}
          <motion.div
            className="progress-bar current"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Question Markers */}
        <div className="question-markers">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <div
              key={index}
              className={`question-marker ${
                index === currentQuestion ? 'current' : 
                index < answeredQuestions ? 'completed' : 'pending'
              }`}
              style={{ left: `${(index / (totalQuestions - 1)) * 100}%` }}
            >
              <div className="marker-dot" />
              <div className="marker-label">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="progress-stats">
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-text">
            <div className="stat-value">{answeredQuestions}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">⏳</div>
          <div className="stat-text">
            <div className="stat-value">{totalQuestions - answeredQuestions}</div>
            <div className="stat-label">Remaining</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-text">
            <div className="stat-value">{Math.round(completionPercentage)}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}