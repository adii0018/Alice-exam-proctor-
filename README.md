# 🤖 Alice Exam Proctor - AI-Powered Online Proctoring System

A modern, clean, and efficient exam proctoring platform with real-time AI monitoring, violation detection, and a beautiful responsive UI. Built with React and Django for seamless online examination experiences.

## ✨ Features

### 🎯 Core Features

- **Role-based Authentication** - Separate portals for Students and Teachers
- **AI-Powered Proctoring** - Real-time face detection and audio monitoring
- **Alice AI Assistant** - Built-in AI chatbot for instant help and support
- **Quiz Management** - Create, manage, and conduct online exams
- **Violation Detection** - Automatic flagging of suspicious behavior
- **Real-time Monitoring** - WebSocket-based live updates
- **Clean Modern UI** - Simple, fast, and professional design

### 🎨 UI/UX Features

- **Clean Design** - Modern, minimalist interface
- **Fast Performance** - Optimized for speed and efficiency
- **Responsive Design** - Works perfectly on all devices
- **Smooth Transitions** - Subtle animations for better UX
- **Professional Theme** - Clean white/blue color scheme
- **Accessibility** - WCAG compliant design

### 👨‍🎓 Student Features

- Enter quiz code to start exam
- Real-time camera monitoring
- Audio monitoring (detection only, no recording)
- Timer with auto-submit
- **Alice AI Assistant** - Get instant help during exams

### ☁️ Alice AI Assistant Features

- **Intelligent Chat Interface** - Natural language conversations
- **Markdown Support** - Rich text formatting and code highlighting
- **Demo Mode** - Works without API key for testing
- **Conversation History** - Maintains chat context
- **Floating Button** - Easy access from landing page
- **Responsive Design** - Works on all devices
- **Real-time Responses** - Fast and efficient communication
- Progress tracking
- View submission history

### 👨‍🏫 Teacher Features

- Create and manage quizzes
- Multi-step quiz creator
- View all submissions
- Monitor violations in real-time
- Resolve flags
- Statistics dashboard

## 🛠️ Tech Stack

### Frontend

- **React 18.2** - UI library
- **Vite 5.x** - Build tool & dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Modern JavaScript** - ES6+ features

### Backend

- **Django 4.2.7** - Web framework
- **Django REST Framework** - API
- **Django Channels** - WebSocket
- **MongoDB** - Database
- **PyMongo** - MongoDB driver
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB 6.0+
- Redis (for WebSocket)

### Backend Setup

```bash
# Navigate to backend
cd django_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env
# Edit .env with your settings

# For AI Assistant (Optional):
# Get free API key from https://console.groq.com/
# Add to .env: GROQ_API_KEY=your_key_here

# Initialize database
python init_database.py

# Create sample data
python create_sample_data.py

# Start server
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5174`

## 🎮 Demo Credentials

### Students

- **Email:** student1@example.com
- **Password:** password123

- **Email:** student2@example.com
- **Password:** password123

### Teachers

- **Email:** teacher1@example.com
- **Password:** password123

- **Email:** teacher2@example.com
- **Password:** password123

## 📁 Project Structure

```
alice-exam-proctor/
├── django_backend/              # Backend Django application
│   ├── api/                     # API app
│   │   ├── views/              # API endpoints
│   │   ├── utils/              # Utilities
│   │   ├── models.py           # Database models
│   │   ├── authentication.py   # JWT auth
│   │   └── urls.py             # API routes
│   ├── exam_proctoring/        # Django settings
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # Backend docs
│
├── src/                        # Frontend source
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   ├── student/           # Student dashboard components
│   │   ├── teacher/           # Teacher dashboard components
│   │   ├── ai/                # Alice AI Assistant components
│   │   ├── common/            # Shared components
│   │   ├── theme/             # Theme system components
│   │   ├── loaders/           # Loading components
│   │   └── ui/                # UI components
│   ├── pages/                 # Page components
│   │   ├── SimpleLandingPage.jsx  # Main landing page
│   │   ├── AuthPage.jsx       # Login/Register
│   │   ├── StudentDashboard.jsx   # Student portal
│   │   └── TeacherDashboard.jsx   # Teacher portal
│   ├── styles/                # CSS files
│   ├── utils/                 # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── contexts/              # React contexts
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
│
├── package.json               # Frontend dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── README.md                 # This file
```
         
## 🎨 Key Components

### Frontend Components

**Authentication:**

