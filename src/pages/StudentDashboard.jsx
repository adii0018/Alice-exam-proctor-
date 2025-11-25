// Student Dashboard - yahan student apne saare kaam kar sakta hai
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // Smooth animations ke liye
import toast from 'react-hot-toast' // Notifications dikhane ke liye
import apiService from '../services/api' // Backend API calls ke liye
import QuizCodeEntry from '../components/student/QuizCodeEntry' // Quiz code enter karne ke liye
import QuizInterface from '../components/student/QuizInterface' // Quiz lene ka interface
import ASRLogo from '../components/common/ASRLogo' // Company logo
import SoundControls from '../components/ui/SoundControls' // Sound controls
// import DebugPanel from '../components/debug/DebugPanel' // Development debugging ke liye - REMOVED
import { playLogin, playLogout, playClick, playSuccess } from '../utils/soundUtils'
import { performCompleteLogout } from '../utils/authFix' // Auth fix utility
import AnimatedLogoutButton from '../components/ui/AnimatedLogoutButton' // Animated logout button
import '../styles/circle-dashboard.css' // Dashboard ki styling
import '../styles/logout-button-fix.css' // Logout button visibility fix
import '../styles/dashboard-color-themes.css' // Color themes

export default function StudentDashboard({ user, onLogout }) {
  // State variables - dashboard ki saari states yahan manage karte hain
  const [activeView, setActiveView] = useState('home') // Konsa view active hai (home/quiz)
  const [currentQuiz, setCurrentQuiz] = useState(null) // Current quiz ka data
  const [submissions, setSubmissions] = useState([]) // Student ke previous submissions
  const [stars, setStars] = useState([]) // Background animation ke liye stars
  const [currentTheme, setCurrentTheme] = useState('theme-ocean') // Current color theme

  useEffect(() => {
    // Play login sound when dashboard loads
    playLogin();
    
    // Component load hone par submissions fetch karte hain
    fetchSubmissions()
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('studentDashboardTheme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }
    
    // Background ke liye random stars generate karte hain - cool effect ke liye
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random X position
      y: Math.random() * 100, // Random Y position
      size: Math.random() * 2 + 0.5, // Random size
      duration: Math.random() * 3 + 2, // Animation duration
      delay: Math.random() * 5, // Animation delay
    }));
    setStars(generatedStars);
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('studentDashboardTheme', currentTheme)
  }, [currentTheme])

  // Student ke previous submissions fetch karne wala function
  const fetchSubmissions = async () => {
    try {
      const data = await apiService.getSubmissions()
      setSubmissions(data) // Submissions set kar dete hain
    } catch (error) {
      console.error('Submissions fetch nahi ho rahe bhai:', error)
    }
  }

  // Quiz start karne wala function
  const handleStartQuiz = (quiz) => {
    playSuccess(); // Play success sound when quiz starts
    setCurrentQuiz(quiz) // Current quiz set karte hain
    setActiveView('quiz') // Quiz view par switch kar dete hain
  }

  // Quiz complete hone par ye function chalega
  const handleQuizComplete = () => {
    setCurrentQuiz(null) // Quiz clear kar dete hain
    setActiveView('home') // Home view par wapas le jaate hain
    fetchSubmissions() // Fresh submissions fetch karte hain
    toast.success('Quiz submit ho gaya bhai! 🎉') // Success message
  }

  return (
    <div className={`min-h-screen relative overflow-hidden student-dashboard ${currentTheme}`}>
      {/* Deep Space Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Deep Space Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-900/20 to-black/40" />

        {/* Animated Nebula Clouds */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(88, 166, 255, 0.3) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.6)`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute bottom-40 left-40 w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Distant Galaxy Effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Twinkling Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`twinkle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
              }}
              animate={{
                x: [0, 300],
                y: [0, 150],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 4 + Math.random() * 3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Aurora Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(45deg, rgba(0, 255, 150, 0.1) 0%, transparent 30%, rgba(255, 0, 150, 0.1) 70%, transparent 100%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Dashboard Content - positioned above background */}
      <div className="relative z-10 min-h-screen">
      {/* Modern Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 p-4 sticky top-0"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ASRLogo 
                className="flex gap-1" 
                size="text-lg"
                animated={true}
              />
            </motion.div>
            <div>
              <motion.h1 
                className="text-white font-bold text-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Ａʟ ɪ c ᴇㅤ☁
              </motion.h1>
              <motion.p 
                className="text-white/70 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Student Portal ✨
              </motion.p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === 'home' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => {
                playClick();
                setActiveView('home');
              }}
            >
              Dashboard
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === 'join' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => {
                playClick();
                setActiveView('join');
              }}
            >
              Join Quiz
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === 'history' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => {
                playClick();
                setActiveView('history');
              }}
            >
              History
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <div className="theme-selector">
              <select 
                value={currentTheme} 
                onChange={(e) => {
                  playClick();
                  setCurrentTheme(e.target.value);
                }}
                className="theme-dropdown"
              >
                <option value="theme-ocean">🌊 Ocean Blue</option>
                <option value="theme-forest">🌲 Forest Green</option>
                <option value="theme-sunset">🌅 Sunset Orange</option>
                <option value="theme-galaxy">🌌 Purple Galaxy</option>
                <option value="theme-rose">🌹 Rose Gold</option>
                <option value="theme-dark">🌙 Dark Mode</option>
              </select>
            </div>
            
            <SoundControls />
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer"
              whileHover={{ 
                scale: 1.1,
                rotate: 360,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {user?.name?.charAt(0) || 'S'}
            </motion.div>

          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-20 max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Page Header */}
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-4xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome back, {user.name}! 👋
                </motion.h1>
                <motion.p 
                  className="text-white/80 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Ready to take your exam? Enter a quiz code to get started.
                </motion.p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2 relative z-10"
                    animate={{ 
                      textShadow: ["0 0 10px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.8)", "0 0 10px rgba(59, 130, 246, 0.5)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {submissions.length}
                  </motion.div>
                  <div className="text-white/70 font-medium relative z-10">Completed Exams 📝</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2 relative z-10"
                    animate={{ 
                      textShadow: ["0 0 10px rgba(34, 197, 94, 0.5)", "0 0 20px rgba(34, 197, 94, 0.8)", "0 0 10px rgba(34, 197, 94, 0.5)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    {submissions.filter(s => s.score >= 70).length}
                  </motion.div>
                  <div className="text-white/70 font-medium relative z-10">Passed Exams ✅</div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="text-3xl font-bold text-white mb-2 relative z-10"
                    animate={{ 
                      textShadow: ["0 0 10px rgba(168, 85, 247, 0.5)", "0 0 20px rgba(168, 85, 247, 0.8)", "0 0 10px rgba(168, 85, 247, 0.5)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    {submissions.length > 0 
                      ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length)
                      : 0}%
                  </motion.div>
                  <div className="text-white/70 font-medium relative z-10">Average Score 📊</div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group relative overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
                  }}
                  onClick={() => setActiveView('join')}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 360,
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      🎯
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Join Quiz</h3>
                      <p className="text-white/70">Enter a quiz code to start</p>
                    </div>
                  </div>
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg relative z-10"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enter Quiz Code ✨
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group relative overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 25px 50px rgba(34, 197, 94, 0.3)"
                  }}
                  onClick={() => setActiveView('history')}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: -360,
                        boxShadow: "0 0 30px rgba(34, 197, 94, 0.6)"
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      📊
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">View History</h3>
                      <p className="text-white/70">Check your past results</p>
                    </div>
                  </div>
                  <motion.button 
                    className="w-full bg-white/20 text-white py-3 rounded-xl font-semibold border border-white/30 relative z-10"
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Results 📈
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeView === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-4xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Join Quiz
                </motion.h1>
                <motion.p 
                  className="text-white/80 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Enter the quiz code provided by your teacher
                </motion.p>
              </div>
              <motion.div 
                className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <QuizCodeEntry onQuizStart={handleStartQuiz} />
              </motion.div>
            </motion.div>
          )}

          {activeView === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-4xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Quiz History
                </motion.h1>
                <motion.p 
                  className="text-white/80 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  View your past quiz results and performance
                </motion.p>
              </div>
              
              {submissions.length === 0 ? (
                <motion.div 
                  className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-6xl mb-6">📊</div>
                  <h3 className="text-2xl font-bold text-white mb-3">No submissions yet</h3>
                  <p className="text-white/70 text-lg">
                    Start your first quiz to see results here
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {submissions.map((submission, index) => (
                    <motion.div
                      key={submission._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            Quiz Submission
                          </h4>
                          <p className="text-white/70">
                            {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white mb-2">
                            {submission.score}/{submission.total_questions}
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            submission.score >= 70 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {submission.score >= 70 ? '✅ Passed' : '❌ Failed'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'quiz' && currentQuiz && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <QuizInterface
                quiz={currentQuiz}
                onComplete={handleQuizComplete}
                onCancel={() => {
                  setCurrentQuiz(null)
                  setActiveView('home')
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      {activeView === 'home' && (
        <motion.div
          className="fixed bottom-8 right-8 z-30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <motion.button
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl"
            whileHover={{ 
              scale: 1.1, 
              rotate: 360,
              boxShadow: "0 0 30px rgba(236, 72, 153, 0.6)"
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            onClick={() => setActiveView('join')}
          >
            🚀
          </motion.button>
        </motion.div>
      )}

      {/* Ambient Light Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>
      </div>

      {/* Debug Panel - REMOVED for production */}
      {/* Floating Logout Button */}
      <motion.div
        className="floating-logout-container"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 99999
        }}
      >
        <AnimatedLogoutButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚪 Student logout button clicked!');
            
            // Play logout sound
            playLogout();
            
            // Call the onLogout prop from App.jsx (Alice loader will handle the rest)
            if (onLogout) {
              onLogout();
            } else {
              performCompleteLogout();
            }
          }}
          className="floating-logout-btn"
        />
      </motion.div>
    </div>
  )
}