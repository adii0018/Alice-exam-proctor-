// Teacher Dashboard - yahan teacher apne saare quizzes manage kar sakta hai
import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations
import toast from 'react-hot-toast' // Notifications ke liye
import apiService from '../services/api' // Backend API calls
import QuizList from '../components/teacher/QuizList' // Quizzes ki list dikhane ke liye
import QuizCreator from '../components/teacher/QuizCreator' // Naya quiz banane ke liye
import FlagMonitor from '../components/teacher/FlagMonitor' // Violations monitor karne ke liye
import QuizResults from '../components/teacher/QuizResults' // Quiz results dekhne ke liye
import QuizSearchBar from '../components/teacher/QuizSearchBar' // Quiz search karne ke liye
import CherryBlossomBackground from '../components/effects/CherryBlossomBackground' // Background effect
import ASRLogo from '../components/common/ASRLogo' // Company logo
// import QuickQuizCreator from '../components/debug/QuickQuizCreator' // Quick quiz creation (debug) - REMOVED
import { filterQuizzes } from '../utils/quizFilters' // Quiz filtering utilities
import { performCompleteLogout } from '../utils/authFix' // Auth fix utility
import AnimatedLogoutButton from '../components/ui/AnimatedLogoutButton' // Animated logout button
import '../styles/circle-dashboard.css' // Dashboard styling
import '../styles/dashboard-text-visibility.css' // Text visibility fixes
import '../styles/teacher-components-visibility.css' // Teacher specific styles
import '../styles/teacher-text-visibility.css' // Enhanced teacher text visibility
import '../styles/teacher-header-fix.css' // Emergency header text fix
import '../styles/teacher-header-layout.css' // Header layout fix
import '../styles/logout-button-fix.css' // Logout button visibility fix
import '../styles/dashboard-color-themes.css' // Color themes

