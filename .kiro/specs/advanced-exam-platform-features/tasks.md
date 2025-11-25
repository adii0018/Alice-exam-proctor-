# Implementation Plan

This implementation plan breaks down the 15 major features into actionable coding tasks. Each task builds incrementally and can be executed by a coding agent.

## Phase 1: Infrastructure Setup

- [ ] 1. Set up Celery and Redis infrastructure
  - Install Celery, Redis, and required dependencies in requirements.txt
  - Create celery.py configuration file in exam_proctoring/
  - Configure Celery app with Redis broker and result backend
  - Create celery_config.py with task routing and rate limits
  - Add Celery worker startup script
  - _Requirements: All features requiring async processing_

- [ ] 2. Configure email service integration
  - Install SendGrid or AWS SES SDK
  - Create email_config.py with SMTP settings
  - Add email service credentials to .env.example
  - Create email service wrapper class in api/utils/email_helper.py
  - Implement email delivery status tracking
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Set up cloud storage for recordings
  - Install boto3 for AWS S3 or minio for MinIO
  - Create storage_config.py with bucket configuration
  - Implement StorageHelper class in api/utils/storage_helper.py
  - Add methods for upload, download, delete, and presigned URLs
  - Create storage initialization script
  - _Requirements: 9.3, 9.4_

- [ ] 4. Create new database collections and indexes
  - Add new collection definitions to api/models.py
  - Create database migration script for new collections
  - Implement index creation for email_logs, batches, question_bank, leaderboards
  - Add compound indexes for plagiarism detection
  - Create database initialization function
  - _Requirements: All features_

## Phase 2: Email Notification System

- [ ] 5. Implement email template system
  - [ ] 5.1 Create EmailTemplate model in api/models.py
    - Define schema with name, subject, html_body, text_body, variables
    - Add CRUD methods for templates
    - _Requirements: 1.5_

  - [ ] 5.2 Create email template renderer
    - Implement Jinja2 template engine integration
    - Create render_template method with variable substitution
    - Add HTML and plain text rendering
    - _Requirements: 1.5, 1.6_

  - [ ] 5.3 Create default email templates
    - Write quiz_invitation.html template
    - Write result_notification.html template
    - Write violation_alert.html template
    - Write reminder_email.html template
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 6. Implement email service backend
  - [ ] 6.1 Create EmailService class
    - Implement send_email method with retry logic
    - Add send_bulk_emails method for batch sending
    - Create email validation function
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 6.2 Create Celery tasks for async email sending
    - Implement send_email_async task in api/tasks/email_tasks.py
    - Add send_bulk_emails_async task
    - Implement retry logic with exponential backoff
    - _Requirements: 1.8_

  - [ ] 6.3 Create email logging system
    - Implement EmailLog model for tracking delivery
    - Add log_email_sent, log_email_failed methods
    - Create email status update mechanism
    - _Requirements: 1.7, 1.8_

- [ ] 7. Create email API endpoints
  - Implement POST /api/emails/send/ endpoint
  - Create GET /api/emails/templates/ endpoint
  - Add POST /api/emails/templates/ endpoint
  - Implement PUT /api/emails/templates/:id/ endpoint
  - Create GET /api/emails/history/ endpoint with pagination
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 8. Build email management frontend
  - [ ] 8.1 Create EmailCenter component
    - Build email history table with filters
    - Add template management interface
    - Implement manual email sending form
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 8.2 Create EmailTemplateEditor component
    - Build rich text editor for HTML templates
    - Add variable insertion helper
    - Implement template preview functionality
    - _Requirements: 1.5_

- [ ] 9. Integrate email triggers with existing features
  - Add email trigger on quiz creation in quiz_views.py
  - Implement email trigger on quiz submission
  - Add email trigger on violation flag creation
  - Create reminder email scheduler
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

## Phase 3: Advanced Analytics Dashboard

- [ ] 10. Implement analytics data aggregation
  - [ ] 10.1 Create AnalyticsService class
    - Implement get_student_performance_trends method
    - Add get_quiz_difficulty_analysis method
    - Create get_cheating_patterns method
    - Implement get_question_analytics method
    - _Requirements: 2.1, 2.2, 2.3, 2.6_

  - [ ] 10.2 Implement caching layer for analytics
    - Create Redis caching wrapper for analytics data
    - Add cache invalidation on new submissions
    - Implement cache warming for popular queries
    - _Requirements: 2.7_

- [ ] 11. Create analytics API endpoints
  - Implement GET /api/analytics/student/:id/trends/ endpoint
  - Create GET /api/analytics/quiz/:id/difficulty/ endpoint
  - Add GET /api/analytics/quiz/:id/cheating/ endpoint
  - Implement GET /api/analytics/quiz/:id/questions/ endpoint
  - Create GET /api/analytics/export/ endpoint with CSV/Excel support
  - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.8_

