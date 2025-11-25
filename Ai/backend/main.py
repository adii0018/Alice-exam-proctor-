from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import certifi

from routes import chat_router
from database import db

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup - Connect to MongoDB
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DATABASE_NAME", "alice_ai_db")
    
    # Connect to MongoDB with proper SSL certificate
    db.client = AsyncIOMotorClient(
        mongodb_url,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000
    )
    db.database = db.client[db_name]
    
    print(f"✅ Connected to MongoDB: {db_name}")
    
    yield
    
    # Shutdown - Close MongoDB connection
    db.client.close()
    print("❌ Disconnected from MongoDB")

app = FastAPI(title="Alice AI API", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://192.168.29.218:5173",
        "https://*.vercel.app",  # Allow all Vercel deployments
        os.getenv("FRONTEND_URL", "")  # Add your specific frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Chat Agent API is running"}

# For Vercel serverless deployment
app_handler = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
