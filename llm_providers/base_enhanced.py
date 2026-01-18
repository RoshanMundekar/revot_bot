"""
Enhanced Base Provider with Retry Logic and Better Error Handling
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any
import time
import logging

logger = logging.getLogger(__name__)


class BaseLLMProvider(ABC):
    """
    Abstract base class for LLM providers.
    All LLM provider implementations must inherit from this class.
    """
    
    def __init__(self, api_key: str, model: str, **config):
        """
        Initialize the LLM provider.
        
        Args:
            api_key: API key for authentication
            model: Model name/identifier
            **config: Additional provider-specific configuration
        """
        self.api_key = api_key
        self.model = model
        self.config = config
        self.max_retries = config.get('max_retries', 3)
        self.retry_delay = config.get('retry_delay', 1.0)
    
    @abstractmethod
    def generate_response(
        self,
        messages: List[Dict[str, str]],
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """
        Generate a response from the LLM.
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0-1)
            **kwargs: Additional provider-specific parameters
            
        Returns:
            Generated response text
            
        Raises:
            Exception: If API call fails
        """
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        """
        Get the name of the provider.
        
        Returns:
            Provider name string
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the provider is properly configured and available.
        
        Returns:
            True if provider is ready to use, False otherwise
        """
        pass
    
    def validate_messages(self, messages: List[Dict[str, str]]) -> bool:
        """
        Validate message format.
        
        Args:
            messages: List of message dictionaries
            
        Returns:
            True if valid, False otherwise
        """
        if not messages:
            return False
        
        for msg in messages:
            if not isinstance(msg, dict):
                return False
            if 'role' not in msg or 'content' not in msg:
                return False
            if msg['role'] not in ['system', 'user', 'assistant']:
                return False
            if not isinstance(msg['content'], str):
                return False
        
        return True
    
    def retry_on_failure(self, func, *args, **kwargs) -> Any:
        """
        Retry a function with exponential backoff.
        
        Args:
            func: Function to retry
            *args: Function arguments
            **kwargs: Function keyword arguments
            
        Returns:
            Function result
            
        Raises:
            Exception: If all retries fail
        """
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    wait_time = self.retry_delay * (2 ** attempt)  # Exponential backoff
                    logger.warning(
                        f"Attempt {attempt + 1} failed: {str(e)}. "
                        f"Retrying in {wait_time}s..."
                    )
                    time.sleep(wait_time)
                else:
                    logger.error(f"All {self.max_retries} attempts failed")
        
        raise last_exception
    
    def get_info(self) -> Dict[str, Any]:
        """
        Get provider information.
        
        Returns:
            Dictionary with provider details
        """
        return {
            "name": self.get_provider_name(),
            "model": self.model,
            "available": self.is_available(),
            "config": {
                "max_retries": self.max_retries,
                "retry_delay": self.retry_delay
            }
        }
