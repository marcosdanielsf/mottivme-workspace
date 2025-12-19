# GoHighLevel Integration - Quick Start Guide

Fast-track guide to activate MetroFlex AI Assistant chat widget on your GoHighLevel website.

---

## Prerequisites

✅ GoHighLevel account with admin access
✅ Deployed AI agent with webhook URL (see [AI_AGENT_DEPLOYMENT_GUIDE.md](AI_AGENT_DEPLOYMENT_GUIDE.md))
✅ [GHL_CHAT_WIDGET.html](GHL_CHAT_WIDGET.html) file ready

---

## 5-Minute Setup

### Step 1: Get Your Webhook URL

From your deployment platform:

| Platform | Webhook URL Format |
|----------|-------------------|
| Heroku | `https://your-app-name.herokuapp.com/webhook/chat` |
| Railway | `https://your-app-name.railway.app/webhook/chat` |
| DigitalOcean | `http://your-droplet-ip/webhook/chat` |
| Custom Domain | `https://yourdomain.com/webhook/chat` |

**Example**: `https://metroflex-ai-agent.herokuapp.com/webhook/chat`

---

### Step 2: Update Chat Widget Code

Open [GHL_CHAT_WIDGET.html](GHL_CHAT_WIDGET.html) and find line 395:

**BEFORE**:
```javascript
const CONFIG = {
    WEBHOOK_URL: 'https://your-agent-url.com/webhook/chat', // UPDATE THIS
    USER_ID: generateUserId(),
    CONVERSATION_ID: generateConversationId()
};
```

**AFTER** (replace with your actual webhook URL):
```javascript
const CONFIG = {
    WEBHOOK_URL: 'https://metroflex-ai-agent.herokuapp.com/webhook/chat',
    USER_ID: generateUserId(),
    CONVERSATION_ID: generateConversationId()
};
```

💾 **Save the file after editing**

---

### Step 3: Copy Widget Code

1. Open [GHL_CHAT_WIDGET.html](GHL_CHAT_WIDGET.html)
2. Select ALL content (Cmd+A / Ctrl+A)
3. Copy to clipboard (Cmd+C / Ctrl+C)

---

### Step 4: Add to GoHighLevel

#### Option A: Add to Specific Funnel/Website

1. **Log into GoHighLevel**
2. **Navigate to**: Sites → [Select Your Site/Funnel]
3. **Click**: Settings (gear icon)
4. **Scroll to**: Tracking Code section
5. **Find**: Footer Code textarea
6. **Paste**: Your updated `GHL_CHAT_WIDGET.html` code
7. **Click**: Save

#### Option B: Add to All Sites (Account-Wide)

1. **Log into GoHighLevel**
2. **Navigate to**: Settings (left sidebar)
3. **Click**: Tracking & Analytics
4. **Scroll to**: Footer Tracking Code
5. **Paste**: Your updated `GHL_CHAT_WIDGET.html` code
6. **Click**: Save Settings

---

### Step 5: Test the Chat Widget

1. **Open your GHL website** (preview or live URL)
2. **Look for**: Floating ⚡ button (bottom right corner)
3. **Click**: Chat button to open window
4. **Type**: "What are the weight classes for Men's Bodybuilding?"
5. **Verify**: AI response appears within 2-3 seconds

**Expected Result**:
```
MetroFlex AI Assistant:
Men's Bodybuilding features 7 weight classes:
- Bantamweight: up to 143.25 lbs
- Lightweight: 143.25 - 156.25 lbs
...
[Full response with all 7 classes]
```

---

## Customization Options

### Change Chat Button Position

Edit line 26-28 in `GHL_CHAT_WIDGET.html`:

```css
#metroflex-chat-widget {
    position: fixed;
    bottom: 20px;  /* Change this: 20px from bottom */
    right: 20px;   /* Change this: 20px from right */
    z-index: 9999;
}
```

**Examples**:
- Bottom left: `bottom: 20px; left: 20px;`
- Top right: `top: 20px; right: 20px;`

---

### Change Chat Button Color

Edit line 36 in `GHL_CHAT_WIDGET.html`:

```css
#metroflex-chat-button {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); /* MetroFlex red */
}
```

