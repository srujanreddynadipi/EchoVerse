# 🤗 Hugging Face API Setup Guide for EchoVerse

This guide will help you integrate Hugging Face APIs using IBM Granite models for EchoVerse.

## 🚀 Available IBM Models on Hugging Face

Based on your access, you have these excellent IBM models:

### Text Generation Models:
- **`ibm-granite/granite-3.3-8b-instruct`** - Best for text rewriting with instructions
- **`ibm-granite/granite-speech-3.3-8b`** - Optimized for speech-related tasks
- **`ibm-granite/granite-speech-3.3-2b`** - Lighter version for faster processing

### Text-to-Speech:
- We'll use popular TTS models like **`facebook/fastspeech2-en-ljspeech`** or **`microsoft/speecht5_tts`**

## 📋 Step-by-Step Setup

### 1. Get Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/join)
2. Create account or login
3. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
4. Click "New token" → "Read" access is sufficient
5. Copy your token (starts with `hf_...`)

### 2. Model Selection Strategy

**For Text Rewriting**: `ibm-granite/granite-3.3-8b-instruct`
- Best instruction-following capability
- Excellent for tone-based text rewriting
- Good balance of quality and speed

**For Text-to-Speech**: `microsoft/speecht5_tts`
- High-quality voice synthesis
- Multiple voice options
- Good compatibility with Hugging Face Inference API

### 3. Free Tier Limits

**Hugging Face Inference API (Free)**:
- Rate limited but generous for development
- No character limits like IBM Watson
- Can upgrade to Pro for higher limits

## 🛠️ Implementation Details

### Environment Variables:
```bash
# Hugging Face Configuration
HUGGINGFACE_API_TOKEN=hf_your_token_here
HUGGINGFACE_TEXT_MODEL=ibm-granite/granite-3.3-8b-instruct
HUGGINGFACE_TTS_MODEL=microsoft/speecht5_tts
```

### API Endpoints:
- **Text Generation**: `https://api-inference.huggingface.co/models/{model_name}`
- **Text-to-Speech**: `https://api-inference.huggingface.co/models/{tts_model}`

## 🎯 Benefits Over IBM Watson

1. **Easier Setup**: Just need API token, no complex IBM Cloud setup
2. **Better Models**: Access to latest IBM Granite models
3. **Cost Effective**: Generous free tier
4. **Community**: Large ecosystem and support

Let's implement this integration!
