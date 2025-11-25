// Enhanced Exam Dashboard - Student ke liye better exam experience
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ExamTimer from './ExamTimer'
import ExamProgress from './ExamProgress'
import ExamStats from './ExamStats'
import ExamHelp from './ExamHelp'
import ExamQuestionCard from './ExamQuestionCard'
import ExamNavigator from './ExamNavigator'
import ExamToolbar from './ExamToolbar'
import ExamSidebar from './ExamSidebar'
import CameraProctor from './CameraProctor'
import SimpleAudioRecorder from './SimpleAudioRecorder'
import { playQuizStart, playViolation, playWarning, playTimeWarning, playQuizSubmit } from '../../utils/soundUtils'
import apiService from '../../services/api'
import '../../styles/exam-dashboard.css'

export default function ExamDashboard({ quiz, onComplete, onCancel }) {
  // Core exam states
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [startTime] = useState(Date.now())
  const [violationCount, setViolationCount] = useState(0)
  
  // UI states
  const [showSidebar, setShowSidebar] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Activity tracking
  const [focusTime, setFocusTime] = useState(0)
  const [keystrokes, setKeystrokes] = useState(0)
  const [mouseClicks, setMouseClicks] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimes, setQuestionTimes] = useState({})

  // Initialize exam
  useEffect(() => {
    playQuizStart()
    
    // Request fullscreen for better focus
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen failed, continue anyway
      })
    }
    
    // Setup timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        
        // Time warnings
        if (prev === 300) {
          playTimeWarning()
          toast.error("⏰ 5 minutes remaining!")
        } else if (prev === 60) {
          playTimeWarning()
          toast.error("🚨 1 minute remaining!")
        } else if (prev <= 10 && prev > 0) {
          playWarning()
        }
        
        return prev - 1
      })
      
      // Track focus time
      if (!document.hidden) {
        setFocusTime(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Activity tracking
  useEffect(() => {
    const handleKeyPress = () => setKeystrokes(prev => prev + 1)
    const handleClick = () => setMouseClicks(prev => prev + 1)

    document.addEventListener('keypress', handleKeyPress)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keypress', handleKeyPress)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Security measures
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        playViolation()
        toast.error("⚠️ Tab switching detected!")
        setViolationCount(prev => prev + 1)
        
        try {
          await apiService.createFlag({
            quiz_id: quiz._id,
            flag_type: "tab_switch",
            description: "Student switched tabs during exam",
            severity: "high",
          })
        } catch (error) {
          console.error("Failed to create flag:", error)
        }
      }
    }

    const handleKeyDown = (e) => {
      // Disable dev tools and other shortcuts
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U") ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault()
        playViolation()
        toast.error("⚠️ This action is disabled during exam")
        
        apiService.createFlag({
          quiz_id: quiz._id,
          flag_type: "security_violation",
          description: `Attempted to use ${e.key}`,
          severity: "high",
        }).catch(err => console.error("Failed to create flag:", err))
        
        return false
      }
    }

    const handleContextMenu = (e) => {
      e.preventDefault()
      playWarning()
      toast.error("⚠️ Right-click is disabled")
      return false
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [quiz._id])

  // Track time spent on each question
  useEffect(() => {
    const timeSpent = Date.now() - questionStartTime
    setQuestionTimes(prev => ({
      ...prev,
      [currentQuestion]: (prev[currentQuestion] || 0) + timeSpent
    }))
    setQuestionStartTime(Date.now())
  }, [currentQuestion])

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleViolation = (violationType, description) => {
    setViolationCount(prev => prev + 1)
    playViolation()
    toast.error(`⚠️ ${description}`)
  }

  const handleAutoSubmit = async () => {
    toast.error("⏰ Time's up! Auto-submitting...")
    await handleSubmit()
  }

  const handleSubmit = async () => {
    try {
      playQuizSubmit()
      
      const endTime = Date.now()
      const timeTaken = Math.round((endTime - startTime) / 1000)

      const submission = {
        quiz_id: quiz._id,
        answers,
        time_taken: timeTaken,
        violation_count: violationCount,
        focus_time: focusTime,
        activity_stats: {
          keystrokes,
          mouse_clicks: mouseClicks,
          question_times: questionTimes
        }
      }

      await apiService.submitQuiz(submission)
      
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      
      onComplete()
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      toast.error("Failed to submit quiz. Please try again.")
    }
  }

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < quiz.questions.length) {
      setCurrentQuestion(index)
    }
  }

  const currentQuestionData = quiz.questions[currentQuestion]
  const answeredQuestions = Object.keys(answers).length
  const completionPercentage = Math.round((answeredQuestions / quiz.questions.length) * 100)

  return (
    <div className="exam-dashboard">
      {/* Security Monitoring */}
      <CameraProctor
        quizId={quiz._id}
        isActive={true}
        onViolation={handleViolation}
      />

      {quiz.audio_proctoring?.enabled && (
        <SimpleAudioRecorder
          quizId={quiz._id}
          isActive={true}
          onConsentDeclined={() => {}}
        />
      )}

      {/* Main Layout */}
      <div className="exam-layout">
        {/* Toolbar */}
        <ExamToolbar
          quiz={quiz}
          timeLeft={timeLeft}
          completionPercentage={completionPercentage}
          violationCount={violationCount}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onToggleStats={() => setShowStats(!showStats)}
          onToggleHelp={() => setShowHelp(!showHelp)}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />

        <div className="exam-content">
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <ExamSidebar
                quiz={quiz}
                currentQuestion={currentQuestion}
                answers={answers}
                onNavigate={navigateToQuestion}
                onClose={() => setShowSidebar(false)}
              />
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="exam-main">
            {/* Progress Bar */}
            <ExamProgress
              currentQuestion={currentQuestion}
              totalQuestions={quiz.questions.length}
              answeredQuestions={answeredQuestions}
            />

            {/* Question Card */}
            <ExamQuestionCard
              question={currentQuestionData}
              questionIndex={currentQuestion}
              answer={answers[currentQuestion]}
              onAnswerChange={handleAnswerChange}
            />

            {/* Navigation */}
            <ExamNavigator
              currentQuestion={currentQuestion}
              totalQuestions={quiz.questions.length}
              onPrevious={() => navigateToQuestion(currentQuestion - 1)}
              onNext={() => navigateToQuestion(currentQuestion + 1)}
              onSubmit={handleSubmit}
              onCancel={onCancel}
              isLastQuestion={currentQuestion === quiz.questions.length - 1}
            />
          </div>
        </div>
      </div>

      {/* Floating Panels */}
      <AnimatePresence>
        {showStats && (
          <ExamStats
            answeredQuestions={answeredQuestions}
            totalQuestions={quiz.questions.length}
            timeLeft={timeLeft}
            focusTime={focusTime}
            keystrokes={keystrokes}
            mouseClicks={mouseClicks}
            violationCount={violationCount}
            onClose={() => setShowStats(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <ExamHelp
            onClose={() => setShowHelp(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}