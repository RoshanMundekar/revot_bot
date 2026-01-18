"""
IBM WatsonX LLM Provider Implementation
"""

from typing import List, Dict, Optional
from ibm_watson_machine_learning.foundation_models import Model
from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
from .base import BaseLLMProvider
import logging

logger = logging.getLogger(__name__)


class WatsonXProvider(BaseLLMProvider):
    """
    IBM WatsonX provider for enterprise AI.
    Supports Granite, Llama, and other WatsonX models.
    """
    
    def __init__(
        self,
        api_key: str,
        model: str = "ibm/granite-13b-chat-v2",
        project_id: Optional[str] = None,
        url: str = "https://us-south.ml.cloud.ibm.com",
        **config
    ):
        """
        Initialize WatsonX provider.
        
        Args:
            api_key: WatsonX API key
            model: Model name (ibm/granite-13b-chat-v2, meta-llama/llama-3-70b-instruct, etc.)
            project_id: WatsonX project ID
            url: WatsonX API URL
            **config: Additional configuration
        """
        super().__init__(api_key, model, **config)
        self.project_id = project_id
        self.url = url
        
        # Initialize WatsonX model
        if api_key and project_id:
            try:
                credentials = {
                    "url": url,
                    "apikey": api_key
                }
                
                self.model_instance = Model(
                    model_id=model,
                    credentials=credentials,
                    project_id=project_id
                )
            except Exception as e:
                logger.error(f"Failed to initialize WatsonX model: {str(e)}")
                self.model_instance = None
        else:
            self.model_instance = None
    
    def generate_response(
        self,
        messages: List[Dict[str, str]],
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        **kwargs
    ) -> str:
        """
        Generate response using WatsonX API.
        
        Args:
            messages: Conversation messages
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature
            **kwargs: Additional WatsonX-specific parameters
            
        Returns:
            Generated response text
            
        Raises:
            Exception: If API call fails
        """
        if not self.model_instance:
            raise Exception("WatsonX model not initialized. Check API key and project ID.")
        
        if not self.validate_messages(messages):
            raise ValueError("Invalid message format")
        
        try:
            # Convert messages to prompt format
            prompt = self._messages_to_prompt(messages)
            
            # Set default values from config if not provided
            max_tokens = max_tokens or self.config.get('max_tokens', 500)
            temperature = temperature or self.config.get('temperature', 0.7)
            
            logger.info(f"Calling WatsonX API with model: {self.model}")
            
            # Set generation parameters
            parameters = {
                GenParams.MAX_NEW_TOKENS: max_tokens,
                GenParams.TEMPERATURE: temperature,
                GenParams.TOP_P: kwargs.get('top_p', 1.0),
                GenParams.TOP_K: kwargs.get('top_k', 50),
            }
            
            # Generate response
            response = self.model_instance.generate_text(
                prompt=prompt,
                params=parameters
            )
            
            logger.info(f"WatsonX response received: {len(response)} characters")
            
            return response
            
        except Exception as e:
            logger.error(f"WatsonX API error: {str(e)}")
            raise Exception(f"WatsonX API call failed: {str(e)}")
    
    def _messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        """
        Convert chat messages to a single prompt string.
        WatsonX uses text generation, not chat completion.
        
        Args:
            messages: List of message dictionaries
            
        Returns:
            Formatted prompt string
        """
        prompt_parts = []
        
        for msg in messages:
            role = msg['role']
            content = msg['content']
            
            if role == 'system':
                prompt_parts.append(f"System: {content}\n")
            elif role == 'user':
                prompt_parts.append(f"User: {content}\n")
            elif role == 'assistant':
                prompt_parts.append(f"Assistant: {content}\n")
        
        # Add final prompt for assistant to respond
        prompt_parts.append("Assistant:")
        
        return '\n'.join(prompt_parts)
    
    def get_provider_name(self) -> str:
        """Get provider name."""
        return "WatsonX"
    
    def is_available(self) -> bool:
        """Check if WatsonX provider is available."""
        return self.model_instance is not None and self.api_key is not None and self.project_id is not None
