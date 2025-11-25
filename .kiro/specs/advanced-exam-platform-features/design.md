# Design Document

## Overview

This design document outlines the architecture and implementation strategy for transforming the ETRIXX EXAM system into an enterprise-grade examination platform. The design follows a modular approach, ensuring each feature can be developed and deployed independently while maintaining system cohesion.

### Design Principles

1. **Modularity**: Each feature is self-contained with clear interfaces
2. **Scalability**: Architecture supports horizontal scaling for high load
3. **Security**: All features implement security best practices
4. **Performance**: Optimized for fast response times and efficient resource usage
5. **Maintainability**: Clean code structure with comprehensive documentation

### Technology Stack Additions

**Backend:**
- Celery: Asynchronous task processing for emails, reports, AI generation
- Redis: Task queue and caching layer
- SendGrid/AWS SES: Email delivery service
- ReportLab/WeasyPrint: PDF generation
- OpenAI API: AI question generation
- Scikit-learn: Plagiarism detection algorithms
- AWS S3/MinIO: Screen recording storage

**Frontend:**
- Chart.js/Recharts: Analytics visualizations
- jsPDF: Client-side PDF generation
- Workbox: PWA and offline support
- React Query: Data fetching and caching
- IndexedDB: Offline data storage

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Analytics │  │  Email   │  │Gamifica- │  │  Screen  │   │
│  │Dashboard │  │  Center  │  │   tion   │  │Recording │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   API Gateway   │
                    │  (Django REST)  │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   Core API     │  │  Task Queue │  │  WebSocket      │
│   Services     │  │   (Celery)  │  │  (Channels)     │
└───────┬────────┘  └──────┬──────┘  └────────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐      ┌──────▼──────┐
        │    MongoDB     │      │    Redis    │
        │   (Primary)    │      │   (Cache)   │
        └────────────────┘      └─────────────┘
                │
        ┌───────▼────────┐
        │   S3/MinIO     │
        │  (Recordings)  │
        └────────────────┘
```


### System Components

#### 1. Email Service Module
- **Email Manager**: Handles email template rendering and delivery
- **Template Engine**: Jinja2-based email template system
- **Queue Manager**: Celery tasks for async email sending
- **Delivery Tracker**: Logs email status and retry logic

#### 2. Analytics Engine
- **Data Aggregator**: Collects and processes quiz/student data
- **Metrics Calculator**: Computes performance statistics
- **Visualization Generator**: Creates charts and graphs
- **Export Service**: Generates CSV/Excel exports

#### 3. Report Generator
- **PDF Builder**: Creates formatted PDF documents
- **Chart Renderer**: Embeds charts in PDFs
- **Template Manager**: Manages report templates
- **Batch Processor**: Handles bulk report generation

#### 4. Batch Management System
- **Group Manager**: CRUD operations for batches
- **Assignment Engine**: Links students to batches
- **Access Controller**: Manages batch-based permissions
- **Analytics Aggregator**: Batch-level statistics

#### 5. AI Question Generator
- **OpenAI Integration**: Connects to GPT API
- **Prompt Builder**: Constructs effective prompts
- **Question Parser**: Extracts structured questions
- **Quality Validator**: Checks question quality
- **Bank Manager**: Stores generated questions

#### 6. Gamification Engine
- **Points Calculator**: Awards points based on performance
- **Badge Manager**: Defines and awards badges
- **Leaderboard Builder**: Ranks students
- **Achievement Tracker**: Monitors progress

#### 7. Plagiarism Detector
- **Similarity Analyzer**: Compares answer patterns
- **Text Comparator**: Uses NLP for text similarity
- **Pattern Matcher**: Detects identical sequences
- **Report Generator**: Creates plagiarism reports

#### 8. Scheduler Service
- **Cron Manager**: Handles scheduled tasks
- **Quiz Activator**: Auto-starts quizzes
- **Quiz Closer**: Auto-ends quizzes
- **Reminder Service**: Sends notifications
- **Calendar Integration**: Syncs with external calendars

#### 9. Screen Recording System
- **Capture Manager**: Handles screen recording API
- **Upload Service**: Streams recordings to storage
- **Compression Engine**: Reduces file sizes
- **Playback Service**: Serves recordings to teachers
- **Retention Manager**: Auto-deletes old recordings

#### 10. Security Module
- **2FA Manager**: Handles TOTP generation/verification
- **Audit Logger**: Records all system activities
- **Access Controller**: Manages permissions
- **Encryption Service**: Encrypts sensitive data

## Components and Interfaces

### 1. Email Notification System

#### Backend Components

**EmailService (django_backend/api/services/email_service.py)**
```python
class EmailService:
    def send_quiz_invitation(quiz_id, student_ids)
    def send_result_notification(submission_id)
    def send_violation_alert(flag_id)
    def send_reminder(quiz_id, hours_before)
```

**EmailTemplate Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "name": str,
    "subject": str,
    "html_body": str,
    "text_body": str,
    "variables": [str],
    "created_at": datetime
}
```

**Celery Tasks (django_backend/api/tasks/email_tasks.py)**
```python
@shared_task
def send_email_async(to_email, subject, html_body, text_body)

@shared_task
def send_bulk_emails(email_list)
```

#### Frontend Components

**EmailCenter (src/components/teacher/EmailCenter.jsx)**
- View email history
- Configure email templates
- Send manual emails
- View delivery status

#### API Endpoints

