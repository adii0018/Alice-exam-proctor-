# Requirements Document

## Introduction

This document outlines the requirements for rebuilding the ETRIXX EXAM proctoring system using Django as the backend framework. The system will provide a comprehensive online examination platform with AI-powered proctoring, real-time monitoring, and enhanced user experience with dynamic animations. The rebuild aims to improve upon the previous implementation with better architecture, performance, and modern UI/UX.

## Glossary

- **System**: The ETRIXX EXAM proctoring platform
- **Student User**: A registered user with student role who takes proctored exams
- **Teacher User**: A registered user with teacher role who creates and monitors exams
- **Quiz**: An examination consisting of multiple-choice questions with a time limit
- **Proctoring Session**: An active exam session with camera and audio monitoring
- **Violation Flag**: A recorded instance of suspicious behavior during an exam
- **Face Detection Module**: AI component using face-api.js for facial recognition
- **Audio Monitor**: Component that analyzes microphone input levels
- **Quiz Code**: Unique identifier used by students to access a specific quiz
- **JWT Token**: JSON Web Token used for authentication
- **WebSocket Connection**: Real-time bidirectional communication channel

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a user, I want to register and login with role-based access, so that I can access features specific to my role (student or teacher)

#### Acceptance Criteria

1. WHEN a new user submits registration form with valid credentials and role selection, THE System SHALL create a new user account with encrypted password in the appropriate database collection
2. WHEN a user submits login credentials, THE System SHALL verify the credentials against the database and generate a JWT Token valid for 7 days
3. WHEN a user attempts to access a protected endpoint, THE System SHALL validate the JWT Token and verify the user role matches the required permission
4. IF a user provides incorrect credentials during login, THEN THE System SHALL return an error message without revealing whether the email or password was incorrect
5. WHERE a user selects student role during registration, THE System SHALL require student_id, class_section, and enrollment_year fields

### Requirement 2: Quiz Management

**User Story:** As a Teacher User, I want to create and manage quizzes with multiple-choice questions, so that I can conduct online examinations for students

#### Acceptance Criteria

1. WHEN a Teacher User creates a new quiz, THE System SHALL generate a unique Quiz Code and store the quiz with title, description, duration, and questions
2. WHEN a Teacher User requests the quiz list, THE System SHALL return all quizzes created by that teacher with complete details
3. WHEN a Teacher User updates a quiz, THE System SHALL modify the quiz data and update the timestamp
4. WHEN a Teacher User deletes a quiz, THE System SHALL remove the quiz from the database and mark associated flags as orphaned
5. WHERE a quiz contains questions, THE System SHALL validate that each question has exactly 4 options and one correct answer index

### Requirement 3: Real-time Face Detection Proctoring

**User Story:** As a Student User taking an exam, I want my face to be monitored automatically, so that the system can ensure exam integrity without manual supervision

#### Acceptance Criteria

1. WHEN a Student User starts a Proctoring Session, THE System SHALL activate the camera feed and load the Face Detection Module
2. WHILE a Proctoring Session is active, THE Face Detection Module SHALL analyze video frames every 1 second to detect faces
3. IF the Face Detection Module detects more than one face, THEN THE System SHALL create a Violation Flag with type "multiple_faces" and severity "high"
4. IF the Face Detection Module detects zero faces for more than 3 consecutive checks, THEN THE System SHALL create a Violation Flag with type "looking_away" and severity "medium"
5. WHEN face detection analysis completes, THE System SHALL display the face count on the student interface within 100 milliseconds

### Requirement 4: Audio Level Monitoring

**User Story:** As a Teacher User, I want the system to monitor audio levels during exams, so that I can detect potential communication or cheating attempts

#### Acceptance Criteria

1. WHEN a Student User starts a Proctoring Session, THE System SHALL request microphone access and initialize the Audio Monitor
2. WHILE a Proctoring Session is active, THE Audio Monitor SHALL analyze audio frequency data every 500 milliseconds
3. IF the Audio Monitor detects average audio level exceeding 40 decibels for more than 2 seconds, THEN THE System SHALL create a Violation Flag with type "high_audio" and severity "medium"
4. WHEN audio analysis completes, THE System SHALL display the current audio level as a visual indicator on the student interface
5. WHERE microphone permission is denied, THE System SHALL prevent the student from starting the quiz and display an error message

### Requirement 5: Violation Flag Management

**User Story:** As a Teacher User, I want to review and manage violation flags, so that I can identify potential cheating and take appropriate action

#### Acceptance Criteria

1. WHEN a violation is detected during a Proctoring Session, THE System SHALL create a Violation Flag with student_id, quiz_id, type, description, timestamp, and severity
2. WHEN a Teacher User requests flags for a specific quiz, THE System SHALL return all flags sorted by timestamp in descending order
3. WHEN a Teacher User marks a flag as resolved, THE System SHALL update the flag with resolved status, resolver teacher_id, and resolution timestamp
4. WHERE multiple flags of the same type occur within 30 seconds, THE System SHALL aggregate them into a single flag with increased severity
5. WHEN a Proctoring Session ends, THE System SHALL calculate total flag count and update the quiz submission record

### Requirement 6: Quiz Taking Experience

