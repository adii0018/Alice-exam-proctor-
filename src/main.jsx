// Main entry point - yahan se pura app start hota hai
import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google' // Google OAuth ke liye
import { ThemeProvider } from './contexts/ThemeContext.jsx' // Theme system
import ErrorBoundary from './components/ErrorBoundary.jsx' // Error handling
import App from './App.jsx' // Main app component
// Saare CSS files import kar rahe hain
import './index.css' // Base styles
import './styles/global-components.css' // Global component styles
import './styles/quiz-components.css' // Quiz specific styles
import './styles/auth-card-animations.css' // Auth animations
import './styles/theme-text-fix.css' // Theme text fixes
import './styles/component-text-overrides.css' // Component overrides
import './styles/auth-text-visibility-fix.css' // Auth visibility fixes

// Google OAuth Client ID - environment variable se ya empty string
// Apna Google Console se Client ID lena hoga: https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

// React app ko DOM mein render kar rahe hain
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* Development mode mein extra checks ke liye */}
    <ErrorBoundary> {/* Errors catch karne ke liye */}
      <ThemeProvider> {/* Theme system provide karne ke liye */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> {/* Google login ke liye */}
          <App /> {/* Main app component */}
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