```
POST   /api/emails/send/                 - Send email
GET    /api/emails/templates/            - List templates
POST   /api/emails/templates/            - Create template
PUT    /api/emails/templates/:id/        - Update template
GET    /api/emails/history/              - Email history
```


### 2. Advanced Analytics Dashboard

#### Backend Components

**AnalyticsService (django_backend/api/services/analytics_service.py)**
```python
class AnalyticsService:
    def get_student_performance_trends(student_id, time_range)
    def get_quiz_difficulty_analysis(quiz_id)
    def get_cheating_patterns(quiz_id)
    def get_question_analytics(quiz_id)
    def export_analytics(format, filters)
```

**Analytics Data Models**
```python
# Cached analytics (Redis)
{
    "quiz_stats": {
        "average_score": float,
        "completion_rate": float,
        "difficulty_rating": str,
        "time_distribution": [int]
    },
    "student_trends": {
        "scores": [float],
        "dates": [datetime],
        "improvement_rate": float
    }
}
```

#### Frontend Components

**AnalyticsDashboard (src/components/teacher/AnalyticsDashboard.jsx)**
- Performance trend charts
- Quiz difficulty visualization
- Cheating pattern heatmaps
- Question-level analytics
- Export functionality

**StudentAnalytics (src/components/teacher/StudentAnalytics.jsx)**
- Individual student performance
- Historical score trends
- Comparison with class average
- Violation history

#### API Endpoints

```
GET    /api/analytics/student/:id/trends/        - Student trends
GET    /api/analytics/quiz/:id/difficulty/       - Quiz difficulty
GET    /api/analytics/quiz/:id/cheating/         - Cheating patterns
GET    /api/analytics/quiz/:id/questions/        - Question analytics
GET    /api/analytics/export/                    - Export data
```

### 3. PDF Report Generation

#### Backend Components

**ReportService (django_backend/api/services/report_service.py)**
```python
class ReportService:
    def generate_student_report(student_id, quiz_id)
    def generate_class_report(batch_id, quiz_id)
    def generate_violation_report(quiz_id)
    def generate_batch_reports(student_ids)
```

**Report Templates (django_backend/api/templates/reports/)**
- student_report.html
- class_report.html
- violation_report.html

**Celery Tasks (django_backend/api/tasks/report_tasks.py)**
```python
@shared_task
def generate_pdf_async(report_type, data, template)

@shared_task
def generate_batch_pdfs(report_configs)
```

#### Frontend Components

**ReportGenerator (src/components/teacher/ReportGenerator.jsx)**
- Select report type
- Configure report parameters
- Preview report
- Download/email report

**ReportHistory (src/components/teacher/ReportHistory.jsx)**
- View generated reports
- Download links
- Regenerate reports

#### API Endpoints

```
POST   /api/reports/generate/              - Generate report
GET    /api/reports/                        - List reports
GET    /api/reports/:id/download/          - Download report
POST   /api/reports/batch/                 - Batch generation
DELETE /api/reports/:id/                   - Delete report
```

### 4. Group and Batch Management

#### Backend Components

**BatchService (django_backend/api/services/batch_service.py)**
```python
class BatchService:
    def create_batch(name, description, student_ids)
    def add_students_to_batch(batch_id, student_ids)
    def remove_students_from_batch(batch_id, student_ids)
    def assign_quiz_to_batch(quiz_id, batch_id)
    def get_batch_analytics(batch_id)
```

**Batch Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "name": str,
    "description": str,
    "teacher_id": ObjectId,
    "student_ids": [ObjectId],
    "created_at": datetime,
    "updated_at": datetime,
    "is_active": bool
}
```

#### Frontend Components

**BatchManager (src/components/teacher/BatchManager.jsx)**
- Create/edit batches
- Add/remove students
- View batch details
- Batch analytics

**BatchSelector (src/components/teacher/BatchSelector.jsx)**
- Select batch for quiz assignment
- Multi-batch selection
- Batch preview

#### API Endpoints

```
GET    /api/batches/                    - List batches
POST   /api/batches/                    - Create batch
GET    /api/batches/:id/                - Get batch details
PUT    /api/batches/:id/                - Update batch
DELETE /api/batches/:id/                - Delete batch
POST   /api/batches/:id/students/       - Add students
DELETE /api/batches/:id/students/       - Remove students
GET    /api/batches/:id/analytics/      - Batch analytics
```


### 5. AI-Powered Question Generator

#### Backend Components

**AIQuestionService (django_backend/api/services/ai_question_service.py)**
```python
class AIQuestionService:
    def generate_questions(topic, difficulty, count)
    def validate_question_quality(question)
    def save_to_question_bank(questions, metadata)
    def get_similar_questions(question_text)
```

**QuestionBank Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "question_text": str,
    "options": [str],
    "correct_answer": int,
    "subject": str,
    "topic": str,
    "difficulty": str,  # easy, medium, hard
    "tags": [str],
    "quality_score": float,
    "usage_count": int,
    "average_score": float,
    "created_by": ObjectId,
    "created_at": datetime,
    "is_ai_generated": bool
}
```

**OpenAI Integration (django_backend/api/utils/openai_helper.py)**
```python
class OpenAIHelper:
    def create_prompt(topic, difficulty, count)
    def parse_response(response)
    def validate_format(questions)
```

#### Frontend Components

**QuestionGenerator (src/components/teacher/QuestionGenerator.jsx)**
- Input topic and parameters
- Generate questions
- Review and edit
- Add to quiz or bank