- [ ] 12. Build analytics dashboard frontend
  - [ ] 12.1 Create AnalyticsDashboard component
    - Build performance trend line chart using Chart.js
    - Add quiz difficulty bar chart
    - Implement cheating pattern heatmap
    - Create question analytics table
    - _Requirements: 2.1, 2.2, 2.3, 2.6_

  - [ ] 12.2 Create StudentAnalytics component
    - Build individual student performance view
    - Add historical score trend chart
    - Implement comparison with class average
    - Create violation history timeline
    - _Requirements: 2.5_

  - [ ] 12.3 Add real-time analytics updates
    - Integrate WebSocket for live dashboard updates
    - Implement auto-refresh on new submissions
    - Add real-time violation statistics
    - _Requirements: 2.7_

  - [ ] 12.4 Implement analytics export functionality
    - Create export button with format selection
    - Add CSV export using Papa Parse
    - Implement Excel export using SheetJS
    - _Requirements: 2.8_

## Phase 4: PDF Report Generation

- [ ] 13. Set up PDF generation infrastructure
  - Install ReportLab or WeasyPrint
  - Create report templates directory
  - Implement PDF styling with CSS
  - Add chart rendering for PDFs
  - _Requirements: 3.4_

- [ ] 14. Implement report generation backend
  - [ ] 14.1 Create ReportService class
    - Implement generate_student_report method
    - Add generate_class_report method
    - Create generate_violation_report method
    - Implement generate_batch_reports method
    - _Requirements: 3.1, 3.2, 3.3, 3.7_

  - [ ] 14.2 Create report templates
    - Write student_report.html template with charts
    - Create class_report.html template with statistics
    - Implement violation_report.html template
    - Add school branding customization
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [ ] 14.3 Implement async PDF generation
    - Create generate_pdf_async Celery task
    - Add generate_batch_pdfs_async task
    - Implement progress tracking for batch generation
    - _Requirements: 3.7_

- [ ] 15. Create report API endpoints
  - Implement POST /api/reports/generate/ endpoint
  - Create GET /api/reports/ endpoint with pagination
  - Add GET /api/reports/:id/download/ endpoint with presigned URLs
  - Implement POST /api/reports/batch/ endpoint
  - Create DELETE /api/reports/:id/ endpoint
  - _Requirements: 3.1, 3.2, 3.3, 3.7, 3.8_

- [ ] 16. Build report generation frontend
  - [ ] 16.1 Create ReportGenerator component
    - Build report type selector
    - Add parameter configuration form
    - Implement report preview modal
    - Create download/email buttons
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 16.2 Create ReportHistory component
    - Build report list table
    - Add download links with expiration display
    - Implement regenerate functionality
    - _Requirements: 3.8_

- [ ] 17. Add QR code generation for reports
  - Install qrcode library
  - Implement QR code generation in reports
  - Add verification URL in QR codes
  - _Requirements: 3.9_

## Phase 5: Group and Batch Management

- [ ] 18. Implement batch management backend
  - [ ] 18.1 Create Batch model
    - Define schema with name, description, teacher_id, student_ids
    - Add CRUD methods for batches
    - Implement student membership methods
    - _Requirements: 4.1, 4.2_

  - [ ] 18.2 Create BatchService class
    - Implement create_batch method
    - Add add_students_to_batch method
    - Create remove_students_from_batch method
    - Implement assign_quiz_to_batch method
    - Add get_batch_analytics method
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

- [ ] 19. Create batch API endpoints
  - Implement GET /api/batches/ endpoint
  - Create POST /api/batches/ endpoint
  - Add GET /api/batches/:id/ endpoint
  - Implement PUT /api/batches/:id/ endpoint
  - Create DELETE /api/batches/:id/ endpoint
  - Add POST /api/batches/:id/students/ endpoint
  - Implement DELETE /api/batches/:id/students/ endpoint
  - Create GET /api/batches/:id/analytics/ endpoint
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7_

- [ ] 20. Build batch management frontend
  - [ ] 20.1 Create BatchManager component
    - Build batch creation form
    - Add student selection interface
    - Implement batch editing functionality
    - Create batch deletion with confirmation
    - _Requirements: 4.1, 4.2, 4.6_

  - [ ] 20.2 Create BatchSelector component
    - Build batch dropdown for quiz assignment
    - Add multi-batch selection
    - Implement batch preview with student count
    - _Requirements: 4.3_

  - [ ] 20.3 Add batch analytics view
    - Create batch performance comparison charts
    - Implement batch-wise filtering in analytics
    - Add batch enrollment statistics
    - _Requirements: 4.4, 4.7, 4.8_

- [ ] 21. Update quiz assignment to support batches
  - Modify quiz creation to accept batch_ids
  - Update quiz access control to check batch membership
  - Add batch filter in quiz list
  - Implement automatic access grant on batch assignment
  - _Requirements: 4.3, 4.5_


## Phase 6: AI-Powered Question Generator

