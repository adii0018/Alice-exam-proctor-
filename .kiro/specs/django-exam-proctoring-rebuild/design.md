# Design Document

## Overview

The ETRIXX EXAM proctoring system will be rebuilt using a modern Django backend with React frontend, featuring enhanced animations, real-time monitoring, and improved architecture. The system follows a RESTful API design pattern with WebSocket support for real-time updates.

### Key Design Principles

1. **Separation of Concerns**: Clear boundaries between frontend, backend, and database layers
2. **Scalability**: Modular architecture that can handle increasing user load
3. **Security First**: JWT authentication, encrypted passwords, and secure data transmission
4. **Real-time Capabilities**: WebSocket integration for live monitoring
5. **Responsive Design**: Mobile-first approach with Tailwind CSS
6. **Performance**: Optimized queries, caching, and lazy loading

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React Application (Vite)                     │ │
│  │  - Authentication Pages                                │ │
│  │  - Student Dashboard (Quiz Taking + Proctoring)        │ │
│  │  - Teacher Dashboard (Quiz Management + Monitoring)    │ │
│  │  - Shared Components (Animations, UI Elements)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST │ WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (Django)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Django REST Framework                     │ │
│  │  - Authentication API (JWT)                            │ │
│  │  - Quiz Management API                                 │ │
│  │  - Flag Management API                                 │ │
│  │  - Submission API                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Django Channels (WebSocket)                  │ │
│  │  - Real-time Monitoring Consumer                       │ │
│  │  - Flag Broadcast Consumer                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                      MongoDB Driver
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (MongoDB)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ teachers │  │ students │  │ quizzes  │  │  flags   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐                                               │
│  │submissions│                                               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.2+ with Hooks
- Vite 5.x for build tooling
- Tailwind CSS 3.4+ for styling
- Framer Motion for animations
- face-api.js OR OpenCV.js for face detection (OpenCV recommended for better accuracy)
- socket.io-client for WebSocket
- Axios for HTTP requests
- React Router for navigation

**Backend:**
- Django 4.2+
- Django REST Framework 3.14+
- Django Channels 4.0+ (WebSocket)
- Daphne (ASGI server)
- PyMongo 4.6+ (MongoDB driver)
- PyJWT for authentication
- bcrypt for password hashing
- django-cors-headers for CORS

**Database:**
- MongoDB 6.0+

**Development Tools:**
- ESLint + Prettier (Frontend)
- Black + Flake8 (Backend)
- Git for version control

## Components and Interfaces

### Frontend Components

#### 1. Authentication Module

**Components:**

- `AuthPage.jsx`: Main authentication container with tab switching
- `LoginForm.jsx`: Login form with role selection
- `RegisterForm.jsx`: Registration form with role-specific fields
- `ProtectedRoute.jsx`: Route guard for authenticated users

**Key Features:**
- Animated tab transitions using Framer Motion
- Form validation with real-time feedback
- Role-based field rendering
- JWT token storage in localStorage
- Automatic redirect after successful auth

**API Integration:**
```javascript
// Authentication Service
class AuthService {
  async login(email, password) {
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }
  
  async register(userData) {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
}
```

#### 2. Student Dashboard Module

**Components:**
- `StudentDashboard.jsx`: Main container
- `QuizCodeEntry.jsx`: Quiz code input with validation
- `ProctoringInterface.jsx`: Camera + audio monitoring
- `QuizTaking.jsx`: Question display and answer selection
- `QuizTimer.jsx`: Countdown timer with warnings
- `ViolationIndicator.jsx`: Real-time violation display

**Key Features:**

- Face detection with visual feedback (face count overlay)
- Audio level visualization with animated bars
- Smooth question transitions with slide animations
- Progress indicator showing answered questions
- Auto-save answers to localStorage
- Warning animations when timer is low
- Confetti animation on quiz completion

**Proctoring Logic (Option 1: face-api.js):**
```javascript
// Face Detection Hook with face-api.js
const useFaceDetection = (videoRef, onViolation) => {
  const [faceCount, setFaceCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      setIsLoaded(true);
    };
    loadModels();
  }, []);
  
  useEffect(() => {
    if (!isLoaded || !videoRef.current) return;
    
    const detectFaces = async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      
      setFaceCount(detections.length);
      
      if (detections.length > 1) {
        onViolation('multiple_faces', 'Multiple faces detected');
      } else if (detections.length === 0) {
        onViolation('looking_away', 'No face detected');
      }
    };
    
    const interval = setInterval(detectFaces, 1000);
    return () => clearInterval(interval);
  }, [isLoaded, videoRef, onViolation]);
  
  return { faceCount, isLoaded };
};
```

