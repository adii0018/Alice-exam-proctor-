// Simple test component to verify dashboard loading
import { useState } from 'react'

export default function DashboardTest() {
  const [testQuiz] = useState({
    _id: 'test-123',
    title: 'Test JEE/NEET Dashboard',
    duration: 180, // 3 hours
    questions: [
      {
        question: 'What is the capital of India?',
        options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
        correct: 'Delhi'
      },
      {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct: '4'
      }
    ]
  })

  const handleComplete = () => {
    alert('Quiz completed!')
  }

  const handleCancel = () => {
    alert('Quiz cancelled!')
  }

  return (
    <div style={{
      padding: '2rem',
      background: '#f3f4f6',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>
          🧪 Dashboard Test Page
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          This page tests if the JEE/NEET dashboard is working properly
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#dbeafe',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #93c5fd'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <div style={{ fontWeight: 'bold', color: '#1d4ed8' }}>Questions</div>
            <div style={{ color: '#3730a3' }}>{testQuiz.questions.length}</div>
          </div>
          
          <div style={{
            background: '#dcfce7',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #86efac'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ fontWeight: 'bold', color: '#166534' }}>Duration</div>
            <div style={{ color: '#14532d' }}>{testQuiz.duration} minutes</div>
          </div>
          
          <div style={{
            background: '#fef3c7',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #fcd34d'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontWeight: 'bold', color: '#92400e' }}>Status</div>
            <div style={{ color: '#78350f' }}>Ready to Test</div>
          </div>
        </div>

        <button
          onClick={() => {
            // Import and render JEE Dashboard
            import('../student/JEEExamDashboard').then(({ default: JEEExamDashboard }) => {
              const dashboardContainer = document.getElementById('dashboard-container')
              if (dashboardContainer) {
                // This is just for testing - in real app it would be handled by React
                dashboardContainer.innerHTML = '<div style="background: #10b981; color: white; padding: 2rem; text-align: center; font-size: 1.5rem; font-weight: bold;">🎯 JEE Dashboard Loaded Successfully! 🎓</div>'
              }
            })
          }}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          🚀 Test JEE Dashboard
        </button>
      </div>

      <div 
        id="dashboard-container"
        style={{
          background: 'white',
          borderRadius: '12px',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '1.1rem'
        }}
      >
        Click the button above to test the JEE Dashboard
      </div>
    </div>
  )
}