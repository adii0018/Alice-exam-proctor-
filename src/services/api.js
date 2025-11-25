// API Service - yahan saare backend API calls handle karte hain
import axios from 'axios'
import toast from 'react-hot-toast' // Notifications ke liye
import { performCompleteLogout } from '../utils/authFix' // Auth fix utility

// Backend API ka base URL - environment variable se ya default localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Axios instance banate hain - yeh saare API calls ke liye use hoga
const api = axios.create({
  baseURL: API_BASE_URL, // Base URL set kar dete hain
  headers: {
    'Content-Type': 'application/json', // JSON data bhejenge
  },
})

// Request interceptor - har API call mein token add kar dete hain
api.interceptors.request.use(
  (config) => {
    // localStorage se token nikaal kar header mein add karte hain
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // JWT token add karte hain
    }
    return config
  },
  (error) => {
    return Promise.reject(error) // Error ko forward kar dete hain
  }
)

// Response interceptor - errors handle karne ke liye
api.interceptors.response.use(
  (response) => response, // Success response ko as-is return karte hain
  (error) => {
    // Different error codes ke liye different actions
    if (error.response?.status === 401) {
      // Token expire ho gaya ya invalid hai
      toast.error('Session expire ho gaya. Dobara login karo bhai.')
      // Use comprehensive logout utility
      performCompleteLogout()
    } else if (error.response?.status === 403) {
      toast.error('Permission nahi hai yeh kaam karne ki!')
    } else if (error.response?.status >= 500) {
      toast.error('Server mein problem hai. Thoda baad try karo.')
    } else if (!error.response) {
      toast.error('Network problem hai. Internet check karo bhai.')
    }
    return Promise.reject(error) // Error ko forward kar dete hain
  }
)

// API Service - saare backend functions yahan define karte hain
const apiService = {
  // Health Check - server chal raha hai ya nahi check karte hain
  healthCheck: async () => {
    const response = await api.get('/health/')
    return response.data
  },

  // Authentication functions - login/register ke liye
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData)
    return response.data
  },

  // Login function - email/password se login karte hain
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password })
    if (response.data.token) {
      // Token aur user data localStorage mein save kar dete hain
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/')
    return response.data
  },

  logout: () => {
    localStorage.clear()
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await api.get('/quizzes/')
    return response.data
  },

  getQuizByCode: async (code) => {
    const response = await api.get(`/quizzes/by-code/${code}/`)
    return response.data
  },

  getQuiz: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/`)
    return response.data
  },

  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes/', quizData)
    return response.data
  },

  updateQuiz: async (quizId, quizData) => {
    const response = await api.put(`/quizzes/${quizId}/`, quizData)
    return response.data
  },

  deleteQuiz: async (quizId) => {
    const response = await api.delete(`/quizzes/${quizId}/`)
    return response.data
  },

  submitQuiz: async (quizId, answers, timeTaken) => {
    const response = await api.post(`/quizzes/${quizId}/submit/`, {
      answers,
      time_taken: timeTaken,
    })
    return response.data
  },

  // Flags
  getFlags: async (params = {}) => {
    const response = await api.get('/flags/', { params })
    return response.data
  },

  createFlag: async (flagData) => {
    const response = await api.post('/flags/', flagData)
    return response.data
  },

  updateFlag: async (flagId, updates) => {
    const response = await api.put(`/flags/${flagId}/`, updates)
    return response.data
  },

  deleteFlag: async (flagId) => {
    const response = await api.delete(`/flags/${flagId}/`)
    return response.data
  },

  // Submissions
  getSubmissions: async (params = {}) => {
    const response = await api.get('/submissions/', { params })
    return response.data
  },

  getSubmission: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}/`)
    return response.data
  },

  // Audio Proctoring
  startAudioSession: async (data) => {
    return await api.post('/audio/session/start/', data)
  },

  endAudioSession: async (data) => {
    return await api.post('/audio/session/end/', data)
  },

  uploadAudioChunk: async (data) => {
    return await api.post('/audio/upload/', data)
  },

  getAudioSession: async (sessionId) => {
    const response = await api.get(`/audio/session/${sessionId}/`)
    return response.data
  },

  // Theme
  getUserTheme: async () => {
    const response = await api.get('/user/theme/')
    return response.data
  },

  updateUserTheme: async (themeData) => {
    const response = await api.post('/user/theme/update/', themeData)
    return response.data
  },

  // Generic methods for flexibility
  get: async (url, config) => {
    return await api.get(url, config)
  },

  post: async (url, data, config) => {
    return await api.post(url, data, config)
  },

  put: async (url, data, config) => {
    return await api.put(url, data, config)
  },

  delete: async (url, config) => {
    return await api.delete(url, config)
  },
}

export default apiService