**Proctoring Logic (Option 2: OpenCV.js - Recommended):**
```javascript
// Face Detection Hook with OpenCV.js (Better accuracy and performance)
const useFaceDetectionOpenCV = (videoRef, onViolation) => {
  const [faceCount, setFaceCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const classifierRef = useRef(null);
  
  useEffect(() => {
    const loadOpenCV = async () => {
      // Wait for OpenCV to load
      await new Promise((resolve) => {
        if (window.cv) {
          resolve();
        } else {
          document.getElementById('opencv').onload = resolve;
        }
      });
      
      // Load Haar Cascade classifier for face detection
      const classifier = new cv.CascadeClassifier();
      await classifier.load('haarcascade_frontalface_default.xml');
      classifierRef.current = classifier;
      setIsLoaded(true);
    };
    loadOpenCV();
  }, []);
  
  useEffect(() => {
    if (!isLoaded || !videoRef.current || !classifierRef.current) return;
    
    const detectFaces = () => {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to OpenCV Mat
      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      
      // Detect faces
      const faces = new cv.RectVector();
      classifierRef.current.detectMultiScale(gray, faces, 1.1, 3, 0);
      
      setFaceCount(faces.size());
      
      if (faces.size() > 1) {
        onViolation('multiple_faces', 'Multiple faces detected');
      } else if (faces.size() === 0) {
        onViolation('looking_away', 'No face detected');
      }
      
      // Cleanup
      src.delete();
      gray.delete();
      faces.delete();
    };
    
    const interval = setInterval(detectFaces, 1000);
    return () => clearInterval(interval);
  }, [isLoaded, videoRef, onViolation]);
  
  return { faceCount, isLoaded };
};
```

**Why OpenCV.js is Better:**
- More accurate face detection with Haar Cascades
- Better performance on various lighting conditions
- Industry-standard computer vision library
- More robust for production use
- Can detect faces at different angles
- Lower false positive rate

#### 3. Teacher Dashboard Module

**Components:**
- `TeacherDashboard.jsx`: Main container with tabs
- `QuizList.jsx`: Display all quizzes with actions
- `QuizCreator.jsx`: Multi-step quiz creation form
- `QuizEditor.jsx`: Edit existing quiz
- `MonitoringPanel.jsx`: Real-time student monitoring
- `FlagReview.jsx`: View and resolve flags
- `SubmissionReview.jsx`: View student submissions and scores

**Key Features:**

- Drag-and-drop question reordering
- Real-time flag notifications with toast animations
- Live student count display
- Filter and search functionality
- Export results to CSV
- Animated statistics cards
- Modal dialogs with smooth transitions

**Real-time Monitoring:**
```javascript
// WebSocket Hook
const useMonitoring = (quizId) => {
  const [flags, setFlags] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = io('ws://localhost:8000', {
      auth: { token: localStorage.getItem('token') }
    });
    
    socketRef.current.emit('join_monitoring', { quiz_id: quizId });
    
    socketRef.current.on('new_flag', (flag) => {
      setFlags(prev => [flag, ...prev]);
      toast.warning(`New violation: ${flag.type}`);
    });
    
    socketRef.current.on('student_status', (data) => {
      setActiveStudents(data.students);
    });
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [quizId]);
  
  return { flags, activeStudents };
};
```

#### 4. Shared Components

**Animation Components:**
- `PageTransition.jsx`: Wrapper for page animations
- `FadeIn.jsx`: Fade-in animation wrapper
- `SlideIn.jsx`: Slide animation wrapper
- `ScaleIn.jsx`: Scale animation wrapper
- `LoadingSpinner.jsx`: Animated loading indicator
- `SkeletonLoader.jsx`: Content placeholder
- `Toast.jsx`: Notification toast with animations
- `AppLoader.jsx`: **Full-screen animated loader for initial app load**
- `ParticleBackground.jsx`: Animated particle effects
- `GlowEffect.jsx`: Glowing border animations
- `RippleEffect.jsx`: Click ripple animations

