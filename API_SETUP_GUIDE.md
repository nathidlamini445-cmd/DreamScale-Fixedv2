# 🔑 API Setup Guide for DreamScale

## Quick Fix for API Issues

If you're seeing generic responses or "fallback analysis" messages, you need to set up your Gemini API key.

### Step 1: Get Your Free API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Add to Your Environment

Create a `.env.local` file in your project root with:

```bash
# DreamScale Environment Variables
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=8192
GEMINI_TEMPERATURE=0.8
```

### Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## What This Fixes

✅ **Real AI Analysis**: Get comprehensive, intelligent competitive analysis  
✅ **No More Generic Responses**: Detailed, personalized insights  
✅ **Full Content**: Complete analysis without truncation  
✅ **Better Quality**: Professional-grade business intelligence  

## Troubleshooting

### Still Getting Generic Responses?
- Check that your `.env.local` file is in the project root
- Verify the API key is correct (no extra spaces)
- Restart the development server after adding the key
- Check the browser console for error messages

### API Key Not Working?
- Make sure you're using the correct key from Google AI Studio
- Check that the key has proper permissions
- Try generating a new key if the current one doesn't work

## Cost Information

- **Free Tier**: 15 requests per minute, 1 million tokens per day
- **Perfect for Development**: No credit card required for free tier
- **Production Ready**: Scale up as needed

---

**Need Help?** Check the browser console for detailed error messages and API status indicators.
