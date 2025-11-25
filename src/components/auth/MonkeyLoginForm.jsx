import { useState } from 'react'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import apiService from '../../services/api'

export default function MonkeyLoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await apiService.login(formData.email, formData.password)
      toast.success('Login successful! 🎉')
      onLogin(response.user)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (role) => {
    if (role === 'student') {
      setFormData({
        email: 'student1@example.com',
        password: 'password123',
      })
    } else {
      setFormData({
        email: 'teacher1@example.com',
        password: 'password123',
      })
    }
    toast.success(`Demo ${role} credentials filled!`)
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      toast.loading('Logging in with Google...')
      // For now, we'll decode the JWT token to get user info
      const credential = credentialResponse.credential
      const base64Url = credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      const userInfo = JSON.parse(jsonPayload)
      
      // Create a mock user object (in production, send to backend)
      const mockUser = {
        _id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        role: 'student', // Default role
        profile_image: userInfo.picture,
      }
      
      // Store in localStorage
      localStorage.setItem('token', credential)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      toast.dismiss()
      toast.success(`Welcome ${userInfo.name}! 🎉`)
      onLogin(mockUser)
    } catch (error) {
      toast.dismiss()
      toast.error('Google login failed. Please try again.')
      console.error('Google login error:', error)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Monkey Avatar */}
      <motion.label
        htmlFor="blind-input"
        whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
        className="block w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-8 cursor-pointer relative overflow-hidden rounded-full border-4 shadow-xl monkey-avatar"
        style={{
          perspective: '80px',
        }}
      >
        {/* Monkey Face SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          className="absolute inset-0"
          animate={{
            rotateY: showPassword ? 0 : [0, -4, 4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ellipse cx="53.7" cy="33" rx="8.3" ry="8.2" fill="#89664c" />
          <ellipse cx="53.7" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3" />
          <ellipse cx="10.2" cy="33" rx="8.2" ry="8.2" fill="#89664c" />
          <ellipse cx="10.2" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3" />
          <g fill="#89664c">
            <path d="m43.4 10.8c1.1-.6 1.9-.9 1.9-.9-3.2-1.1-6-1.8-8.5-2.1 1.3-1 2.1-1.3 2.1-1.3-20.4-2.9-30.1 9-30.1 19.5h46.4c-.7-7.4-4.8-12.4-11.8-15.2" />
            <path d="m55.3 27.6c0-9.7-10.4-17.6-23.3-17.6s-23.3 7.9-23.3 17.6c0 2.3.6 4.4 1.6 6.4-1 2-1.6 4.2-1.6 6.4 0 9.7 10.4 17.6 23.3 17.6s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4 1-2 1.6-4.2 1.6-6.4" />
          </g>
          <path d="m52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7-1.3 1.7-2.1 3.6-2.1 5.7 0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7 4.4-2.7 7.3-7 7.3-11.7" fill="#e0ac7e" />
          <g fill="#3b302a">
            <path d="m35.1 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.6.1 1 1 1 2.1" />
            <path d="m30.9 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.5.1 1 1 1 2.1" />
            <motion.ellipse
              cx="40.7"
              cy={31.7}
              rx="3.5"
              ry={4.5}
              initial={{ ry: 4.5, cy: 31.7 }}
              animate={{
                ry: showPassword ? 0.5 : [4.5, 0.5, 4.5],
                cy: showPassword ? 30 : [31.7, 30, 31.7],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                times: [0, 0.02, 0.04, 1],
              }}
            />
            <motion.ellipse
              cx="23.3"
              cy={31.7}
              rx="3.5"
              ry={4.5}
              initial={{ ry: 4.5, cy: 31.7 }}
              animate={{
                ry: showPassword ? 0.5 : [4.5, 0.5, 4.5],
                cy: showPassword ? 30 : [31.7, 30, 31.7],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                times: [0, 0.02, 0.04, 1],
              }}
            />
          </g>
        </motion.svg>

        {/* Monkey Hands SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 64 64"
          className="absolute inset-0"
          animate={{
            translateY: showPassword ? 0 : '25%',
            rotateX: showPassword ? 0 : -21,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 100%',
          }}
        >
          <path fill="#89664C" d="M9.4,32.5L2.1,61.9H14c-1.6-7.7,4-21,4-21L9.4,32.5z" />
          <path fill="#FFD6BB" d="M15.8,24.8c0,0,4.9-4.5,9.5-3.9c2.3,0.3-7.1,7.6-7.1,7.6s9.7-8.2,11.7-5.6c1.8,2.3-8.9,9.8-8.9,9.8s10-8.1,9.6-4.6c-0.3,3.8-7.9,12.8-12.5,13.8C11.5,43.2,6.3,39,9.8,24.4C11.6,17,13.3,25.2,15.8,24.8" />
          <path fill="#89664C" d="M54.8,32.5l7.3,29.4H50.2c1.6-7.7-4-21-4-21L54.8,32.5z" />
          <path fill="#FFD6BB" d="M48.4,24.8c0,0-4.9-4.5-9.5-3.9c-2.3,0.3,7.1,7.6,7.1,7.6s-9.7-8.2-11.7-5.6c-1.8,2.3,8.9,9.8,8.9,9.8s-10-8.1-9.7-4.6c0.4,3.8,8,12.8,12.6,13.8c6.6,1.3,11.8-2.9,8.3-17.5C52.6,17,50.9,25.2,48.4,24.8" />
        </motion.svg>

        {/* Mouth Line */}
        <motion.div
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 rounded-full border-b-4 border-[#3c302a]"
          animate={{
            width: showPassword ? '9%' : '25.9%',
            height: showPassword ? 0 : '17.2%',
            borderRadius: showPassword ? '50%' : '45%',
            borderBottomWidth: showPassword ? '10%' : '4%',
          }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut',
          }}
        />

      </motion.label>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Section - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-2 auth-heading tracking-tight" style={{ color: 'rgb(255, 255, 255)' }}>
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base font-medium" style={{ color: '#999999' }}>
            Sign in to your account
          </p>
        </motion.div>

        {/* Form Fields Container - Enhanced */}
        <div className="space-y-5">
          {/* Email Input with Icon */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="auth-label block mb-2 text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Address
            </label>
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              whileFocus={{ scale: 1.01 }}
              className="auth-input w-full px-4 py-3.5 text-base rounded-xl"
              required
            />
          </motion.div>

          {/* Password Input with Show/Hide */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="auth-label text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Password
              </label>
              <motion.button 
                type="button" 
                onClick={(e) => { 
                  e.preventDefault()
                  toast.info('Password reset feature coming soon! 🔐')
                }} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="auth-link text-xs font-medium hover:underline"
              >
                Forgot?
              </motion.button>
            </div>
            <div className="auth-input-with-icon relative">
              <motion.input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                whileFocus={{ scale: 1.01 }}
                className="auth-input w-full px-4 py-3.5 text-base rounded-xl pr-12"
                required
              />
              
              {/* Show/Hide Button with Icons */}
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="auth-input-icon absolute right-4 top-1/2 -translate-y-1/2"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Submit Button - Enhanced */}
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="auth-button-primary w-full py-4 rounded-xl text-base font-bold relative overflow-hidden group"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            <span className="relative z-10 flex items-center justify-center gap-3 font-bold text-lg">
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Dashboard
                </>
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* Demo Credentials - Enhanced */}
        <motion.div 
          className="pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="auth-divider mb-5">
            <div className="auth-divider-line" />
            <span className="auth-divider-text text-xs font-bold uppercase tracking-wider">Quick Demo</span>
            <div className="auth-divider-line" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() => fillDemoCredentials('student')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="auth-demo-button py-4 rounded-xl relative overflow-hidden group"
            >
              {/* Hover gradient effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="relative flex flex-col items-center justify-center gap-2">
                <motion.svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </motion.svg>
                <span className="text-sm font-bold">Student</span>
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => fillDemoCredentials('teacher')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="auth-demo-button py-4 rounded-xl relative overflow-hidden group"
            >
              {/* Hover gradient effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="relative flex flex-col items-center justify-center gap-2">
                <motion.svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </motion.svg>
                <span className="text-sm font-bold">Teacher</span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Hidden checkbox for password visibility */}
      <input
        type="checkbox"
        id="blind-input"
        checked={showPassword}
        onChange={() => setShowPassword(!showPassword)}
        className="hidden"
      />
    </motion.div>
  )
}
