// Quiz Code Entry - yahan student quiz code daal kar quiz start karta hai
import { useState } from 'react'
import { motion } from 'framer-motion' // Smooth animations
import toast from 'react-hot-toast' // Notifications
import apiService from '../../services/api' // Backend API calls
import { playSuccess, playError, playClick, playInfo } from '../../utils/soundUtils'

export default function QuizCodeEntry({ onQuizStart }) {
  // Quiz code entry ke states
  const [code, setCode] = useState('') // User ka enter kiya hua quiz code
  const [loading, setLoading] = useState(false) // Loading state jab quiz search kar rahe hain

  // Quiz code submit karne wala function
  const handleSubmit = async (e) => {
    e.preventDefault() // Page reload nahi hone dete
    
    // Validation - code kam se kam 4 characters ka hona chahiye
    if (!code || code.length < 4) {
      playError();
      toast.error('Sahi quiz code daalo bhai!')
      return
    }

    setLoading(true) // Loading start kar dete hain

    try {
      // Backend se quiz search karte hain code ke basis par
      const quiz = await apiService.getQuizByCode(code.toUpperCase())
      playSuccess(); // Play success sound
      toast.success('Quiz mil gaya! Start kar rahe hain...') // Success message
      onQuizStart(quiz) // Parent component ko quiz data pass karte hain
    } catch (error) {
      console.error('Quiz search mein error:', error)
      // Different types ke errors handle karte hain
      playError(); // Play error sound
      if (error.response?.status === 404) {
        toast.error('Quiz nahi mila. Code check karo bhai.')
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Quiz load nahi hua: ' + (error.message || 'Unknown error'))
      }
    } finally {
      setLoading(false) // Loading band kar dete hain
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-8 rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <svg className="w-8 h-8" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold text-white">Enter Quiz Code</h3>
          <p className="text-sm text-gray-300">Get the code from your teacher</p>
        </div>
      </div>

      {/* User Status Info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Logged in as:</strong> {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Unknown'}
        </div>
        <div className="text-xs text-blue-600 mt-1">
          <strong>Token:</strong> {localStorage.getItem('token') ? '✅ Valid' : '❌ Missing'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="QUIZ-CODE"
            maxLength={20}
            className="w-full p-4 text-center text-2xl font-bold tracking-widest uppercase rounded-xl border-2 transition-all duration-300"
            style={{
              letterSpacing: '0.2em',
              fontSize: '1.5rem',
              background: 'var(--color-surface)',
              borderColor: code.length >= 4 ? 'var(--color-primary)' : 'var(--color-border)',
              color: 'var(--color-text)',
              boxShadow: code.length >= 4 
                ? '0 0 20px rgba(96, 165, 250, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

        <div className="space-y-3">
          {/* Test API Button */}
          <motion.button
            type="button"
            onClick={async () => {
              playClick();
              try {
                const health = await apiService.healthCheck()
                playSuccess();
                toast.success('API Connection: ' + health.status)
                
                // Also test getting quizzes
                const quizzes = await apiService.getQuizzes()
                playInfo();
                toast.success(`Found ${quizzes.length} quizzes in database`)
              } catch (error) {
                console.error('API test failed:', error)
                playError();
                toast.error('API Connection Failed: ' + (error.message || 'Unknown error'))
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-3 font-medium text-blue-600 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Test API Connection
          </motion.button>

          <motion.button
            type="submit"
            disabled={loading || code.length < 4}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 font-bold text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: (loading || code.length < 4) 
                ? 'rgba(107, 114, 128, 0.5)' 
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              cursor: (loading || code.length < 4) ? 'not-allowed' : 'pointer',
              opacity: (loading || code.length < 4) ? 0.5 : 1
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading Quiz...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Start Quiz
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="p-4 rounded-xl text-center transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-2xl mb-1">📹</div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Camera Required</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="p-4 rounded-xl text-center transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-2xl mb-1">🎤</div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Audio Monitored</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="p-4 rounded-xl text-center transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-2xl mb-1">🤖</div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>AI Proctored</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
