"""
OpenAI LLM Provider Implementation
"""

from typing import List, Dict, Optional
from openai import OpenAI
from .base import BaseLLMProvider
import logging

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseLLMProvider):
    """
    OpenAI GPT models provider.
    Supports GPT-3.5, GPT-4, and other OpenAI models.
    """
    
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo", **config):
        """
        Initialize OpenAI provider.
        
        Args:
            api_key: OpenAI API key
            model: Model name (gpt-3.5-turbo, gpt-4, etc.)
            **config: Additional configuration
        """
        super().__init__(api_key, model, **config)
        self.client = OpenAI(api_key=api_key) if api_key else None
    
    def generate_response(
        self,
        messages: List[Dict[str, str]],
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """
        Generate response using OpenAI API.
        
        Args:
            messages: Conversation messages
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
            **kwargs: Additional OpenAI-specific parameters
            
        Returns:
            Generated response text
            
        Raises:
            Exception: If API call fails
        """
        if not self.client:
            raise Exception("OpenAI client not initialized. Check API key.")
        
        if not self.validate_messages(messages):
            raise ValueError("Invalid message format")
        
        try:
            # Set default values from config if not provided
            max_tokens = max_tokens or self.config.get('max_tokens', 500)
            temperature = temperature or self.config.get('temperature', 0.7)
            
            logger.info(f"Calling OpenAI API with model: {self.model}")
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                **kwargs
            )
            
            reply = response.choices[0].message.content
            logger.info(f"OpenAI response received: {len(reply)} characters")
            
            return reply
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise Exception(f"OpenAI API call failed: {str(e)}")
    
    def get_provider_name(self) -> str:
        """Get provider name."""
        return "OpenAI"
    
    def is_available(self) -> bool:
        """Check if OpenAI provider is available."""
        return self.client is not None and self.api_key is not None