**QuestionBankBrowser (src/components/teacher/QuestionBankBrowser.jsx)**
- Browse question bank
- Filter by subject/difficulty
- Search questions
- Select for quiz

#### API Endpoints

```
POST   /api/ai/generate-questions/          - Generate questions
GET    /api/question-bank/                   - List questions
POST   /api/question-bank/                   - Add question
GET    /api/question-bank/:id/               - Get question
PUT    /api/question-bank/:id/               - Update question
DELETE /api/question-bank/:id/               - Delete question
GET    /api/question-bank/search/            - Search questions
POST   /api/question-bank/import/            - Import from CSV
```

### 6. Gamification System

#### Backend Components

**GamificationService (django_backend/api/services/gamification_service.py)**
```python
class GamificationService:
    def calculate_points(submission)
    def award_badge(student_id, badge_type)
    def update_leaderboard()
    def get_student_rank(student_id, scope)
    def check_achievements(student_id)
```

**Badge Definitions**
```python
BADGES = {
    "perfect_score": {"name": "Perfect Score", "criteria": "score == 100"},
    "speed_demon": {"name": "Speed Demon", "criteria": "time < avg_time * 0.5"},
    "consistent": {"name": "Consistent Performer", "criteria": "5 quizzes with score > 80"},
    "no_violations": {"name": "Clean Record", "criteria": "flag_count == 0"},
    "early_bird": {"name": "Early Bird", "criteria": "submitted in first 10%"},
}
```

**Leaderboard Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "student_id": ObjectId,
    "total_points": int,
    "badges": [str],
    "rank": int,
    "batch_rank": int,
    "quizzes_completed": int,
    "average_score": float,
    "updated_at": datetime
}
```

#### Frontend Components

**Leaderboard (src/components/student/Leaderboard.jsx)**
- Top 10 students
- Current user rank
- Filter by time period
- Batch leaderboard

**BadgeCollection (src/components/student/BadgeCollection.jsx)**
- Display earned badges
- Show locked badges
- Progress indicators
- Badge details

**AchievementNotification (src/components/common/AchievementNotification.jsx)**
- Animated badge popup
- Points earned display
- Rank change notification

#### API Endpoints

```
GET    /api/gamification/leaderboard/           - Get leaderboard
GET    /api/gamification/student/:id/stats/     - Student stats
GET    /api/gamification/badges/                - Available badges
POST   /api/gamification/award-badge/           - Award badge
GET    /api/gamification/achievements/:id/      - Student achievements
```

### 7. Plagiarism Detection

#### Backend Components

**PlagiarismService (django_backend/api/services/plagiarism_service.py)**
```python
class PlagiarismService:
    def analyze_submissions(quiz_id)
    def calculate_similarity(submission1, submission2)
    def detect_patterns(submissions)
    def generate_report(flagged_pairs)
```

**Similarity Algorithms**
```python
class SimilarityCalculator:
    def jaccard_similarity(answers1, answers2)
    def sequence_matching(answers1, answers2)
    def timing_correlation(timestamps1, timestamps2)
    def combined_score(metrics)
```

**PlagiarismFlag Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "quiz_id": ObjectId,
    "student1_id": ObjectId,
    "student2_id": ObjectId,
    "similarity_score": float,
    "matching_answers": [int],  # question indices
    "timing_correlation": float,
    "status": str,  # pending, confirmed, dismissed
    "reviewed_by": ObjectId,
    "created_at": datetime
}
```

#### Frontend Components

**PlagiarismDetector (src/components/teacher/PlagiarismDetector.jsx)**
- Run plagiarism check
- View flagged pairs
- Side-by-side comparison
- Mark as confirmed/dismissed

**SimilarityReport (src/components/teacher/SimilarityReport.jsx)**
- Similarity percentage
- Matching questions
- Timing analysis
- Evidence display

#### API Endpoints

```
POST   /api/plagiarism/analyze/:quiz_id/       - Run analysis
GET    /api/plagiarism/flags/:quiz_id/         - Get flags
GET    /api/plagiarism/compare/:id1/:id2/      - Compare submissions
PUT    /api/plagiarism/flags/:id/              - Update flag status
GET    /api/plagiarism/report/:quiz_id/        - Generate report
```


### 8. Scheduled Exams

#### Backend Components

**SchedulerService (django_backend/api/services/scheduler_service.py)**
```python
class SchedulerService:
    def schedule_quiz(quiz_id, start_time, end_time, timezone)
    def activate_quiz(quiz_id)
    def deactivate_quiz(quiz_id)
    def send_reminders(quiz_id, hours_before)
    def extend_deadline(quiz_id, student_id, new_end_time)
```

**Quiz Schedule Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "quiz_id": ObjectId,
    "start_time": datetime,
    "end_time": datetime,
    "timezone": str,
    "reminder_sent_24h": bool,
    "reminder_sent_1h": bool,
    "is_active": bool,
    "extensions": [{
        "student_id": ObjectId,
        "extended_end_time": datetime,
        "reason": str
    }]
}
```

**Celery Beat Tasks (django_backend/api/tasks/scheduler_tasks.py)**
```python
@periodic_task(run_every=crontab(minute='*/5'))
def check_quiz_schedules()

@shared_task
def activate_scheduled_quiz(quiz_id)

@shared_task
def deactivate_scheduled_quiz(quiz_id)