**UI Components:**
- `Button.jsx`: Animated button with variants
- `Card.jsx`: Container with hover effects
- `Modal.jsx`: Animated modal dialog
- `Input.jsx`: Form input with validation states
- `Select.jsx`: Dropdown with animations
- `Badge.jsx`: Status badge
- `Avatar.jsx`: User avatar with fallback

**Animation Configuration:**
```javascript
// Framer Motion Variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }
};

export const modalVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};
```

### Backend Components

#### 1. Authentication System

**Files:**
- `api/authentication.py`: JWT authentication class
- `api/views/auth_views.py`: Login, register, logout endpoints
- `api/serializers/user_serializers.py`: User data serialization

**JWT Implementation:**

```python
# api/authentication.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import authentication, exceptions
from bson import ObjectId
from .models import teachers_collection, students_collection

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            # Search in both collections
            user = teachers_collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                user = students_collection.find_one({'_id': ObjectId(user_id)})
            
            if not user:
                raise exceptions.AuthenticationFailed('User not found')
            
            # Convert ObjectId to string for JSON serialization
            user['_id'] = str(user['_id'])
            user.pop('password', None)  # Remove password from user object
            
            return (user, token)
        
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

def generate_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')
```

#### 2. Quiz Management System

**Files:**
- `api/views/quiz_views.py`: CRUD operations for quizzes
- `api/serializers/quiz_serializers.py`: Quiz data validation
- `api/utils/quiz_utils.py`: Helper functions (code generation, scoring)

**Quiz Views Structure:**
```python
# api/views/quiz_views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bson import ObjectId
from datetime import datetime
from ..models import quizzes_collection
from ..utils.quiz_utils import generate_quiz_code, calculate_score

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def quiz_list_create(request):
    if request.method == 'GET':
        # Return all quizzes (teachers see all, students see active only)
        pass
    
    elif request.method == 'POST':
        # Only teachers can create quizzes
        if request.user.get('role') != 'teacher':
            return Response({'error': 'Only teachers can create quizzes'}, status=403)
        # Create quiz logic
        pass

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def quiz_detail(request, quiz_id):
    # Get, update, or delete specific quiz
    pass

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request, quiz_id):
    # Submit quiz answers and calculate score
    pass
```

#### 3. Flag Management System

**Files:**
- `api/views/flag_views.py`: Flag CRUD operations
- `api/serializers/flag_serializers.py`: Flag data validation
- `api/utils/flag_utils.py`: Flag aggregation logic

**Flag Aggregation Logic:**
```python
# api/utils/flag_utils.py
from datetime import datetime, timedelta
from ..models import flags_collection

def should_aggregate_flag(student_id, quiz_id, flag_type):
    """Check if similar flag exists within 30 seconds"""
    thirty_seconds_ago = datetime.utcnow() - timedelta(seconds=30)
    
    existing_flag = flags_collection.find_one({
        'student_id': student_id,
        'quiz_id': quiz_id,
        'type': flag_type,
        'timestamp': {'$gte': thirty_seconds_ago}
    })
    
    return existing_flag

def increase_flag_severity(flag_id):
    """Increase severity of existing flag"""
    severity_map = {'low': 'medium', 'medium': 'high', 'high': 'critical'}
    flag = flags_collection.find_one({'_id': ObjectId(flag_id)})
    new_severity = severity_map.get(flag['severity'], 'critical')
    
    flags_collection.update_one(
        {'_id': ObjectId(flag_id)},
        {'$set': {'severity': new_severity, 'count': flag.get('count', 1) + 1}}
    )
```

#### 4. WebSocket Consumers

**Files:**
- `api/consumers.py`: WebSocket consumer for real-time updates
- `api/routing.py`: WebSocket URL routing

**Consumer Implementation:**