**Color Options**:
- **Blue**: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)`
- **Green**: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`
- **Purple**: `linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)`
- **Black**: `linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)`

---

### Change Welcome Message

Edit line 352-360 in `GHL_CHAT_WIDGET.html`:

```html
<div class="metroflex-chat-message-content">
    Hey! I'm the MetroFlex AI Assistant. I can help you with:
    <br><br>
    💪 Division rules & weight classes<br>
    📅 Event dates & registration<br>
    🎯 Sponsorship opportunities<br>
    ⚡ Competition day procedures<br>
    <br>
    What can I help you with today?
</div>
```

**Custom Example**:
```html
<div class="metroflex-chat-message-content">
    Welcome to MetroFlex Events! 👋
    <br><br>
    Ask me anything about:
    <br>
    💪 NPC competitions & divisions<br>
    🏆 Ronnie Coleman Classic 30th Anniversary<br>
    📋 Registration & requirements<br>
    <br>
    How can I assist you?
</div>
```

---

### Auto-Open Chat on Page Load

Add to line 557 (after existing auto-open logic):

```javascript
// Auto-open chat on first visit
const hasVisited = localStorage.getItem('metroflex_chat_visited');
if (!hasVisited) {
    chatWindow.classList.add('open');
    chatInput.focus();
    localStorage.setItem('metroflex_chat_visited', 'true');
}
```

---

### Disable Chat on Mobile

Add to line 296 (inside mobile media query):

```css
@media (max-width: 480px) {
    #metroflex-chat-widget {
        display: none; /* Hides chat on mobile */
    }
}
```

---

## Advanced: Track Conversations in GHL CRM

### Enable Contact Capture

Modify the `sendMessage()` function (line 446) to capture contact info:

```javascript
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // ... existing code ...

    const response = await fetch(CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: CONFIG.USER_ID,
            message: message,
            conversation_id: CONFIG.CONVERSATION_ID,
            contact_info: {
                ghl_contact_id: window.ghl_contact_id || null,  // GHL contact ID if available
                page_url: window.location.href,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            }
        })
    });

    // ... rest of code ...
}
```

### Send to GHL Webhook (Optional)

Add after line 493 to also send conversation to GHL workflow:

```javascript
// Send to GHL workflow webhook (optional)
if (data.success) {
    fetch('https://services.leadconnectorhq.com/hooks/YOUR_GHL_WEBHOOK_ID', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contact_id: window.ghl_contact_id,
            conversation: [
                {role: 'user', message: message},
                {role: 'assistant', message: data.response}
            ],
            timestamp: new Date().toISOString()
        })
    });
}
```

Replace `YOUR_GHL_WEBHOOK_ID` with your GHL workflow webhook ID.

---

## Troubleshooting

### Issue: Chat Button Not Appearing

**Check #1**: Code saved in correct location?
- Go to GHL Settings → Tracking Code
- Verify code is in "Footer Tracking Code" section
- Click "Save Settings" again

**Check #2**: Browser cache?
- Hard refresh page: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Try incognito/private window

**Check #3**: JavaScript errors?
- Open browser console (F12 → Console tab)
- Look for red error messages
- Common fix: Verify all `<script>` tags are closed

---

### Issue: Chat Opens But No Response

**Check #1**: Webhook URL correct?
- Line 395 in chat widget code
- Should match your deployment URL exactly
- Must end with `/webhook/chat`

**Check #2**: Server running?
- Visit: `https://your-webhook-url.com/health`
- Should return: `{"status": "healthy", "agent": "MetroFlex AI Assistant"}`
- If not, restart your server (see deployment guide)

**Check #3**: CORS enabled?
- Check server logs for CORS errors
- Verify `flask-cors` installed
- Verify `CORS(app)` line in Python code (line 337)

---

### Issue: Response is Generic (Not MetroFlex-Specific)

**Problem**: Vector database not loaded properly

**Solution**:
1. Check server startup logs for: "✅ Vector database built with X documents"
2. Should show 100+ documents
3. If 0 documents, verify `METROFLEX_KNOWLEDGE_BASE.json` is in same directory as Python file
4. Restart server

