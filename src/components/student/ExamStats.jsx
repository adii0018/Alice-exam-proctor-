// Statistics Panel for Exam
import { motion } from 'framer-motion'

export default function ExamStats({ 
  answeredQuestions, 
  totalQuestions, 
  timeLeft, 
  focusTime, 
  keystrokes, 
  mouseClicks, 
  violationCount,
  onClose 
}) {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100)
  const focusPercentage = Math.round((focusTime / (focusTime + (Date.now() - Date.now()))) * 100) || 100

  const stats = [
    {
      icon: '📊',
      title: 'Progress',
      value: `${completionPercentage}%`,
      subtitle: `${answeredQuestions}/${totalQuestions} questions`,
      color: 'blue',
      trend: completionPercentage > 50 ? 'up' : 'neutral'
    },
    {
      icon: '⏱️',
      title: 'Time Left',
      value: formatTime(timeLeft),
      subtitle: timeLeft < 300 ? 'Hurry up!' : 'You have time',
      color: timeLeft < 60 ? 'red' : timeLeft < 300 ? 'yellow' : 'green',
      trend: 'down'
    },
    {
      icon: '🎯',
      title: 'Focus Time',
      value: formatTime(focusTime),
      subtitle: `${focusPercentage}% focused`,
      color: 'purple',
      trend: focusPercentage > 80 ? 'up' : 'neutral'
    },
    {
      icon: '⌨️',
      title: 'Activity',
      value: keystrokes,
      subtitle: `${mouseClicks} clicks`,
      color: 'indigo',
      trend: 'up'
    },
    {
      icon: '⚠️',
      title: 'Violations',
      value: violationCount,
      subtitle: violationCount > 0 ? 'Stay focused!' : 'Good job!',
      color: violationCount > 0 ? 'red' : 'green',
      trend: violationCount > 0 ? 'down' : 'up'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="exam-stats-panel"
    >
      <div className="stats-header">
        <div className="stats-title">
          <div className="title-icon">📊</div>
          <div>
            <h3>Exam Statistics</h3>
            <p>Real-time performance metrics</p>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`stat-card ${stat.color}`}
          >
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' ? '↗️' : stat.trend === 'down' ? '↘️' : '➡️'}
              </div>
            </div>
            
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-subtitle">{stat.subtitle}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Insights */}
      <div className="performance-insights">
        <h4>💡 Performance Insights</h4>
        <div className="insights-list">
          {completionPercentage < 30 && (
            <div className="insight warning">
              <span>⚡</span>
              <span>You're moving slowly. Try to pick up the pace!</span>
            </div>
          )}
          
          {violationCount > 0 && (
            <div className="insight error">
              <span>⚠️</span>
              <span>Avoid tab switching and stay focused on the exam.</span>
            </div>
          )}
          
          {focusPercentage > 90 && (
            <div className="insight success">
              <span>🎯</span>
              <span>Excellent focus! Keep up the great work.</span>
            </div>
          )}
          
          {timeLeft < 300 && completionPercentage < 80 && (
            <div className="insight warning">
              <span>⏰</span>
              <span>Time is running out. Focus on unanswered questions.</span>
            </div>
          )}
          
          {completionPercentage > 80 && violationCount === 0 && (
            <div className="insight success">
              <span>🌟</span>
              <span>You're doing great! Almost there.</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>🚀 Quick Actions</h4>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.scrollTo(0, 0)}>
            <span>⬆️</span>
            <span>Scroll to Top</span>
          </button>
          
          <button className="action-btn" onClick={() => {
            const unanswered = Array.from({ length: totalQuestions }, (_, i) => i)
              .find(i => !Object.keys(answers).includes(i.toString()))
            if (unanswered !== undefined) {
              // Navigate to first unanswered question
              console.log('Navigate to question:', unanswered)
            }
          }}>
            <span>🎯</span>
            <span>Next Unanswered</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}