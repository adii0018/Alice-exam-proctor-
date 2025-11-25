"""
AI Assistant Views - Alice AI chat functionality
"""
import json
import uuid
import httpx
import os
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "gsk_demo_key")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# In-memory storage for conversations (can be moved to database later)
conversations_memory = {}

@csrf_exempt
@require_http_methods(["POST"])
def chat(request):
    """
    Handle chat messages with Alice AI
    """
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()
        conversation_id = data.get('conversation_id')
        user_id = data.get('user_id')
        
        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Get or create conversation
        if conversation_id and conversation_id in conversations_memory:
            messages = conversations_memory[conversation_id].get("messages", [])
        else:
            conversation_id = str(uuid.uuid4())
            messages = []
        
        # Add user message
        user_message = {
            "role": "user",
            "content": message,
            "timestamp": datetime.now().isoformat()
        }
        messages.append(user_message)
        
        # Prepare messages for API with system prompt
        system_prompt = {
            "role": "system",
            "content": """You are Alice, a helpful and friendly AI assistant integrated into an exam proctoring system. Your goal is to provide accurate, detailed, and useful information.

Key guidelines:
- Always provide helpful and accurate information
- When asked for links or resources, provide real, working URLs
- Format your responses clearly using markdown (headings, lists, code blocks, etc.)
- Be conversational and friendly
- If you mention a website or resource, include the actual URL
- Provide step-by-step explanations when needed
- Use examples to clarify complex topics
- Be honest if you don't know something
- Help users with exam-related questions, technical support, and general inquiries
- Maintain a professional yet approachable tone

Remember: You CAN and SHOULD provide links, URLs, and web resources when relevant to help users."""
        }
        
        api_messages = [system_prompt] + [{"role": msg["role"], "content": msg["content"]} for msg in messages]
        
        # Call Groq API or use demo response
        if GROQ_API_KEY and GROQ_API_KEY != "gsk_demo_key":
            try:
                import asyncio
                response = asyncio.run(call_groq_api(api_messages))
                ai_response = response
            except Exception as api_error:
                print(f"Groq API error: {api_error}")
                ai_response = "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment."
        else:
            # Demo response when no API key is configured
            ai_response = f"""Hello! I'm Alice, your AI assistant. 

I see you said: "{message}"

I'm currently running in demo mode. To enable full AI functionality, please:

1. Get a free API key from [Groq](https://console.groq.com/)
2. Add it to your Django backend `.env` file as `GROQ_API_KEY=your_key_here`
3. Restart the Django server

**What I can help you with:**
- 🎓 Exam and study guidance
- 💻 Technical support
- 📚 Educational resources
- ❓ General questions and assistance

**Features:**
- Real-time chat interface
- Markdown formatting support
- Code syntax highlighting
- Conversation history

Feel free to ask me anything! Even in demo mode, I can provide helpful responses."""
        
        # Add assistant message
        assistant_message = {
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.now().isoformat()
        }
        messages.append(assistant_message)
        
        # Create conversation title from first user message
        conversation_title = message[:60] + "..." if len(message) > 60 else message
        
        # Save to in-memory storage
        conversations_memory[conversation_id] = {
            "id": conversation_id,
            "title": conversation_title,
            "first_message": message,
            "messages": messages,
            "message_count": len(messages),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "user_id": user_id
        }
        
        return JsonResponse({
            'response': ai_response,
            'conversation_id': conversation_id,
            'status': 'success'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)

async def call_groq_api(messages):
    """
    Call Groq API asynchronously
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1500
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"API Error: {response.text}")
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
            
    except Exception as e:
        raise Exception(f"Groq API call failed: {str(e)}")

@csrf_exempt
@require_http_methods(["GET"])
def get_conversation(request, conversation_id):
    """
    Get a specific conversation
    """
    try:
        if conversation_id in conversations_memory:
            return JsonResponse(conversations_memory[conversation_id])
        else:
            return JsonResponse({'error': 'Conversation not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_conversations(request):
    """
    Get all conversations
    """
    try:
        conversations = list(conversations_memory.values())
        # Sort by updated_at in descending order
        conversations.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
        return JsonResponse({'conversations': conversations[:50]})  # Limit to 50 recent conversations
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_user(request):
    """
    Create a user for AI chat (simple version)
    """
    try:
        data = json.loads(request.body)
        name = data.get('name', '').strip()
        
        if not name:
            return JsonResponse({'error': 'Name is required'}, status=400)
        
        # Generate a simple user ID
        user_id = str(uuid.uuid4())
        
        return JsonResponse({
            'user_id': user_id,
            'name': name,
            'message': 'User created successfully'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print(f"Create user error: {str(e)}")  # Debug logging
        return JsonResponse({'error': 'Internal server error'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def ai_health_check(request):
    """
    Health check for AI service
    """
    return JsonResponse({
        'status': 'healthy',
        'service': 'Alice AI Assistant',
        'timestamp': datetime.now().isoformat()
    })