@shared_task
def send_quiz_reminders(quiz_id, hours_before)
```

#### Frontend Components

**QuizScheduler (src/components/teacher/QuizScheduler.jsx)**
- Set start/end times
- Timezone selector
- Reminder configuration
- Calendar view

**ScheduledQuizList (src/components/teacher/ScheduledQuizList.jsx)**
- Upcoming quizzes
- Active quizzes
- Past quizzes
- Quick actions

**CountdownTimer (src/components/student/CountdownTimer.jsx)**
- Time until quiz starts
- Time remaining in quiz
- Auto-submit warning

#### API Endpoints

```
POST   /api/schedules/                      - Create schedule
GET    /api/schedules/quiz/:id/             - Get schedule
PUT    /api/schedules/:id/                  - Update schedule
DELETE /api/schedules/:id/                  - Delete schedule
POST   /api/schedules/:id/extend/           - Extend deadline
GET    /api/schedules/upcoming/             - Upcoming quizzes
POST   /api/schedules/:id/calendar-sync/    - Sync to calendar
```

### 9. Screen Recording System

#### Backend Components

**RecordingService (django_backend/api/services/recording_service.py)**
```python
class RecordingService:
    def initiate_recording(submission_id)
    def upload_segment(submission_id, segment_data)
    def finalize_recording(submission_id)
    def get_playback_url(recording_id)
    def delete_old_recordings()
```

**Recording Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "submission_id": ObjectId,
    "student_id": ObjectId,
    "quiz_id": ObjectId,
    "segments": [{
        "segment_number": int,
        "storage_url": str,
        "duration": int,
        "size_bytes": int,
        "uploaded_at": datetime
    }],
    "total_duration": int,
    "total_size": int,
    "violation_bookmarks": [{
        "timestamp": int,
        "flag_id": ObjectId,
        "description": str
    }],
    "status": str,  # recording, completed, failed
    "created_at": datetime,
    "expires_at": datetime
}
```

**Storage Integration (django_backend/api/utils/storage_helper.py)**
```python
class StorageHelper:
    def upload_to_s3(file_data, key)
    def generate_presigned_url(key, expiration)
    def delete_file(key)
    def compress_video(input_path, output_path)
```

#### Frontend Components

**ScreenRecorder (src/components/student/ScreenRecorder.jsx)**
- Request permission
- Start recording
- Upload segments
- Status indicator

**RecordingPlayer (src/components/teacher/RecordingPlayer.jsx)**
- Video playback
- Violation bookmarks
- Speed controls
- Download option

**RecordingManager (src/components/teacher/RecordingManager.jsx)**
- List recordings
- Filter by quiz/student
- Bulk delete
- Storage usage

#### API Endpoints

```
POST   /api/recordings/initiate/              - Start recording
POST   /api/recordings/upload-segment/        - Upload segment
POST   /api/recordings/finalize/              - Complete recording
GET    /api/recordings/:id/playback/          - Get playback URL
GET    /api/recordings/submission/:id/        - Get by submission
DELETE /api/recordings/:id/                   - Delete recording
GET    /api/recordings/storage-stats/         - Storage usage
```

### 10. Two-Factor Authentication

#### Backend Components

**TwoFactorService (django_backend/api/services/twofa_service.py)**
```python
class TwoFactorService:
    def generate_secret(user_id)
    def generate_qr_code(secret, user_email)
    def verify_totp(user_id, code)
    def generate_backup_codes(user_id)
    def verify_backup_code(user_id, code)
    def send_sms_code(user_id, phone_number)
```

**TwoFactor Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "secret": str,  # encrypted
    "is_enabled": bool,
    "backup_codes": [str],  # hashed
    "trusted_devices": [{
        "device_id": str,
        "device_name": str,
        "added_at": datetime,
        "expires_at": datetime
    }],
    "phone_number": str,  # encrypted
    "preferred_method": str,  # totp, sms
    "created_at": datetime
}
```

#### Frontend Components

**TwoFactorSetup (src/components/auth/TwoFactorSetup.jsx)**
- QR code display
- Manual entry option
- Verification step
- Backup codes download

**TwoFactorVerify (src/components/auth/TwoFactorVerify.jsx)**
- Code input
- Remember device option
- Use backup code link
- SMS option

**TwoFactorSettings (src/components/profile/TwoFactorSettings.jsx)**
- Enable/disable 2FA
- Change method
- Manage trusted devices
- Regenerate backup codes

#### API Endpoints

```
POST   /api/auth/2fa/setup/                 - Initialize 2FA
POST   /api/auth/2fa/verify-setup/          - Verify setup
POST   /api/auth/2fa/verify/                - Verify login
POST   /api/auth/2fa/disable/               - Disable 2FA
GET    /api/auth/2fa/backup-codes/          - Get backup codes
POST   /api/auth/2fa/regenerate-codes/      - New backup codes
POST   /api/auth/2fa/send-sms/              - Send SMS code
GET    /api/auth/2fa/trusted-devices/       - List devices
DELETE /api/auth/2fa/trusted-devices/:id/   - Remove device
```


### 11. Activity Logs and Audit Trail

#### Backend Components

**AuditService (django_backend/api/services/audit_service.py)**
```python
class AuditService:
    def log_activity(user_id, action, resource, details)
    def get_user_activities(user_id, filters)
    def detect_anomalies(user_id)
    def export_logs(filters, format)
