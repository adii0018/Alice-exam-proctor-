import { useState } from 'react'
import '../../styles/teacher-dashboard-test.css'

export default function TeacherDashboardTest() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Generate dummy content for scrolling
  const generateDummyContent = () => {
    const items = []
    for (let i = 1; i <= 50; i++) {
      items.push(
        <div key={i} className="content-item">
          <h3>Content Item {i}</h3>
          <p>This is dummy content to demonstrate scrolling behavior. The header and navigation will stay fixed while only this content area scrolls.</p>
          <div className="item-details">
            <span>Created: {new Date().toLocaleDateString()}</span>
            <span>Status: Active</span>
            <span>Type: Sample Data</span>
          </div>
        </div>
      )
    }
    return items
  }

  return (
    <div className="teacher-dashboard-test">
      {/* FIXED HEADER - Ye hamesha top pe rahega */}
      <header className="fixed-header">
        <div className="header-container">
          <div className="header-left">
            <h1>🎓 Teacher Dashboard</h1>
            <span className="subtitle">Fixed Header Example</span>
          </div>
          <div className="header-right">
            <div className="stats-mini">
              <div className="stat">
                <span className="number">24</span>
                <span className="label">Quizzes</span>
              </div>
              <div className="stat">
                <span className="number">156</span>
                <span className="label">Students</span>
              </div>
            </div>
            <button className="profile-btn">👤 Teacher</button>
          </div>
        </div>
      </header>

      {/* FIXED NAVIGATION - Ye bhi fixed rahega */}
      <nav className="fixed-nav">
        <div className="nav-container">
          {['dashboard', 'quizzes', 'results', 'analytics'].map((tab) => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button className="create-btn">➕ Create Quiz</button>
        </div>
      </nav>

      {/* SCROLLABLE CONTENT - Sirf ye area scroll hoga */}
      <main className="scrollable-content">
        <div className="content-wrapper">
          <div className="page-header">
            <h2>📊 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content</h2>
            <p>Scroll down to see the fixed header behavior in action!</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>24</h3>
                <p>Total Quizzes</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>156</h3>
                <p>Students</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h3>3</h3>
                <p>Active</p>
              </div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <h3>7</h3>
                <p>Flagged</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content List */}
          <div className="content-section">
            <h3>📋 Content List (Scroll to test behavior)</h3>
            <div className="content-list">
              {generateDummyContent()}
            </div>
          </div>

          {/* Footer to show scroll end */}
          <div className="content-footer">
            <p>🎉 You've reached the end! Notice how the header stayed fixed while scrolling.</p>
          </div>
        </div>
      </main>
    </div>
  )
}