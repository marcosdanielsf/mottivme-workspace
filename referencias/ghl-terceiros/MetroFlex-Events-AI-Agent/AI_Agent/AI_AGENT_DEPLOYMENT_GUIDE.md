# MetroFlex AI Agent - Deployment Guide

Complete guide to deploying the MetroFlex Events AI Assistant with RAG capabilities.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing](#local-testing)
3. [Deployment Options](#deployment-options)
4. [GHL Integration](#ghl-integration)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts & API Keys

1. **OpenAI API Key**
   - Sign up at: https://platform.openai.com
   - Navigate to: API Keys → Create new secret key
   - Cost: ~$0.002 per chat interaction (GPT-4)
   - Recommended budget: $50/month for moderate usage

2. **Deployment Platform** (choose one):
   - **Heroku** (easiest): https://www.heroku.com
   - **AWS Lambda** (cheapest): https://aws.amazon.com
   - **DigitalOcean** (best performance): https://www.digitalocean.com
   - **Railway** (modern): https://railway.app

3. **GoHighLevel Account**
   - Access to Settings → Custom Code section
   - Ability to add footer tracking code

### System Requirements

- Python 3.9 or higher
- pip (Python package manager)
- Git (for version control)
- 512MB RAM minimum (2GB recommended)

---

## Local Testing

### Step 1: Install Dependencies

```bash
cd /Users/noelpena/Desktop/CircuitOS_Local_Complete_Package/Active/metroflex-ghl-website/AI_Agent

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `AI_Agent` directory:

```bash
# .env file
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

**IMPORTANT**: Never commit `.env` to Git. Add to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### Step 3: Update Agent to Use Environment Variables

The agent is already configured to read from environment variables. Verify line 340 in `metroflex_ai_agent.py`:

```python
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")
```

### Step 4: Run Locally

```bash
python metroflex_ai_agent.py
```

Expected output:
```
🚀 MetroFlex AI Agent starting...
✅ Vector database built with 100+ documents
📊 Vector database ready
💬 Chat endpoint: POST /webhook/chat
❤️  Health check: GET /health
 * Running on http://0.0.0.0:5000
```

### Step 5: Test Health Check

Open browser to: `http://localhost:5000/health`

Expected response:
```json
{
  "status": "healthy",
  "agent": "MetroFlex AI Assistant"
}
```

### Step 6: Test Chat Endpoint

Use Postman, curl, or Python requests:

```bash
curl -X POST http://localhost:5000/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "message": "What are the weight classes for Classic Physique?",
    "conversation_id": "test_conv_1"
  }'
```

Expected response:
```json
{
  "success": true,
  "response": "Classic Physique division uses height-to-weight ratios. For example, if you're 5'10\" to 5'11\", the maximum weight is 202 lbs...",
  "timestamp": "2025-01-15T10:30:00.123456"
}
```

---

## Deployment Options

### Option 1: Heroku (Easiest for Beginners)

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli

#### Steps

1. **Create `Procfile`** (tells Heroku how to run the app):

```bash
echo "web: gunicorn metroflex_ai_agent:app" > Procfile
```

2. **Create `runtime.txt`** (specifies Python version):

```bash
echo "python-3.11.0" > runtime.txt
```

3. **Initialize Git repository** (if not already):

```bash
git init
git add .
git commit -m "Initial commit - MetroFlex AI Agent"
```

4. **Create Heroku app**:

```bash
heroku create metroflex-ai-agent
```

5. **Set environment variables**:

```bash
heroku config:set OPENAI_API_KEY=sk-proj-xxxxxxxxxx
```

6. **Deploy**:

```bash
git push heroku main
```

7. **Verify deployment**:

```bash
heroku logs --tail
```

Your agent is now live at: `https://metroflex-ai-agent.herokuapp.com`

#### Update Webhook URL in Chat Widget

Edit `GHL_CHAT_WIDGET.html` line 395:

```javascript
WEBHOOK_URL: 'https://metroflex-ai-agent.herokuapp.com/webhook/chat',
```

---

### Option 2: DigitalOcean (Best Performance)

#### Prerequisites
- DigitalOcean account
- SSH key configured

#### Steps

1. **Create Droplet**:
   - Go to: https://cloud.digitalocean.com/droplets/new
   - Choose: Ubuntu 22.04 LTS
   - Plan: Basic ($6/month - 1GB RAM)
   - Region: Closest to your users (Dallas/Texas recommended)
   - Authentication: SSH key
   - Click "Create Droplet"

2. **SSH into server**:

```bash
ssh root@your-droplet-ip
```

3. **Install dependencies**:

```bash
apt update
apt install python3-pip python3-venv nginx -y
```

4. **Create application directory**:

```bash
mkdir -p /var/www/metroflex-ai-agent
cd /var/www/metroflex-ai-agent
```

5. **Upload files** (from your local machine):

```bash
scp -r AI_Agent/* root@your-droplet-ip:/var/www/metroflex-ai-agent/
```

6. **Create virtual environment**:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

7. **Create environment file**:

```bash
nano .env
```

Add:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxx
FLASK_ENV=production
```

8. **Create systemd service** (keeps app running):

```bash
nano /etc/systemd/system/metroflex-ai.service
```

Add:
```ini
[Unit]
Description=MetroFlex AI Agent
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/metroflex-ai-agent
Environment="PATH=/var/www/metroflex-ai-agent/venv/bin"
ExecStart=/var/www/metroflex-ai-agent/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 metroflex_ai_agent:app

[Install]
WantedBy=multi-user.target
```

9. **Start service**:

```bash
systemctl daemon-reload
systemctl start metroflex-ai
systemctl enable metroflex-ai
systemctl status metroflex-ai
```

10. **Configure Nginx reverse proxy**:

```bash
nano /etc/nginx/sites-available/metroflex-ai
```

Add:
```nginx
server {
    listen 80;
    server_name your-droplet-ip;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

11. **Enable site**:

```bash
ln -s /etc/nginx/sites-available/metroflex-ai /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

Your agent is now live at: `http://your-droplet-ip/webhook/chat`

#### (Optional) Add SSL Certificate

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

---

### Option 3: Railway (Modern & Simple)

#### Steps

1. **Sign up**: https://railway.app
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Connect your GitHub repository** (or create new repo with AI_Agent files)
4. **Railway auto-detects Python** and installs dependencies
5. **Add environment variable**:
   - Go to: Variables tab
   - Add: `OPENAI_API_KEY` = `sk-proj-xxxxxxxxxx`
6. **Deploy**

Your agent is live at: `https://your-app.railway.app`

---

## GHL Integration

### Step 1: Update Webhook URL in Chat Widget

Edit `GHL_CHAT_WIDGET.html` line 395:

```javascript
const CONFIG = {
    WEBHOOK_URL: 'https://your-deployed-url.com/webhook/chat', // UPDATE THIS
    USER_ID: generateUserId(),
    CONVERSATION_ID: generateConversationId()
};
```

Replace `your-deployed-url.com` with your actual deployment URL from:
- Heroku: `metroflex-ai-agent.herokuapp.com`
- DigitalOcean: Your droplet IP or domain
- Railway: Your Railway app URL

### Step 2: Add Chat Widget to GoHighLevel

1. **Log into GoHighLevel**
2. **Navigate to**: Settings → Tracking Code
3. **Scroll to**: Footer Tracking Code section
4. **Copy entire contents** of `GHL_CHAT_WIDGET.html`
5. **Paste** into Footer Tracking Code textarea
6. **Click "Save"**

### Step 3: Test on GHL Website

1. **Preview your GHL website**
2. **Look for floating chat button** (bottom right, ⚡ icon)
3. **Click to open chat window**
4. **Send test message**: "What are the weight classes for Men's Bodybuilding?"
5. **Verify AI response** appears within 2-3 seconds

---

## Testing & Verification

### Test Queries to Verify Agent Knowledge

Copy these into the chat widget to test all knowledge domains:

#### Events
- "When is the Better Bodies Classic?"
- "How do I register for the Ronnie Coleman 30th Anniversary Classic?"
- "What events does MetroFlex host in 2025?"

#### Division Rules
- "What are the weight classes for Men's Bodybuilding?"
- "What's the difference between Classic Physique and Men's Physique?"
- "What are the height requirements for Classic Physique?"
- "Tell me about the Bikini division judging criteria"

#### Competition Procedures
- "Do I need an NPC card to compete?"
- "How do I submit my posing music?"
- "What should I bring on competition day?"
- "What are the tanning rules?"

#### Pro Card Qualification
- "How do I earn my IFBB Pro Card?"
- "What are the national qualifiers?"
- "How many pro cards has MetroFlex awarded?"

#### Sponsorships
- "What sponsorship packages are available?"
- "What's the ROI for sponsors?"
- "Who is MetroFlex's target audience?"

#### Legacy & History
- "Tell me the Ronnie Coleman story"
- "When was MetroFlex founded?"
- "Who is Brian Dobson?"

#### First-Time Competitors
- "This is my first competition, what should I do?"
- "How much does it cost to compete?"
- "How long does prep take?"

### Expected Response Quality

✅ **Good responses should**:
- Answer the question accurately
- Reference specific numbers/dates from knowledge base
- Include MetroFlex legacy references when appropriate
- End with clear next steps or contact information
- Stay within 2-4 paragraphs

❌ **Poor responses indicate issues**:
- Generic answers not specific to MetroFlex
- Hallucinated information (check against knowledge base)
- No clear call-to-action
- Too verbose (>5 paragraphs)

### Performance Benchmarks

- **Response time**: <2 seconds (from user send to AI response displayed)
- **Accuracy**: 95%+ (verified against knowledge base)
- **Conversation memory**: Should remember context from previous 5 messages
- **Uptime**: 99.9% (check every 24 hours)

---

## Troubleshooting

### Issue: "Network response was not ok" Error

**Symptom**: Chat widget shows error message instead of AI response

**Causes**:
1. Webhook URL incorrect in `GHL_CHAT_WIDGET.html`
2. Server not running or crashed
3. CORS issue blocking cross-origin requests

**Solutions**:
1. Verify webhook URL is correct (check line 395)
2. Check server logs: `heroku logs --tail` or `systemctl status metroflex-ai`
3. Ensure Flask-CORS is installed and `CORS(app)` is in code (line 337)

---

### Issue: Agent Gives Generic Responses (Not Using Knowledge Base)

**Symptom**: Responses don't include specific MetroFlex info

**Causes**:
1. Vector database not built correctly
2. ChromaDB collection empty
3. Semantic search returning no results

**Solutions**:
1. Check server logs for "✅ Vector database built with X documents"
2. Should show 100+ documents indexed
3. Test locally with debug prints in `retrieve_relevant_context()` method

---

### Issue: "OpenAI API Error" / Rate Limit Exceeded

**Symptom**: Error message about OpenAI API

**Causes**:
1. Invalid API key
2. Insufficient credits in OpenAI account
3. Rate limit exceeded (free tier limits)

**Solutions**:
1. Verify API key is correct: `heroku config` or check `.env`
2. Check OpenAI billing: https://platform.openai.com/account/billing
3. Upgrade to paid plan ($5 minimum) for higher limits
4. Reduce `max_tokens` in code (currently 500) to lower costs

---

### Issue: Slow Response Time (>5 seconds)

**Symptom**: Typing indicator shows for too long

**Causes**:
1. Server location far from users
2. Cold start (serverless platforms)
3. Too many documents retrieved (n_results too high)

**Solutions**:
1. Deploy closer to users (Texas/Dallas region recommended)
2. Use always-on server (DigitalOcean) instead of serverless
3. Reduce `n_results` from 5 to 3 in `chat()` method (line 270)

---

### Issue: Conversation Memory Not Working

**Symptom**: Agent forgets context from previous messages

**Causes**:
1. `conversation_id` changing between messages
2. Browser localStorage clearing `metroflex_user_id`
3. Server restarting and losing in-memory history

**Solutions**:
1. Verify `CONFIG.CONVERSATION_ID` stays constant in browser console
2. Check localStorage: `localStorage.getItem('metroflex_user_id')`
3. For production, implement Redis or database for persistent conversation storage

---

### Issue: Chat Widget Not Appearing on GHL Site

**Symptom**: No floating chat button visible

**Causes**:
1. Code not saved in GHL Footer Tracking Code
2. JavaScript error blocking widget load
3. CSS z-index conflict

**Solutions**:
1. Re-check Settings → Tracking Code → Footer section
2. Open browser console (F12) and check for errors
3. Increase z-index in line 28: `z-index: 99999;`

---

## Monitoring & Maintenance

### Daily Checks (First 7 Days)

- [ ] Test chat widget functionality
- [ ] Review server logs for errors
- [ ] Check OpenAI usage/costs
- [ ] Test 3-5 sample queries

### Weekly Checks (Ongoing)

- [ ] Review conversation logs for inaccurate responses
- [ ] Update knowledge base with new events/info
- [ ] Monitor server uptime/performance
- [ ] Check for security updates (dependencies)

### Monthly Updates

- [ ] Rebuild vector database if knowledge base changed
- [ ] Review and optimize token usage/costs
- [ ] Update Python dependencies: `pip install --upgrade -r requirements.txt`
- [ ] Backup conversation history (if using persistent storage)

---

## Cost Estimates

### OpenAI API Costs (GPT-4)

- **Per interaction**: ~$0.002-0.005
- **100 chats/day**: ~$15-20/month
- **500 chats/day**: ~$75-100/month
- **1000 chats/day**: ~$150-200/month

**Cost optimization tips**:
- Use GPT-3.5-turbo for 10x lower cost (change line 37)
- Reduce `max_tokens` from 500 to 300
- Cache common responses

### Hosting Costs

| Platform | Monthly Cost | Best For |
|----------|-------------|----------|
| Heroku (Hobby) | $7 | Testing/low traffic |
| Railway | $5-10 | Modern deployment |
| DigitalOcean | $6 | High performance |
| AWS Lambda | $0-5 | Pay-per-use |

**Total estimated cost**: $20-50/month for moderate usage (100-300 chats/day)

---

## Next Steps

1. ✅ Choose deployment platform (Heroku recommended for first deployment)
2. ✅ Obtain OpenAI API key and add $10 credits
3. ✅ Deploy agent using guide above
4. ✅ Update webhook URL in chat widget
5. ✅ Add chat widget to GHL Footer Tracking Code
6. ✅ Test with 10+ sample queries
7. ✅ Monitor for 48 hours
8. ✅ Collect user feedback and iterate

---

## Support

**Technical Issues**:
- Check this guide's Troubleshooting section first
- Review server logs for error details
- Test locally before assuming deployment issue

**Knowledge Base Updates**:
- Edit `METROFLEX_KNOWLEDGE_BASE.json`
- Restart server to rebuild vector database
- Test updated responses

**Feature Requests**:
- Document desired feature
- Assess if requires code changes or knowledge base updates
- Implement and test locally before deploying

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Agent Version**: MetroFlex AI Assistant v1.0
**Platform**: OpenAI GPT-4 + ChromaDB RAG