- [ ] 22. Set up OpenAI integration
  - Install openai Python package
  - Create openai_config.py with API key configuration
  - Implement OpenAIHelper class in api/utils/openai_helper.py
  - Add rate limiting for API calls
  - _Requirements: 5.1, 5.2_

- [ ] 23. Implement question bank backend
  - [ ] 23.1 Create QuestionBank model
    - Define schema with question_text, options, correct_answer, metadata
    - Add CRUD methods for questions
    - Implement search and filter methods
    - _Requirements: 5.4_

  - [ ] 23.2 Create AIQuestionService class
    - Implement generate_questions method with OpenAI integration
    - Add validate_question_quality method
    - Create save_to_question_bank method
    - Implement get_similar_questions method
    - _Requirements: 5.1, 5.2, 5.3, 5.8, 5.9_

  - [ ] 23.3 Implement question generation prompts
    - Create prompt templates for different difficulty levels
    - Add subject-specific prompt variations
    - Implement response parsing logic
    - Add quality validation rules
    - _Requirements: 5.1, 5.2, 5.8_

- [ ] 24. Create question bank API endpoints
  - Implement POST /api/ai/generate-questions/ endpoint
  - Create GET /api/question-bank/ endpoint with filters
  - Add POST /api/question-bank/ endpoint
  - Implement GET /api/question-bank/:id/ endpoint
  - Create PUT /api/question-bank/:id/ endpoint
  - Add DELETE /api/question-bank/:id/ endpoint
  - Implement GET /api/question-bank/search/ endpoint
  - Create POST /api/question-bank/import/ endpoint for CSV
  - _Requirements: 5.1, 5.4, 5.6, 5.7_

- [ ] 25. Build question generator frontend
  - [ ] 25.1 Create QuestionGenerator component
    - Build topic and difficulty input form
    - Add question count selector
    - Implement generate button with loading state
    - Create question review and edit interface
    - Add bulk add to quiz functionality
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.7_

  - [ ] 25.2 Create QuestionBankBrowser component
    - Build question list with filters
    - Add search functionality
    - Implement question preview
    - Create select for quiz functionality
    - Add usage statistics display
    - _Requirements: 5.4, 5.9_

  - [ ] 25.3 Add question import functionality
    - Create CSV upload component
    - Implement CSV parsing and validation
    - Add preview before import
    - Create bulk import with progress indicator
    - _Requirements: 5.7_

- [ ] 26. Integrate question bank with quiz creator
  - Add "Select from Question Bank" button in QuizCreator
  - Implement question bank modal in quiz creation flow
  - Add duplicate detection when adding questions
  - Update quiz creation to support question bank references
  - _Requirements: 5.4, 5.5, 5.9_

## Phase 7: Gamification System

- [ ] 27. Implement gamification backend
  - [ ] 27.1 Create Leaderboard model
    - Define schema with student_id, total_points, badges, rank
    - Add methods for updating leaderboard
    - Implement rank calculation logic
    - _Requirements: 6.1, 6.5_

  - [ ] 27.2 Create GamificationService class
    - Implement calculate_points method
    - Add award_badge method with badge definitions
    - Create update_leaderboard method
    - Implement get_student_rank method
    - Add check_achievements method
    - _Requirements: 6.2, 6.3, 6.5, 6.6, 6.8_

  - [ ] 27.3 Define badge criteria and logic
    - Create BADGES dictionary with all badge types
    - Implement badge checking logic for each type
    - Add badge awarding triggers
    - Create badge notification system
    - _Requirements: 6.3, 6.4_

- [ ] 28. Create gamification API endpoints
  - Implement GET /api/gamification/leaderboard/ endpoint
  - Create GET /api/gamification/student/:id/stats/ endpoint
  - Add GET /api/gamification/badges/ endpoint
  - Implement POST /api/gamification/award-badge/ endpoint
  - Create GET /api/gamification/achievements/:id/ endpoint
  - _Requirements: 6.1, 6.2, 6.3, 6.10_

- [ ] 29. Build gamification frontend components
  - [ ] 29.1 Create Leaderboard component
    - Build top 10 students table
    - Add current user rank highlight
    - Implement time period filter (daily, weekly, monthly)
    - Create batch leaderboard view
    - _Requirements: 6.1, 6.5, 6.7_

  - [ ] 29.2 Create BadgeCollection component
    - Build badge grid display
    - Add earned vs locked badge states
    - Implement progress indicators
    - Create badge detail modal
    - _Requirements: 6.3, 6.6, 6.10_

  - [ ] 29.3 Create AchievementNotification component
    - Build animated badge popup
    - Add points earned display
    - Implement rank change notification
    - Create confetti animation
    - _Requirements: 6.4_

- [ ] 30. Integrate gamification with quiz submission
  - Update quiz submission handler to calculate points
  - Add badge checking after submission
  - Implement leaderboard update trigger
  - Create achievement notification trigger
  - _Requirements: 6.2, 6.3, 6.4, 6.8_

