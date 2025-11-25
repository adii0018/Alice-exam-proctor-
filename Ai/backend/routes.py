from fastapi import APIRouter, HTTPException
from models import ChatRequest, ChatResponse
from database import get_database
import os
from datetime import datetime
import uuid
from dotenv import load_dotenv
import httpx
from bson import ObjectId

load_dotenv()

chat_router = APIRouter()

# Use Groq API (free alternative)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "gsk_demo_key")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# In-memory storage as fallback
conversations_memory = {}

@chat_router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Get or create conversation
        if request.conversation_id:
            if request.conversation_id in conversations_memory:
                messages = conversations_memory[request.conversation_id].get("messages", [])
            else:
                messages = []
                conversation_id = request.conversation_id
        else:
            conversation_id = str(uuid.uuid4())
            messages = []
        
        # Add user message
        user_message = {
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat()
        }
        messages.append(user_message)
        
        # Prepare messages for API with system prompt
        system_prompt = {
            "role": "system",
            "content": """You are Alice, a helpful and friendly AI assistant. Your goal is to provide accurate, detailed, and useful information.

Key guidelines:
- Always provide helpful and accurate information
- When asked for links or resources, provide real, working URLs
- Format your responses clearly using markdown (headings, lists, code blocks, etc.)
- Be conversational and friendly
- If you mention a website or resource, include the actual URL
- Provide step-by-step explanations when needed
- Use examples to clarify complex topics
- Be honest if you don't know something

Remember: You CAN and SHOULD provide links, URLs, and web resources when relevant to help users."""
        }
        
        api_messages = [system_prompt] + [{"role": msg["role"], "content": msg["content"]} for msg in messages]
        
        # Call Groq API (free alternative to OpenAI)
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": api_messages,
                    "temperature": 0.7,
                    "max_tokens": 1500
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail=f"API Error: {response.text}")
            
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
        
        # Add assistant message
        assistant_message = {
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.utcnow().isoformat()
        }
        messages.append(assistant_message)
        
        # Create conversation title from first user message
        conversation_title = request.message[:60] + "..." if len(request.message) > 60 else request.message
        
        # Save to in-memory storage
        conversations_memory[conversation_id] = {
            "id": conversation_id,
            "title": conversation_title,
            "first_message": request.message,
            "messages": messages,
            "message_count": len(messages),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Try to save to MongoDB if available
        try:
            db = get_database()
            if db:
                if request.conversation_id:
                    await db.conversations.update_one(
                        {"_id": ObjectId(request.conversation_id)},
                        {
                            "$set": {
                                "messages": messages,
                                "updated_at": datetime.utcnow()
                            }
                        }
                    )
                else:
                    conversation_data = {
                        "_id": ObjectId(conversation_id),
                        "title": conversation_title,
                        "first_message": request.message,
                        "messages": messages,
                        "message_count": len(messages),
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                    await db.conversations.insert_one(conversation_data)
        except Exception as db_error:
            print(f"MongoDB save failed (using memory): {db_error}")
        
        return ChatResponse(response=ai_response, conversation_id=conversation_id)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    try:
        # Check memory first
        if conversation_id in conversations_memory:
            return conversations_memory[conversation_id]
        
        # Try MongoDB if available
        try:
            db = get_database()
            if db:
                conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
                if conversation:
                    conversation["id"] = str(conversation["_id"])
                    del conversation["_id"]
                    return conversation
        except Exception as db_error:
            print(f"MongoDB fetch failed: {db_error}")
        
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.get("/conversations")
async def get_all_conversations():
    try:
        # Return from memory first
        conversations = list(conversations_memory.values())
        
        # Try to get from MongoDB if available
        try:
            db = get_database()
            if db:
                async for conv in db.conversations.find().sort("updated_at", -1).limit(50):
                    conv["id"] = str(conv["_id"])
                    del conv["_id"]
                    # Add to memory if not already there
                    if conv["id"] not in conversations_memory:
                        conversations.append(conv)
        except Exception as db_error:
            print(f"MongoDB fetch failed (using memory): {db_error}")
        
        return sorted(conversations, key=lambda x: x.get("updated_at", ""), reverse=True)[:50]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.post("/user/create")
async def create_user(request: dict):
    try:
        db = get_database()
        name = request.get("name", "").strip()
        
        if not name:
            raise HTTPException(status_code=400, detail="Name is required")
        
        # Create user
        user_id = str(ObjectId())
        user_data = {
            "_id": ObjectId(user_id),
            "name": name,
            "created_at": datetime.utcnow(),
            "last_active": datetime.utcnow()
        }
        
        await db.users.insert_one(user_data)
        
        return {
            "user_id": user_id,
            "name": name,
            "message": "User created successfully"
        }
    
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
