"""
Configuration validator for LLM providers
Ensures all required environment variables are set correctly
"""

import os
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


class ConfigValidator:
    """Validates LLM provider configuration"""
    
    REQUIRED_VARS = {
        'openai': ['OPENAI_API_KEY'],
        'groq': ['GROQ_API_KEY'],
        'watsonx': ['WATSONX_API_KEY', 'WATSONX_PROJECT_ID']
    }
    
    OPTIONAL_VARS = {
        'openai': ['OPENAI_MODEL'],
        'groq': ['GROQ_MODEL'],
        'watsonx': ['WATSONX_MODEL', 'WATSONX_URL']
    }
    
    @staticmethod
    def validate_provider_config(provider_type: str) -> Tuple[bool, List[str]]:
        """
        Validate configuration for a specific provider.
        
        Args:
            provider_type: Provider type (openai, groq, watsonx)
            
        Returns:
            Tuple of (is_valid, missing_vars)
        """
        provider_type = provider_type.lower()
        
        if provider_type not in ConfigValidator.REQUIRED_VARS:
            return False, [f"Unknown provider: {provider_type}"]
        
        missing_vars = []
        required = ConfigValidator.REQUIRED_VARS[provider_type]
        
        for var in required:
            if not os.getenv(var):
                missing_vars.append(var)
        
        is_valid = len(missing_vars) == 0
        
        return is_valid, missing_vars
    
    @staticmethod
    def validate_all_configs() -> Dict[str, Dict]:
        """
        Validate all provider configurations.
        
        Returns:
            Dictionary with validation results for each provider
        """
        results = {}
        
        for provider in ['openai', 'groq', 'watsonx']:
            is_valid, missing = ConfigValidator.validate_provider_config(provider)
            results[provider] = {
                'valid': is_valid,
                'missing_vars': missing,
                'configured': is_valid
            }
        
        return results
    
    @staticmethod
    def get_config_summary() -> str:
        """
        Get a human-readable configuration summary.
        
        Returns:
            Formatted string with configuration status
        """
        results = ConfigValidator.validate_all_configs()
        
        summary = ["LLM Provider Configuration Status:", "="*50]
        
        for provider, status in results.items():
            icon = "✓" if status['valid'] else "✗"
            summary.append(f"{icon} {provider.upper()}: {'Configured' if status['valid'] else 'Not configured'}")
            if status['missing_vars']:
                summary.append(f"   Missing: {', '.join(status['missing_vars'])}")
        
        summary.append("="*50)
        
        return "\n".join(summary)


def validate_environment() -> bool:
    """
    Validate environment configuration at startup.
    
    Returns:
        True if at least one provider is configured
    """
    logger.info("Validating environment configuration...")
    
    results = ConfigValidator.validate_all_configs()
    configured_count = sum(1 for r in results.values() if r['valid'])
    
    if configured_count == 0:
        logger.error("No LLM providers are configured!")
        logger.error(ConfigValidator.get_config_summary())
        return False
    
    logger.info(f"{configured_count} provider(s) configured")
    logger.info(ConfigValidator.get_config_summary())
    
    return True