- [ ] 31. Add gamification to student dashboard
  - Display student's total points and rank
  - Show recent badges earned
  - Add leaderboard widget
  - Implement achievement progress bars
  - _Requirements: 6.1, 6.5, 6.6, 6.10_

## Phase 8: Plagiarism Detection

- [ ] 32. Implement plagiarism detection backend
  - [ ] 32.1 Create PlagiarismFlag model
    - Define schema with quiz_id, student pairs, similarity_score
    - Add CRUD methods for flags
    - Implement status update methods
    - _Requirements: 7.3_

  - [ ] 32.2 Create SimilarityCalculator class
    - Implement jaccard_similarity method
    - Add sequence_matching method
    - Create timing_correlation method
    - Implement combined_score method
    - _Requirements: 7.2, 7.6, 7.9_

  - [ ] 32.3 Create PlagiarismService class
    - Implement analyze_submissions method
    - Add calculate_similarity method
    - Create detect_patterns method
    - Implement generate_report method
    - _Requirements: 7.1, 7.2, 7.7_

  - [ ] 32.4 Implement plagiarism detection algorithm
    - Create answer pattern comparison logic
    - Add text similarity for written answers
    - Implement timing correlation analysis
    - Create threshold-based flagging
    - Exclude common correct answers from analysis
    - _Requirements: 7.2, 7.5, 7.6, 7.9, 7.10_

- [ ] 33. Create plagiarism API endpoints
  - Implement POST /api/plagiarism/analyze/:quiz_id/ endpoint
  - Create GET /api/plagiarism/flags/:quiz_id/ endpoint
  - Add GET /api/plagiarism/compare/:id1/:id2/ endpoint
  - Implement PUT /api/plagiarism/flags/:id/ endpoint
  - Create GET /api/plagiarism/report/:quiz_id/ endpoint
  - _Requirements: 7.1, 7.3, 7.4, 7.7, 7.8_

- [ ] 34. Build plagiarism detection frontend
  - [ ] 34.1 Create PlagiarismDetector component
    - Build "Run Plagiarism Check" button
    - Add loading state during analysis
    - Implement flagged pairs list
    - Create filter by similarity threshold
    - _Requirements: 7.1, 7.3_

  - [ ] 34.2 Create SimilarityReport component
    - Build side-by-side submission comparison
    - Add similarity percentage display
    - Implement matching questions highlight
    - Create timing analysis visualization
    - Add evidence display
    - _Requirements: 7.2, 7.4, 7.6, 7.9_

  - [ ] 34.3 Add plagiarism flag management
    - Create mark as confirmed/dismissed buttons
    - Implement flag status update
    - Add teacher notes field
    - Create plagiarism report export
    - _Requirements: 7.7, 7.8_

- [ ] 35. Integrate plagiarism detection with quiz results
  - Add "Check Plagiarism" button in QuizResults
  - Display plagiarism flags in submission list
  - Implement automatic plagiarism check on quiz close
  - Add plagiarism statistics to analytics
  - _Requirements: 7.1, 7.3, 7.7_

## Phase 9: Scheduled Exams

- [ ] 36. Implement quiz scheduling backend
  - [ ] 36.1 Create QuizSchedule model
    - Define schema with quiz_id, start_time, end_time, timezone
    - Add methods for schedule management
    - Implement extension tracking
    - _Requirements: 8.1, 8.2, 8.9_

  - [ ] 36.2 Create SchedulerService class
    - Implement schedule_quiz method
    - Add activate_quiz method
    - Create deactivate_quiz method
    - Implement send_reminders method
    - Add extend_deadline method
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6, 8.9_

  - [ ] 36.3 Create Celery Beat tasks for scheduling
    - Implement check_quiz_schedules periodic task
    - Add activate_scheduled_quiz task
    - Create deactivate_scheduled_quiz task
    - Implement send_quiz_reminders task
    - Add auto_submit_expired_attempts task
    - _Requirements: 8.3, 8.4, 8.6, 8.8_

- [ ] 37. Create scheduling API endpoints
  - Implement POST /api/schedules/ endpoint
  - Create GET /api/schedules/quiz/:id/ endpoint
  - Add PUT /api/schedules/:id/ endpoint
  - Implement DELETE /api/schedules/:id/ endpoint
  - Create POST /api/schedules/:id/extend/ endpoint
  - Add GET /api/schedules/upcoming/ endpoint
  - Implement POST /api/schedules/:id/calendar-sync/ endpoint
  - _Requirements: 8.1, 8.2, 8.9, 8.10_

