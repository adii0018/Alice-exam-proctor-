import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get submission from location state or fetch from API
    if (location.state?.submission) {
      setSubmission(location.state.submission)
      setLoading(false)
    } else {
      navigate('/student')
    }
  }, [location, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text text-xl">Loading results...</div>
      </div>
    )
  }

  const percentage = submission?.percentage || 0
  const passed = percentage >= 60

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Result Card */}
        <div className="backdrop-blur-xl bg-surface border border-border rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 ${
                passed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-red-500 to-orange-600'
              }`}
            >
              <span className="text-6xl">
                {passed ? '🎉' : '📚'}
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-text mb-2"
            >
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-secondary"
            >
              {passed ? 'You passed the exam!' : 'Better luck next time!'}
            </motion.p>
          </div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-8 mb-6"
          >
            <div className="text-center">
              <div className="text-7xl font-bold text-text mb-2">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-text-secondary text-lg">
                {submission?.correct_answers} out of {submission?.total_questions} correct
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-success">
                {submission?.correct_answers}
              </div>
              <div className="text-text-secondary text-sm">Correct</div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-2xl font-bold text-error">
                {submission?.total_questions - submission?.correct_answers}
              </div>
              <div className="text-text-secondary text-sm">Incorrect</div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-primary">
                {Math.floor(submission?.time_taken / 60)}m {submission?.time_taken % 60}s
              </div>
              <div className="text-text-secondary text-sm">Time Taken</div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🚩</div>
              <div className={`text-2xl font-bold ${
                submission?.total_flags > 0 ? 'text-warning' : 'text-success'
              }`}>
                {submission?.total_flags || 0}
              </div>
              <div className="text-text-secondary text-sm">Violations</div>
            </div>
          </motion.div>

          {/* Status Badge */}
          {submission?.total_flags > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-warning/20 border border-warning/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="text-warning font-semibold">
                    Violations Detected
                  </div>
                  <div className="text-warning/80 text-sm">
                    Your submission has been flagged for review by the teacher
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/student')}
              className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <p className="text-text-secondary text-sm italic">
              {passed
                ? '"Success is not final, failure is not fatal: it is the courage to continue that counts."'
                : '"The expert in anything was once a beginner. Keep practicing!"'}
            </p>
          </motion.div>
        </div>

        {/* Confetti Effect for Pass */}
        {passed && (
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
