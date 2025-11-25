// Quiz Creator - yahan teacher naya quiz banata hai (3 steps mein)
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations
import toast from 'react-hot-toast' // Notifications
import apiService from '../../services/api' // Backend API calls

export default function QuizCreator({ onQuizCreated, onSuccess }) {
  // Quiz creation ke saare states - 3 steps mein quiz banate hain
  const [step, setStep] = useState(1) // Current step (1, 2, ya 3)
  const [formData, setFormData] = useState({
    title: '', // Quiz ka title
    description: '', // Quiz description
    duration: 30, // Duration in minutes
    code: '', // Quiz code (auto-generated if empty)
    questions: [], // Saare questions ka array
    audio_proctoring: { // Audio monitoring settings
      enabled: false, // Audio monitoring on/off
      custom_keywords: [], // Custom suspicious keywords
      suspicion_threshold: 0.5, // Kitna strict monitoring
      language: 'auto' // Language for transcription
    }
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '', // Current question text
    options: ['', '', '', ''], // 4 options
    correct: 0, // Correct answer index (0-3)
  })
  const [loading, setLoading] = useState(false) // Loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      question: e.target.value,
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    })
  }

  // Question add karne wala function
  const addQuestion = () => {
    // Validation - saare fields bhare hain ya nahi
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      toast.error('Saare question fields bharo bhai!')
      return
    }

    // Question ko quiz mein add kar dete hain
    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion],
    })
    
    // Current question form reset kar dete hain
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
    })
    toast.success('Question add ho gaya!') // Success message
  }

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    })
    toast.success('Question removed')
  }

  // Quiz submit karne wala function
  const handleSubmit = async () => {
    // Final validation
    if (formData.questions.length === 0) {
      toast.error('Kam se kam ek question toh add karo bhai!')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Quiz title zaroori hai!')
      return
    }

    setLoading(true) // Loading start kar dete hain

    try {
      console.log('Quiz data submit kar rahe hain:', formData)
      // Backend API call kar ke quiz create karte hain
      const result = await apiService.createQuiz(formData)
      console.log('Quiz successfully ban gaya:', result)
      
      toast.success('Quiz ban gaya bhai! 🎉') // Success message
      
      // Form reset kar dete hain next quiz ke liye
      setFormData({
        title: '',
        description: '',
        duration: 30,
        code: '',
        questions: [],
        audio_proctoring: {
          enabled: false,
          custom_keywords: [],
          suspicion_threshold: 0.5,
          language: 'auto'
        }
      })
      setStep(1) // Step 1 par wapas le jaate hain
      
      // Parent components ko notify karte hain
      if (onQuizCreated) onQuizCreated()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Quiz creation mein error:', error)
      // Error message extract karte hain
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Quiz nahi ban saka bhai'
      toast.error(errorMessage)
    } finally {
      setLoading(false) // Loading band kar dete hain
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 teacher-dashboard"
    >
      {/* Enhanced Progress */}
      <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <motion.div
                animate={{
                  scale: step >= s ? 1.2 : 1,
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600'
                }`}
              >
                {step >= s ? '✓' : s}
              </motion.div>
              {s < 3 && (
                <motion.div
                  className={`flex-1 h-2 mx-4 rounded-full transition-all ${
                    step > s 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-r from-gray-200 to-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className={step >= 1 ? 'text-blue-600' : 'text-gray-500'}>📝 Basic Info</span>
          <span className={step >= 2 ? 'text-blue-600' : 'text-gray-500'}>❓ Add Questions</span>
          <span className={step >= 3 ? 'text-blue-600' : 'text-gray-500'}>✅ Review & Create</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="quiz-creator-form"
          >
            <div className="text-center mb-6">
              <h3 className="form-section-title">
                📝 Quiz Information
              </h3>
              <p className="form-section-subtitle">Set up the basic details for your quiz</p>
            </div>
            
            <div>
              <label>📚 Quiz Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Mathematics Final Exam"
                className="w-full"
                required
              />
            </div>

            <div>
              <label>📝 Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the quiz..."
                rows={3}
                className="w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>⏱️ Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  className="w-full"
                />
              </div>

              <div>
                <label>🔑 Quiz Code (optional)</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  className="w-full uppercase"
                />
              </div>
            </div>

            {/* Audio Proctoring Settings */}
            <div className="border-t border-border pt-4 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="form-section-title">
                    🎤 Audio Proctoring
                  </h4>
                  <p className="form-section-subtitle">Monitor student audio during exam</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.audio_proctoring.enabled}
                    onChange={(e) => setFormData({
                      ...formData,
                      audio_proctoring: {
                        ...formData.audio_proctoring,
                        enabled: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {formData.audio_proctoring.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pl-4 border-l-2 border-primary/30"
                >
                  {/* Custom Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Suspicious Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.audio_proctoring.custom_keywords.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData,
                        audio_proctoring: {
                          ...formData.audio_proctoring,
                          custom_keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                        }
                      })}
                      placeholder="e.g., answer, help, cheat"
                      className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-theme"
                    />
                    <p className="text-xs text-text-secondary/70 mt-1">
                      Default keywords: answer, help, tell me, give me, solution, cheat, copy
                    </p>
                  </div>

                  {/* Suspicion Threshold */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Suspicion Threshold: {formData.audio_proctoring.suspicion_threshold.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.audio_proctoring.suspicion_threshold}
                      onChange={(e) => setFormData({
                        ...formData,
                        audio_proctoring: {
                          ...formData.audio_proctoring,
                          suspicion_threshold: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-text-secondary/70 mt-1">
                      <span>Lenient (0.0)</span>
                      <span>Moderate (0.5)</span>
                      <span>Strict (1.0)</span>
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Transcription Language
                    </label>
                    <select
                      value={formData.audio_proctoring.language}
                      onChange={(e) => setFormData({
                        ...formData,
                        audio_proctoring: {
                          ...formData.audio_proctoring,
                          language: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-theme"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!formData.title) {
                  toast.error('Please enter a quiz title')
                  return
                }
                setStep(2)
              }}
              className="btn-primary w-full"
            >
              Next: Add Questions →
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Add Questions */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Current Question Form */}
            <div className="quiz-creator-form">
              <h3 className="form-section-title">
                ❓ Question {formData.questions.length + 1}
              </h3>
              
              <div>
                <label>📝 Question Text</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  placeholder="Enter your question..."
                  rows={2}
                  className="w-full resize-none"
                />
              </div>

              <div className="space-y-3">
                <label>📋 Answer Options</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setCurrentQuestion({ ...currentQuestion, correct: index })}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-theme ${
                        currentQuestion.correct === index
                          ? 'border-accent bg-accent text-white'
                          : 'border-border'
                      }`}
                    >
                      {currentQuestion.correct === index && '✓'}
                    </motion.button>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                  </div>
                ))}
                <p className="text-xs text-text-secondary/70">Click the circle to mark correct answer</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addQuestion}
                className="btn-primary w-full"
              >
                ➕ Add Question
              </motion.button>
            </div>

            {/* Added Questions */}
            {formData.questions.length > 0 && (
              <div className="form-section">
                <h4 className="form-section-title">
                  📚 Added Questions ({formData.questions.length})
                </h4>
                <div className="space-y-3">
                  {formData.questions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-surface rounded-lg p-4 flex items-start justify-between border border-border"
                    >
                      <div className="flex-1">
                        <p className="text-text font-medium mb-1">
                          {index + 1}. {q.question}
                        </p>
                        <p className="text-sm text-accent">
                          ✓ Correct: {q.options[q.correct]}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-400 transition-theme"
                      >
                        🗑️
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                ← Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (formData.questions.length === 0) {
                    toast.error('Add at least one question')
                    return
                  }
                  setStep(3)
                }}
                className="btn-primary flex-1"
              >
                Review & Create →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="quiz-creator-form"
          >
            <h3 className="form-section-title">✅ Review Quiz</h3>
            
            <div className="space-y-4">
              <div className="question-card">
                <h4 className="question-text">{formData.title}</h4>
                <p className="form-section-subtitle">{formData.description}</p>
                <div className="flex gap-4 text-sm text-text-secondary">
                  <span>⏱️ {formData.duration} minutes</span>
                  <span>❓ {formData.questions.length} questions</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="btn-secondary"
              >
                ← Back
              </motion.button>
              
              {/* Test API Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    const health = await apiService.healthCheck()
                    toast.success('API Connection: ' + health.status)
                  } catch (error) {
                    toast.error('API Connection Failed')
                  }
                }}
                className="btn-secondary"
              >
                Test API
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  '🎉 Create Quiz'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
