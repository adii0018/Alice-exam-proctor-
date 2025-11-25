import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import apiService from '../services/api'
import ThemeToggle from '../components/theme/ThemeToggle'
import ColorSchemePicker from '../components/theme/ColorSchemePicker'
import AccessibilityPanel from '../components/theme/AccessibilityPanel'
import ThemePreview from '../components/theme/ThemePreview'
import { useTheme } from '../hooks/useTheme'
import '../styles/circle-dashboard.css'

// Lazy load ThemeSettings modal for better performance
const ThemeSettings = lazy(() => import('../components/theme/ThemeSettings'))

export default function ProfilePage() {
  const navigate = useNavigate()
  const { theme, setScheme } = useTheme()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showThemeSettings, setShowThemeSettings] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userData)
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdateProfile = async () => {
    try {
      // Validate
      if (!formData.name || !formData.email) {
        toast.error('Name and email are required')
        return
      }

      // Update user data in localStorage (in real app, call API)
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleChangePassword = async () => {
    try {
      if (!formData.currentPassword || !formData.newPassword) {
        toast.error('Please fill in all password fields')
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match')
        return
      }

      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }

      // In real app, call API to change password
      toast.success('Password changed successfully!')
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error('Failed to change password')
    }
  }

  const handleLogout = () => {
    apiService.logout()
    navigate('/auth')
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text text-xl">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="profile-back-button"
          >
            <span className="text-2xl">←</span>
            <span>Back</span>
          </motion.button>

          <h1 className="text-3xl font-bold text-text">Profile Settings</h1>
          
          <ThemeToggle size="md" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <div className="profile-card">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="profile-avatar"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </motion.div>

              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>

              <div className={`profile-role-badge ${user?.role === 'teacher' ? 'teacher' : 'student'}`}>
                {user?.role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
              </div>

              <div className="profile-member-since">
                <div className="profile-member-since-label">Member since</div>
                <div className="profile-member-since-date">
                  {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Forms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Profile Information */}
            <div className="settings-section">
              <div className="settings-section-header">
                <h3 className="settings-section-title">Profile Information</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(!editing)}
                  className="settings-edit-button"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="settings-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="settings-input"
                  />
                </div>

                <div>
                  <label className="settings-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="settings-input"
                  />
                </div>

                {editing && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateProfile}
                    className="settings-save-button"
                  >
                    Save Changes
                  </motion.button>
                )}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="theme-settings-panel">
              <div className="settings-section-header">
                <div className="settings-section-title">
                  <svg
                    className="settings-section-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  Theme Settings
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowThemeSettings(true)}
                  className="advanced-settings-button"
                >
                  <svg
                    className="advanced-settings-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Advanced Settings
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Theme Mode Toggle */}
                <div className="theme-option-card">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="theme-option-title">Theme Mode</h4>
                      <p className="theme-option-description">
                        Switch between light and dark appearance
                      </p>
                    </div>
                    <ThemeToggle size="md" showLabel />
                  </div>
                  <div className="theme-current-mode">
                    Current mode: <span className="theme-current-mode-value">{theme.mode}</span>
                  </div>
                </div>

                {/* Color Scheme Picker */}
                <div className="theme-option-card">
                  <h4 className="theme-option-title mb-4">Color Scheme</h4>
                  <ColorSchemePicker
                    currentScheme={theme.scheme}
                    onSchemeChange={setScheme}
                  />
                </div>

                {/* Accessibility Quick Settings */}
                <div className="theme-option-card">
                  <h4 className="theme-option-title mb-4">Accessibility</h4>
                  <AccessibilityPanel />
                </div>

                {/* Current Theme Preview */}
                <div className="theme-option-card">
                  <h4 className="theme-option-title mb-4">Current Theme Preview</h4>
                  <ThemePreview />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="password-change-section">
              <h3 className="settings-section-title mb-6">Change Password</h3>

              <div className="space-y-4">
                <div>
                  <label className="settings-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="settings-input"
                  />
                </div>

                <div>
                  <label className="settings-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="settings-input"
                  />
                </div>

                <div>
                  <label className="settings-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="settings-input"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangePassword}
                  className="password-change-button"
                >
                  Update Password
                </motion.button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone">
              <h3 className="danger-zone-title">Danger Zone</h3>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="danger-zone-button"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Advanced Theme Settings Modal - Lazy loaded */}
      <Suspense fallback={null}>
        {showThemeSettings && (
          <ThemeSettings
            isOpen={showThemeSettings}
            onClose={() => setShowThemeSettings(false)}
          />
        )}
      </Suspense>
    </div>
  )
}
