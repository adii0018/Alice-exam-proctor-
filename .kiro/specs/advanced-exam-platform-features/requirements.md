# Requirements Document

## Introduction

This document outlines the requirements for transforming the ETRIXX EXAM system into an enterprise-grade online examination platform with advanced features including email notifications, analytics, PDF reports, batch management, gamification, AI-powered question generation, plagiarism detection, scheduled exams, and screen recording capabilities.

## Glossary

- **System**: The ETRIXX EXAM online proctoring platform
- **Student**: A user with student role who takes quizzes
- **Teacher**: A user with teacher role who creates and manages quizzes
- **Quiz**: An examination with multiple-choice questions
- **Batch**: A group of students organized by class, section, or custom criteria
- **Flag**: A violation detected during proctoring
- **Submission**: A completed quiz attempt by a student
- **Leaderboard**: A ranking system showing top-performing students
- **Badge**: An achievement award given to students for accomplishments
- **Plagiarism Score**: A percentage indicating similarity between student answers
- **Schedule**: A time-based configuration for automatic quiz start/end
- **Report**: A PDF document containing exam analytics and results
- **Email Template**: A pre-designed email format for notifications
- **Question Bank**: A repository of questions organized by subject and difficulty
- **Screen Recording**: Video capture of student's screen during exam
- **Analytics Dashboard**: A visual interface showing performance metrics and trends

## Requirements

### Requirement 1: Email Notification System

**User Story:** As a teacher, I want to send automated email notifications to students, so that they are informed about quiz schedules, results, and violations without manual communication.

#### Acceptance Criteria

1. WHEN a teacher creates a quiz, THE System SHALL send invitation emails to all assigned students
2. WHEN a student submits a quiz, THE System SHALL send a confirmation email to the student
3. WHEN a quiz result is published, THE System SHALL send result notification emails to students
4. WHEN a violation flag is created, THE System SHALL send an alert email to the teacher
5. WHERE email templates are configured, THE System SHALL use customizable templates for all notifications
6. THE System SHALL support HTML email formatting with embedded images and styling
7. THE System SHALL log all email delivery status with timestamps
8. IF email delivery fails, THEN THE System SHALL retry up to 3 times with exponential backoff

### Requirement 2: Advanced Analytics Dashboard

**User Story:** As a teacher, I want to view comprehensive analytics about student performance and quiz effectiveness, so that I can identify learning gaps and improve teaching strategies.

#### Acceptance Criteria

1. THE System SHALL display student performance trends over time with line charts
2. THE System SHALL calculate and display average scores per quiz with bar charts
3. THE System SHALL show quiz difficulty analysis based on average scores and completion rates
4. THE System SHALL detect and visualize cheating patterns using heatmaps
5. WHEN a teacher selects a student, THE System SHALL display individual performance history
6. THE System SHALL show question-level analytics including most missed questions
7. THE System SHALL display real-time dashboard updates using WebSocket connections
8. THE System SHALL allow exporting analytics data to CSV and Excel formats
9. THE System SHALL show violation statistics with severity distribution charts
10. WHERE multiple quizzes exist, THE System SHALL provide comparative analysis between quizzes

### Requirement 3: PDF Report Generation

**User Story:** As a teacher, I want to generate professional PDF reports for students and classes, so that I can share detailed performance analysis with stakeholders.

#### Acceptance Criteria

1. THE System SHALL generate individual student performance reports in PDF format
2. THE System SHALL generate class-wide performance reports with aggregate statistics
3. THE System SHALL generate violation summary reports with timestamps and evidence
4. THE System SHALL include charts and graphs in PDF reports
5. THE System SHALL allow customization of report templates with school branding
6. WHEN a report is generated, THE System SHALL include student details, scores, and rankings
7. THE System SHALL support batch PDF generation for multiple students simultaneously
8. THE System SHALL provide download links for generated reports with 7-day expiration
9. THE System SHALL include QR codes in reports for verification purposes

### Requirement 4: Group and Batch Management

