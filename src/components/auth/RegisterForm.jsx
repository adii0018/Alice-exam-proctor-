// Register Form - yahan naya user account banata hai (3 steps mein)
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations
import { GoogleLogin } from '@react-oauth/google' // Google OAuth login
import toast from 'react-hot-toast' // Notifications
import apiService from '../../services/api' // Backend API calls

export default function RegisterForm({ onSuccess }) {
  // Registration form ke saare states - 3 steps mein registration hoti hai
  const [step, setStep] = useState(1) // Current step (1, 2, ya 3)
  const [formData, setFormData] = useState({
    // Basic info (Step 1)
    name: '', // User ka naam
    email: '', // Email address
    username: '', // Username
    password: '', // Password
    confirmPassword: '', // Password confirmation
    role: 'student', // Default role student hai
    // Student specific fields (Step 3)
    student_id: '', // Student ID
    class_section: '', // Class aur section
    enrollment_year: new Date().getFullYear().toString(), // Current year
    // Teacher specific fields (Step 3)
    department: '', // Department name
    employee_id: '', // Employee ID
  })
  const [loading, setLoading] = useState(false) // Loading state
  const [showPassword, setShowPassword] = useState(false) // Password visibility toggle

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.username) {
      toast.error('Please fill in all fields')
      return false
    }
    if (formData.name.length < 2) {
      toast.error('Name must be at least 2 characters')
      return false
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all password fields')
      return false
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (!/[a-zA-Z]/.test(formData.password)) {
      toast.error('Password must contain at least one letter')
      return false
    }
    if (!/\d/.test(formData.password)) {
      toast.error('Password must contain at least one number')
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (formData.role === 'student') {
      if (!formData.student_id) {
        toast.error('Student ID is required')
        return false
      }
    } else {
      if (!formData.employee_id) {
        toast.error('Employee ID is required')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep3()) return

    setLoading(true)

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      }

      if (formData.role === 'student') {
        submitData.student_id = formData.student_id
        submitData.class_section = formData.class_section
        submitData.enrollment_year = formData.enrollment_year
      } else {
        submitData.department = formData.department
        submitData.employee_id = formData.employee_id
      }

      await apiService.register(submitData)
      toast.success('Registration successful! Please login.')
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      toast.loading('Signing up with Google...')
      const credential = credentialResponse.credential
      const base64Url = credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      const userInfo = JSON.parse(jsonPayload)
      
      toast.dismiss()
      toast.success(`Account created for ${userInfo.name}! Please login.`)
      onSuccess()
    } catch (error) {
      toast.dismiss()
      toast.error('Google signup failed. Please try again.')
      console.error('Google signup error:', error)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google signup failed. Please try again.')
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
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <motion.div
              animate={{
                scale: step >= s ? 1.1 : 1,
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-theme ${
                step >= s ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
              }`}
            >
              {s}
            </motion.div>
            {s < 3 && (
              <motion.div
                className={`flex-1 h-1 mx-2 transition-theme ${
                  step > s ? 'bg-primary' : 'bg-surface'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-text mb-4">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                required
              />
            </div>

            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-theme"
            >
              Next Step →
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-text mb-4">Create Password</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary transition-theme pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-theme"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-xs text-text-secondary/70 mt-1">Min 8 characters, 1 letter, 1 number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary transition-theme"
                required
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={handleBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-surface border border-border text-text font-semibold rounded-xl hover:bg-surface/80 transition-theme"
              >
                ← Back
              </motion.button>
              <motion.button
                type="button"
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg transition-theme"
              >
                Next Step →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Role & Details */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-text mb-4">Role & Details</h3>
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">I am a</label>
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-theme ${
                    formData.role === 'student'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-surface border border-border text-text-secondary'
                  }`}
                >
                  👨‍🎓 Student
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'teacher' })}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-theme ${
                    formData.role === 'teacher'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-surface border border-border text-text-secondary'
                  }`}
                >
                  👨‍🏫 Teacher
                </motion.button>
              </div>
            </div>

            {/* Student Fields */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Student ID</label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="STU001"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Class Section</label>
                  <input
                    type="text"
                    name="class_section"
                    value={formData.class_section}
                    onChange={handleChange}
                    placeholder="10-A"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Enrollment Year</label>
                  <input
                    type="text"
                    name="enrollment_year"
                    value={formData.enrollment_year}
                    onChange={handleChange}
                    placeholder="2025"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                  />
                </div>
              </>
            )}

            {/* Teacher Fields */}
            {formData.role === 'teacher' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="EMP001"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={handleBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-surface border border-border text-text font-semibold rounded-xl hover:bg-surface/80 transition-theme"
              >
                ← Back
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-theme"
              >
                {loading ? 'Creating Account...' : 'Create Account ✨'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.form>
  )
}