- [ ] 38. Build quiz scheduling frontend
  - [ ] 38.1 Create QuizScheduler component
    - Build start/end time pickers
    - Add timezone selector
    - Implement reminder configuration
    - Create calendar view integration
    - _Requirements: 8.1, 8.2, 8.5, 8.6, 8.10_

  - [ ] 38.2 Create ScheduledQuizList component
    - Build upcoming quizzes list
    - Add active quizzes section
    - Implement past quizzes archive
    - Create quick action buttons
    - _Requirements: 8.1, 8.2_

  - [ ] 38.3 Create CountdownTimer component
    - Build time until quiz starts display
    - Add time remaining in quiz
    - Implement auto-submit warning
    - Create visual countdown animation
    - _Requirements: 8.7, 8.8_

- [ ] 39. Integrate scheduling with quiz system
  - Update quiz creation to include scheduling options
  - Modify quiz access control to check schedule
  - Add countdown timer to quiz interface
  - Implement auto-submit on deadline
  - Create reminder email triggers
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6, 8.7, 8.8_

- [ ] 40. Add calendar integration
  - Implement Google Calendar API integration
  - Create Outlook Calendar integration
  - Add iCal export functionality
  - Build calendar sync UI
  - _Requirements: 8.10_

## Phase 10: Screen Recording System

- [ ] 41. Set up screen recording infrastructure
  - Configure S3/MinIO bucket for recordings
  - Set up video compression pipeline
  - Implement retention policy (30-day auto-delete)
  - Create storage quota monitoring
  - _Requirements: 9.3, 9.7, 9.8_

- [ ] 42. Implement screen recording backend
  - [ ] 42.1 Create Recording model
    - Define schema with submission_id, segments, bookmarks
    - Add methods for recording management
    - Implement expiration tracking
    - _Requirements: 9.3, 9.4, 9.9_

  - [ ] 42.2 Create RecordingService class
    - Implement initiate_recording method
    - Add upload_segment method
    - Create finalize_recording method
    - Implement get_playback_url method
    - Add delete_old_recordings method
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.8_

  - [ ] 42.3 Implement video compression
    - Create compress_video function
    - Add segment compression before upload
    - Implement quality vs size optimization
    - _Requirements: 9.7_

- [ ] 43. Create recording API endpoints
  - Implement POST /api/recordings/initiate/ endpoint
  - Create POST /api/recordings/upload-segment/ endpoint
  - Add POST /api/recordings/finalize/ endpoint
  - Implement GET /api/recordings/:id/playback/ endpoint
  - Create GET /api/recordings/submission/:id/ endpoint
  - Add DELETE /api/recordings/:id/ endpoint
  - Implement GET /api/recordings/storage-stats/ endpoint
  - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [ ] 44. Build screen recording frontend
  - [ ] 44.1 Create ScreenRecorder component
    - Implement screen capture API integration
    - Add permission request flow
    - Create segment upload logic
    - Implement recording status indicator
    - Add error handling for recording failures
    - _Requirements: 9.1, 9.2, 9.10, 9.11_

  - [ ] 44.2 Create RecordingPlayer component
    - Build video player with controls
    - Add violation bookmark navigation
    - Implement playback speed controls
    - Create download option
    - _Requirements: 9.5, 9.9_

  - [ ] 44.3 Create RecordingManager component
    - Build recordings list with filters
    - Add bulk delete functionality
    - Implement storage usage display
    - Create auto-delete warning
    - _Requirements: 9.5, 9.8_

- [ ] 45. Integrate screen recording with quiz system
  - Add recording initiation on quiz start
  - Implement automatic segment upload during quiz
  - Create recording finalization on quiz submit
  - Add recording failure flag creation
  - Link recordings to violation flags
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.9, 9.11_

- [ ] 46. Implement suspicious activity detection
  - Create tab switching detection
  - Add window change detection
  - Implement automatic flag creation on detection
  - Create bookmark in recording at violation time
  - _Requirements: 9.6, 9.9_


## Phase 11: Two-Factor Authentication

- [ ] 47. Implement 2FA backend
  - [ ] 47.1 Create TwoFactor model
    - Define schema with user_id, secret, backup_codes, trusted_devices
    - Add encryption for sensitive fields
    - Implement CRUD methods
    - _Requirements: 10.2, 10.4, 10.8_

  - [ ] 47.2 Create TwoFactorService class
    - Implement generate_secret method using pyotp
    - Add generate_qr_code method
    - Create verify_totp method
    - Implement generate_backup_codes method
    - Add verify_backup_code method
    - Create send_sms_code method
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.7_

  - [ ] 47.3 Implement trusted device management
    - Create device fingerprinting logic
    - Add trusted device verification
    - Implement 30-day expiration
    - Create device removal functionality
    - _Requirements: 10.8_

- [ ] 48. Create 2FA API endpoints
  - Implement POST /api/auth/2fa/setup/ endpoint
  - Create POST /api/auth/2fa/verify-setup/ endpoint
  - Add POST /api/auth/2fa/verify/ endpoint
  - Implement POST /api/auth/2fa/disable/ endpoint
  - Create GET /api/auth/2fa/backup-codes/ endpoint
  - Add POST /api/auth/2fa/regenerate-codes/ endpoint
  - Implement POST /api/auth/2fa/send-sms/ endpoint
  - Create GET /api/auth/2fa/trusted-devices/ endpoint
  - Add DELETE /api/auth/2fa/trusted-devices/:id/ endpoint
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.7, 10.8_