export default function TeacherDashboard({ user, onLogout }) {
  // Teacher dashboard ke saare states yahan manage karte hain
  const [activeTab, setActiveTab] = useState('overview') // Current active tab
  const [quizzes, setQuizzes] = useState([]) // Teacher ke saare quizzes
  const [stats, setStats] = useState({
    totalQuizzes: 0, // Total quizzes count
    activeQuizzes: 0, // Active quizzes count
    totalSubmissions: 0, // Total submissions count
    totalFlags: 0, // Total violations count
  })
  const [loading, setLoading] = useState(true) // Loading state
  const [currentTime, setCurrentTime] = useState(new Date()) // Current time display ke liye
  const [currentTheme, setCurrentTheme] = useState('theme-ocean') // Current color theme

  // Filter state
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null })
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchData()
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('teacherDashboardTheme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('teacherDashboardTheme', currentTheme)
  }, [currentTheme])

  const fetchData = async () => {
    setLoading(true)
    try {
      const quizzesData = await apiService.getQuizzes()
      setQuizzes(quizzesData)
      
      // Calculate stats
      const activeCount = quizzesData.filter(q => q.is_active).length
      setStats({
        totalQuizzes: quizzesData.length,
        activeQuizzes: activeCount,
        totalSubmissions: 0, // Will be calculated from submissions
        totalFlags: 0, // Will be calculated from flags
      })
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Filter quizzes using useMemo
  const filteredQuizzes = useMemo(() => {
    return filterQuizzes(quizzes, {
      searchText,
      dateFilter,
      customDateRange,
      statusFilter,
      sortBy,
    })
  }, [quizzes, searchText, dateFilter, customDateRange, statusFilter, sortBy])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchText !== '' ||
      dateFilter !== 'all' ||
      statusFilter !== 'all' ||
      sortBy !== 'date-desc'
    )
  }, [searchText, dateFilter, statusFilter, sortBy])

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setSearchText('')
    setDateFilter('all')
    setCustomDateRange({ start: null, end: null })
    setStatusFilter('all')
    setSortBy('date-desc')
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠', gradient: 'from-blue-500 to-purple-600' },
    { id: 'quizzes', label: 'My Quizzes', icon: '📚', gradient: 'from-green-500 to-teal-600' },
    { id: 'create', label: 'Create Quiz', icon: '✨', gradient: 'from-orange-500 to-red-600' },
    { id: 'results', label: 'Analytics', icon: '📈', gradient: 'from-purple-500 to-pink-600' },
    { id: 'monitor', label: 'Live Monitor', icon: '👀', gradient: 'from-indigo-500 to-blue-600' },
  ]

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className={`teacher-dashboard ${currentTheme}`}>
      {/* Fixed Background Layer */}
      <CherryBlossomBackground />
      
      {/* Scrollable Content Layer */}
      <div className="scrollable-content">
        {/* Enhanced Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="teacher-nav"
        >
        <div className="teacher-nav-container">
          <motion.div 
            className="teacher-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-icon">
              <ASRLogo 
                className="flex gap-1" 
                size="text-lg"
                animated={true}
              />
            </div>
            <div className="logo-text">
              <span className="logo-main">Ａʟ ɪ c ᴇㅤ☁</span>
              <span className="logo-sub">Teacher Portal</span>
            </div>
          </motion.div>
          
          <div className="teacher-nav-menu">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                className={`teacher-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          <div className="teacher-user-section">
            {/* Theme Selector */}
            <div className="theme-selector">
              <select 
                value={currentTheme} 
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="theme-dropdown"
              >
                <option value="theme-ocean">🌊 Ocean Blue</option>
                <option value="theme-forest">🌲 Forest Green</option>
                <option value="theme-sunset">🌅 Sunset Orange</option>
                <option value="theme-galaxy">🌌 Purple Galaxy</option>
                <option value="theme-rose">🌹 Rose Gold</option>
                <option value="theme-dark">🌙 Dark Mode</option>
              </select>
            </div>
            
            <div className="time-display">
              <div className="current-time">{formatTime()}</div>
              <div className="current-date">{currentTime.toLocaleDateString()}</div>
            </div>
            <motion.div 
              className="teacher-user-profile"
              whileHover={{ scale: 1.05 }}
            >
              <div className="user-avatar">
                <span>{user?.name?.charAt(0) || 'T'}</span>
                <div className="status-indicator"></div>
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Teacher'}</div>
                <div className="user-role">Educator</div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        className="teacher-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="hero-greeting">
              {getGreeting()}, {user?.name || 'Teacher'}! 👋
            </h1>
            <p className="hero-subtitle">
              Ready to inspire minds and shape futures? Let's make learning amazing today.
            </p>
          </motion.div>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="quick-stat">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalQuizzes}</div>
                <div className="stat-label">Total Quizzes</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-number">{stats.activeQuizzes}</div>
                <div className="stat-label">Active Now</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalSubmissions}</div>
                <div className="stat-label">Submissions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="teacher-main">{loading && (
          <motion.div 
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="loading-text">Loading your dashboard...</div>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overview-section"
            >
              {/* Quick Actions */}
              <div className="quick-actions">
                <h3 className="section-title">Quick Actions</h3>
                <div className="action-grid">
                  <motion.button
                    className="action-card create-quiz"
                    onClick={() => setActiveTab('create')}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="action-icon">✨</div>
                    <div className="action-content">
                      <h4>Create New Quiz</h4>
                      <p>Design engaging assessments</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </motion.button>
                  
                  <motion.button
                    className="action-card view-quizzes"
                    onClick={() => setActiveTab('quizzes')}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="action-icon">📚</div>
                    <div className="action-content">
                      <h4>Manage Quizzes</h4>
                      <p>View and edit your quizzes</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </motion.button>
                  
                  <motion.button
                    className="action-card monitor-live"
                    onClick={() => setActiveTab('monitor')}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="action-icon">👀</div>
                    <div className="action-content">
                      <h4>Live Monitor</h4>
                      <p>Watch students in real-time</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </motion.button>
                  
                  <motion.button
                    className="action-card view-analytics"
                    onClick={() => setActiveTab('results')}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="action-icon">📈</div>
                    <div className="action-content">
                      <h4>View Analytics</h4>
                      <p>Analyze performance data</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </motion.button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h3 className="section-title">Recent Activity</h3>
                <div className="activity-card">
                  <div className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-content">
                      <p><strong>Quiz Created:</strong> "Advanced Mathematics"</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">👥</div>
                    <div className="activity-content">
                      <p><strong>15 students</strong> completed "Physics Quiz"</p>
                      <span className="activity-time">4 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">🚨</div>
                    <div className="activity-content">
                      <p><strong>3 flags</strong> detected in "Chemistry Test"</p>
                      <span className="activity-time">6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="content-section"
            >
              <div className="section-header">
                <h2 className="section-title">📚 My Quizzes</h2>
                <p className="section-subtitle">Manage and organize your quiz collection</p>
              </div>
              <div className="content-card">
                <QuizSearchBar
                  searchText={searchText}
                  setSearchText={setSearchText}
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  customDateRange={customDateRange}
                  setCustomDateRange={setCustomDateRange}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  hasActiveFilters={hasActiveFilters}
                  onClearAllFilters={handleClearAllFilters}
                />
                <QuizList 
                  quizzes={filteredQuizzes} 
                  onQuizUpdate={fetchData}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="content-section"
            >
              <div className="section-header">
                <h2 className="section-title">✨ Create New Quiz</h2>
                <p className="section-subtitle">Design engaging assessments for your students</p>
              </div>
              <div className="content-card">
                {/* Quick Test Quiz Creator - REMOVED */}
                
                {/* Full Quiz Creator */}
                <QuizCreator onQuizCreated={fetchData} />
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="content-section"
            >
              <div className="section-header">
                <h2 className="section-title">📈 Analytics & Results</h2>
                <p className="section-subtitle">Analyze student performance and quiz statistics</p>
              </div>
              <div className="content-card">
                <QuizResults />
              </div>
            </motion.div>
          )}

          {activeTab === 'monitor' && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="content-section"
            >
              <div className="section-header">
                <h2 className="section-title">👀 Live Monitor</h2>
                <p className="section-subtitle">Real-time student monitoring and flag detection</p>
              </div>
              <div className="content-card">
                <FlagMonitor />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div> {/* End scrollable-content */}

      {/* Floating Logout Button */}
      <motion.div
        className="floating-logout-container"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99999
        }}
      >
        <AnimatedLogoutButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚪 Teacher logout button clicked!');
            
            // Call the onLogout prop from App.jsx (Alice loader will handle the rest)
            if (onLogout) {
              onLogout();
            } else {
              performCompleteLogout();
            }
          }}
          className="floating-logout-btn"
        />
      </motion.div>
    </div>
  )
}