**User Story:** As a teacher, I want to organize students into groups and batches, so that I can efficiently manage large classes and assign quizzes to specific groups.

#### Acceptance Criteria

1. THE System SHALL allow teachers to create student groups with custom names
2. THE System SHALL support adding students to multiple groups simultaneously
3. THE System SHALL allow assigning quizzes to specific batches instead of individual students
4. THE System SHALL display batch-wise analytics and performance comparisons
5. WHEN a student is added to a batch, THE System SHALL automatically grant access to batch-assigned quizzes
6. THE System SHALL support bulk operations for adding/removing students from batches
7. THE System SHALL allow filtering quizzes and submissions by batch
8. THE System SHALL show batch enrollment counts and active student statistics
9. WHERE batches are hierarchical, THE System SHALL support nested batch structures

### Requirement 5: AI-Powered Question Generator

**User Story:** As a teacher, I want to automatically generate quiz questions using AI, so that I can quickly create diverse question sets without manual effort.

#### Acceptance Criteria

1. THE System SHALL generate multiple-choice questions based on provided topics
2. THE System SHALL adjust question difficulty levels (easy, medium, hard) based on teacher input
3. THE System SHALL create 4 answer options per question with one correct answer
4. THE System SHALL maintain a question bank organized by subject and difficulty
5. WHEN generating questions, THE System SHALL avoid duplicate questions within the same quiz
6. THE System SHALL allow teachers to review and edit AI-generated questions before adding to quiz
7. THE System SHALL support bulk question generation (up to 50 questions at once)
8. THE System SHALL provide question quality scores based on clarity and difficulty
9. WHERE question bank exists, THE System SHALL suggest similar existing questions to avoid redundancy

### Requirement 6: Gamification System

**User Story:** As a student, I want to earn badges and see my ranking on leaderboards, so that I am motivated to perform better and engage more with the platform.

#### Acceptance Criteria

1. THE System SHALL display a leaderboard showing top 10 students based on total points
2. THE System SHALL award points to students based on quiz scores (1 point per correct answer)
3. THE System SHALL award badges for achievements such as "Perfect Score", "Speed Demon", "Consistent Performer"
4. WHEN a student earns a badge, THE System SHALL display an animated notification
5. THE System SHALL show student rankings within their batch and globally
6. THE System SHALL calculate and display achievement progress bars
7. THE System SHALL support time-based leaderboards (daily, weekly, monthly, all-time)
8. THE System SHALL award bonus points for completing quizzes without violations
9. WHERE multiple students have same points, THE System SHALL rank by completion time
10. THE System SHALL display badge collection on student profile pages

### Requirement 7: Plagiarism Detection

**User Story:** As a teacher, I want to detect answer similarities between students, so that I can identify potential cheating and maintain exam integrity.

#### Acceptance Criteria

1. THE System SHALL compare student answers across all submissions for the same quiz
2. THE System SHALL calculate similarity scores between student answer patterns
3. WHEN similarity exceeds 80%, THE System SHALL flag submissions as potentially plagiarized
4. THE System SHALL display side-by-side comparison of flagged submissions
5. THE System SHALL use text similarity algorithms for comparing written answers
6. THE System SHALL detect identical answer sequences in multiple-choice questions
7. THE System SHALL generate plagiarism reports with similarity percentages
8. THE System SHALL allow teachers to mark plagiarism flags as resolved or confirmed
9. WHERE timing data exists, THE System SHALL consider answer submission timestamps in analysis
10. THE System SHALL exclude common correct answers from plagiarism calculations

### Requirement 8: Scheduled Exams

**User Story:** As a teacher, I want to schedule quizzes to automatically start and end at specific times, so that I don't need to manually manage quiz availability.

#### Acceptance Criteria

