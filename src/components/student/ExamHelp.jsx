// Help Panel for Exam
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ExamHelp({ onClose }) {
  const [activeTab, setActiveTab] = useState('navigation')

  const helpSections = {
    navigation: {
      icon: '🧭',
      title: 'Navigation',
      content: [
        {
          icon: '⬅️➡️',
          title: 'Question Navigation',
          description: 'Use Previous/Next buttons or click question numbers in the sidebar to move between questions.'
        },
        {
          icon: '📋',
          title: 'Question Overview',
          description: 'Click the sidebar button to see all questions at once. Green = answered, Blue = current, Gray = unanswered.'
        },
        {
          icon: '🎯',
          title: 'Quick Jump',
          description: 'Click any question number to jump directly to that question.'
        }
      ]
    },
    camera: {
      icon: '📹',
      title: 'Camera & Monitoring',
      content: [
        {
          icon: '👤',
          title: 'Face Visibility',
          description: 'Keep your face visible and centered in the camera. The system monitors for multiple faces or absence.'
        },
        {
          icon: '💡',
          title: 'Lighting',
          description: 'Ensure good lighting so your face is clearly visible. Avoid backlighting or shadows.'
        },
        {
          icon: '🔄',
          title: 'Camera Position',
          description: 'You can drag the camera window to reposition it if it blocks content.'
        }
      ]
    },
    rules: {
      icon: '⚠️',
      title: 'Exam Rules',
      content: [
        {
          icon: '🚫',
          title: 'No Tab Switching',
          description: 'Do not switch tabs, open new windows, or navigate away from the exam. This will be flagged as cheating.'
        },
        {
          icon: '🔧',
          title: 'No Developer Tools',
          description: 'F12, Ctrl+Shift+I, and other developer shortcuts are disabled and monitored.'
        },
        {
          icon: '📸',
          title: 'No Screenshots',
          description: 'PrintScreen and screenshot tools are disabled during the exam.'
        },
        {
          icon: '👥',
          title: 'Work Alone',
          description: 'Only one person should be visible in the camera. Multiple faces will trigger violations.'
        }
      ]
    },
    tips: {
      icon: '💡',
      title: 'Tips & Tricks',
      content: [
        {
          icon: '📖',
          title: 'Read Carefully',
          description: 'Read each question thoroughly before selecting an answer. You can change answers before submitting.'
        },
        {
          icon: '⏰',
          title: 'Time Management',
          description: 'Keep an eye on the timer. Spend appropriate time on each question based on difficulty.'
        },
        {
          icon: '✅',
          title: 'Review Answers',
          description: 'Use the question navigator to review your answers before final submission.'
        },
        {
          icon: '🎯',
          title: 'Stay Focused',
          description: 'Maintain focus on the exam. The system tracks your engagement and focus time.'
        }
      ]
    },
    technical: {
      icon: '⚙️',
      title: 'Technical Support',
      content: [
        {
          icon: '🔊',
          title: 'Audio Issues',
          description: 'If audio monitoring is enabled, ensure your microphone is working and permissions are granted.'
        },
        {
          icon: '📱',
          title: 'Connection Problems',
          description: 'If you lose internet connection, the exam will pause. Reconnect quickly to continue.'
        },
        {
          icon: '💾',
          title: 'Auto-Save',
          description: 'Your answers are automatically saved as you select them. No need to manually save.'
        },
        {
          icon: '🔄',
          title: 'Browser Issues',
          description: 'Use Chrome or Firefox for best experience. Avoid Safari or Internet Explorer.'
        }
      ]
    }
  }

  const tabs = Object.keys(helpSections)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="exam-help-panel"
    >
      <div className="help-header">
        <div className="help-title">
          <div className="title-icon">❓</div>
          <div>
            <h3>Exam Help & Instructions</h3>
            <p>Everything you need to know about taking the exam</p>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>

      <div className="help-content">
        {/* Tab Navigation */}
        <div className="help-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`help-tab ${activeTab === tab ? 'active' : ''}`}
            >
              <span className="tab-icon">{helpSections[tab].icon}</span>
              <span className="tab-title">{helpSections[tab].title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="help-tab-content"
        >
          <div className="help-items">
            {helpSections[activeTab].content.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="help-item"
              >
                <div className="help-item-icon">{item.icon}</div>
                <div className="help-item-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Emergency Contact */}
      <div className="help-footer">
        <div className="emergency-contact">
          <div className="contact-icon">🆘</div>
          <div className="contact-info">
            <h4>Need Immediate Help?</h4>
            <p>If you encounter technical issues during the exam, contact your instructor immediately.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}