```

**ActivityLog Model (MongoDB)**
```python
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "action": str,  # login, logout, create_quiz, submit_quiz, etc.
    "resource_type": str,  # quiz, submission, flag, etc.
    "resource_id": ObjectId,
    "ip_address": str,
    "user_agent": str,
    "details": dict,
    "timestamp": datetime,
    "is_anomalous": bool
}
```

**Middleware (django_backend/api/middleware/audit_middleware.py)**
```python
class AuditMiddleware:
    def process_request(request)
    def process_response(request, response)
    def log_api_call(request, response)
```

#### Frontend Components

**ActivityLogViewer (src/components/admin/ActivityLogViewer.jsx)**
- Filter by user/action/date
- Search logs
- Export functionality
- Anomaly highlights

**UserActivityTimeline (src/components/admin/UserActivityTimeline.jsx)**
- Chronological activity view
- Activity details
- IP address tracking
- Session information

#### API Endpoints

```
GET    /api/audit/logs/                    - List logs
GET    /api/audit/user/:id/                - User activities
GET    /api/audit/anomalies/               - Anomalous activities
POST   /api/audit/export/                  - Export logs
GET    /api/audit/stats/                   - Activity statistics
```

### 12. Mobile Progressive Web App

#### Frontend Components

**Service Worker (public/sw.js)**
```javascript
// Cache strategies
// Offline fallback
// Background sync
// Push notifications
```

**PWA Configuration (public/manifest.json)**
```json
{
  "name": "ETRIXX EXAM",
  "short_name": "ETRIXX",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "icons": [...]
}
```

**Offline Storage (src/utils/offlineStorage.js)**
```javascript
class OfflineStorage {
    saveQuizProgress(quizId, answers)
    getQuizProgress(quizId)
    syncWhenOnline()
    clearSyncedData()
}
```

**Push Notification Handler (src/utils/pushNotifications.js)**
```javascript
class PushNotificationManager {
    requestPermission()
    subscribe(userId)
    handleNotification(notification)
}
```

#### Backend Components

**Push Notification Service (django_backend/api/services/push_service.py)**
```python
class PushNotificationService:
    def send_notification(user_id, title, body, data)
    def subscribe_user(user_id, subscription_info)
    def unsubscribe_user(user_id)
```

#### API Endpoints

```
POST   /api/pwa/subscribe/                 - Subscribe to push
DELETE /api/pwa/unsubscribe/               - Unsubscribe
POST   /api/pwa/sync/                      - Sync offline data
GET    /api/pwa/offline-data/:quiz_id/     - Get offline quiz data
```

### 13. Live Proctoring Dashboard

#### Backend Components

**LiveMonitoringService (django_backend/api/services/live_monitoring_service.py)**
```python
class LiveMonitoringService:
    def get_active_sessions()
    def get_session_details(session_id)
    def send_message_to_student(session_id, message)
    def terminate_session(session_id)
```

**WebSocket Consumer (django_backend/api/consumers.py)**
```python
class LiveProctoringConsumer(AsyncWebsocketConsumer):
    async def connect()
    async def receive(text_data)
    async def send_camera_frame(frame_data)
    async def send_violation_alert(alert_data)
    async def teacher_message(message_data)
```

#### Frontend Components

**LiveDashboard (src/components/teacher/LiveDashboard.jsx)**
- Grid view of active students
- Real-time camera feeds
- Violation alerts
- Quick actions

**StudentMonitorCard (src/components/teacher/StudentMonitorCard.jsx)**
- Camera feed
- Progress indicator
- Violation count
- Send message button

**TeacherMessageModal (src/components/teacher/TeacherMessageModal.jsx)**
- Message input
- Send to student
- Message history

#### WebSocket Events

```javascript
// Student to Server
{
    type: "camera_frame",
    data: base64_image,
    timestamp: datetime
}

// Server to Teacher
{
    type: "violation_alert",
    student_id: string,
    violation_type: string,
    severity: string,
    timestamp: datetime
}

// Teacher to Student
{
    type: "teacher_message",
    message: string,
    timestamp: datetime
}
```

### 14. Adaptive Quiz Difficulty

#### Backend Components

**AdaptiveQuizService (django_backend/api/services/adaptive_quiz_service.py)**
```python
class AdaptiveQuizService:
    def calculate_student_level(student_id)
    def select_next_question(student_id, current_performance)
    def adjust_difficulty(quiz_id, student_id)
    def generate_adaptive_report(submission_id)
