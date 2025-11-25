// JEE/NEET Style Question Palette
import { motion } from 'framer-motion'

export default function QuestionPalette({ 
  questions, 
  sections, 
  currentQuestion, 
  answers, 
  markedForReview, 
  visitedQuestions, 
  onNavigateToQuestion, 
  getQuestionStatus 
}) {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return '#10b981' // Green
      case 'not-answered': return '#ef4444' // Red
      case 'marked': return '#8b5cf6' // Purple
      case 'answered-marked': return '#f59e0b' // Orange
      case 'not-visited': return '#e5e7eb' // Gray
      default: return '#e5e7eb'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered': return '✓'
      case 'not-answered': return '✗'
      case 'marked': return '🔖'
      case 'answered-marked': return '✓🔖'
      case 'not-visited': return ''
      default: return ''
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'answered': return 'Answered'
      case 'not-answered': return 'Not Answered'
      case 'marked': return 'Marked for Review'
      case 'answered-marked': return 'Answered & Marked'
      case 'not-visited': return 'Not Visited'
      default: return 'Not Visited'
    }
  }

  // Calculate statistics
  const stats = {
    answered: 0,
    notAnswered: 0,
    marked: 0,
    answeredMarked: 0,
    notVisited: 0
  }

  questions.forEach((_, index) => {
    const status = getQuestionStatus(index)
    switch (status) {
      case 'answered': stats.answered++; break
      case 'not-answered': stats.notAnswered++; break
      case 'marked': stats.marked++; break
      case 'answered-marked': stats.answeredMarked++; break
      case 'not-visited': stats.notVisited++; break
    }
  })

  let questionIndex = 0

  return (
    <div className="question-palette">
      {/* Header */}
      <div className="palette-header">
        <h3>Question Palette</h3>
        <div className="palette-stats">
          <div className="stat-item">
            <span className="stat-value">{Object.keys(answers).length}</span>
            <span className="stat-label">Answered</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{markedForReview.size}</span>
            <span className="stat-label">Marked</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="palette-legend">
        <div className="legend-title">Legend:</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }} />
            <span>Answered</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }} />
            <span>Not Answered</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }} />
            <span>Marked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }} />
            <span>Answered & Marked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e5e7eb' }} />
            <span>Not Visited</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="palette-sections">
        {sections.map((section, sectionIndex) => {
          const sectionStart = questionIndex
          const sectionQuestions = section.questions
          questionIndex += sectionQuestions.length

          return (
            <div key={sectionIndex} className="palette-section">
              <div 
                className="section-header"
                style={{ borderLeftColor: section.color }}
              >
                <h4 style={{ color: section.color }}>{section.name}</h4>
                <span className="section-count">
                  {sectionQuestions.length} Questions
                </span>
              </div>

              <div className="section-questions">
                {sectionQuestions.map((_, qIndex) => {
                  const globalIndex = sectionStart + qIndex
                  const status = getQuestionStatus(globalIndex)
                  const isCurrent = globalIndex === currentQuestion

                  return (
                    <motion.button
                      key={globalIndex}
                      onClick={() => onNavigateToQuestion(globalIndex)}
                      className={`question-btn ${isCurrent ? 'current' : ''}`}
                      style={{
                        backgroundColor: getStatusColor(status),
                        color: status === 'not-visited' ? '#6b7280' : 'white',
                        border: isCurrent ? '3px solid #1d4ed8' : 'none'
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Question ${globalIndex + 1} - ${getStatusLabel(status)}`}
                    >
                      <span className="question-number">{globalIndex + 1}</span>
                      <span className="question-status-icon">
                        {getStatusIcon(status)}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Statistics */}
      <div className="palette-summary">
        <h4>Summary</h4>
        <div className="summary-grid">
          <div className="summary-item answered">
            <div className="summary-count">{stats.answered}</div>
            <div className="summary-label">Answered</div>
          </div>
          
          <div className="summary-item not-answered">
            <div className="summary-count">{stats.notAnswered}</div>
            <div className="summary-label">Not Answered</div>
          </div>
          
          <div className="summary-item marked">
            <div className="summary-count">{stats.marked}</div>
            <div className="summary-label">Marked</div>
          </div>
          
          <div className="summary-item answered-marked">
            <div className="summary-count">{stats.answeredMarked}</div>
            <div className="summary-label">Ans. & Marked</div>
          </div>
          
          <div className="summary-item not-visited">
            <div className="summary-count">{stats.notVisited}</div>
            <div className="summary-label">Not Visited</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="palette-actions">
        <button 
          className="action-btn primary"
          onClick={() => {
            // Navigate to first unanswered question
            const unanswered = questions.findIndex((_, index) => 
              !answers.hasOwnProperty(index) && visitedQuestions.has(index)
            )
            if (unanswered !== -1) {
              onNavigateToQuestion(unanswered)
            }
          }}
        >
          Next Unanswered
        </button>
        
        <button 
          className="action-btn secondary"
          onClick={() => {
            // Navigate to first marked question
            const marked = Array.from(markedForReview)[0]
            if (marked !== undefined) {
              onNavigateToQuestion(marked)
            }
          }}
        >
          Next Marked
        </button>
      </div>

      {/* Progress Bar */}
      <div className="palette-progress">
        <div className="progress-label">
          Overall Progress: {Math.round((Object.keys(answers).length / questions.length) * 100)}%
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}