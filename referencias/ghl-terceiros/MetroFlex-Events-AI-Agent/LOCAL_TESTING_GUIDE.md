# Local Testing Guide - MetroFlex AI Agent

Test the AI agent on your machine before deploying to production.

---

## Quick Start (5 minutes)

### 1. Set Up OpenAI API Key

Create a `.env` file in the `AI_Agent` directory:

```bash
cd ~/Desktop/MetroFlex-Events-AI-Agent/AI_Agent
nano .env
```

Add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-key-here
```

Save (Ctrl+O, Enter, Ctrl+X)

**Get your API key at:** https://platform.openai.com/api-keys

---

### 2. Install Dependencies (if not already done)

```bash
cd ~/Desktop/MetroFlex-Events-AI-Agent/AI_Agent
pip3 install -r requirements.txt
```

**Note:** This may take 5-10 minutes as it builds some packages from source.

---

### 3. Run the Test Server

```bash
cd ~/Desktop/MetroFlex-Events-AI-Agent/AI_Agent
python3 test_local.py
```

You should see:

```
Initializing MetroFlex AI Agent...
Agent ready!
Server starting on: http://localhost:5000
```

---

### 4. Test in Your Browser

Open: **http://localhost:5000**

You'll see a simple test interface where you can ask questions like:

- "What types of events do you specialize in?"
- "Tell me about your services"
- "What makes MetroFlex different?"

The AI will respond using the knowledge base!

---

## Testing the Chat Widget

### Option 1: Test on Localhost

The full MetroFlex website (`index.html`) has the chat widget embedded.

1. **Update the webhook URL** in `index.html`:

   Find line ~428 and change:
   ```javascript
   WEBHOOK_URL: 'http://localhost:5000/webhook'  // Changed from 'DEPLOY_BACKEND_FIRST'
   ```

2. **Open the website** in your browser:
   ```bash
   open ~/Desktop/MetroFlex-Events-AI-Agent/index.html
   ```

3. **Click the ⚡ button** in the bottom right corner

4. **Ask questions** and the AI will respond!

---

### Option 2: Test with GHL (Local Webhook)

You can test the GHL integration locally using a tool like **ngrok** to expose your local server:

1. **Install ngrok:** https://ngrok.com/download

2. **Start the test server:**
   ```bash
   python3 test_local.py
   ```

3. **In a new terminal, expose it:**
   ```bash
   ngrok http 5000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Use that URL in GHL** webhook configuration

---

## Cost Tracking

While testing locally, monitor your API usage:

- **Dashboard:** https://platform.openai.com/usage
- **GPT-4o-mini cost:** ~$0.0005 per chat (super cheap!)
- **Testing budget:** ~100 test chats = $0.05

---

## Troubleshooting

### "OPENAI_API_KEY not set"
- Make sure you created the `.env` file in the `AI_Agent` directory
- Check that the file is named `.env` (not `.env.txt` or `.env.example`)

### "ImportError: No module named..."
- Run: `pip3 install -r requirements.txt`
- Make sure you're in the `AI_Agent` directory

### "Address already in use"
- Another process is using port 5000
- Kill it: `lsof -ti:5000 | xargs kill -9`
- Or change port in `test_local.py` (line 146)

### AI responses are slow
- First response takes 5-10 seconds (loading models)
- Subsequent responses should be 2-4 seconds
- This is normal for local testing

---

## When Ready to Deploy

Once you've tested locally and everything works:

1. **Follow the deployment guide:** `AI_Agent/AI_AGENT_DEPLOYMENT_GUIDE.md`
2. **Deploy to Railway/Heroku** (5-10 minutes)
3. **Update the webhook URL** in your website/GHL
4. **Push changes to GitHub** so the live site has the correct URL

---

## Need Help?

**Check the logs:**
```bash
# The test server shows detailed logs in the terminal
# Look for errors or warnings
```

**Verify the agent works:**
```bash
curl -X POST http://localhost:5000/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "What do you do?"}'
```

You should get a JSON response with an AI answer!
