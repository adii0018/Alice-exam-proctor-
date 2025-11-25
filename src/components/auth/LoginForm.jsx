// Login Form - yahan user apna email/password daal kar login karta hai
import { useState } from 'react'
import { motion } from 'framer-motion' // Smooth animations ke liye
import toast from 'react-hot-toast' // Notifications ke liye
import apiService from '../../services/api' // Backend API calls

export default function LoginForm({ onLogin }) {
  // Login form ke saare states yahan manage karte hain
  const [formData, setFormData] = useState({
    email: '', // User ka email
    password: '', // User ka password
  })
  const [loading, setLoading] = useState(false) // Loading state
  const [showPassword, setShowPassword] = useState(false) // Password show/hide toggle

  // Input fields mein change handle karne wala function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Jo field change hui hai uski value update karte hain
    })
  }

  // Form submit handle karne wala function
  const handleSubmit = async (e) => {
    e.preventDefault() // Page reload nahi hone dete
    
    // Validation - saare fields bhare hain ya nahi check karte hain
    if (!formData.email || !formData.password) {
      toast.error('Saare fields bharo bhai!')
      return
    }

    setLoading(true) // Loading start kar dete hain

    try {
      // Backend se login API call karte hain
      const response = await apiService.login(formData.email, formData.password)
      toast.success('Login ho gaya bhai! 🎉') // Success message
      onLogin(response.user) // Parent component ko user data pass karte hain
    } catch (error) {
      // Error handle karte hain
      toast.error(error.response?.data?.message || 'Login nahi hua bhai')
    } finally {
      setLoading(false) // Loading band kar dete hain
    }
  }

  // Demo credentials fill karne wala function - testing ke liye
  const fillDemoCredentials = (role) => {
    if (role === 'student') {
      // Student ke demo credentials
      setFormData({
        email: 'student1@example.com',
        password: 'password123',
      })
    } else {
      // Teacher ke demo credentials
      setFormData({
        email: 'teacher1@example.com',
        password: 'password123',
      })
    }
    toast.success(`Demo ${role} credentials bhar diye!`) // Success message
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Email Address
        </label>
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className="relative"
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-theme"
            required
          />
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: formData.email
                ? '0 0 20px rgba(59, 130, 246, 0.3)'
                : '0 0 0px rgba(59, 130, 246, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Password
        </label>
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className="relative"
        >
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-theme pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-theme"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: formData.password
                ? '0 0 20px rgba(168, 85, 247, 0.3)'
                : '0 0 0px rgba(168, 85, 247, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-theme disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login to Dashboard
            </>
          )}
        </span>
      </motion.button>

      {/* Demo Credentials */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-text-secondary mb-3 text-center">Try Demo Accounts:</p>
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => fillDemoCredentials('student')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-surface border border-border text-text-secondary text-sm rounded-lg hover:bg-surface/80 transition-theme"
          >
            👨‍🎓 Student
          </motion.button>
          <motion.button
            type="button"
            onClick={() => fillDemoCredentials('teacher')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-surface border border-border text-text-secondary text-sm rounded-lg hover:bg-surface/80 transition-theme"
          >
            👨‍🏫 Teacher
          </motion.button>
        </div>
      </div>

      {/* Forgot Password Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <a
          href="#"
          className="text-sm text-text-secondary hover:text-primary transition-theme"
        >
          Forgot your password?
        </a>
      </motion.div>
    </motion.form>
  )
}