```

**Student Performance Profile (MongoDB)**
```python
{
    "_id": ObjectId,
    "student_id": ObjectId,
    "subject_levels": {
        "math": {"level": 7, "confidence": 0.85},
        "science": {"level": 5, "confidence": 0.72}
    },
    "overall_level": int,
    "quiz_history": [{
        "quiz_id": ObjectId,
        "difficulty": str,
        "score": float,
        "date": datetime
    }],
    "updated_at": datetime
}
```

#### Frontend Components

**AdaptiveQuizCreator (src/components/teacher/AdaptiveQuizCreator.jsx)**
- Enable adaptive mode
- Set difficulty range
- Configure adaptation rules
- Preview question pool

**AdaptiveQuizInterface (src/components/student/AdaptiveQuizInterface.jsx)**
- Dynamic question loading
- Difficulty indicator
- Performance feedback
- Adaptive progress bar

#### API Endpoints

```
POST   /api/adaptive/create-quiz/           - Create adaptive quiz
GET    /api/adaptive/next-question/:id/     - Get next question
POST   /api/adaptive/submit-answer/         - Submit and adapt
GET    /api/adaptive/student-level/:id/     - Get student level
GET    /api/adaptive/report/:submission_id/ - Adaptive report
```

## Data Models

### New MongoDB Collections

#### email_templates
```python
{
    "_id": ObjectId,
    "name": str,
    "subject": str,
    "html_body": str,
    "text_body": str,
    "variables": [str],
    "created_at": datetime
}
```

#### email_logs
```python
{
    "_id": ObjectId,
    "to_email": str,
    "subject": str,
    "template_id": ObjectId,
    "status": str,  # sent, failed, pending
    "sent_at": datetime,
    "error_message": str
}
```

#### batches
```python
{
    "_id": ObjectId,
    "name": str,
    "description": str,
    "teacher_id": ObjectId,
    "student_ids": [ObjectId],
    "created_at": datetime,
    "is_active": bool
}
```

#### question_bank
```python
{
    "_id": ObjectId,
    "question_text": str,
    "options": [str],
    "correct_answer": int,
    "subject": str,
    "difficulty": str,
    "tags": [str],
    "usage_count": int,
    "created_by": ObjectId,
    "is_ai_generated": bool
}
```

#### leaderboards
```python
{
    "_id": ObjectId,
    "student_id": ObjectId,
    "total_points": int,
    "badges": [str],
    "rank": int,
    "updated_at": datetime
}
```

#### plagiarism_flags
```python
{
    "_id": ObjectId,
    "quiz_id": ObjectId,
    "student1_id": ObjectId,
    "student2_id": ObjectId,
    "similarity_score": float,
    "status": str,
    "created_at": datetime
}
```

#### quiz_schedules
```python
{
    "_id": ObjectId,
    "quiz_id": ObjectId,
    "start_time": datetime,
    "end_time": datetime,
    "timezone": str,
    "is_active": bool
}
```

#### screen_recordings
```python
{
    "_id": ObjectId,
    "submission_id": ObjectId,
    "segments": [{"url": str, "duration": int}],
    "total_duration": int,
    "expires_at": datetime
}
```

#### activity_logs
```python
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "action": str,
    "resource_type": str,
    "ip_address": str,
    "timestamp": datetime
}
```


## Error Handling

### Email Service Errors

**Error Types:**
- Email delivery failure
- Invalid email address
- Template rendering error
- SMTP connection timeout

**Handling Strategy:**
```python
try:
    send_email(to, subject, body)
except SMTPException as e:
    # Retry with exponential backoff
    retry_email.apply_async(args=[to, subject, body], countdown=60)
    log_error("Email delivery failed", e)
except TemplateError as e:
    # Alert admin, don't retry
    notify_admin("Template error", e)
    log_error("Template rendering failed", e)
```

### Analytics Errors

**Error Types:**
- Data aggregation timeout
- Missing data points
- Chart rendering failure
- Export format error

**Handling Strategy:**
```python
try:
    analytics_data = aggregate_data(filters)
except TimeoutError:
    # Return cached data with warning
    return get_cached_analytics(filters), {"warning": "Using cached data"}
except DataMissingError:
    # Return partial data
    return partial_data, {"warning": "Some data unavailable"}
```

### PDF Generation Errors

**Error Types:**
- Template not found
- Chart rendering failure
- Memory overflow
- Storage upload failure

**Handling Strategy:**
```python
try:
    pdf = generate_pdf(data, template)
    upload_to_storage(pdf)
except MemoryError:
    # Generate in smaller chunks
    pdf = generate_pdf_chunked(data, template)
except StorageError as e:
    # Retry upload
    retry_upload.apply_async(args=[pdf], countdown=30)
```

### AI Question Generation Errors

**Error Types:**
- API rate limit exceeded
- Invalid response format
- Quality validation failure
- API timeout

**Handling Strategy:**
```python
try:
    questions = generate_questions_ai(topic, count)
    validate_questions(questions)
except RateLimitError:
    # Queue for later processing
    queue_generation_task(topic, count)
    return {"status": "queued", "message": "Will process shortly"}
except ValidationError as e:
    # Regenerate with adjusted prompt
    questions = regenerate_with_feedback(topic, count, e.feedback)
```

### Screen Recording Errors

**Error Types:**
- Permission denied
- Upload failure
- Storage quota exceeded
- Compression failure

**Handling Strategy:**
```python
try:
    upload_segment(segment_data)
except PermissionError:
    # Create high-severity flag
    create_flag(student_id, "recording_permission_denied", "high")
except StorageQuotaError:
    # Delete old recordings and retry
    cleanup_old_recordings()
    retry_upload(segment_data)
```

### WebSocket Errors

**Error Types:**
- Connection dropped
- Message parsing error
- Authentication failure
- Rate limit exceeded

**Handling Strategy:**
```javascript
websocket.onerror = (error) => {
    if (error.code === 'AUTH_FAILED') {
        // Refresh token and reconnect
        refreshToken().then(() => reconnect());
    } else if (error.code === 'RATE_LIMIT') {
        // Slow down message rate
        setMessageDelay(1000);
    } else {
        // Exponential backoff reconnection
        setTimeout(() => reconnect(), backoffTime);
    }
};
```

## Testing Strategy

### Unit Tests

**Backend Tests (pytest)**

```python
# test_email_service.py
def test_send_email_success():
    result = email_service.send_email(valid_email, subject, body)
    assert result.status == "sent"

def test_send_email_invalid_address():
    with pytest.raises(ValidationError):
        email_service.send_email(invalid_email, subject, body)

