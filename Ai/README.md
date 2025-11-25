# AI Chat Agent

Full-stack AI chat application with React + Vite frontend and FastAPI backend.

## Project Structure
```
├── backend/          # FastAPI + MongoDB + OpenAI
├── frontend/         # React + Vite
└── README.md
```

## Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Create .env file with your OpenAI API key
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend `.env`:
```
OPENAI_API_KEY=your_api_key_here
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ai_chat_db
```

## Features
- Real-time chat with AI
- Conversation history
- MongoDB storage
- OpenAI GPT integration
- Modern React UI
