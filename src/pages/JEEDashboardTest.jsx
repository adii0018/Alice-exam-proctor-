// Direct JEE Dashboard Test Page
import JEEExamDashboard from '../components/student/JEEExamDashboard'

// Offline mode - no API calls needed
const OFFLINE_MODE = true

export default function JEEDashboardTest() {
  // Mock quiz data for testing
  const mockQuiz = {
    _id: 'test-quiz-123',
    title: 'JEE Main 2024 - Physics, Chemistry, Mathematics',
    duration: 180, // 3 hours
    candidateName: 'Test Student',
    rollNumber: 'JEE2024001',
    questions: [
      {
        question: 'What is the SI unit of force?',
        options: ['Newton', 'Joule', 'Watt', 'Pascal'],
        type: 'Multiple Choice'
      },
      {
        question: 'Which element has atomic number 1?',
        options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'],
        type: 'Multiple Choice'
      },
      {
        question: 'What is the derivative of x²?',
        options: ['x', '2x', 'x²', '2x²'],
        type: 'Multiple Choice'
      },
      {
        question: 'What is the speed of light in vacuum?',
        options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'],
        type: 'Multiple Choice'
      },
      {
        question: 'Which gas is most abundant in Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
        type: 'Multiple Choice'
      }
    ],
    sections: [
      {
        name: 'Physics',
        questions: [
          {
            question: 'What is the SI unit of force?',
            options: ['Newton', 'Joule', 'Watt', 'Pascal'],
            type: 'Multiple Choice'
          },
          {
            question: 'What is the speed of light in vacuum?',
            options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'],
            type: 'Multiple Choice'
          }
        ],
        color: '#3b82f6'
      },
      {
        name: 'Chemistry',
        questions: [
          {
            question: 'Which element has atomic number 1?',
            options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'],
            type: 'Multiple Choice'
          },
          {
            question: 'Which gas is most abundant in Earth\'s atmosphere?',
            options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
            type: 'Multiple Choice'
          }
        ],
        color: '#10b981'
      },
      {
        name: 'Mathematics',
        questions: [
          {
            question: 'What is the derivative of x²?',
            options: ['x', '2x', 'x²', '2x²'],
            type: 'Multiple Choice'
          }
        ],
        color: '#f59e0b'
      }
    ],
    audio_proctoring: {
      enabled: false
    }
  }

  const handleComplete = () => {
    alert('🎉 Quiz Completed Successfully!\n\nThis was a test of the JEE Dashboard.')
  }

  const handleCancel = () => {
    alert('❌ Quiz Cancelled!\n\nReturning to test page.')
  }

  return (
    <div>
      {/* Test Header */}
      <div style={{
        background: '#1f2937',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🧪 JEE Dashboard Direct Test - No Login Required
      </div>

      {/* JEE Dashboard */}
      <JEEExamDashboard
        quiz={mockQuiz}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  )
}