# test_analytics_service.py
def test_calculate_student_trends():
    trends = analytics_service.get_student_trends(student_id)
    assert len(trends.scores) > 0
    assert trends.improvement_rate is not None

# test_plagiarism_service.py
def test_detect_high_similarity():
    similarity = plagiarism_service.calculate_similarity(sub1, sub2)
    assert 0 <= similarity <= 100
```

**Frontend Tests (Jest + React Testing Library)**

```javascript
// AnalyticsDashboard.test.jsx
test('renders analytics charts', async () => {
    render(<AnalyticsDashboard />);
    await waitFor(() => {
        expect(screen.getByText('Performance Trends')).toBeInTheDocument();
    });
});

// Leaderboard.test.jsx
test('displays top 10 students', async () => {
    render(<Leaderboard />);
    const students = await screen.findAllByTestId('student-rank');
    expect(students).toHaveLength(10);
});
```

### Integration Tests

**API Integration Tests**

```python
# test_email_integration.py
def test_quiz_invitation_flow():
    # Create quiz
    quiz = create_quiz(teacher_id, quiz_data)
    
    # Assign to students
    assign_students(quiz.id, student_ids)
    
    # Verify emails sent
    emails = get_email_logs(quiz.id)
    assert len(emails) == len(student_ids)
    assert all(e.status == "sent" for e in emails)

# test_gamification_integration.py
def test_badge_award_on_perfect_score():
    # Submit quiz with perfect score
    submission = submit_quiz(student_id, quiz_id, perfect_answers)
    
    # Verify badge awarded
    badges = get_student_badges(student_id)
    assert "perfect_score" in badges
    
    # Verify leaderboard updated
    leaderboard = get_leaderboard()
    assert student_id in [s.id for s in leaderboard[:10]]
```

### End-to-End Tests (Playwright)

```javascript
// e2e/teacher-workflow.spec.js
test('teacher creates quiz and views analytics', async ({ page }) => {
    // Login as teacher
    await page.goto('/login');
    await page.fill('[name="email"]', 'teacher@test.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Create quiz
    await page.click('text=Create Quiz');
    await page.fill('[name="title"]', 'Test Quiz');
    // ... fill quiz details
    await page.click('text=Save Quiz');
    
    // View analytics
    await page.click('text=Analytics');
    await expect(page.locator('.chart-container')).toBeVisible();
});

// e2e/student-workflow.spec.js
test('student takes quiz and earns badge', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await loginAsStudent(page);
    
    // Take quiz
    await page.fill('[name="quiz-code"]', 'TEST123');
    await page.click('text=Start Quiz');
    
    // Answer all questions correctly
    await answerAllQuestionsCorrectly(page);
    await page.click('text=Submit');
    
    // Verify badge notification
    await expect(page.locator('.badge-notification')).toBeVisible();
    await expect(page.locator('text=Perfect Score')).toBeVisible();
});
```

### Performance Tests

**Load Testing (Locust)**

```python
# locustfile.py
class ExamUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def view_analytics(self):
        self.client.get("/api/analytics/dashboard/")
    
    @task(2)
    def generate_report(self):
        self.client.post("/api/reports/generate/", json={
            "type": "student",
            "student_id": "123"
        })
    
    @task(1)
    def run_plagiarism_check(self):
        self.client.post("/api/plagiarism/analyze/quiz123/")
```

**Stress Testing Scenarios:**
- 500 concurrent students taking quizzes
- 100 teachers viewing live dashboard simultaneously
- 50 PDF reports generating concurrently
- 1000 emails sent in 1 minute
- 200 screen recording uploads per minute

### Security Tests

**Authentication Tests**

```python
def test_2fa_required_after_enable():
    # Enable 2FA
    enable_2fa(user_id)
    
    # Try login without 2FA code
    response = login(email, password)
    assert response.status == "2fa_required"
    
    # Login with invalid code
    response = login_with_2fa(email, password, "000000")
    assert response.status == "invalid_code"
    
    # Login with valid code
    response = login_with_2fa(email, password, valid_code)
    assert response.status == "success"