```python
# api/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import jwt
from django.conf import settings
from bson import ObjectId
from .models import teachers_collection, students_collection

class MonitoringConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Authenticate user from token
        token = self.scope['query_string'].decode().split('token=')[1]
        user = await self.authenticate_token(token)
        
        if not user:
            await self.close()
            return
        
        self.user = user
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave monitoring room
        if hasattr(self, 'quiz_id'):
            await self.channel_layer.group_discard(
                f'quiz_{self.quiz_id}',
                self.channel_name
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'join_monitoring':
            self.quiz_id = data.get('quiz_id')
            await self.channel_layer.group_add(
                f'quiz_{self.quiz_id}',
                self.channel_name
            )
        
        elif action == 'broadcast_flag':
            # Broadcast new flag to all monitoring teachers
            await self.channel_layer.group_send(
                f'quiz_{self.quiz_id}',
                {
                    'type': 'flag_notification',
                    'flag': data.get('flag')
                }
            )
    
    async def flag_notification(self, event):
        # Send flag to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_flag',
            'flag': event['flag']
        }))
    
    @database_sync_to_async
    def authenticate_token(self, token):
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = teachers_collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                user = students_collection.find_one({'_id': ObjectId(user_id)})
            return user
        except:
            return None
```

## Data Models

### MongoDB Collections Schema

#### Teachers Collection
```javascript
{
  _id: ObjectId,
  name: String,              // "Dr. John Smith"
  email: String,             // "john@example.com" (unique, indexed)
  username: String,          // "johnsmith" (unique, indexed)
  password: String,          // bcrypt hash
  role: "teacher",           // Fixed value
  department: String,        // "Computer Science"
  employee_id: String,       // "EMP001" (unique, indexed)
  created_at: ISODate,
  updated_at: ISODate,
  is_active: Boolean,
  profile_image: String      // URL or base64
}
```

#### Students Collection
```javascript
{
  _id: ObjectId,
  name: String,              // "Alice Johnson"
  email: String,             // "alice@example.com" (unique, indexed)
  username: String,          // "alicejohnson" (unique, indexed)
  password: String,          // bcrypt hash
  role: "student",           // Fixed value
  student_id: String,        // "STU001" (unique, indexed)
  class_section: String,     // "10-A"
  enrollment_year: String,   // "2024"
  created_at: ISODate,
  updated_at: ISODate,
  is_active: Boolean,
  profile_image: String      // URL or base64
}
```

#### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String,             // "Mathematics Final Exam"
  code: String,              // "MATH2024" (unique, indexed)
  teacher_id: String,        // Reference to teacher._id (indexed)
  description: String,       // "Final exam covering chapters 1-10"
  duration: Number,          // Duration in minutes (e.g., 60)
  questions: [
    {
      question: String,      // "What is 2 + 2?"
      options: [String],     // ["3", "4", "5", "6"]
      correct: Number        // Index of correct answer (1)
    }
  ],
  created_at: ISODate,
  updated_at: ISODate,
  is_active: Boolean,
  start_time: ISODate,       // Optional scheduled start
  end_time: ISODate,         // Optional scheduled end
  settings: {
    shuffle_questions: Boolean,
    shuffle_options: Boolean,
    show_results: Boolean,
    allow_review: Boolean
  }
}
```

#### Flags Collection
```javascript
{
  _id: ObjectId,
  student_id: String,        // Reference to student._id (indexed)
  quiz_id: String,           // Reference to quiz._id (indexed)
  type: String,              // "multiple_faces", "looking_away", "high_audio"
  description: String,       // Human-readable description
  timestamp: ISODate,        // When violation occurred (indexed)
  severity: String,          // "low", "medium", "high", "critical"
  resolved: Boolean,
  resolved_by: String,       // Reference to teacher._id
  resolved_at: ISODate,
  resolution_note: String,   // Teacher's note
  count: Number              // Number of times aggregated
}
```

#### Submissions Collection
```javascript
{
  _id: ObjectId,
  quiz_id: String,           // Reference to quiz._id (indexed)
  student_id: String,        // Reference to student._id (indexed)
  answers: Object,           // { "0": 1, "1": 3, "2": 0 } (question index: selected option)
  submitted_at: ISODate,
  score: Number,             // Calculated score
  total_questions: Number,
  correct_answers: Number,
  total_flags: Number,       // Count of flags during this attempt
  time_taken: Number,        // Seconds taken to complete
  status: String             // "in_progress", "submitted", "flagged", "reviewed"
}
```

### Database Indexes

```javascript
// Performance optimization indexes
db.teachers.createIndex({ email: 1 }, { unique: true });
db.teachers.createIndex({ username: 1 }, { unique: true });
db.teachers.createIndex({ employee_id: 1 }, { unique: true });

db.students.createIndex({ email: 1 }, { unique: true });
db.students.createIndex({ username: 1 }, { unique: true });
db.students.createIndex({ student_id: 1 }, { unique: true });