- `AuthPage.jsx` - Login/Register page
- `LoginForm.jsx` - Login form with demo credentials
- `RegisterForm.jsx` - Multi-step registration

**Student:**

- `StudentDashboard.jsx` - Main student page
- `QuizCodeEntry.jsx` - Enter quiz code
- `QuizInterface.jsx` - Take quiz with timer

**Teacher:**

- `TeacherDashboard.jsx` - Main teacher page
- `QuizList.jsx` - View all quizzes
- `QuizCreator.jsx` - Create new quiz
- `FlagMonitor.jsx` - Monitor violations

**Common:**

- `SimpleLandingPage.jsx` - Clean, modern landing page
- `FullPageLoader.jsx` - Loading screen
- `Footer.jsx` - Site footer
- `ScrollProgressBar.jsx` - Scroll indicator

### Backend Endpoints

**Authentication:**

- `POST /api/auth/register/` - Register user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user

**Quizzes:**

- `GET /api/quizzes/` - List quizzes
- `POST /api/quizzes/` - Create quiz
- `GET /api/quizzes/by-code/:code/` - Get by code
- `GET /api/quizzes/:id/` - Get quiz
- `PUT /api/quizzes/:id/` - Update quiz
- `DELETE /api/quizzes/:id/` - Delete quiz
- `POST /api/quizzes/:id/submit/` - Submit quiz

**Flags:**

- `GET /api/flags/` - List flags
- `POST /api/flags/` - Create flag
- `PUT /api/flags/:id/` - Update flag

**WebSocket:**

- `ws://localhost:8000/ws/monitoring/` - Real-time monitoring

## 🎯 Features in Detail

### Alice AI Assistant

- **Smart Conversations** - Natural language processing with Groq API
- **Demo Mode** - Works without API key for testing and development
- **Markdown Support** - Rich text formatting with code syntax highlighting
- **Floating Interface** - Easy access button on landing page
- **Conversation History** - Maintains context across messages
- **Responsive Design** - Optimized for desktop and mobile
- **Real-time Chat** - Instant responses with typing indicators

**Usage:**
1. Click the floating Alice AI button on the landing page
2. Enter your name when prompted (first time only)
3. Start chatting with Alice for help and support
4. Ask about exams, technical issues, or general questions

### AI Proctoring

- Face detection using face-api.js or OpenCV.js
- Multiple face detection
- Looking away detection
- Audio level monitoring
- Automatic violation flagging
- Flag aggregation (30-second window)
- Severity escalation

### Quiz System

- Multi-step quiz creation
- Question bank with 4 options
- Correct answer marking
- Timer with auto-submit
- Progress tracking
- Score calculation
- Submission history

### Monitoring

- Real-time flag updates
- Filter by severity
- Resolve violations
- Statistics dashboard
- Export capabilities

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing (12 rounds)
- Input validation and sanitization
- CORS configuration
- Rate limiting
- XSS prevention
- Secure headers

## 🎨 Design Features

- Clean, modern interface
- Responsive design for all devices
- Smooth hover effects
- Professional color scheme
- Fast loading times
- Optimized performance
- Accessibility compliant
- Mobile-first approach

## 📊 Performance

- **Lightweight Design** - Minimal animations for fast loading
- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Components loaded on demand
- **Efficient Rendering** - Optimized React components
- **Fast Build Times** - Vite for lightning-fast development
- **Clean Code** - Well-structured and maintainable
- **Modern Standards** - Latest web technologies

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Start MongoDB
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Port Already in Use

```bash
# Kill process on port
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### Camera/Audio Issues

- Ensure camera and microphone permissions are granted
- Check browser compatibility (Chrome/Firefox recommended)
- Verify HTTPS in production for media access
- Clear browser cache if issues persist

## 📝 License

MIT License

## 👥 Authors

**Alice Exam Proctor Team**
- Developed by: **Aditya Singh Rajput**

## 🙏 Acknowledgments

- **React** - For the amazing UI library
- **Tailwind CSS** - For utility-first CSS framework
- **Vite** - For lightning-fast build tool
- **Django** - For robust backend framework
- **Open Source Community** - For all the amazing tools

## 📞 Support

For issues or questions:

- Email: opg21139@gmail.com
- Documentation: Check the docs folder

## 🚀 Live Demo

Visit our live demo: [Alice Exam Proctor Demo](https://alice-exam-proctor.netlify.app)

**Demo Credentials:**
- Student: student1@example.com / password123
- Teacher: teacher1@example.com / password123

---

Made with ❤️ and modern web technologies by **Alice Team**
