import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizList from './QuizList'
import QuizCreator from './QuizCreator'
import QuizResults from './QuizResults'
import QuizStatistics from './QuizStatistics'
import FlagMonitor from './FlagMonitor'
import '../../styles/teacher-dashboard.css'

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [showCreateQuiz, setShowCreateQuiz] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalStudents: 0,
    flaggedAttempts: 0
  })

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalQuizzes: 24,
      activeQuizzes: 3,
      totalStudents: 156,
      flaggedAttempts: 7
    })
  }, [])

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'quizzes', label: 'Quizzes', icon: '📝' },
    { id: 'results', label: 'Results', icon: '📈' },
    { id: 'monitoring', label: 'Monitoring', icon: '👁️' },
    { id: 'analytics', label: 'Analytics', icon: '📉' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />
      case 'quizzes':
        return <QuizList onSelectQuiz={setSelectedQuiz} onCreateNew={() => setShowCreateQuiz(true)} />
      case 'results':
        return <QuizResults selectedQuiz={selectedQuiz} />
      case 'monitoring':
        return <FlagMonitor />
      case 'analytics':
        return <QuizStatistics />
      default:
        return <DashboardOverview stats={stats} />
    }
  }

  return (
    <div className="teacher-dashboard">
      {/* Fixed Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <span className="title-icon">🎓</span>
              Teacher Dashboard
            </h1>
            <div className="breadcrumb">
              <span>Home</span>
              <span className="separator">/</span>
              <span className="current">{tabs.find(tab => tab.id === activeTab)?.label}</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.activeQuizzes}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.flaggedAttempts}</span>
                <span className="stat-label">Flagged</span>
              </div>
            </div>
            
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            
            <div className="user-profile">
              <img src="/api/placeholder/32/32" alt="Profile" className="profile-avatar" />
              <span className="profile-name">Teacher</span>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Navigation Tabs */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <button 
            className="create-quiz-btn"
            onClick={() => setShowCreateQuiz(true)}
          >
            <span className="btn-icon">➕</span>
            Create Quiz
          </button>
        </div>
      </nav>

      {/* Scrollable Main Content */}
      <main className="dashboard-main">
        <div className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="content-container"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showCreateQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowCreateQuiz(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <QuizCreator onClose={() => setShowCreateQuiz(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Dashboard Overview Component
function DashboardOverview({ stats }) {
  return (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
        
        <div className="stat-card active">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h3>{stats.activeQuizzes}</h3>
            <p>Active Quizzes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.flaggedAttempts}</h3>
            <p>Flagged Attempts</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p><strong>New quiz created:</strong> "Physics Chapter 1"</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">⚠️</div>
            <div className="activity-content">
              <p><strong>Violation detected:</strong> Student switched tabs</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p><strong>Quiz completed:</strong> 25 students finished "Math Test"</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span>Create Quiz</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">👁️</span>
            <span>Monitor Live</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}