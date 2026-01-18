"""
Test script for LLM providers
Tests OpenAI, Groq, and WatsonX providers
"""

import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_providers import LLMProviderFactory


def test_provider(provider_type, api_key, **config):
    """Test a specific LLM provider"""
    print(f"\n{'='*60}")
    print(f"Testing {provider_type.upper()} Provider")
    print(f"{'='*60}")
    
    try:
        # Create provider
        print(f"Creating provider...")
        provider = LLMProviderFactory.create_provider(
            provider_type=provider_type,
            api_key=api_key,
            **config
        )
        
        print(f"✓ Provider initialized: {provider.get_provider_name()}")
        print(f"✓ Model: {provider.model}")
        print(f"✓ Is available: {provider.is_available()}")
        
        # Test message
        messages = [
            {"role": "system", "content": "You are a helpful assistant. Keep responses under 50 words."},
            {"role": "user", "content": "Say hello and tell me which AI model you are."}
        ]
        
        print("\n📤 Sending test message...")
        response = provider.generate_response(messages)
        
        print(f"\n📥 Response received ({len(response)} characters):")
        print(f"   \"{response}\"\n")
        print(f"✅ {provider_type.upper()} test PASSED!\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ {provider_type.upper()} test FAILED!")
        print(f"   Error: {str(e)}\n")
        return False


def main():
    """Run tests for all configured providers"""
    # Load environment
    load_dotenv()
    
    print("\n" + "="*60)
    print("LLM PROVIDER TEST SUITE")
    print("="*60)
    
    results = {}
    
    # Test OpenAI
    print("\n[1/3] Testing OpenAI...")
    if os.getenv("OPENAI_API_KEY"):
        results['openai'] = test_provider(
            "openai",
            os.getenv("OPENAI_API_KEY"),
            OPENAI_MODEL=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            max_tokens=100,
            temperature=0.7
        )
    else:
        print("⚠️  OPENAI_API_KEY not found - skipping OpenAI test\n")
        results['openai'] = None
    
    # Test Groq
    print("\n[2/3] Testing Groq...")
    if os.getenv("GROQ_API_KEY"):
        results['groq'] = test_provider(
            "groq",
            os.getenv("GROQ_API_KEY"),
            GROQ_MODEL=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
            max_tokens=100,
            temperature=0.7
        )
    else:
        print("⚠️  GROQ_API_KEY not found - skipping Groq test\n")
        results['groq'] = None
    
    # Test WatsonX
    print("\n[3/3] Testing WatsonX...")
    if os.getenv("WATSONX_API_KEY") and os.getenv("WATSONX_PROJECT_ID"):
        results['watsonx'] = test_provider(
            "watsonx",
            os.getenv("WATSONX_API_KEY"),
            WATSONX_MODEL=os.getenv("WATSONX_MODEL", "ibm/granite-13b-chat-v2"),
            WATSONX_PROJECT_ID=os.getenv("WATSONX_PROJECT_ID"),
            WATSONX_URL=os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
            max_tokens=100,
            temperature=0.7
        )
    else:
        print("⚠️  WATSONX_API_KEY or WATSONX_PROJECT_ID not found - skipping WatsonX test\n")
        results['watsonx'] = None
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for provider, result in results.items():
        if result is None:
            status = "⚠️  SKIPPED (no API key)"
        elif result:
            status = "✅ PASSED"
        else:
            status = "❌ FAILED"
        print(f"{provider.upper():12} {status}")
    
    print("\n" + "="*60)
    
    # Exit code
    passed = sum(1 for r in results.values() if r is True)
    failed = sum(1 for r in results.values() if r is False)
    
    if failed > 0:
        print(f"\n❌ {failed} test(s) failed")
        sys.exit(1)
    elif passed == 0:
        print(f"\n⚠️  No tests run - please configure API keys in .env file")
        sys.exit(2)
    else:
        print(f"\n✅ All {passed} test(s) passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()