**User Story:** As a Student User, I want to take quizzes with a clear interface and timer, so that I can focus on answering questions without confusion

#### Acceptance Criteria

1. WHEN a Student User enters a valid Quiz Code, THE System SHALL retrieve the quiz details and display the first question
2. WHILE a quiz is in progress, THE System SHALL display a countdown timer that updates every second
3. WHEN the timer reaches zero, THE System SHALL automatically submit the quiz with all answered questions
4. WHEN a Student User selects an answer option, THE System SHALL highlight the selection and store it in local state
5. WHEN a Student User submits the quiz, THE System SHALL calculate the score by comparing answers with correct options and store the submission

### Requirement 7: Dynamic UI Animations

**User Story:** As a user, I want smooth and engaging animations throughout the interface, so that the application feels modern and responsive

#### Acceptance Criteria

1. WHEN a user navigates to any page, THE System SHALL display page transition animations with duration between 200 and 400 milliseconds
2. WHEN a user hovers over interactive elements, THE System SHALL apply hover effects including scale, shadow, or color transitions within 150 milliseconds
3. WHERE background decorative elements are present, THE System SHALL animate them with continuous floating or blob animations
4. WHEN a modal or dialog opens, THE System SHALL animate the entrance with fade-in and scale effects
5. WHEN loading data from the backend, THE System SHALL display skeleton loaders or animated spinners

### Requirement 8: Real-time Dashboard Updates

**User Story:** As a Teacher User, I want to see real-time updates of student activity during exams, so that I can monitor multiple students simultaneously

#### Acceptance Criteria

1. WHEN a Teacher User opens the monitoring dashboard, THE System SHALL establish a WebSocket Connection to receive real-time updates
2. WHEN a new Violation Flag is created, THE System SHALL broadcast the flag data through the WebSocket Connection to connected Teacher Users
3. WHEN a Student User starts or submits a quiz, THE System SHALL send status updates through the WebSocket Connection
4. WHILE the WebSocket Connection is active, THE System SHALL send heartbeat messages every 30 seconds to maintain the connection
5. IF the WebSocket Connection is lost, THEN THE System SHALL attempt to reconnect automatically with exponential backoff up to 5 attempts

### Requirement 9: Responsive Design

**User Story:** As a user accessing the system from different devices, I want the interface to adapt to my screen size, so that I can use the system on desktop, tablet, or mobile

#### Acceptance Criteria

1. WHEN a user accesses the System on a screen width less than 768 pixels, THE System SHALL display mobile-optimized layouts with stacked components
2. WHEN a user accesses the System on a screen width between 768 and 1024 pixels, THE System SHALL display tablet-optimized layouts with adjusted spacing
3. WHERE camera feed is displayed on mobile devices, THE System SHALL scale the video element to fit within the viewport without horizontal scrolling
4. WHEN a user rotates their device, THE System SHALL adjust the layout within 300 milliseconds to match the new orientation
5. WHEN touch gestures are used on mobile devices, THE System SHALL respond to tap, swipe, and pinch interactions appropriately

### Requirement 10: Performance and Optimization

**User Story:** As a user, I want the application to load quickly and respond smoothly, so that I can complete tasks without frustration

#### Acceptance Criteria

1. WHEN a user loads the initial page, THE System SHALL display the first contentful paint within 1.5 seconds on a standard broadband connection
2. WHEN the Face Detection Module processes video frames, THE System SHALL complete analysis within 200 milliseconds per frame
3. WHERE static assets are served, THE System SHALL implement caching headers with minimum 7 days expiration
4. WHEN API requests are made, THE System SHALL respond within 500 milliseconds for 95% of requests under normal load
5. WHEN the database is queried, THE System SHALL utilize indexes to ensure query execution time remains under 100 milliseconds

### Requirement 11: Error Handling and Recovery

**User Story:** As a user, I want clear error messages and recovery options when something goes wrong, so that I can resolve issues without losing my progress

#### Acceptance Criteria

1. WHEN a network error occurs during quiz submission, THE System SHALL store the answers locally and retry submission automatically
2. IF camera or microphone access fails, THEN THE System SHALL display a clear error message with troubleshooting steps
3. WHEN a JWT Token expires during an active session, THE System SHALL prompt the user to re-authenticate without losing current quiz progress
4. WHERE validation errors occur in form submissions, THE System SHALL highlight the specific fields with error messages
5. WHEN an unexpected error occurs, THE System SHALL log the error details and display a user-friendly message with a support contact option

### Requirement 12: Data Security and Privacy

**User Story:** As a user, I want my personal data and exam responses to be secure, so that I can trust the system with sensitive information

#### Acceptance Criteria

1. WHEN a user password is stored, THE System SHALL hash the password using bcrypt with minimum 12 salt rounds
2. WHEN sensitive data is transmitted, THE System SHALL use HTTPS protocol with TLS 1.2 or higher in production environment
3. WHERE JWT Tokens are stored on the client, THE System SHALL use httpOnly cookies or secure localStorage with encryption
4. WHEN a user logs out, THE System SHALL invalidate the JWT Token and clear all session data from client storage
5. WHEN camera or audio data is processed, THE System SHALL not store or transmit the raw media files, only analysis results