---

### Issue: Slow Response Time (>5 seconds)

**Quick Fixes**:
1. Deploy server closer to users (Dallas/Texas region)
2. Reduce `n_results` from 5 to 3 (line 270 in Python)
3. Reduce `max_tokens` from 500 to 300 (line 296 in Python)
4. Use GPT-3.5-turbo instead of GPT-4 (line 37 in Python)

---

## GHL-Specific Tips

### Compatibility with GHL Themes

The chat widget uses `position: fixed` with high `z-index: 9999`, ensuring it appears on top of all GHL page builders:

✅ **Works with**:
- GHL Funnel Builder
- GHL Website Builder
- GHL Blog Builder
- Custom HTML pages
- WordPress sites (if GHL tracking code installed)

⚠️ **Known conflicts**:
- Other floating chat widgets (Intercom, Drift, etc.) - adjust z-index
- Full-screen video overlays - may cover chat button temporarily

---

### A/B Testing Chat Widget

Use GHL's A/B testing feature:

**Variant A**: Chat widget enabled (use full code)
**Variant B**: Chat widget disabled (remove code)

Track metrics:
- Time on page
- Form submissions
- Conversion rate
- Bounce rate

---

### Integrate with GHL Conversations

Future enhancement: Send AI chat transcripts to GHL Conversations inbox.

**Requires**:
- GHL API access
- Webhook configuration in Python agent
- Custom code in `metroflex_ai_agent.py` to POST to GHL API

---

## Pre-Launch Checklist

Before going live, verify:

- [ ] Webhook URL updated in chat widget (line 395)
- [ ] Agent server is deployed and running
- [ ] Health check endpoint returns "healthy": `https://your-url.com/health`
- [ ] Test query works locally: "What are the weight classes for Men's Bodybuilding?"
- [ ] Code pasted in GHL Footer Tracking Code
- [ ] Saved in GHL Settings
- [ ] Hard refresh GHL website (Cmd+Shift+R)
- [ ] Chat button visible (bottom right, ⚡ icon)
- [ ] Chat window opens when clicked
- [ ] Test message sends and receives response
- [ ] Response is MetroFlex-specific (not generic)
- [ ] Mobile responsive (test on phone)
- [ ] No JavaScript errors in console (F12)

---

## Post-Launch Monitoring

### First 24 Hours
- [ ] Test chat every 2-3 hours
- [ ] Monitor server logs for errors
- [ ] Check OpenAI usage dashboard
- [ ] Collect user feedback

### First Week
- [ ] Review 10-20 actual conversations
- [ ] Identify common questions not in knowledge base
- [ ] Check for inaccurate responses
- [ ] Monitor server uptime

### Ongoing
- [ ] Weekly: Review conversation logs
- [ ] Monthly: Update knowledge base with new events/info
- [ ] Quarterly: Optimize based on usage patterns

---

## Support Resources

**Deployment Issues**:
- See: [AI_AGENT_DEPLOYMENT_GUIDE.md](AI_AGENT_DEPLOYMENT_GUIDE.md)
- Check server logs first

**Testing Questions**:
- See: [SAMPLE_TEST_QUERIES.md](SAMPLE_TEST_QUERIES.md)
- 40+ sample queries to test knowledge coverage

**Knowledge Base Updates**:
- Edit: `METROFLEX_KNOWLEDGE_BASE.json`
- Restart server to rebuild vector database

**GHL Support**:
- GHL Help Center: https://help.gohighlevel.com
- GHL Community: https://community.gohighlevel.com

---

## Next Steps

1. ✅ Deploy AI agent (if not already done)
2. ✅ Update webhook URL in chat widget
3. ✅ Test locally with sample queries
4. ✅ Add to GHL Footer Tracking Code
5. ✅ Test on live website
6. ✅ Monitor for 48 hours
7. ✅ Iterate based on user feedback

---

**Quick Reference**:
- Webhook URL location: Line 395
- Welcome message: Line 352-360
- Button position: Line 26-28
- Button color: Line 36
- Mobile styles: Line 297-304

**Version**: 1.0
**Last Updated**: January 2025
**Platform**: GoHighLevel (all plans)