1. THE System SHALL allow teachers to set start date and time for quizzes
2. THE System SHALL allow teachers to set end date and time for quizzes
3. WHEN scheduled start time arrives, THE System SHALL automatically make the quiz available to students
4. WHEN scheduled end time arrives, THE System SHALL automatically close the quiz and prevent new submissions
5. THE System SHALL support timezone conversion for international students
6. THE System SHALL send reminder emails 24 hours and 1 hour before quiz start time
7. THE System SHALL display countdown timers for upcoming scheduled quizzes
8. IF a student is taking a quiz when end time arrives, THEN THE System SHALL auto-submit their current progress
9. THE System SHALL allow teachers to extend quiz deadlines for individual students
10. THE System SHALL integrate with calendar applications (Google Calendar, Outlook)

### Requirement 9: Screen Recording

**User Story:** As a teacher, I want to record student screens during exams, so that I can review suspicious activities and verify violation flags.

#### Acceptance Criteria

1. WHEN a student starts a quiz, THE System SHALL request screen recording permission
2. IF permission is granted, THEN THE System SHALL start recording the student's screen
3. THE System SHALL upload screen recordings to cloud storage in 5-minute segments
4. THE System SHALL associate screen recordings with quiz submissions and violation flags
5. THE System SHALL provide playback controls for teachers to review recordings
6. THE System SHALL detect suspicious activities like tab switching and window changes
7. THE System SHALL compress recordings to reduce storage requirements (target: 10MB per hour)
8. THE System SHALL automatically delete recordings after 30 days for privacy compliance
9. WHERE violations are flagged, THE System SHALL bookmark recording timestamps for quick review
10. THE System SHALL display recording status indicator to students during quiz
11. IF recording fails or stops, THEN THE System SHALL create a high-severity flag

### Requirement 10: Two-Factor Authentication (2FA)

**User Story:** As a user, I want to enable two-factor authentication on my account, so that my account is protected from unauthorized access.

#### Acceptance Criteria

1. THE System SHALL support TOTP-based two-factor authentication using authenticator apps
2. WHEN a user enables 2FA, THE System SHALL generate a QR code for authenticator app setup
3. WHEN 2FA is enabled, THE System SHALL require verification code at login
4. THE System SHALL provide backup codes for account recovery
5. THE System SHALL allow users to disable 2FA using backup codes
6. IF 2FA verification fails 5 times, THEN THE System SHALL temporarily lock the account for 15 minutes
7. THE System SHALL support SMS-based 2FA as an alternative to authenticator apps
8. THE System SHALL remember trusted devices for 30 days to reduce verification frequency

### Requirement 11: Activity Logs and Audit Trail

**User Story:** As an administrator, I want to view detailed activity logs for all users, so that I can track system usage and investigate security incidents.

#### Acceptance Criteria

1. THE System SHALL log all user login and logout events with timestamps and IP addresses
2. THE System SHALL log all quiz creation, modification, and deletion events
3. THE System SHALL log all submission events with student details and scores
4. THE System SHALL log all violation flag creation and resolution events
5. THE System SHALL provide searchable and filterable activity logs
6. THE System SHALL retain activity logs for at least 90 days
7. THE System SHALL allow exporting activity logs to CSV format
8. WHERE suspicious patterns are detected, THE System SHALL highlight anomalous activities
9. THE System SHALL display activity logs in real-time using WebSocket updates

### Requirement 12: Mobile Progressive Web App (PWA)

**User Story:** As a student, I want to access the exam platform from my mobile device with app-like experience, so that I can take quizzes conveniently from anywhere.

#### Acceptance Criteria

1. THE System SHALL function as a Progressive Web App installable on mobile devices
2. THE System SHALL support offline quiz taking with automatic sync when connection is restored
3. THE System SHALL send push notifications for quiz reminders and results
4. THE System SHALL optimize UI layout for mobile screens (320px to 768px width)
5. THE System SHALL support touch gestures for navigation and interactions
6. THE System SHALL use mobile-optimized camera and microphone APIs for proctoring
7. WHEN network connection is lost during quiz, THE System SHALL save progress locally
8. THE System SHALL display network status indicator to users
9. THE System SHALL support biometric authentication (fingerprint, face ID) on compatible devices

### Requirement 13: Question Bank Management

