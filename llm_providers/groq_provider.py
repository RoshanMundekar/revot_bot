"""
Groq LLM Provider Implementation
"""

from typing import List, Dict, Optional
from groq import Groq
from .base import BaseLLMProvider
import logging

logger = logging.getLogger(__name__)


class GroqProvider(BaseLLMProvider):
    """
    Groq provider for fast inference.
    Supports Llama, Mixtral, and other Groq-hosted models.
    """
    
    def __init__(self, api_key: str, model: str = "llama3-70b-8192", **config):
        """
        Initialize Groq provider.
        
        Args:
            api_key: Groq API key
            model: Model name (llama3-70b-8192, mixtral-8x7b-32768, etc.)
            **config: Additional configuration
        """
        super().__init__(api_key, model, **config)
        self.client = Groq(api_key=api_key) if api_key else None
    
    def generate_response(
        self,
        messages: List[Dict[str, str]],
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """
        Generate response using Groq API.
        
        Args:
            messages: Conversation messages
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
            **kwargs: Additional Groq-specific parameters
            
        Returns:
            Generated response text
            
        Raises:
            Exception: If API call fails
        """
        if not self.client:
            raise Exception("Groq client not initialized. Check API key.")
        
        if not self.validate_messages(messages):
            raise ValueError("Invalid message format")
        
        try:
            # Set default values from config if not provided
            max_tokens = max_tokens or self.config.get('max_tokens', 500)
            temperature = temperature or self.config.get('temperature', 0.7)
            
            logger.info(f"Calling Groq API with model: {self.model}")
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                **kwargs
            )
            
            reply = response.choices[0].message.content
            logger.info(f"Groq response received: {len(reply)} characters")
            
            return reply
            
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            raise Exception(f"Groq API call failed: {str(e)}")
    
    def get_provider_name(self) -> str:
        """Get provider name."""
        return "Groq"
    
    def is_available(self) -> bool:
        """Check if Groq provider is available."""
        return self.client is not None and self.api_key is not None