- [ ] 49. Build 2FA frontend components
  - [ ] 49.1 Create TwoFactorSetup component
    - Build QR code display
    - Add manual entry option
    - Implement verification step
    - Create backup codes download
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ] 49.2 Create TwoFactorVerify component
    - Build 6-digit code input
    - Add remember device checkbox
    - Implement use backup code link
    - Create SMS option toggle
    - _Requirements: 10.3, 10.7, 10.8_

  - [ ] 49.3 Create TwoFactorSettings component
    - Build enable/disable 2FA toggle
    - Add method selection (TOTP/SMS)
    - Implement trusted devices list
    - Create regenerate backup codes button
    - _Requirements: 10.1, 10.4, 10.5, 10.7, 10.8_

- [ ] 50. Integrate 2FA with authentication flow
  - Update login endpoint to check 2FA status
  - Add 2FA verification step after password
  - Implement account lockout after failed attempts
  - Create 2FA requirement enforcement
  - _Requirements: 10.3, 10.6_

- [ ] 51. Add 2FA to profile settings
  - Create 2FA section in ProfilePage
  - Add setup wizard for new users
  - Implement status indicator
  - Create emergency disable option
  - _Requirements: 10.1, 10.5_

## Phase 12: Activity Logs and Audit Trail

- [ ] 52. Implement activity logging backend
  - [ ] 52.1 Create ActivityLog model
    - Define schema with user_id, action, resource, details
    - Add indexing for efficient queries
    - Implement retention policy (90 days)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

  - [ ] 52.2 Create AuditService class
    - Implement log_activity method
    - Add get_user_activities method
    - Create detect_anomalies method
    - Implement export_logs method
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.7, 11.8_

  - [ ] 52.3 Create audit middleware
    - Implement request/response logging
    - Add IP address and user agent capture
    - Create automatic activity logging
    - Implement sensitive action flagging
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 53. Create audit API endpoints
  - Implement GET /api/audit/logs/ endpoint with filters
  - Create GET /api/audit/user/:id/ endpoint
  - Add GET /api/audit/anomalies/ endpoint
  - Implement POST /api/audit/export/ endpoint
  - Create GET /api/audit/stats/ endpoint
  - _Requirements: 11.5, 11.7, 11.8, 11.9_

- [ ] 54. Build activity log frontend
  - [ ] 54.1 Create ActivityLogViewer component
    - Build log table with pagination
    - Add filters (user, action, date range)
    - Implement search functionality
    - Create anomaly highlights
    - Add export button
    - _Requirements: 11.5, 11.7, 11.8_

  - [ ] 54.2 Create UserActivityTimeline component
    - Build chronological activity view
    - Add activity detail expansion
    - Implement IP address display
    - Create session grouping
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 55. Integrate activity logging throughout system
  - Add login/logout logging
  - Implement quiz CRUD logging
  - Create submission logging
  - Add flag management logging
  - Implement settings change logging
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 56. Implement real-time activity monitoring
  - Add WebSocket for live activity updates
  - Create real-time anomaly alerts
  - Implement activity statistics dashboard
  - _Requirements: 11.9_

## Phase 13: Mobile Progressive Web App

- [ ] 57. Implement PWA infrastructure
  - [ ] 57.1 Create service worker
    - Implement cache strategies for assets
    - Add offline fallback pages
    - Create background sync logic
    - Implement push notification handling
    - _Requirements: 12.2, 12.7, 12.8_

  - [ ] 57.2 Configure PWA manifest
    - Create manifest.json with app metadata
    - Add app icons in multiple sizes
    - Configure display mode and theme
    - Implement splash screens
    - _Requirements: 12.1_

  - [ ] 57.3 Implement offline storage
    - Create IndexedDB wrapper for quiz data
    - Add offline quiz progress saving
    - Implement sync queue for pending submissions
    - Create conflict resolution logic
    - _Requirements: 12.2, 12.7_

- [ ] 58. Create PWA backend support
  - [ ] 58.1 Create PushNotificationService
    - Implement send_notification method
    - Add subscribe_user method
    - Create unsubscribe_user method
    - Implement notification scheduling
    - _Requirements: 12.3_

  - [ ] 58.2 Create offline data API
    - Implement GET /api/pwa/offline-data/:quiz_id/ endpoint
    - Add POST /api/pwa/sync/ endpoint for background sync
    - Create POST /api/pwa/subscribe/ endpoint
    - Implement DELETE /api/pwa/unsubscribe/ endpoint
    - _Requirements: 12.2, 12.3, 12.7_

