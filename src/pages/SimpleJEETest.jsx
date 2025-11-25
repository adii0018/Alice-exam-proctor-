// Simple JEE Dashboard Test - No Network Required
import { useState, useEffect } from 'react'

export default function SimpleJEETest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(10800) // 3 hours
  const [markedForReview, setMarkedForReview] = useState(new Set())

  const questions = [
    {
      question: 'What is the SI unit of force?',
      options: ['Newton', 'Joule', 'Watt', 'Pascal']
    },
    {
      question: 'Which element has atomic number 1?',
      options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon']
    },
    {
      question: 'What is the derivative of x²?',
      options: ['x', '2x', 'x²', '2x²']
    },
    {
      question: 'What is the speed of light in vacuum?',
      options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s']
    },
    {
      question: 'Which gas is most abundant in Earth\'s atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon']
    }
  ]

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleMarkForReview = (questionIndex) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current'
    if (markedForReview.has(index)) {
      return answers[index] !== undefined ? 'answered-marked' : 'marked'
    }
    if (answers[index] !== undefined) return 'answered'
    return 'unanswered'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return '#3b82f6'
      case 'answered': return '#10b981'
      case 'marked': return '#8b5cf6'
      case 'answered-marked': return '#f59e0b'
      default: return '#e5e7eb'
    }
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      {/* Test Banner */}
      <div style={{
        background: '#1f2937',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🧪 Simple JEE Dashboard Test - No Network Required
      </div>

      {/* JEE Confirmation Banner */}
      <div style={{
        background: '#10b981',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        🎯 JEE/NEET Style Professional Exam Dashboard Active! 🎓
      </div>

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>
            JEE Main 2024 - Physics, Chemistry, Mathematics
          </h1>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            <span>Candidate: Test Student</span>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span>Roll No: JEE2024001</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
            TIME LEFT
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            fontFamily: 'Courier New, monospace',
            color: timeLeft < 60 ? '#ef4444' : timeLeft < 300 ? '#f59e0b' : '#10b981'
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{
            padding: '0.75rem 1rem',
            background: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            color: '#1d4ed8',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            🧮 Calculator
          </button>
          <button style={{
            padding: '0.75rem 1rem',
            background: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: '8px',
            color: '#166534',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            📝 Rough Work
          </button>
          <button style={{
            padding: '0.75rem 1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '8px',
            color: '#92400e',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            📋 Review
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', height: 'calc(100vh - 200px)', gap: '1rem', padding: '1rem 2rem' }}>
        {/* Left Panel - Question */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Question Card */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            flex: 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Question</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937' }}>{currentQuestion + 1}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>Multiple Choice</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>⏱️ 2:30</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {answers[currentQuestion] ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#166534'
                  }}>
                    <span>✓</span>
                    <span>Answered</span>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#dc2626'
                  }}>
                    <span>⏳</span>
                    <span>Not Answered</span>
                  </div>
                )}
                
                {markedForReview.has(currentQuestion) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#f3e8ff',
                    border: '1px solid #c4b5fd',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#7c3aed'
                  }}>
                    <span>🔖</span>
                    <span>Marked</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#1f2937', marginBottom: '1rem' }}>
                {currentQuestionData.question}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                Choose the correct answer:
              </div>
              
              {currentQuestionData.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index)
                const isSelected = answers[currentQuestion] === option
                
                return (
                  <label
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      background: isSelected ? '#dbeafe' : '#f9fafb',
                      border: isSelected ? '2px solid #3b82f6' : '2px solid #f3f4f6',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleAnswerChange(currentQuestion, option)}
                  >
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      border: isSelected ? '2px solid #3b82f6' : '2px solid #d1d5db',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected ? '#3b82f6' : 'transparent',
                      color: isSelected ? 'white' : '#6b7280',
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}>
                      {isSelected ? '✓' : optionLetter}
                    </div>
                    <div style={{ flex: 1, fontSize: '1rem', lineHeight: 1.5, color: '#374151' }}>
                      {option}
                    </div>
                  </label>
                )
              })}
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => {
                    setAnswers(prev => {
                      const newAnswers = { ...prev }
                      delete newAnswers[currentQuestion]
                      return newAnswers
                    })
                  }}
                  disabled={!answers[currentQuestion]}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontWeight: 600,
                    cursor: answers[currentQuestion] ? 'pointer' : 'not-allowed',
                    opacity: answers[currentQuestion] ? 1 : 0.5
                  }}
                >
                  <span>🗑️</span>
                  <span>Clear Response</span>
                </button>
                
                <button
                  onClick={() => handleMarkForReview(currentQuestion)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: markedForReview.has(currentQuestion) ? '#8b5cf6' : '#f3e8ff',
                    border: '1px solid #c4b5fd',
                    borderRadius: '8px',
                    color: markedForReview.has(currentQuestion) ? 'white' : '#7c3aed',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>🔖</span>
                  <span>{markedForReview.has(currentQuestion) ? 'Unmark' : 'Mark for Review'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#374151',
                  fontWeight: 600,
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentQuestion === 0 ? 0.5 : 1
                }}
              >
                <span>⬅️</span>
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === questions.length - 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: currentQuestion === questions.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentQuestion === questions.length - 1 ? 0.5 : 1
                }}
              >
                <span>Save & Next</span>
                <span>➡️</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Question Palette */}
        <div style={{
          width: '350px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: '0 0 0.5rem 0' }}>
              Question Palette
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>
                  {Object.keys(answers).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Answered</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>
                  {markedForReview.size}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Marked</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Legend:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                <span>Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
                <span>Not Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8b5cf6' }} />
                <span>Marked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }} />
                <span>Ans + Marked</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {questions.map((_, index) => {
              const status = getQuestionStatus(index)
              const statusColor = getStatusColor(status)
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '8px',
                    border: index === currentQuestion ? '3px solid #1d4ed8' : 'none',
                    background: statusColor,
                    color: status === 'unanswered' ? '#6b7280' : 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}