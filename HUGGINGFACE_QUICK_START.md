# 🚀 Quick Start: Hugging Face Integration for EchoVerse

## 🎯 Why Hugging Face over IBM Watson?

✅ **Easier Setup**: Just need one API token vs complex IBM Cloud setup  
✅ **Better Models**: Access to latest IBM Granite models on Hugging Face  
✅ **More Generous**: Better free tier limits  
✅ **Faster**: Direct API access without authentication overhead  

## ⚡ 3-Minute Setup

### 1. Get Your Hugging Face API Token (1 minute)

1. Go to [Hugging Face](https://huggingface.co/join) and create account
2. Visit [Settings → Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token" → Name it "EchoVerse" → Select "Read" access
4. Copy the token (starts with `hf_...`)

### 2. Configure EchoVerse (1 minute)

**Option A: Interactive Setup (Recommended)**
```bash
cd backend
python setup_huggingface.py
```

**Option B: Manual Setup**
Edit `backend/.env` file:
```bash
HUGGINGFACE_API_TOKEN=hf_your_actual_token_here
HUGGINGFACE_TEXT_MODEL=ibm-granite/granite-3.3-8b-instruct
HUGGINGFACE_TTS_MODEL=microsoft/speecht5_tts
```

### 3. Test Your Setup (1 minute)

```bash
cd backend
python test_huggingface_setup.py
```

### 4. Start EchoVerse

```bash
# Backend
cd backend
python app.py

# Frontend (new terminal)
cd ..
npm start
```

## 🤖 What You Get

### IBM Granite Models
- **`ibm-granite/granite-3.3-8b-instruct`**: Best instruction-following for text rewriting
- **Advanced AI**: Same models IBM uses internally
- **Multiple Tones**: Cheerful, inspiring, suspenseful, calm, and more

### High-Quality TTS
- **`microsoft/speecht5_tts`**: Microsoft's advanced text-to-speech
- **Natural Voices**: High-quality audio generation
- **Multiple Formats**: MP3 output for downloads

## 🆚 Comparison

| Feature | Hugging Face | IBM Watson |
|---------|-------------|------------|
| Setup Time | 3 minutes | 15+ minutes |
| API Token | 1 token | Multiple keys + project ID |
| Models | Latest IBM Granite | Older IBM models |
| Free Tier | Generous | Limited characters |
| Documentation | Excellent | Complex |

## 🔧 Available Models

### Text Generation (Choose one):
- **`ibm-granite/granite-3.3-8b-instruct`** ⭐ **Recommended**
- `ibm-granite/granite-speech-3.3-8b`
- `ibm-granite/granite-speech-3.3-2b`

### Text-to-Speech (Choose one):
- **`microsoft/speecht5_tts`** ⭐ **Recommended**
- `facebook/fastspeech2-en-ljspeech`
- `espnet/kan-bayashi_ljspeech_vits`

## 🧪 Testing Commands

```bash
# Test everything
python test_huggingface_setup.py

# Test specific features
python -c "from huggingface_service import hf_service; print(hf_service.rewrite_text('Hello world', 'cheerful'))"
```

## 🛠️ Troubleshooting

### "API token not configured"
- Check your `.env` file has `HUGGINGFACE_API_TOKEN=hf_...`
- Ensure token starts with `hf_`

### "Model loading failed"  
- Try different model (granite-speech-3.3-2b is faster)
- Check internet connection
- Wait a few minutes (models need to load)

### "TTS failed"
- Microsoft's TTS model might be loading
- Try alternative: `facebook/fastspeech2-en-ljspeech`

## 🎉 Success Indicators

When working correctly, you'll see:
- ✅ Text gets rewritten in different tones (not just prefixed)
- ✅ High-quality MP3 files are generated
- ✅ Downloads page shows real audio files
- ✅ Backend logs show "Hugging Face" success messages

## 💡 Pro Tips

1. **First Run**: Models may take 30-60 seconds to load initially
2. **Rate Limits**: Free tier has generous limits but not unlimited
3. **Model Selection**: granite-3.3-8b-instruct gives best text quality
4. **Backup**: Keep IBM Watson config as fallback

## 🔗 Useful Links

- [Get API Token](https://huggingface.co/settings/tokens)
- [IBM Granite Models](https://huggingface.co/collections/ibm-granite/granite-3-language-models-6759706c8f81b3ad8b9c8c0c)
- [Hugging Face Docs](https://huggingface.co/docs/api-inference/index)

---

**Ready in 3 minutes!** 🚀 Your EchoVerse will have professional AI capabilities with IBM's latest models.