```

**Authorization Tests**

```python
def test_student_cannot_access_teacher_endpoints():
    # Login as student
    token = login_as_student()
    
    # Try to access teacher endpoint
    response = client.get("/api/analytics/dashboard/", 
                         headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403
```

**Input Validation Tests**

```python
def test_xss_prevention():
    malicious_input = "<script>alert('xss')</script>"
    
    # Try to create quiz with malicious title
    response = create_quiz(title=malicious_input)
    
    # Verify input is sanitized
    quiz = get_quiz(response.quiz_id)
    assert "<script>" not in quiz.title
```

## Deployment Strategy

### Phase 1: Core Infrastructure (Week 1)

**Tasks:**
1. Set up Celery and Redis for task queue
2. Configure email service (SendGrid/SES)
3. Set up S3/MinIO for file storage
4. Update database indexes
5. Deploy monitoring tools

**Deployment Steps:**
```bash
# Install dependencies
pip install celery redis sendgrid boto3

# Start Celery worker
celery -A exam_proctoring worker -l info

# Start Celery beat (scheduler)
celery -A exam_proctoring beat -l info

# Update environment variables
export EMAIL_API_KEY=xxx
export AWS_ACCESS_KEY=xxx
export AWS_SECRET_KEY=xxx
```

### Phase 2: Email & Analytics (Week 2)

**Features:**
- Email notification system
- Advanced analytics dashboard
- Activity logs

**Deployment:**
```bash
# Run migrations
python manage.py migrate

# Create email templates
python manage.py load_email_templates

# Build frontend
npm run build

# Deploy
./deploy.sh email-analytics
```

### Phase 3: Reports & Batches (Week 3)

**Features:**
- PDF report generation
- Batch management
- Question bank

**Deployment:**
```bash
# Install PDF dependencies
pip install reportlab weasyprint

# Deploy
./deploy.sh reports-batches
```

### Phase 4: AI & Gamification (Week 4)

**Features:**
- AI question generator
- Gamification system
- Plagiarism detection

**Deployment:**
```bash
# Configure OpenAI
export OPENAI_API_KEY=xxx

# Deploy
./deploy.sh ai-gamification
```

### Phase 5: Advanced Features (Week 5-6)

**Features:**
- Scheduled exams
- Screen recording
- 2FA
- Live proctoring dashboard
- PWA
- Adaptive quizzes

**Deployment:**
```bash
# Deploy all remaining features
./deploy.sh advanced-features

# Enable PWA
npm run build:pwa
```

### Rollback Strategy

```bash
# Rollback to previous version
./rollback.sh <version>

# Rollback specific feature
./rollback.sh --feature=email-system

# Database rollback
python manage.py migrate <previous_migration>
```

### Monitoring

**Metrics to Track:**
- Email delivery rate
- PDF generation time
- API response times
- WebSocket connection count
- Storage usage
- Celery queue length
- Error rates

**Alerts:**
- Email delivery failure > 5%
- API response time > 2s
- Storage usage > 80%
- Celery queue > 1000 tasks
- Error rate > 1%

## Performance Optimization

### Database Optimization

**Indexes:**
```python
# MongoDB indexes
db.email_logs.create_index([("sent_at", -1)])
db.activity_logs.create_index([("user_id", 1), ("timestamp", -1)])
db.leaderboards.create_index([("total_points", -1)])
db.question_bank.create_index([("subject", 1), ("difficulty", 1)])
db.plagiarism_flags.create_index([("quiz_id", 1), ("similarity_score", -1)])
```

**Query Optimization:**
```python
# Use projection to limit fields
students = db.students.find(
    {"batch_id": batch_id},
    {"name": 1, "email": 1, "student_id": 1}
)

# Use aggregation pipeline for complex queries
pipeline = [
    {"$match": {"quiz_id": quiz_id}},
    {"$group": {"_id": "$student_id", "avg_score": {"$avg": "$score"}}},
    {"$sort": {"avg_score": -1}},
    {"$limit": 10}
]
top_students = db.submissions.aggregate(pipeline)
```

### Caching Strategy

**Redis Caching:**
```python
# Cache analytics data
cache.set(f"analytics:{quiz_id}", analytics_data, timeout=300)

# Cache leaderboard
cache.set("leaderboard:global", leaderboard_data, timeout=60)

# Cache question bank queries
cache.set(f"questions:{subject}:{difficulty}", questions, timeout=3600)
```

### Frontend Optimization

**Code Splitting:**
```javascript
// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));
const LiveDashboard = lazy(() => import('./components/LiveDashboard'));
```

**Data Fetching:**
```javascript
// Use React Query for caching
const { data: analytics } = useQuery(
    ['analytics', quizId],
    () => fetchAnalytics(quizId),
    { staleTime: 5 * 60 * 1000 } // 5 minutes
);
```

### Asset Optimization

```bash
# Compress images
npm run optimize-images

# Minify JavaScript
npm run build -- --minify

# Generate service worker
npm run generate-sw
```

## Security Considerations

### Data Encryption

**At Rest:**
- Screen recordings: AES-256 encryption
- 2FA secrets: Encrypted with user-specific key
- Backup codes: Bcrypt hashing

**In Transit:**
- All API calls: HTTPS/TLS 1.3
- WebSocket: WSS (WebSocket Secure)
- Email: TLS encryption

### Access Control

**Role-Based Permissions:**
```python
PERMISSIONS = {
    "student": ["take_quiz", "view_own_results", "view_leaderboard"],
    "teacher": ["create_quiz", "view_analytics", "generate_reports", 
                "manage_batches", "view_recordings"],
    "admin": ["*"]  # All permissions
}
```

### Rate Limiting

```python
# API rate limits
RATE_LIMITS = {
    "default": "100/hour",
    "email_send": "50/hour",
    "report_generate": "20/hour",
    "ai_generate": "10/hour",
    "login": "5/minute"
}
```

### Input Sanitization

```python
# Sanitize all user inputs
def sanitize_input(text):
    # Remove HTML tags
    text = bleach.clean(text, tags=[], strip=True)
    # Escape special characters
    text = html.escape(text)
    return text
```

## Conclusion

This design provides a comprehensive architecture for implementing 15 major features that will transform ETRIXX EXAM into an enterprise-grade examination platform. The modular design allows for incremental development and deployment, while maintaining system stability and performance.

Key design decisions:
- Asynchronous processing for heavy tasks (emails, reports, AI)
- Caching strategy for improved performance
- Comprehensive error handling and retry mechanisms
- Security-first approach with encryption and access control
- Scalable architecture supporting thousands of concurrent users
- Progressive Web App for mobile support
- Real-time features using WebSocket
- Extensive testing strategy ensuring reliability

The implementation can be done in 5-6 weeks with proper resource allocation, following the phased deployment strategy outlined above.
