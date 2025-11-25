import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api' 
    : 'http://192.168.29.218:8000/api')

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userName, setUserName] = useState(localStorage.getItem('alice_user_name') || '')
  const [userId, setUserId] = useState(localStorage.getItem('alice_user_id') || '')
  const [showNameModal, setShowNameModal] = useState(!localStorage.getItem('alice_user_name'))
  const [nameInput, setNameInput] = useState('')
  const [theme, setTheme] = useState(localStorage.getItem('alice_theme') || 'ocean')
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [copySuccess, setCopySuccess] = useState({})
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const themes = {
    ocean: {
      name: '🌊 Ocean',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      accent: '#19c37d'
    },
    sunset: {
      name: '🌅 Sunset',
      gradient: 'linear-gradient(135deg, #2d1b4e 0%, #4a1942 50%, #6b1839 100%)',
      accent: '#ff6b9d'
    },
    forest: {
      name: '🌲 Forest',
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      accent: '#4ade80'
    },
    midnight: {
      name: '🌙 Midnight',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      accent: '#a78bfa'
    },
    rose: {
      name: '🌹 Rose',
      gradient: 'linear-gradient(135deg, #3d1635 0%, #5c2a4a 50%, #7b3f5f 100%)',
      accent: '#fda4af'
    }
  }

  const changeTheme = (themeName) => {
    setTheme(themeName)
    localStorage.setItem('alice_theme', themeName)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || loading) return

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: currentInput,
        conversation_id: conversationId,
        user_id: userId
      })

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
      setConversationId(response.data.conversation_id)
      
      // Update conversations list
      if (!conversationId) {
        setConversations(prev => [{
          id: response.data.conversation_id,
          title: currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : ''),
          timestamp: new Date()
        }, ...prev])
      }
    } catch (error) {
      console.error('Error:', error)
      setConnectionStatus('error')
      setTimeout(() => setConnectionStatus('connected'), 3000)
      
      const errorMessage = { 
        role: 'assistant', 
        content: '❌ Sorry, something went wrong. Please check your connection and try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setConversationId(null)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault()
      if (input.trim()) {
        sendMessage(e)
      }
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopySuccess({ ...copySuccess, [index]: true })
    setTimeout(() => {
      setCopySuccess({ ...copySuccess, [index]: false })
    }, 2000)
  }

  const regenerateResponse = async (messageIndex) => {
    const userMessage = messages[messageIndex - 1]
    if (!userMessage || userMessage.role !== 'user') return

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: userMessage.content,
        conversation_id: conversationId,
        user_id: userId
      })

      const newMessages = [...messages]
      newMessages[messageIndex] = { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: new Date().toISOString()
      }
      setMessages(newMessages)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).length
  }

  const exportChat = () => {
    const chatText = messages.map(msg => `${msg.role === 'user' ? 'You' : 'Alice'}: ${msg.content}`).join('\n\n')
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alice-chat-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in your browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + ' ' + transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    if (!nameInput.trim()) return

    try {
      // Create user in backend
      const response = await axios.post(`${API_URL}/user/create`, {
        name: nameInput.trim()
      })

      const { user_id, name } = response.data
      
      // Save to localStorage
      localStorage.setItem('alice_user_name', name)
      localStorage.setItem('alice_user_id', user_id)
      
      setUserName(name)
      setUserId(user_id)
      setShowNameModal(false)
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to save name. Please try again.')
    }
  }

  const examplePrompts = [
    { text: "Explain quantum computing in simple terms", icon: "🔬" },
    { text: "Write a Python function to sort a list", icon: "💻" },
    { text: "What are the best practices for React?", icon: "⚛️" },
    { text: "Help me plan a trip to Japan", icon: "✈️" },
    { text: "Create a REST API with Node.js", icon: "🚀" },
    { text: "Explain machine learning basics", icon: "🤖" }
  ]

  const quickActions = [
    { text: "Summarize this", icon: "📝" },
    { text: "Explain like I'm 5", icon: "👶" },
    { text: "Give me code examples", icon: "💡" },
    { text: "Make it shorter", icon: "✂️" }
  ]

  return (
    <div className="app" style={{ background: themes[theme].gradient }}>
      {/* Top Bar Controls */}
      <div className="top-controls">
        {/* Theme Switcher */}
        <div className={`theme-switcher ${themeMenuOpen ? 'expanded' : 'collapsed'}`}>
          <button 
            className="theme-toggle-btn"
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            title={themeMenuOpen ? 'Close themes' : 'Change theme'}
          >
            <span className="theme-label">🎨</span>
          </button>
          {themeMenuOpen && (
            <div className="theme-options">
              {Object.keys(themes).map((themeName) => (
                <button
                  key={themeName}
                  className={`theme-btn ${theme === themeName ? 'active' : ''}`}
                  onClick={() => changeTheme(themeName)}
                  title={themes[themeName].name}
                >
                  {themes[themeName].name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Button */}
        {messages.length > 0 && (
          <div className="settings-controls">
            <button 
              className="control-btn"
              onClick={exportChat}
              title="Export chat"
            >
              💾
            </button>
            <button 
              className="control-btn"
              onClick={() => setSettingsOpen(!settingsOpen)}
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        )}
      </div>

      {/* Connection Status */}
      {connectionStatus === 'error' && (
        <div className="connection-status error">
          <span className="status-icon">⚠️</span>
          <span className="status-text">Connection error</span>
        </div>
      )}

      {/* Decorative Bows */}
      <div className="bow-decoration bow-1">🎀</div>
      <div className="bow-decoration bow-2">🎀</div>
      <div className="bow-decoration bow-3">🎀</div>
      <div className="bow-decoration bow-4">🎀</div>
      
      {/* Name Modal */}
      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">☁️</div>
              <h2>Welcome to Alice AI</h2>
              <p>What should I call you?</p>
            </div>
            <form onSubmit={handleNameSubmit} className="modal-form">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                className="modal-input"
                autoFocus
                maxLength={30}
              />
              <button 
                type="submit" 
                className="modal-submit"
                disabled={!nameInput.trim()}
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-sidebar">
            {sidebarOpen ? '←' : '→'}
          </button>
          {sidebarOpen && (
            <button onClick={startNewChat} className="new-chat-sidebar">
              <span>+</span> New Chat
            </button>
          )}
        </div>
        
        {sidebarOpen && (
          <div className="conversations-list">
            <h3>Recent Chats</h3>
            {conversations.length === 0 ? (
              <p className="no-chats">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="conversation-item">
                  <span>{conv.title}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        <div className="chat-container">
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.length === 0 && (
              <div className="welcome-screen">
                <div className="logo">
                  <div className="logo-icon">☁️</div>
                  <h1>Alice AI</h1>
                </div>
                <p className="tagline">Hi! I'm Alice, your AI assistant. How can I help you today?</p>
                
                <div className="example-prompts">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="example-prompt"
                      onClick={() => setInput(prompt.text)}
                    >
                      <span className="prompt-icon">{prompt.icon}</span>
                      <span className="prompt-text">{prompt.text}</span>
                    </button>
                  ))}
                </div>

                <div className="quick-actions-section">
                  <h3 className="quick-actions-title">Quick Actions</h3>
                  <div className="quick-actions">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className="quick-action-btn"
                        onClick={() => setInput(action.text)}
                      >
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-text">{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar">
                  <div className="avatar-icon">
                    {msg.role === 'user' ? '👤' : '☁️'}
                  </div>
                  <div className="avatar-info">
                    <div className="avatar-name">
                      {msg.role === 'user' ? 'You' : 'Alice'}
                    </div>
                    {msg.timestamp && (
                      <div className="message-time">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-text">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === 'assistant' && (
                    <>
                      <div className="message-meta">
                        <span className="word-count">{getWordCount(msg.content)} words</span>
                      </div>
                      <div className="message-actions">
                        <button 
                          className="action-btn"
                          onClick={() => copyToClipboard(msg.content, index)}
                          title={copySuccess[index] ? "Copied!" : "Copy"}
                        >
                          {copySuccess[index] ? '✓' : '📋'}
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => regenerateResponse(index)}
                          title="Regenerate"
                          disabled={loading}
                        >
                          🔄
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message-wrapper assistant">
                <div className="message-avatar">
                  <div className="avatar-icon">☁️</div>
                  <div className="avatar-name">Alice</div>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="loading-text">Alice is thinking...</div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button className="scroll-top-btn" onClick={scrollToTop} title="Scroll to top">
              ↑
            </button>
          )}

          <div className="input-container">
            <form onSubmit={sendMessage} className="input-form">
              <div className="input-actions">
                <button 
                  type="button"
                  className="input-action-btn"
                  onClick={handleVoiceInput}
                  title="Voice input"
                  disabled={loading}
                >
                  {isRecording ? '🔴' : '🎤'}
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Alice..."
                disabled={loading}
                className="message-input"
                rows="1"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="send-btn"
                title="Send message"
              >
                {loading ? '⏳' : '↑'}
              </button>
            </form>
            <p className="input-hint">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {messages.length > 0 && (
                <span className="message-count"> • {messages.length} messages</span>
              )}
            </p>
          </div>
          
          <footer className="app-footer">
            <div className="footer-content">
              <span className="footer-text">Made with</span>
              <span className="footer-heart">❤️</span>
              <span className="footer-text">by</span>
              <span className="footer-name">N A R 🎀</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
