import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'
import './AliceAI.css'

const API_URL = import.meta.env.VITE_AI_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8001/api' 
    : 'http://192.168.29.218:8001/api')

function AliceAI({ isOpen, onClose }) {
  // Debug logging
  console.log('AliceAI component rendered with isOpen:', isOpen);
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState(localStorage.getItem('alice_user_name') || '')
  const [userId, setUserId] = useState(localStorage.getItem('alice_user_id') || '')
  const [showNameModal, setShowNameModal] = useState(!localStorage.getItem('alice_user_name'))
  const [nameInput, setNameInput] = useState('')
  const [copySuccess, setCopySuccess] = useState({})
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      const response = await axios.post(`${API_URL}/chat/`, {
        message: currentInput,
        conversation_id: conversationId,
        user_id: userId
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout for AI responses
      })

      const aiMessage = { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
      setConversationId(response.data.conversation_id)
      
    } catch (error) {
      console.error('Chat Error:', error)
      console.error('Chat Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: `${API_URL}/chat/`
      })
      setConnectionStatus('error')
      setTimeout(() => setConnectionStatus('connected'), 3000)
      
      let errorText = '❌ Sorry, something went wrong. Please check your connection and try again.'
      if (error.response?.status === 404) {
        errorText = '❌ AI service not found. Please check if the backend is running on the correct port.'
      } else if (error.code === 'ECONNREFUSED') {
        errorText = '❌ Cannot connect to AI service. Please check if the backend is running.'
      }
      
      const errorMessage = { 
        role: 'assistant', 
        content: errorText,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
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

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    if (!nameInput.trim()) return

    try {
      console.log('Creating user with API URL:', API_URL)
      const response = await axios.post(`${API_URL}/user/create/`, {
        name: nameInput.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      })

      console.log('User creation response:', response.data)
      const { user_id, name } = response.data
      
      localStorage.setItem('alice_user_name', name)
      localStorage.setItem('alice_user_id', user_id)
      
      setUserName(name)
      setUserId(user_id)
      setShowNameModal(false)
    } catch (error) {
      console.error('Error creating user:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: `${API_URL}/user/create/`
      })
      
      let errorMessage = 'Failed to save name. Please try again.'
      if (error.response?.status === 404) {
        errorMessage = 'AI service not available. Please check if the backend is running.'
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to AI service. Please check your connection.'
      }
      
      alert(errorMessage)
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="alice-ai-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="alice-ai-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="alice-header">
            <div className="alice-title">
              <span className="alice-icon">☁️</span>
              <h2>Alice AI Assistant</h2>
            </div>
            <button className="alice-close" onClick={onClose}>×</button>
          </div>

          {/* Name Modal */}
          {showNameModal && (
            <div className="alice-name-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-icon">☁️</div>
                  <h3>Welcome to Alice AI</h3>
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

          {/* Messages */}
          <div className="alice-messages">
            {messages.length === 0 && !showNameModal && (
              <div className="alice-welcome">
                <div className="welcome-logo">
                  <div className="logo-icon">☁️</div>
                  <h3>Alice AI</h3>
                </div>
                <p className="welcome-text">Hi {userName}! I'm Alice, your AI assistant. How can I help you today?</p>
                
                <div className="example-prompts">
                  {examplePrompts.slice(0, 4).map((prompt, index) => (
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
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`alice-message ${msg.role}`}>
                <div className="message-avatar">
                  <div className="avatar-icon">
                    {msg.role === 'user' ? '👤' : '☁️'}
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.role === 'user' ? 'You' : 'Alice'}
                    </span>
                    {msg.timestamp && (
                      <span className="message-time">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    )}
                  </div>
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
                    <div className="message-actions">
                      <button 
                        className="action-btn"
                        onClick={() => copyToClipboard(msg.content, index)}
                        title={copySuccess[index] ? "Copied!" : "Copy"}
                      >
                        {copySuccess[index] ? '✓' : '📋'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="alice-message assistant">
                <div className="message-avatar">
                  <div className="avatar-icon">☁️</div>
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

          {/* Input */}
          <div className="alice-input">
            <form onSubmit={sendMessage} className="input-form">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Alice..."
                disabled={loading || showNameModal}
                className="message-input"
                rows="1"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim() || showNameModal} 
                className="send-btn"
                title="Send message"
              >
                {loading ? '⏳' : '↑'}
              </button>
            </form>
            <p className="input-hint">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AliceAI