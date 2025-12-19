# Deploy MetroFlex AI Agent to Railway (5 Minutes)

Your AI agent is **production-ready**! Here's how to deploy it:

## What's Ready

- Production Flask app ([AI_Agent/app.py](AI_Agent/app.py))
- Minimal dependencies (no ChromaDB conflicts!)
- Railway deployment config
- OpenAI GPT-4o-mini ($0.0005/chat)

## Deploy to Railway (Recommended - Free Tier Available)

### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub

### Step 2: Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select: `drive-brand-growth/MetroFlex-Events-AI-Agent`
3. Railway will auto-detect the Python app

### Step 3: Configure Environment
1. In Railway dashboard, click your service
2. Go to **Variables** tab
3. Add: `OPENAI_API_KEY` = `your-openai-api-key-from-.env-file`
   - Copy the key from `AI_Agent/.env` file on your computer

### Step 4: Set Root Directory
1. In **Settings** tab
2. Set **Root Directory**: `AI_Agent`
3. Railway will use `requirements-production.txt`

### Step 5: Deploy!
1. Railway automatically deploys
2. Wait 2-3 minutes for build
3. Copy your deployment URL (e.g., `https://metroflex-production.up.railway.app`)

### Step 6: Test Your Deployment
```bash
curl https://YOUR-RAILWAY-URL.railway.app/health
```

Should return:
```json
{"status": "healthy", "agent": "MetroFlex AI Assistant"}
```

### Step 7: Update Website
1. Open [index.html](index.html)
2. Find line 428: `WEBHOOK_URL: 'DEPLOY_BACKEND_FIRST'`
3. Change to: `WEBHOOK_URL: 'https://YOUR-RAILWAY-URL.railway.app/webhook'`
4. Save and push to GitHub

### Step 8: Test Live Chat Widget
1. Go to: https://drive-brand-growth.github.io/MetroFlex-Events-AI-Agent/
2. Click the ⚡ button (bottom right)
3. Ask: "What types of events do you specialize in?"
4. The AI should respond!

---

## Alternative: Deploy to Heroku

### Requirements
- Heroku account (free tier available)
- Heroku CLI installed

### Deploy Commands
```bash
cd ~/Desktop/MetroFlex-Events-AI-Agent/AI_Agent

# Login to Heroku
heroku login

# Create app
heroku create metroflex-ai-agent

# Set environment variable (use your actual key from AI_Agent/.env)
heroku config:set OPENAI_API_KEY=your-openai-api-key-here

# Deploy
git push heroku main

# Open your app
heroku open
```

---

## Cost Estimate (Railway Free Tier)

**Free Tier Includes:**
- $5/month credit
- 500 hours of runtime
- Perfect for testing!

**With Your OpenAI Key:**
- ~1,000 chats/month = $0.50
- Stays well under $5 free credit

**Production Scale:**
- 10,000 chats/month = $5 OpenAI + $5 Railway = $10/month total

---

## Troubleshooting

### Deployment Fails
- Check Railway logs for errors
- Verify `requirements-production.txt` is being used
- Ensure `AI_Agent` is set as root directory

### Agent Not Responding
- Check Railway logs: `railway logs`
- Verify OPENAI_API_KEY is set correctly
- Test health endpoint: `curl https://YOUR-URL/health`

### Chat Widget Shows Placeholder
- Make sure you updated `WEBHOOK_URL` in index.html
- Push changes to GitHub (GitHub Pages updates in 1-2 min)
- Clear browser cache and reload

---

## What You Get

 **Live Chat Widget** on https://drive-brand-growth.github.io/MetroFlex-Events-AI-Agent/
 **AI Assistant** powered by GPT-4o-mini
 **Knowledge Base** with all MetroFlex events, NPC rules, sponsors
 **Production API** at `/webhook` and `/webhook/chat` (for GHL)
 **Cost-Optimized** - 83% cheaper than GPT-4o

---

## Next Steps

1. Deploy to Railway (5 min)
2. Update website webhook URL
3. Test the live chat widget
4. Integrate with GoHighLevel (optional)
5. Monitor usage at [platform.openai.com/usage](https://platform.openai.com/usage)

**Questions?** Check the logs in Railway dashboard or test locally first with:
```bash
cd ~/Desktop/MetroFlex-Events-AI-Agent/AI_Agent
python3 app.py
```

Then open http://localhost:5000/health

---

**Your AI agent is production-ready with best practices!**
- No dependency conflicts
- Modern OpenAI API (v1.0+)
- Simple, fast keyword-based RAG
- Railway/Heroku deployment files included
- Environment variables protected (.gitignore)

Deploy now and get your chat widget working live! 🚀
