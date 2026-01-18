# LLM Provider Switching Guide

## Quick Start Examples

### Example 1: Use OpenAI (GPT Models)

**.env file:**
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo
```

**Start server:**
```bash
python main.py
```

---

### Example 2: Use Groq (Ultra-Fast Llama/Mixtral)

**.env file:**
```env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL=llama3-70b-8192
```

**Start server:**
```bash
python main.py
```

---

### Example 3: Use WatsonX (IBM Enterprise AI)

**.env file:**
```env
LLM_PROVIDER=watsonx
WATSONX_API_KEY=xxxxxxxxxxxxx
WATSONX_PROJECT_ID=xxxxxxxxxxxxx
WATSONX_MODEL=ibm/granite-13b-chat-v2
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**Start server:**
```bash
python main.py
```

---

## Available Models

### OpenAI Models
- `gpt-3.5-turbo` - Fast, cost-effective
- `gpt-4` - Most capable
- `gpt-4-turbo` - Faster GPT-4
- `gpt-4o` - Latest multimodal model

### Groq Models
- `llama3-70b-8192` - Large Llama 3 (recommended)
- `llama3-8b-8192` - Small Llama 3 (faster)
- `mixtral-8x7b-32768` - Mixtral MoE
- `gemma-7b-it` - Google Gemma

### WatsonX Models
- `ibm/granite-13b-chat-v2` - IBM Granite (recommended)
- `meta-llama/llama-3-70b-instruct` - Meta Llama 3
- `mistralai/mixtral-8x7b-instruct-v01` - Mixtral
- `google/flan-ul2` - Google Flan-UL2

---

## Testing Each Provider

### Test Script

Create `test_providers.py`:

```python
import os
from llm_providers import LLMProviderFactory

def test_provider(provider_type, api_key, **config):
    """Test a specific LLM provider"""
    print(f"\n{'='*50}")
    print(f"Testing {provider_type.upper()} Provider")
    print(f"{'='*50}")
    
    try:
        # Create provider
        provider = LLMProviderFactory.create_provider(
            provider_type=provider_type,
            api_key=api_key,
            **config
        )
        
        print(f"✓ Provider initialized: {provider.get_provider_name()}")
        print(f"✓ Is available: {provider.is_available()}")
        
        # Test message
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say 'Hello from provider!'"}
        ]
        
        print("\nGenerating response...")
        response = provider.generate_response(messages)
        
        print(f"\n✓ Response received:")
        print(f"  {response}\n")
        print(f"✓ {provider_type.upper()} test PASSED!\n")
        
    except Exception as e:
        print(f"\n✗ {provider_type.upper()} test FAILED!")
        print(f"  Error: {str(e)}\n")

if __name__ == "__main__":
    # Load environment
    from dotenv import load_dotenv
    load_dotenv()
    
    # Test OpenAI
    if os.getenv("OPENAI_API_KEY"):
        test_provider(
            "openai",
            os.getenv("OPENAI_API_KEY"),
            OPENAI_MODEL=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        )
    
    # Test Groq
    if os.getenv("GROQ_API_KEY"):
        test_provider(
            "groq",
            os.getenv("GROQ_API_KEY"),
            GROQ_MODEL=os.getenv("GROQ_MODEL", "llama3-70b-8192")
        )
    
    # Test WatsonX
    if os.getenv("WATSONX_API_KEY") and os.getenv("WATSONX_PROJECT_ID"):
        test_provider(
            "watsonx",
            os.getenv("WATSONX_API_KEY"),
            WATSONX_MODEL=os.getenv("WATSONX_MODEL", "ibm/granite-13b-chat-v2"),
            WATSONX_PROJECT_ID=os.getenv("WATSONX_PROJECT_ID"),
            WATSONX_URL=os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
        )
```

**Run tests:**
```bash
python test_providers.py
```

---

## Getting API Keys

### OpenAI
1. Visit: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Groq
1. Visit: https://console.groq.com/keys
2. Click "Create API Key"
3. Copy the key (starts with `gsk_`)

### WatsonX
1. Visit: https://cloud.ibm.com/
2. Create Watson Machine Learning instance
3. Get API key from IBM Cloud IAM
4. Get Project ID from WatsonX project settings

---

## Cost Comparison

| Provider | Model | Cost (per 1M tokens) | Speed |
|----------|-------|---------------------|-------|
| OpenAI | GPT-3.5-Turbo | $0.50 / $1.50 | Fast |
| OpenAI | GPT-4 | $30 / $60 | Slow |
| Groq | Llama3-70B | Free (beta) | **Ultra-Fast** |
| Groq | Mixtral-8x7B | Free (beta) | **Ultra-Fast** |
| WatsonX | Granite-13B | Enterprise pricing | Medium |

*Groq is currently free during beta but may introduce pricing later*

---

## Troubleshooting

### Provider Not Found Error
```
ValueError: Unsupported provider type: xxx
```
**Solution:** Check `LLM_PROVIDER` in `.env` - must be: `openai`, `groq`, or `watsonx`

### API Key Not Configured
```
API key not found for provider: xxx
```
**Solution:** Set the correct API key:
- OpenAI: `OPENAI_API_KEY`
- Groq: `GROQ_API_KEY`
- WatsonX: `WATSONX_API_KEY`

### WatsonX Project ID Missing
```
WatsonX requires WATSONX_PROJECT_ID in configuration
```
**Solution:** Add `WATSONX_PROJECT_ID` to your `.env` file

### Rate Limit Errors
- OpenAI: Upgrade plan or reduce frequency
- Groq: Very high limits (100+ req/sec)
- WatsonX: Contact IBM support

---

## Best Practices

1. **Development:** Use Groq (free + fast)
2. **Production:** Use OpenAI GPT-3.5-Turbo (reliable + affordable)
3. **Enterprise:** Use WatsonX (compliance + support)
4. **High Quality:** Use OpenAI GPT-4 (best responses)

---

## Fallback Strategy (Advanced)

You can implement provider fallback in `main.py`:

```python
# Try multiple providers in order
providers_to_try = ['groq', 'openai', 'watsonx']

for provider_type in providers_to_try:
    try:
        llm_provider = LLMProviderFactory.create_provider(...)
        if llm_provider.is_available():
            logger.info(f"Using {provider_type}")
            break
    except:
        continue
```

This ensures your chatbot stays online even if one provider is down!
