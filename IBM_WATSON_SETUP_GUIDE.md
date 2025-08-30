# IBM Watson API Setup Guide for EchoVerse

This guide will help you obtain and configure IBM Watson API credentials for EchoVerse.

## 🚀 Step-by-Step Setup

### 1. Create IBM Cloud Account
1. Go to [IBM Cloud Registration](https://cloud.ibm.com/registration)
2. Sign up for a free account (no credit card required for Lite plan)
3. Verify your email and complete account setup

### 2. Create Watson Text to Speech Service

#### A. Navigate to the Service
1. Login to [IBM Cloud Console](https://cloud.ibm.com)
2. Click "Create resource" (blue button)
3. Search for "Text to Speech" 
4. Select "Text to Speech" service

#### B. Configure the Service
1. **Plan**: Select "Lite" (free tier - 10,000 characters/month)
2. **Region**: Choose "Dallas" or "Washington DC" (us-south/us-east)
3. **Service name**: Leave default or name it "echoverse-tts"
4. Click "Create"

#### C. Get Your Credentials
1. After creation, you'll be redirected to the service dashboard
2. Click "Service credentials" in the left sidebar
3. Click "New credential" → "Add"
4. Copy the generated credentials:
   ```json
   {
     "apikey": "your-tts-api-key-here",
     "iam_apikey_description": "...",
     "iam_apikey_name": "...",
     "iam_role_crn": "...",
     "iam_serviceid_crn": "...",
     "url": "https://api.us-south.text-to-speech.watson.cloud.ibm.com"
   }
   ```

### 3. Create Watsonx.ai Service

#### A. Navigate to Watsonx
1. In IBM Cloud Console, search for "watsonx"
2. Select "watsonx.ai" 
3. Click "Get started"

#### B. Configure Watsonx
1. **Plan**: Select "Lite" (free tier - limited but sufficient for development)
2. **Region**: Same as your TTS service
3. **Service name**: Leave default or name it "echoverse-watsonx"
4. Click "Create"

#### C. Get Your Credentials
1. Go to the watsonx.ai dashboard
2. Click "Manage" → "Access (IAM)"
3. Create an API key:
   - Click "API keys" → "Create"
   - Name: "EchoVerse API Key"
   - Copy the generated API key
4. Get your Project ID:
   - Go back to watsonx.ai dashboard
   - Create a new project or use existing
   - Copy the Project ID from project settings

### 4. Alternative: Using IBM Watson Assistant for LLM

If Watsonx.ai is not available in your region or plan:

1. Search for "Watson Assistant" in IBM Cloud
2. Create the service (Lite plan available)
3. Get API credentials similar to TTS
4. Use the Assistant API for text processing

## 🔧 Configuration Files

### Environment Variables (.env)
Create a `.env` file in the backend folder with your credentials:

```bash
# IBM Watson Text-to-Speech Configuration  
TTS_API_KEY=your_actual_tts_api_key_here
TTS_URL=https://api.us-south.text-to-speech.watson.cloud.ibm.com

# IBM Watsonx LLM Configuration
WATSONX_API_KEY=your_actual_watsonx_api_key_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_PROJECT_ID=your_actual_project_id_here

# Database Configuration (already configured)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=echoverse
DB_USERNAME=echoverse
DB_PASSWORD=your_mysql_password_here
```

## 🧪 Testing Your Setup

### Test TTS Service
```python
from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

authenticator = IAMAuthenticator('your_tts_api_key')
tts = TextToSpeechV1(authenticator=authenticator)
tts.set_service_url('your_tts_url')

# Test synthesis
response = tts.synthesize(
    text='Hello, this is a test',
    voice='en-US_LisaV3Voice',
    accept='audio/mp3'
)

print("TTS Test:", "Success" if response.status_code == 200 else "Failed")
```

### Test Watsonx Service
```python
import requests

url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation"
headers = {
    "Authorization": f"Bearer {your_access_token}",
    "Content-Type": "application/json"
}

# Test generation
response = requests.post(url, headers=headers, json={
    "input": "Test input",
    "model_id": "ibm/granite-13b-chat-v2",
    "project_id": "your_project_id"
})

print("Watsonx Test:", "Success" if response.status_code == 200 else "Failed")
```

## 📋 Quick Checklist

- [ ] IBM Cloud account created
- [ ] Text to Speech service created
- [ ] TTS API key and URL obtained
- [ ] Watsonx.ai service created  
- [ ] Watsonx API key and Project ID obtained
- [ ] .env file created with all credentials
- [ ] Services tested successfully

## 🆘 Troubleshooting

### Common Issues:
1. **Service not available in region**: Try different regions (us-south, us-east, eu-gb)
2. **Quota exceeded**: Check usage in IBM Cloud dashboard
3. **Authentication errors**: Verify API keys are correct and not expired
4. **URL format**: Ensure URLs match the format shown above

### Getting Help:
- [IBM Cloud Support](https://cloud.ibm.com/unifiedsupport/supportcenter)
- [Watson Documentation](https://cloud.ibm.com/docs/text-to-speech)
- [Watsonx.ai Documentation](https://cloud.ibm.com/docs/watsonx)

## 💡 Pro Tips

1. **Free Tier Limits**: 
   - TTS: 10,000 characters/month
   - Watsonx: Limited requests (check current quotas)

2. **Cost Management**: Monitor usage in IBM Cloud billing dashboard

3. **Security**: Never commit API keys to git repositories

4. **Development**: Use separate services for dev/prod environments
