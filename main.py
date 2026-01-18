"""
FastAPI Chatbot Backend
Provides API endpoint for chatbot widget to communicate with multiple LLM providers
Supports: OpenAI, Groq, WatsonX (configurable via environment variables)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm_providers import LLMProviderFactory
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging with better format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Chatbot API",
    description="Backend API for embeddable chatbot widget with multi-LLM support",
    version="2.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM Provider using Factory Pattern
llm_provider = None

try:
    provider_type = os.getenv("LLM_PROVIDER", "openai").lower()
    
    # Get provider-specific configuration
    config = {
        'OPENAI_MODEL': os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
        'GROQ_MODEL': os.getenv('GROQ_MODEL', 'llama3-70b-8192'),
        'WATSONX_MODEL': os.getenv('WATSONX_MODEL', 'ibm/granite-13b-chat-v2'),
        'WATSONX_PROJECT_ID': os.getenv('WATSONX_PROJECT_ID'),
        'WATSONX_URL': os.getenv('WATSONX_URL', 'https://us-south.ml.cloud.ibm.com'),
        'max_tokens': int(os.getenv('MAX_TOKENS', '500')),
        'temperature': float(os.getenv('TEMPERATURE', '0.7'))
    }
    
    # Get API key based on provider type
    if provider_type == 'openai':
        api_key = os.getenv('OPENAI_API_KEY')
    elif provider_type == 'groq':
        api_key = os.getenv('GROQ_API_KEY')
    elif provider_type == 'watsonx':
        api_key = os.getenv('WATSONX_API_KEY')
    else:
        api_key = None
    
    if not api_key:
        logger.warning(f"API key not found for provider: {provider_type}")
    else:
        llm_provider = LLMProviderFactory.create_provider(
            provider_type=provider_type,
            api_key=api_key,
            **config
        )
        logger.info(f"Successfully initialized {llm_provider.get_provider_name()} provider")
        
except Exception as e:
    logger.error(f"Failed to initialize LLM provider: {str(e)}")
    llm_provider = None

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []

class ChatResponse(BaseModel):
    reply: str
    success: bool
    error: str = None

@app.get("/")
async def root():
    """Health check endpoint"""
    provider_info = {
        "provider": llm_provider.get_provider_name() if llm_provider else "Not configured",
        "model": llm_provider.model if llm_provider else "N/A",
        "available": llm_provider.is_available() if llm_provider else False
    } if llm_provider else None
    
    return {
        "status": "online",
        "message": "Chatbot API is running",
        "version": "2.0.0",
        "llm_provider": provider_info
    }

@app.get("/api/providers")
async def list_providers():
    """List all supported providers"""
    from llm_providers import LLMProviderFactory
    return {
        "supported_providers": LLMProviderFactory.get_supported_providers(),
        "current_provider": llm_provider.get_provider_name() if llm_provider else None
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Handle chat requests from the widget
    
    Args:
        request: ChatRequest containing user message and conversation history
        
    Returns:
        ChatResponse with AI-generated reply
    """
    try:
        # Validate LLM provider
        if not llm_provider:
            raise HTTPException(
                status_code=500,
                detail=f"LLM provider not configured. Please set LLM_PROVIDER and corresponding API key in .env file"
            )
        
        # Validate message
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )
        
        logger.info(f"Received chat request: {request.message[:50]}... (Provider: {llm_provider.get_provider_name()})")
        
        # Prepare conversation history
        messages = [
            {
                "role": "system",
                "content": "You are a helpful, friendly AI assistant embedded in a website chatbot. Provide concise, helpful responses."
            }
        ]
        
        # Add conversation history if provided
        if request.conversation_history:
            messages.extend(request.conversation_history)
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Generate response using LLM provider
        reply = llm_provider.generate_response(messages)
        
        logger.info(f"Generated reply: {reply[:50]}... from {llm_provider.get_provider_name()}")
        
        return ChatResponse(
            reply=reply,
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        return ChatResponse(
            reply="I'm sorry, I encountered an error processing your request. Please try again.",
            success=False,
            error=str(e)
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