- [ ] 59. Optimize UI for mobile
  - [ ] 59.1 Update responsive layouts
    - Optimize all components for 320px-768px screens
    - Add touch-friendly button sizes (min 44px)
    - Implement swipe gestures for navigation
    - Create mobile-optimized forms
    - _Requirements: 12.4, 12.5_

  - [ ] 59.2 Optimize camera and microphone for mobile
    - Update camera constraints for mobile devices
    - Add mobile-specific error handling
    - Implement orientation change handling
    - Create mobile proctoring UI
    - _Requirements: 12.6_

- [ ] 60. Implement push notifications
  - Create notification permission request flow
  - Add notification preferences in settings
  - Implement notification types (quiz reminder, result, violation)
  - Create notification click handling
  - _Requirements: 12.3_

- [ ] 61. Add biometric authentication support
  - Implement WebAuthn API integration
  - Create fingerprint authentication flow
  - Add Face ID support for iOS
  - Implement fallback to password
  - _Requirements: 12.9_

- [ ] 62. Test PWA functionality
  - [ ]* 62.1 Test offline quiz taking
    - Verify quiz data caching
    - Test answer saving offline
    - Validate sync on reconnection
    - _Requirements: 12.2, 12.7_

  - [ ]* 62.2 Test push notifications
    - Verify notification delivery
    - Test notification actions
    - Validate notification preferences
    - _Requirements: 12.3_

  - [ ]* 62.3 Test mobile responsiveness
    - Test on various screen sizes
    - Verify touch interactions
    - Test camera/microphone on mobile
    - _Requirements: 12.4, 12.5, 12.6_

## Phase 14: Live Proctoring Dashboard

- [ ] 63. Implement live monitoring backend
  - [ ] 63.1 Create LiveMonitoringService
    - Implement get_active_sessions method
    - Add get_session_details method
    - Create send_message_to_student method
    - Implement terminate_session method
    - _Requirements: 14.1, 14.4, 14.7_

  - [ ] 63.2 Extend WebSocket consumer for live monitoring
    - Add teacher monitoring channel
    - Implement camera frame broadcasting
    - Create violation alert broadcasting
    - Add teacher-student messaging
    - _Requirements: 14.2, 14.3, 14.4_

- [ ] 64. Build live proctoring dashboard frontend
  - [ ] 64.1 Create LiveDashboard component
    - Build grid view for active students (4x4 layout)
    - Add real-time camera feed display
    - Implement violation alert panel
    - Create quick action toolbar
    - Add filter by quiz/batch
    - _Requirements: 14.1, 14.2, 14.3, 14.8_

  - [ ] 64.2 Create StudentMonitorCard component
    - Build camera feed display
    - Add progress indicator (questions answered)
    - Implement violation count badge
    - Create send message button
    - Add terminate session button
    - _Requirements: 14.2, 14.4, 14.5, 14.7_

  - [ ] 64.3 Create TeacherMessageModal component
    - Build message input form
    - Add send to student functionality
    - Implement message history display
    - Create quick message templates
    - _Requirements: 14.4_

  - [ ] 64.4 Implement real-time updates
    - Add WebSocket connection for live data
    - Implement camera frame updates
    - Create violation alert notifications
    - Add audio alert for high-severity violations
    - _Requirements: 14.2, 14.3, 14.6_

- [ ] 65. Add network quality monitoring
  - Implement connection quality indicator
  - Create bandwidth monitoring
  - Add reconnection handling
  - Display network status for each student
  - _Requirements: 14.9_

- [ ] 66. Integrate live dashboard with existing features
  - Add "Live Monitor" button in TeacherDashboard
  - Link to specific quiz monitoring
  - Implement session filtering
  - Create violation flag creation from live dashboard
  - _Requirements: 14.1, 14.8_

## Phase 15: Adaptive Quiz Difficulty

- [ ] 67. Implement adaptive quiz backend
  - [ ] 67.1 Create StudentPerformanceProfile model
    - Define schema with subject_levels, overall_level, quiz_history
    - Add methods for level calculation
    - Implement confidence scoring
    - _Requirements: 15.1, 15.2_

  - [ ] 67.2 Create AdaptiveQuizService class
    - Implement calculate_student_level method
    - Add select_next_question method
    - Create adjust_difficulty method
    - Implement generate_adaptive_report method
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 67.3 Implement adaptive algorithm
    - Create difficulty adjustment logic based on performance
    - Add question selection algorithm
    - Implement fairness balancing
    - Create performance tracking
    - _Requirements: 15.2, 15.3, 15.5, 15.6_

- [ ] 68. Create adaptive quiz API endpoints
  - Implement POST /api/adaptive/create-quiz/ endpoint
  - Create GET /api/adaptive/next-question/:id/ endpoint
  - Add POST /api/adaptive/submit-answer/ endpoint
  - Implement GET /api/adaptive/student-level/:id/ endpoint
  - Create GET /api/adaptive/report/:submission_id/ endpoint
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.7_

