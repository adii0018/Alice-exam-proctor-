import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import apiService from '../../services/api'

export default function QuizResults() {
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizResults(selectedQuiz)
    }
  }, [selectedQuiz])

  const fetchQuizzes = async () => {
    try {
      const data = await apiService.getQuizzes()
      setQuizzes(data)
      if (data.length > 0) {
        setSelectedQuiz(data[0]._id)
      }
    } catch (error) {
      toast.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizResults = async (quizId) => {
    setLoading(true)
    try {
      // Fetch submissions for this quiz
      const submissionsData = await apiService.getSubmissions({ quiz_id: quizId })
      setSubmissions(submissionsData)

      // Fetch flags for this quiz
      const flagsData = await apiService.getFlags({ quiz_id: quizId })
      setFlags(flagsData.flags || flagsData)
    } catch (error) {
      toast.error('Failed to load quiz results')
    } finally {
      setLoading(false)
    }
  }

  const getStudentFlags = (studentId) => {
    return flags.filter(f => f.student_id === studentId)
  }

  const getFlagTypeIcon = (type) => {
    const icons = {
      'multiple_faces': '👥',
      'no_face': '❌',
      'looking_away': '👀',
      'high_audio': '🔊',
      'audio_multiple_speakers': '🎤👥',
      'audio_keywords': '🔑',
      'tab_switch': '🔄'
    }
    return icons[type] || '🚩'
  }

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'red',
      'high': 'orange',
      'medium': 'yellow',
      'low': 'blue'
    }
    return colors[severity] || 'gray'
  }

  const getStatusBadge = (submission) => {
    const flagCount = submission.total_flags || 0
    if (flagCount === 0) {
      return <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs font-semibold">✅ Clean</span>
    } else if (flagCount < 3) {
      return <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-semibold">⚠️ Minor Flags</span>
    } else {
      return <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-semibold">🚨 Suspicious</span>
    }
  }

  const selectedQuizData = quizzes.find(q => q._id === selectedQuiz)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              📊 Quiz Results & Analysis
            </h2>
            <p className="text-gray-600 font-medium text-lg">View student performance and proctoring violations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectedQuiz && fetchQuizResults(selectedQuiz)}
            className="p-3 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-theme"
          >
            🔄
          </motion.button>
        </div>

        {/* Quiz Selector */}
        <div className="space-y-2">
          <label className="text-text-secondary text-sm font-semibold">Select Quiz:</label>
          <select
            value={selectedQuiz || ''}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-theme"
          >
            {quizzes.map(quiz => (
              <option key={quiz._id} value={quiz._id} className="bg-surface">
                {quiz.title} ({quiz.code})
              </option>
            ))}
          </select>
        </div>

        {/* Enhanced Quiz Stats */}
        {selectedQuizData && submissions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="text-3xl font-bold text-blue-600 mb-2">{submissions.length}</div>
              <div className="text-blue-800 font-semibold">📝 Total Submissions</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / submissions.length)}%
              </div>
              <div className="text-green-800 font-semibold">📈 Average Score</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {submissions.filter(s => (s.total_flags || 0) === 0).length}
              </div>
              <div className="text-purple-800 font-semibold">✅ Clean Submissions</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="text-3xl font-bold text-red-600 mb-2">{flags.length}</div>
              <div className="text-red-800 font-semibold">🚨 Total Violations</div>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      {loading ? (
        <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl p-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-4xl mb-4"
          >
            ⏳
          </motion.div>
          <p className="text-text-secondary">Loading results...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl p-12 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            📭
          </motion.div>
          <h3 className="text-2xl font-bold text-text mb-2">No Submissions Yet</h3>
          <p className="text-text-secondary">Students haven't submitted this quiz yet.</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-xl overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="bg-surface border-b border-border px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-text-secondary text-sm font-semibold">
              <div className="col-span-2">Student Name & Email</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-1 text-center">%</div>
              <div className="col-span-1 text-center">Flags</div>
              <div className="col-span-3 text-center">Cheating Methods</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-center">Details</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {submissions.map((submission, index) => {
              const studentFlags = getStudentFlags(submission.student_id)
              const isExpanded = expandedStudent === submission.student_id

              return (
                <div key={submission._id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-6 py-4 hover:bg-surface/70 transition-theme"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Student Info */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(submission.student_name || submission.student_id).substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-text font-semibold text-sm truncate">
                              {submission.student_name || 'Unknown Student'}
                            </div>
                            <div className="text-text-secondary text-xs truncate">
                              {submission.student_email || submission.student_id}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="col-span-2 text-center">
                        <div className="text-xl font-bold text-text">
                          {submission.score}/{submission.total_questions}
                        </div>
                      </div>

                      {/* Percentage */}
                      <div className="col-span-1 text-center">
                        <div className={`text-xl font-bold ${
                          submission.percentage >= 80 ? 'text-accent' :
                          submission.percentage >= 60 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {submission.percentage}%
                        </div>
                      </div>

                      {/* Violations Count */}
                      <div className="col-span-1 text-center">
                        <div className={`text-xl font-bold ${
                          studentFlags.length === 0 ? 'text-accent' :
                          studentFlags.length < 3 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {studentFlags.length}
                        </div>
                      </div>

                      {/* Cheating Methods */}
                      <div className="col-span-3 text-center">
                        {studentFlags.length === 0 ? (
                          <span className="text-accent text-sm">✅ Clean</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {[...new Set(studentFlags.map(f => f.type))].map((type, idx) => (
                              <span key={idx} className="text-lg" title={type.replace(/_/g, ' ')}>
                                {getFlagTypeIcon(type)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-center">
                        {getStatusBadge(submission)}
                      </div>

                      {/* Expand Button */}
                      <div className="col-span-1 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedStudent(isExpanded ? null : submission.student_id)}
                          className="p-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-theme"
                        >
                          {isExpanded ? '▲' : '▼'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-surface/30 border-t border-border overflow-hidden"
                      >
                        <div className="px-6 py-6 space-y-4">
                          {/* Performance Details */}
                          <div>
                            <h4 className="text-text font-semibold mb-3 flex items-center gap-2">
                              <span>📈</span> Performance Details
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                <div className="text-text-secondary text-sm">Correct Answers</div>
                                <div className="text-xl font-bold text-primary">{submission.correct_answers}</div>
                              </div>
                              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                                <div className="text-text-secondary text-sm">Time Taken</div>
                                <div className="text-xl font-bold text-secondary">
                                  {Math.floor(submission.time_taken / 60)}m {submission.time_taken % 60}s
                                </div>
                              </div>
                              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                                <div className="text-text-secondary text-sm">Submission Status</div>
                                <div className="text-xl font-bold text-accent capitalize">{submission.status}</div>
                              </div>
                            </div>
                          </div>

                          {/* Violations Details */}
                          {studentFlags.length > 0 && (
                            <div>
                              <h4 className="text-text font-semibold mb-3 flex items-center gap-2">
                                <span>🚨</span> Proctoring Violations ({studentFlags.length})
                              </h4>
                              <div className="space-y-2">
                                {studentFlags.map((flag, flagIndex) => {
                                  const color = getSeverityColor(flag.severity)
                                  return (
                                    <motion.div
                                      key={flag._id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: flagIndex * 0.05 }}
                                      className={`bg-${color}-500/10 border border-${color}-500/20 rounded-lg p-4`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                          <span className="text-2xl">{getFlagTypeIcon(flag.type)}</span>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h5 className="text-text font-semibold">
                                                {flag.type.replace(/_/g, ' ').toUpperCase()}
                                              </h5>
                                              <span className={`px-2 py-0.5 bg-${color}-500/20 border border-${color}-500/30 text-${color}-500 rounded text-xs font-semibold uppercase`}>
                                                {flag.severity}
                                              </span>
                                            </div>
                                            <p className="text-text-secondary text-sm mb-2">{flag.description}</p>
                                            <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                                              <span>📅 {new Date(flag.timestamp).toLocaleString()}</span>
                                              {flag.count > 1 && <span>🔢 Occurred {flag.count} times</span>}
                                              {flag.resolved && <span className="text-accent">✅ Resolved</span>}
                                            </div>
                                            
                                            {/* Audio Flag Details */}
                                            {flag.audio_data && (
                                              <div className="mt-3 p-3 bg-surface/50 border border-border rounded-lg">
                                                <div className="text-text-secondary text-sm space-y-1">
                                                  {flag.audio_data.num_speakers > 1 && (
                                                    <div>👥 Speakers: {flag.audio_data.num_speakers}</div>
                                                  )}
                                                  {flag.audio_data.keywords_found && flag.audio_data.keywords_found.length > 0 && (
                                                    <div>🔑 Keywords: {flag.audio_data.keywords_found.join(', ')}</div>
                                                  )}
                                                  {flag.audio_data.transcription && (
                                                    <div className="mt-2">
                                                      <div className="text-text-secondary text-xs mb-1">Transcription:</div>
                                                      <div className="text-text italic">"{flag.audio_data.transcription.substring(0, 200)}..."</div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {studentFlags.length === 0 && (
                            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
                              <div className="text-4xl mb-2">✅</div>
                              <div className="text-accent font-semibold">No Violations Detected</div>
                              <div className="text-text-secondary text-sm">This student completed the quiz without any proctoring flags.</div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