db.quizzes.createIndex({ code: 1 }, { unique: true });
db.quizzes.createIndex({ teacher_id: 1 });
db.quizzes.createIndex({ is_active: 1 });

db.flags.createIndex({ student_id: 1 });
db.flags.createIndex({ quiz_id: 1 });
db.flags.createIndex({ timestamp: -1 });
db.flags.createIndex({ resolved: 1 });

db.submissions.createIndex({ quiz_id: 1, student_id: 1 }, { unique: true });
db.submissions.createIndex({ submitted_at: -1 });
```

## Error Handling

### Frontend Error Handling

**Error Boundary Component:**
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**API Error Handling:**
```javascript
// Axios interceptor for global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.clear();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);
```

### Backend Error Handling

**Custom Exception Handler:**

```python
# api/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response = {
            'error': True,
            'message': str(exc),
            'status_code': response.status_code
        }
        
        # Log error
        logger.error(f"API Error: {exc}", exc_info=True)
        
        return Response(custom_response, status=response.status_code)
    
    # Unhandled exception
    logger.critical(f"Unhandled exception: {exc}", exc_info=True)
    return Response({
        'error': True,
        'message': 'An unexpected error occurred',
        'status_code': 500
    }, status=500)
```

**Validation Errors:**
```python
# api/validators.py
from rest_framework import serializers

def validate_quiz_code(code):
    if not code or len(code) < 4:
        raise serializers.ValidationError("Quiz code must be at least 4 characters")
    if not code.isalnum():
        raise serializers.ValidationError("Quiz code must be alphanumeric")
    return code.upper()

def validate_email(email):
    if not email or '@' not in email:
        raise serializers.ValidationError("Invalid email format")
    return email.lower()

def validate_password(password):
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters")
    return password
```

## Testing Strategy

### Frontend Testing

**Unit Tests (Vitest + React Testing Library):**
- Component rendering tests
- User interaction tests
- Hook behavior tests
- Utility function tests

**Integration Tests:**
- API service tests with mocked responses
- Form submission flows
- Authentication flows
- WebSocket connection tests

**E2E Tests (Playwright):**
- Complete user journeys
- Student taking quiz flow
- Teacher creating quiz flow
- Proctoring violation detection

**Example Test:**
```javascript
// __tests__/LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../components/auth/LoginForm';
import * as api from '../services/api';

vi.mock('../services/api');

