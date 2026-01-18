"""
Abstract Base Class for LLM Providers
Defines the interface that all LLM providers must implement
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional


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
        
        return True
