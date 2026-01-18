"""
LLM Provider Factory
Implements Abstract Factory pattern for creating LLM provider instances
"""

from typing import Optional
from .base import BaseLLMProvider
from .openai_provider import OpenAIProvider
from .groq_provider import GroqProvider
from .watsonx_provider import WatsonXProvider
import logging

logger = logging.getLogger(__name__)


class LLMProviderFactory:
    """
    Factory class for creating LLM provider instances.
    Supports OpenAI, Groq, and WatsonX providers.
    """
    
    # Supported provider types
    OPENAI = "openai"
    GROQ = "groq"
    WATSONX = "watsonx"
    
    @staticmethod
    def create_provider(
        provider_type: str,
        api_key: str,
        model: Optional[str] = None,
        **config
    ) -> BaseLLMProvider:
        """
        Create and return an LLM provider instance based on the provider type.
        
        Args:
            provider_type: Type of provider ('openai', 'groq', 'watsonx')
            api_key: API key for the provider
            model: Optional model name (uses default if not provided)
            **config: Additional provider-specific configuration
            
        Returns:
            BaseLLMProvider instance
            
        Raises:
            ValueError: If provider_type is not supported
            Exception: If provider initialization fails
        """
        provider_type = provider_type.lower().strip()
        
        logger.info(f"Creating LLM provider: {provider_type}")
        
        try:
            if provider_type == LLMProviderFactory.OPENAI:
                model = model or config.get('OPENAI_MODEL', 'gpt-3.5-turbo')
                provider = OpenAIProvider(
                    api_key=api_key,
                    model=model,
                    max_tokens=config.get('max_tokens', 500),
                    temperature=config.get('temperature', 0.7)
                )
                
            elif provider_type == LLMProviderFactory.GROQ:
                model = model or config.get('GROQ_MODEL', 'llama3-70b-8192')
                provider = GroqProvider(
                    api_key=api_key,
                    model=model,
                    max_tokens=config.get('max_tokens', 500),
                    temperature=config.get('temperature', 0.7)
                )
                
            elif provider_type == LLMProviderFactory.WATSONX:
                model = model or config.get('WATSONX_MODEL', 'ibm/granite-13b-chat-v2')
                project_id = config.get('WATSONX_PROJECT_ID')
                url = config.get('WATSONX_URL', 'https://us-south.ml.cloud.ibm.com')
                
                if not project_id:
                    raise ValueError("WatsonX requires WATSONX_PROJECT_ID in configuration")
                
                provider = WatsonXProvider(
                    api_key=api_key,
                    model=model,
                    project_id=project_id,
                    url=url,
                    max_tokens=config.get('max_tokens', 500),
                    temperature=config.get('temperature', 0.7)
                )
                
            else:
                raise ValueError(
                    f"Unsupported provider type: {provider_type}. "
                    f"Supported types: {LLMProviderFactory.OPENAI}, "
                    f"{LLMProviderFactory.GROQ}, {LLMProviderFactory.WATSONX}"
                )
            
            # Verify provider is available
            if not provider.is_available():
                raise Exception(f"{provider.get_provider_name()} provider is not properly configured")
            
            logger.info(f"Successfully created {provider.get_provider_name()} provider with model: {model}")
            return provider
            
        except Exception as e:
            logger.error(f"Failed to create provider {provider_type}: {str(e)}")
            raise
    
    @staticmethod
    def get_supported_providers() -> list:
        """
        Get list of supported provider types.
        
        Returns:
            List of supported provider names
        """
        return [
            LLMProviderFactory.OPENAI,
            LLMProviderFactory.GROQ,
            LLMProviderFactory.WATSONX
        ]
