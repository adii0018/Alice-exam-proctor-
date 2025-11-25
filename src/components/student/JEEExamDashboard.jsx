// JEE/NEET Style Exam Dashboard - Professional Interface
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { examToast } from '../../utils/examToast'
import JEETimer from './JEETimer'
import QuestionPalette from './QuestionPalette'
import JEEQuestionCard from './JEEQuestionCard'
import JEENavigator from './JEENavigator'
import ReviewScreen from './ReviewScreen'
import Calculator from './Calculator'
import RoughWorkArea from './RoughWorkArea'
import CameraProctor from './CameraProctor'
import SimpleAudioRecorder from './SimpleAudioRecorder'
import { playQuizStart, playViolation, playWarning, playTimeWarning, playQuizSubmit } from '../../utils/soundUtils'
import apiService from '../../services/api'
import '../../styles/jee-exam-dashboard.css'
import '../../styles/exam-notifications.css'

export default function JEEExamDashboard({ quiz, onComplete, onCancel }) {
  // Core exam states
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState(new Set())
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]))
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [startTime] = useState(Date.now())
  const [violationCount, setViolationCount] = useState(0)
  
  // UI states
  const [showReviewScreen, setShowReviewScreen] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showRoughWork, setShowRoughWork] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionTimeSpent, setSectionTimeSpent] = useState({})
  
  // Activity tracking
  const [focusTime, setFocusTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimes, setQuestionTimes] = useState({})

  // Sections for JEE/NEET style
  const sections = quiz.sections || [
    { name: 'Physics', questions: quiz.questions.slice(0, Math.ceil(quiz.questions.length / 3)), color: '#3b82f6' },
    { name: 'Chemistry', questions: quiz.questions.slice(Math.ceil(quiz.questions.length / 3), Math.ceil(2 * quiz.questions.length / 3)), color: '#10b981' },
    { name: 'Mathematics', questions: quiz.questions.slice(Math.ceil(2 * quiz.questions.length / 3)), color: '#f59e0b' }
  ]

  // Initialize exam
  useEffect(() => {
    playQuizStart()
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {})
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
        if (prev === 900) { // 15 minutes
          playTimeWarning()
          examToast.warning("⏰ 15 minutes remaining!")
        } else if (prev === 300) { // 5 minutes
          playTimeWarning()
          examToast.error("🚨 5 minutes remaining!")
        } else if (prev === 60) { // 1 minute
          playTimeWarning()
          examToast.error("⚠️ 1 minute remaining!")
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

  // Security measures
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        playViolation()
        examToast.error("⚠️ Tab switching detected!")
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
        examToast.warning("⚠️ This action is disabled during exam")
        
        apiService.createFlag({
          quiz_id: quiz._id,
          flag_type: "security_violation",
          description: `Attempted to use ${e.key}`,
          severity: "high",
        }).catch(err => console.error("Failed to create flag:", err))
        
        return false
      }

      // Navigation shortcuts
      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault()
        navigateToPrevious()
      } else if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault()
        navigateToNext()
      }
    }

    const handleContextMenu = (e) => {
      e.preventDefault()
      playWarning()
      examToast.silent("⚠️ Right-click is disabled", 'warning')
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

  const getCurrentSection = () => {
    let questionCount = 0
    for (let i = 0; i < sections.length; i++) {
      if (currentQuestion < questionCount + sections[i].questions.length) {
        return i
      }
      questionCount += sections[i].questions.length
    }
    return 0
  }

  const getQuestionStatus = (questionIndex) => {
    if (markedForReview.has(questionIndex)) {
      return answers[questionIndex] !== undefined ? 'answered-marked' : 'marked'
    }
    if (answers[questionIndex] !== undefined) {
      return 'answered'
    }
    if (visitedQuestions.has(questionIndex)) {
      return 'not-answered'
    }
    return 'not-visited'
  }

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < quiz.questions.length) {
      setCurrentQuestion(index)
      setVisitedQuestions(prev => new Set([...prev, index]))
    }
  }

  const navigateToPrevious = () => {
    if (currentQuestion > 0) {
      navigateToQuestion(currentQuestion - 1)
    }
  }

  const navigateToNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      navigateToQuestion(currentQuestion + 1)
    }
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleMarkForReview = (questionIndex) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const handleClearResponse = (questionIndex) => {
    setAnswers(prev => {
      const newAnswers = { ...prev }
      delete newAnswers[questionIndex]
      return newAnswers
    })
    toast.success("Response cleared!")
  }

  const handleSaveAndNext = () => {
    // Auto-save is already handled by handleAnswerChange
    navigateToNext()
  }

  const handleViolation = (violationType, description) => {
    setViolationCount(prev => prev + 1)
    playViolation()
    toast.error(`⚠️ ${description}`)
  }

  const handleAutoSubmit = async () => {
    examToast.error("⏰ Time's up! Auto-submitting...")
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
        marked_for_review: Array.from(markedForReview),
        question_times: questionTimes,
        section_time_spent: sectionTimeSpent
      }

      await apiService.submitQuiz(submission)
      
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      
      onComplete()
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      examToast.error("Failed to submit quiz. Please try again.")
    }
  }

  const currentQuestionData = quiz.questions[currentQuestion]
  const answeredQuestions = Object.keys(answers).length
  const completionPercentage = Math.round((answeredQuestions / quiz.questions.length) * 100)

  if (showReviewScreen) {
    return (
      <ReviewScreen
        quiz={quiz}
        answers={answers}
        markedForReview={markedForReview}
        questionTimes={questionTimes}
        onNavigateToQuestion={navigateToQuestion}
        onSubmit={handleSubmit}
        onBack={() => setShowReviewScreen(false)}
      />
    )
  }

  return (
    <div className="jee-exam-dashboard exam-mode">
      {/* Test Banner to confirm JEE Dashboard is loading */}
      <div style={{
        background: '#10b981',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        🎯 JEE/NEET Style Professional Exam Dashboard Active! 🎓
      </div>

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

      {/* Header */}
      <div className="jee-header">
        <div className="header-left">
          <div className="exam-info">
            <h1 className="exam-title">{quiz.title}</h1>
            <div className="exam-meta">
              <span>Candidate: {quiz.candidateName || 'Student'}</span>
              <span>•</span>
              <span>Roll No: {quiz.rollNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <JEETimer 
            timeLeft={timeLeft}
            totalTime={quiz.duration * 60}
          />
        </div>

        <div className="header-right">
          <div className="header-actions">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="header-btn calculator-btn"
              title="Calculator"
            >
              🧮
            </button>
            
            <button
              onClick={() => setShowRoughWork(!showRoughWork)}
              className="header-btn rough-work-btn"
              title="Rough Work"
            >
              📝
            </button>
            
            <button
              onClick={() => setShowReviewScreen(true)}
              className="header-btn review-btn"
              title="Review & Submit"
            >
              📋 Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="jee-content">
        {/* Left Panel - Question */}
        <div className="question-panel">
          <JEEQuestionCard
            question={currentQuestionData}
            questionIndex={currentQuestion}
            answer={answers[currentQuestion]}
            isMarkedForReview={markedForReview.has(currentQuestion)}
            onAnswerChange={handleAnswerChange}
            onMarkForReview={() => handleMarkForReview(currentQuestion)}
            onClearResponse={() => handleClearResponse(currentQuestion)}
          />

          <JEENavigator
            currentQuestion={currentQuestion}
            totalQuestions={quiz.questions.length}
            onPrevious={navigateToPrevious}
            onNext={navigateToNext}
            onSaveAndNext={handleSaveAndNext}
            onMarkForReview={() => handleMarkForReview(currentQuestion)}
            onClearResponse={() => handleClearResponse(currentQuestion)}
            isMarkedForReview={markedForReview.has(currentQuestion)}
            hasAnswer={answers[currentQuestion] !== undefined}
          />
        </div>

        {/* Right Panel - Question Palette */}
        <QuestionPalette
          questions={quiz.questions}
          sections={sections}
          currentQuestion={currentQuestion}
          answers={answers}
          markedForReview={markedForReview}
          visitedQuestions={visitedQuestions}
          onNavigateToQuestion={navigateToQuestion}
          getQuestionStatus={getQuestionStatus}
        />
      </div>

      {/* Floating Components */}
      <AnimatePresence>
        {showCalculator && (
          <Calculator onClose={() => setShowCalculator(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRoughWork && (
          <RoughWorkArea onClose={() => setShowRoughWork(false)} />
        )}
      </AnimatePresence>

      {/* Violation Warning */}
      {violationCount > 0 && (
        <div className="violation-warning">
          <div className="violation-content">
            <span className="violation-icon">⚠️</span>
            <span className="violation-text">
              {violationCount} Violation{violationCount > 1 ? 's' : ''} Detected
            </span>
            {violationCount >= 5 && (
              <span className="violation-severe">
                Exam may be auto-submitted at 10 violations
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}