describe('LoginForm', () => {
  it('should login successfully with valid credentials', async () => {
    const mockSetRole = vi.fn();
    api.login.mockResolvedValue({
      token: 'fake-token',
      user: { role: 'student', name: 'Test User' }
    });
    
    render(<LoginForm setRole={mockSetRole} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockSetRole).toHaveBeenCalledWith('student');
    });
  });
});
```

### Backend Testing

**Unit Tests (Django TestCase):**
- Model validation tests
- Utility function tests
- Authentication tests
- Serializer tests

**Integration Tests:**
- API endpoint tests
- Database operation tests
- WebSocket consumer tests

**Example Test:**
```python
# api/tests/test_auth.py
from django.test import TestCase
from rest_framework.test import APIClient
from api.models import students_collection
import bcrypt

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_data = {
            'name': 'Test Student',
            'email': 'test@example.com',
            'username': 'teststudent',
            'password': bcrypt.hashpw('password123'.encode(), bcrypt.gensalt()).decode(),
            'role': 'student',
            'student_id': 'STU001',
            'class_section': '10-A',
            'enrollment_year': '2024'
        }
        students_collection.insert_one(self.student_data)
    
    def tearDown(self):
        students_collection.delete_many({})
    
    def test_login_success(self):
        response = self.client.post('/api/auth/login', {
            'email': 'test@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['role'], 'student')
    
    def test_login_invalid_credentials(self):
        response = self.client.post('/api/auth/login', {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
```

## Performance Optimization

### Frontend Optimization

1. **Code Splitting:**
```javascript
// Lazy load routes
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/student" element={<StudentDashboard />} />
    <Route path="/teacher" element={<TeacherDashboard />} />
  </Routes>
</Suspense>
```

2. **Memoization:**
```javascript
// Memoize expensive computations
const QuizList = ({ quizzes }) => {
  const sortedQuizzes = useMemo(() => {
    return quizzes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [quizzes]);
  
  return <div>{/* render sorted quizzes */}</div>;
};
```

3. **Debouncing:**
```javascript
// Debounce search input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

4. **Image Optimization:**
- Use WebP format with fallbacks
- Lazy load images below the fold
- Implement progressive image loading

### Backend Optimization

1. **Database Query Optimization:**
```python
# Use projection to limit fields
def get_quiz_list(teacher_id):
    return list(quizzes_collection.find(
        {'teacher_id': teacher_id},
        {'title': 1, 'code': 1, 'created_at': 1, 'is_active': 1}
    ))

# Use indexes for frequent queries
# Already defined in Data Models section
```

2. **Caching:**
```python
# Cache quiz data
from django.core.cache import cache

def get_quiz_by_code(code):
    cache_key = f'quiz_{code}'
    quiz = cache.get(cache_key)
    
    if not quiz:
        quiz = quizzes_collection.find_one({'code': code})
        cache.set(cache_key, quiz, timeout=300)  # 5 minutes
    
    return quiz
```

3. **Pagination:**
```python
# Paginate large result sets
@api_view(['GET'])
def get_flags(request):
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    skip = (page - 1) * page_size
    
    flags = list(flags_collection.find().skip(skip).limit(page_size))
    total = flags_collection.count_documents({})
    
    return Response({
        'flags': flags,
        'total': total,
        'page': page,
        'page_size': page_size
    })
```

## Security Considerations

### Authentication Security

1. **Password Hashing:**
```python
import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

2. **JWT Token Security:**
- Use strong secret key (minimum 32 characters)
- Set appropriate expiration time
- Implement token refresh mechanism
- Store tokens securely (httpOnly cookies in production)

3. **CORS Configuration:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://yourdomain.com"
]
CORS_ALLOW_CREDENTIALS = True
```

### Input Validation

1. **Sanitize User Input:**
```python
import bleach

def sanitize_input(text):
    return bleach.clean(text, tags=[], strip=True)
```

2. **Rate Limiting:**
```python
# Implement rate limiting for API endpoints
from rest_framework.throttling import UserRateThrottle

class LoginRateThrottle(UserRateThrottle):
    rate = '5/minute'
```

### Data Privacy

1. **Remove Sensitive Data:**
```python
def serialize_user(user):
    user_copy = user.copy()
    user_copy.pop('password', None)
    user_copy['_id'] = str(user_copy['_id'])
    return user_copy
```

2. **HTTPS in Production:**
- Enforce HTTPS for all requests
- Use secure cookies
- Implement HSTS headers

## Deployment Architecture

### Development Environment
```
Frontend: http://localhost:5173 (Vite dev server)
Backend: http://localhost:8000 (Django dev server)
Database: mongodb://localhost:27017
WebSocket: ws://localhost:8000
```

### Production Environment
```
Frontend: https://exam.yourdomain.com (Nginx + Static files)
Backend: https://api.exam.yourdomain.com (Gunicorn + Nginx)
Database: MongoDB Atlas or self-hosted
WebSocket: wss://api.exam.yourdomain.com (Daphne)
```

### Deployment Steps

1. **Frontend Build:**
```bash
npm run build
# Output: dist/ folder with optimized static files
```

2. **Backend Setup:**
```bash
pip install gunicorn
gunicorn exam_proctoring.asgi:application -k uvicorn.workers.UvicornWorker
```

3. **Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name exam.yourdomain.com;
    
    location / {
        root /var/www/exam-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Monitoring and Logging

### Frontend Monitoring
- Implement error tracking (Sentry)
- Track user analytics (Google Analytics)
- Monitor performance metrics (Web Vitals)

### Backend Logging
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

## Future Enhancements

1. **Advanced Proctoring:**
   - Eye tracking
   - Screen recording
   - Browser tab monitoring
   - Keystroke analysis

2. **Analytics Dashboard:**
   - Student performance trends
   - Quiz difficulty analysis
   - Violation patterns
   - Time-based insights

3. **Mobile App:**
   - React Native mobile application
   - Native camera/audio access
   - Offline quiz support

4. **Integration:**
   - LMS integration (Moodle, Canvas)
   - Email notifications
   - SMS alerts
   - Calendar integration

5. **AI Enhancements:**
   - Automated question generation
   - Plagiarism detection
   - Behavioral analysis
   - Predictive cheating detection
