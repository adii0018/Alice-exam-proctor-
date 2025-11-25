import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import apiService from '../../services/api'

export default function QuizStatistics({ quiz }) {
  const [submissions, setSubmissions] = useState([])
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    averageScore: 0,
    passRate: 0,
    totalFlags: 0,
    averageTime: 0,
  })

  useEffect(() => {
    fetchData()
  }, [quiz._id])

  const fetchData = async () => {
    try {
      const [submissionsData, flagsData] = await Promise.all([
        apiService.getSubmissions({ quiz_id: quiz._id }),
        apiService.getFlags({ quiz_id: quiz._id }),
      ])

      setSubmissions(submissionsData)
      setFlags(flagsData)

      // Calculate statistics
      if (submissionsData.length > 0) {
        const totalScore = submissionsData.reduce((sum, s) => sum + s.percentage, 0)
        const passCount = submissionsData.filter(s => s.percentage >= 60).length
        const totalTime = submissionsData.reduce((sum, s) => sum + s.time_taken, 0)

        setStats({
          totalSubmissions: submissionsData.length,
          averageScore: (totalScore / submissionsData.length).toFixed(1),
          passRate: ((passCount / submissionsData.length) * 100).toFixed(1),
          totalFlags: flagsData.length,
          averageTime: Math.floor(totalTime / submissionsData.length),
        })
      }

      setLoading(false)
    } catch (error) {
      toast.error('Failed to fetch statistics')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-surface/50 border border-border rounded-2xl p-8">
        <div className="text-center text-text-secondary">Loading statistics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4"
        >
          <div className="text-3xl mb-2">👥</div>
          <div className="text-3xl font-bold text-text">{stats.totalSubmissions}</div>
          <div className="text-text-secondary text-sm">Submissions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 rounded-xl p-4"
        >
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-text">{stats.averageScore}%</div>
          <div className="text-text-secondary text-sm">Avg Score</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30 rounded-xl p-4"
        >
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-text">{stats.passRate}%</div>
          <div className="text-text-secondary text-sm">Pass Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-gradient-to-br from-orange-600/20 to-orange-600/10 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="text-3xl mb-2">🚩</div>
          <div className="text-3xl font-bold text-text">{stats.totalFlags}</div>
          <div className="text-text-secondary text-sm">Violations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/30 rounded-xl p-4"
        >
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-3xl font-bold text-text">
            {Math.floor(stats.averageTime / 60)}m
          </div>
          <div className="text-text-secondary text-sm">Avg Time</div>
        </motion.div>
      </div>

      {/* Submissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="backdrop-blur-xl bg-surface/50 border border-border rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-text mb-4">Recent Submissions</h3>
        
        {submissions.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            No submissions yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-text-secondary font-semibold py-3 px-4">Student</th>
                  <th className="text-left text-text-secondary font-semibold py-3 px-4">Score</th>
                  <th className="text-left text-text-secondary font-semibold py-3 px-4">Time</th>
                  <th className="text-left text-text-secondary font-semibold py-3 px-4">Flags</th>
                  <th className="text-left text-text-secondary font-semibold py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.slice(0, 10).map((submission, index) => (
                  <motion.tr
                    key={submission._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-surface/70 transition-theme"
                  >
                    <td className="py-3 px-4 text-text">
                      Student #{submission.student_id.slice(-6)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${
                        submission.percentage >= 60 ? 'text-accent' : 'text-red-500'
                      }`}>
                        {submission.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {Math.floor(submission.time_taken / 60)}m {submission.time_taken % 60}s
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        submission.total_flags > 0 ? 'text-orange-500' : 'text-accent'
                      }`}>
                        {submission.total_flags}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        submission.percentage >= 60
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-red-500/20 text-red-500 border border-red-500/30'
                      }`}>
                        {submission.percentage >= 60 ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Score Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-xl bg-surface/50 border border-border rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-text mb-4">Score Distribution</h3>
        
        {submissions.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            No data available
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { range: '90-100%', color: 'accent', count: submissions.filter(s => s.percentage >= 90).length },
              { range: '80-89%', color: 'primary', count: submissions.filter(s => s.percentage >= 80 && s.percentage < 90).length },
              { range: '70-79%', color: 'yellow-500', count: submissions.filter(s => s.percentage >= 70 && s.percentage < 80).length },
              { range: '60-69%', color: 'orange-500', count: submissions.filter(s => s.percentage >= 60 && s.percentage < 70).length },
              { range: 'Below 60%', color: 'red-500', count: submissions.filter(s => s.percentage < 60).length },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-text-secondary text-sm">{item.range}</div>
                <div className="flex-1 bg-surface rounded-full h-8 overflow-hidden border border-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / submissions.length) * 100}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    className={`h-full bg-${item.color} flex items-center justify-end px-3`}
                  >
                    {item.count > 0 && (
                      <span className="text-white text-sm font-semibold">{item.count}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