- [ ] 69. Build adaptive quiz frontend
  - [ ] 69.1 Create AdaptiveQuizCreator component
    - Build adaptive mode toggle
    - Add difficulty range selector
    - Implement adaptation rules configuration
    - Create question pool preview
    - _Requirements: 15.4_

  - [ ] 69.2 Create AdaptiveQuizInterface component
    - Build dynamic question loading
    - Add difficulty indicator
    - Implement real-time performance feedback
    - Create adaptive progress bar
    - _Requirements: 15.2, 15.5, 15.8_

  - [ ] 69.3 Create adaptive report view
    - Build difficulty adjustment timeline
    - Add performance analysis
    - Implement comparison with standard quiz
    - Create recommendations for improvement
    - _Requirements: 15.7, 15.8_

- [ ] 70. Integrate adaptive quizzes with existing system
  - Update quiz creation to support adaptive mode
  - Modify quiz interface to handle dynamic questions
  - Add adaptive quiz filtering in quiz list
  - Create adaptive analytics in dashboard
  - _Requirements: 15.4, 15.5_

## Phase 16: Integration and Testing

- [ ] 71. Integration testing
  - [ ]* 71.1 Test email notification flow
    - Verify quiz invitation emails
    - Test result notification emails
    - Validate violation alert emails
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 71.2 Test analytics data accuracy
    - Verify performance trend calculations
    - Test quiz difficulty analysis
    - Validate plagiarism detection accuracy
    - _Requirements: 2.1, 2.2, 2.3, 7.2_

  - [ ]* 71.3 Test gamification flow
    - Verify points calculation
    - Test badge awarding
    - Validate leaderboard updates
    - _Requirements: 6.2, 6.3, 6.5_

  - [ ]* 71.4 Test scheduled quiz automation
    - Verify auto-start functionality
    - Test auto-end and submission
    - Validate reminder emails
    - _Requirements: 8.3, 8.4, 8.6, 8.8_

  - [ ]* 71.5 Test screen recording pipeline
    - Verify recording initiation
    - Test segment upload
    - Validate playback functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 72. Performance optimization
  - [ ]* 72.1 Optimize database queries
    - Add missing indexes
    - Optimize aggregation pipelines
    - Implement query result caching
    - _Requirements: All features_

  - [ ]* 72.2 Optimize frontend bundle
    - Implement code splitting for new features
    - Add lazy loading for heavy components
    - Optimize image assets
    - _Requirements: All features_

  - [ ]* 72.3 Optimize API response times
    - Implement Redis caching
    - Add database connection pooling
    - Optimize serialization
    - _Requirements: All features_

- [ ] 73. Security audit
  - [ ]* 73.1 Review authentication and authorization
    - Verify 2FA implementation
    - Test role-based access control
    - Validate session management
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 73.2 Review data encryption
    - Verify screen recording encryption
    - Test 2FA secret encryption
    - Validate sensitive data handling
    - _Requirements: 9.3, 10.2_

  - [ ]* 73.3 Test input validation
    - Verify XSS prevention
    - Test SQL injection prevention
    - Validate file upload security
    - _Requirements: All features_

- [ ] 74. Documentation and deployment
  - Update README with new features
  - Create feature-specific documentation
  - Update API documentation
  - Create deployment guide for new dependencies
  - Write user guides for new features
  - _Requirements: All features_

## Summary

This implementation plan covers 15 major features with 74 top-level tasks and numerous sub-tasks. The plan is organized into 16 phases for systematic development:

1. **Phase 1**: Infrastructure Setup (Tasks 1-4)
2. **Phase 2**: Email Notifications (Tasks 5-9)
3. **Phase 3**: Analytics Dashboard (Tasks 10-12)
4. **Phase 4**: PDF Reports (Tasks 13-17)
5. **Phase 5**: Batch Management (Tasks 18-21)
6. **Phase 6**: AI Question Generator (Tasks 22-26)
7. **Phase 7**: Gamification (Tasks 27-31)
8. **Phase 8**: Plagiarism Detection (Tasks 32-35)
9. **Phase 9**: Scheduled Exams (Tasks 36-40)
10. **Phase 10**: Screen Recording (Tasks 41-46)
11. **Phase 11**: Two-Factor Auth (Tasks 47-51)
12. **Phase 12**: Activity Logs (Tasks 52-56)
13. **Phase 13**: Mobile PWA (Tasks 57-62)
14. **Phase 14**: Live Proctoring (Tasks 63-66)
15. **Phase 15**: Adaptive Quizzes (Tasks 67-70)
16. **Phase 16**: Integration & Testing (Tasks 71-74)

Each task is designed to be actionable by a coding agent and builds incrementally on previous tasks. Optional testing tasks are marked with `*` to allow focus on core functionality first.

**Estimated Timeline**: 8-10 weeks for complete implementation
**Priority Order**: Phases 1-5 (Quick wins), Phases 6-10 (Medium features), Phases 11-16 (Advanced features)
