# ETRIXX EXAM - Django Backend

Complete Django REST API backend for the ETRIXX EXAM proctoring system with MongoDB, JWT authentication, and WebSocket support.

## 🚀 Features

- ✅ Django 4.2.7 with REST Framework
- ✅ MongoDB integration with PyMongo
- ✅ JWT authentication system
- ✅ Django Channels for WebSocket (real-time monitoring)
- ✅ Role-based access control (Students & Teachers)
- ✅ Quiz management with CRUD operations
- ✅ Violation flag system with aggregation
- ✅ Automatic score calculation
- ✅ CORS configuration for frontend
- ✅ Comprehensive logging
- ✅ Input validation and sanitization

## 📋 Prerequisites

- Python 3.10 or higher
- MongoDB 6.0 or higher
- Redis (for Channels/WebSocket)

## 🛠️ Installation

### 1. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables

```bash
# Copy example env file
copy .env.example .env

# Edit .env with your settings
# Update SECRET_KEY, JWT_SECRET, MONGODB_URI, etc.
```

### 4. Start MongoDB

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. Start Redis

```bash
# Windows (download from https://github.com/microsoftarchive/redis/releases)
redis-server

# Mac
brew services start redis

# Linux
sudo systemctl start redis
```

### 6. Initialize Database

```bash
python init_database.py
```

This will create all necessary indexes in MongoDB.

### 7. Create Sample Data (Optional)

```bash
python create_sample_data.py
```

This creates:
- 2 Teachers
- 3 Students
- 2 Quizzes
- Sample flags

**Demo Credentials:**
- Teachers: `teacher1@example.com` / `password123`
- Students: `student1@example.com` / `password123`

### 8. Run Development Server

```bash
python manage.py runserver
```

Server will start at: `http://127.0.0.1:8000/`

## 📡 API Endpoints

### Health Check
```
GET /api/health/
```

### Authentication
```
POST /api/auth/register/     - Register new user
POST /api/auth/login/        - Login user
GET  /api/auth/me/           - Get current user (requires auth)
```

### Quizzes
```
GET    /api/quizzes/                  - List quizzes
POST   /api/quizzes/                  - Create quiz (teachers only)
GET    /api/quizzes/by-code/:code/    - Get quiz by code
GET    /api/quizzes/:id/              - Get quiz details
PUT    /api/quizzes/:id/              - Update quiz (teachers only)
DELETE /api/quizzes/:id/              - Delete quiz (teachers only)
POST   /api/quizzes/:id/submit/       - Submit quiz (students only)
```

### Flags
```
GET    /api/flags/           - List flags
POST   /api/flags/           - Create flag
GET    /api/flags/:id/       - Get flag details
PUT    /api/flags/:id/       - Update flag (teachers only)
DELETE /api/flags/:id/       - Delete flag (teachers only)
```

### Submissions
```
GET /api/submissions/           - List submissions
GET /api/submissions/:id/       - Get submission details
```

### WebSocket
```
ws://localhost:8000/ws/monitoring/?token=<jwt_token>
```

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Collections

### teachers
- Stores teacher user accounts
- Unique indexes: email, username, employee_id

### students
- Stores student user accounts
- Unique indexes: email, username, student_id

### quizzes
- Stores quiz data with questions
- Unique index: code
- Indexes: teacher_id, is_active, created_at

### flags
- Stores violation flags during exams
- Indexes: student_id, quiz_id, timestamp, resolved

### submissions
- Stores quiz submissions and scores
- Unique compound index: (quiz_id, student_id)
- Indexes: submitted_at, quiz_id, student_id

## 🧪 Testing

### Test API Health
```bash
curl http://localhost:8000/api/health/
```

### Test Registration
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "username": "teststudent",
    "password": "password123",
    "role": "student",
    "student_id": "STU999",
    "class_section": "10-A",
    "enrollment_year": "2024"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "password": "password123"
  }'
```

## 📝 Logging

Logs are stored in `logs/django.log`

Log levels:
- INFO: General information
- WARNING: Warning messages
- ERROR: Error messages
- CRITICAL: Critical errors

## 🔧 Configuration

### settings.py Key Configurations

- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION_DAYS`: Token expiration (default: 7 days)
- `CORS_ALLOWED_ORIGINS`: Allowed frontend origins
- `CHANNEL_LAYERS`: Redis configuration for WebSocket

## 🚨 Common Issues

### MongoDB Connection Error
```
Error: pymongo.errors.ServerSelectionTimeoutError
Solution: Ensure MongoDB is running
```

### Redis Connection Error
```
Error: Connection refused
Solution: Ensure Redis is running
```

### Port Already in Use
```
Error: Port 8000 is already in use
Solution: Kill the process or use different port
python manage.py runserver 8001
```

## 📦 Project Structure

```
django_backend/
├── api/
│   ├── views/
│   │   ├── auth_views.py      # Authentication endpoints
│   │   ├── quiz_views.py      # Quiz management
│   │   ├── flag_views.py      # Flag management
│   │   └── health_views.py    # Health check
│   ├── utils/
│   │   ├── validators.py      # Input validation
│   │   ├── password_utils.py  # Password hashing
│   │   ├── quiz_utils.py      # Quiz utilities
│   │   └── flag_utils.py      # Flag utilities
│   ├── models.py              # MongoDB collections
│   ├── authentication.py      # JWT authentication
│   ├── exceptions.py          # Custom exception handler
│   ├── consumers.py           # WebSocket consumers
│   ├── routing.py             # WebSocket routing
│   └── urls.py                # API URL routing
├── exam_proctoring/
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL routing
│   ├── asgi.py                # ASGI config
│   └── wsgi.py                # WSGI config
├── logs/                      # Log files
├── manage.py                  # Django management
├── requirements.txt           # Python dependencies
├── init_database.py           # Database initialization
├── create_sample_data.py      # Sample data creation
└── README.md                  # This file
```

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Add docstrings to all functions
3. Write tests for new features
4. Update documentation

## 📄 License

MIT License

## 👥 Support

For issues or questions, contact: support@etrixxexam.com