**User Story:** As a teacher, I want to maintain a centralized question bank, so that I can reuse questions across multiple quizzes and share questions with other teachers.

#### Acceptance Criteria

1. THE System SHALL provide a question bank interface for creating and organizing questions
2. THE System SHALL support categorizing questions by subject, topic, and difficulty level
3. THE System SHALL allow tagging questions with custom labels
4. THE System SHALL support importing questions from CSV and Excel files
5. THE System SHALL allow teachers to share question banks with other teachers
6. WHEN creating a quiz, THE System SHALL allow selecting questions from the question bank
7. THE System SHALL track question usage statistics (times used, average score)
8. THE System SHALL support versioning of questions to track modifications
9. THE System SHALL allow bulk editing and deletion of questions
10. WHERE questions are shared, THE System SHALL maintain original author attribution

### Requirement 14: Live Proctoring Dashboard

**User Story:** As a teacher, I want to monitor all active quiz sessions in real-time, so that I can intervene immediately if suspicious activity is detected.

#### Acceptance Criteria

1. THE System SHALL display a live dashboard showing all students currently taking quizzes
2. THE System SHALL show real-time camera feeds for all active students in grid view
3. THE System SHALL display violation alerts with audio notifications for teachers
4. THE System SHALL allow teachers to send messages to individual students during quiz
5. THE System SHALL show student progress (questions answered, time remaining) in real-time
6. WHEN a high-severity violation occurs, THE System SHALL highlight the student's feed
7. THE System SHALL allow teachers to remotely terminate a student's quiz session
8. THE System SHALL support filtering active sessions by quiz, batch, or violation status
9. THE System SHALL display network quality indicators for each student connection

### Requirement 15: Adaptive Quiz Difficulty

**User Story:** As a teacher, I want quizzes to automatically adjust difficulty based on student performance, so that each student is appropriately challenged.

#### Acceptance Criteria

1. THE System SHALL track student performance history across all quizzes
2. WHEN a student consistently scores above 90%, THE System SHALL recommend harder questions
3. WHEN a student consistently scores below 50%, THE System SHALL recommend easier questions
4. THE System SHALL support creating adaptive quizzes with mixed difficulty levels
5. THE System SHALL adjust question difficulty in real-time during quiz based on current performance
6. THE System SHALL maintain fairness by ensuring all students answer equivalent difficulty distributions
7. THE System SHALL provide difficulty adjustment reports to teachers
8. WHERE adaptive mode is enabled, THE System SHALL explain difficulty adjustments to students

## Non-Functional Requirements

### Performance

1. THE System SHALL load the analytics dashboard within 2 seconds
2. THE System SHALL generate PDF reports within 10 seconds for individual students
3. THE System SHALL process plagiarism detection within 30 seconds for 100 submissions
4. THE System SHALL support 500 concurrent active quiz sessions
5. THE System SHALL deliver email notifications within 1 minute of trigger event

### Security

1. THE System SHALL encrypt all screen recordings using AES-256 encryption
2. THE System SHALL implement rate limiting of 100 requests per minute per user
3. THE System SHALL sanitize all user inputs to prevent XSS and SQL injection
4. THE System SHALL use HTTPS for all communications
5. THE System SHALL comply with GDPR and data privacy regulations

### Scalability

1. THE System SHALL support up to 10,000 registered users
2. THE System SHALL handle 1,000 simultaneous quiz submissions
3. THE System SHALL store up to 100GB of screen recordings with automatic archival
4. THE System SHALL support question banks with up to 50,000 questions

### Usability

1. THE System SHALL maintain consistent UI design across all new features
2. THE System SHALL provide contextual help tooltips for all new features
3. THE System SHALL support keyboard shortcuts for common actions
4. THE System SHALL be accessible according to WCAG 2.1 Level AA standards

### Reliability

1. THE System SHALL maintain 99.9% uptime
2. THE System SHALL automatically backup database every 6 hours
3. THE System SHALL recover from crashes within 5 minutes
4. THE System SHALL handle email service failures gracefully with retry mechanisms
