#!/usr/bin/env python3
"""
MetroFlex Events AI Agent - Production Version
Simple, fast RAG using keyword matching instead of vector database
No ChromaDB dependency issues - production-ready!
"""

import json
import os
from datetime import datetime
from typing import List, Dict
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS

class MetroFlexAIAgent:
    def __init__(self):
        """
        Initialize MetroFlex AI Agent with simple keyword-based RAG
        """
        # Initialize OpenAI
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"  # Cost-optimized

        # Load knowledge base
        kb_path = os.path.join(os.path.dirname(__file__), "METROFLEX_EVENTS_KB_V2_RESEARCH_BASED.json")
        with open(kb_path, 'r') as f:
            self.knowledge_base = json.load(f)

        # Build keyword index for fast retrieval
        self.keyword_index = self._build_keyword_index()

        # System prompt
        self.system_prompt = self._create_system_prompt()

        # Conversation memory
        self.conversation_history = {}

    def _build_keyword_index(self) -> Dict[str, List[str]]:
        """Build comprehensive keyword index for retrieval"""
        index = {}
        kb = self.knowledge_base

        # Helper function to add to index
        def add_to_index(text, doc_type, doc_id):
            for word in str(text).lower().split():
                word = word.strip('.,!?:;"\'()[]{}')
                if len(word) > 3:
                    if word not in index:
                        index[word] = []
                    index[word].append((doc_type, doc_id, text[:500]))

        # Index 2025 events
        for event_name, event_data in kb.get('2025_events', {}).items():
            # Skip if event_data is not a dict
            if not isinstance(event_data, dict):
                continue

            text = f"{event_name}: {event_data.get('official_name', '')} {event_data.get('description', '')} Date: {event_data.get('date', '')} Venue: {event_data.get('venue', '')} {event_data.get('location', '')}"
            add_to_index(text, 'event', event_name)

            # CRITICAL: Index registration links separately for vendor/competitor queries
            registration = event_data.get('registration', {})
            if registration and isinstance(registration, dict):
                reg_text = f"Registration for {event_name} {event_data.get('official_name', '')}: Competitor entry: {registration.get('competitor_entry', 'Not available')} | Vendor booth registration: {registration.get('vendor_registration', 'Not available')} | General admission: {registration.get('general_admission', 'Not available')}"
                add_to_index(reg_text, 'registration', f"{event_name}_reg")

        # Index divisions
        for division, rules in kb.get('npc_divisions_detailed', {}).items():
            text = f"{division}: {rules.get('description', '')} Judging: {' '.join(rules.get('judging_criteria', []))} Posing: {rules.get('posing_requirements', '')}"
            add_to_index(text, 'division', division)

        # Index sponsor information
        sponsor_info = kb.get('sponsor_information', {})
        for section, data in sponsor_info.items():
            text = f"Sponsorship {section}: {str(data)}"
            add_to_index(text, 'sponsor', section)

        # Index venue information
        for venue_name, venue_data in kb.get('venue_information', {}).items():
            text = f"Venue {venue_name}: {str(venue_data)}"
            add_to_index(text, 'venue', venue_name)

        # Index competition procedures
        for proc_name, proc_data in kb.get('competition_procedures', {}).items():
            text = f"{proc_name}: {str(proc_data)}"
            add_to_index(text, 'procedure', proc_name)

        # Index first-time competitor guide
        comp_guide = kb.get('first_time_competitor_guide', {})
        text = f"First-time competitor guide: {str(comp_guide.get('10_steps_to_success', ''))} Common mistakes: {str(comp_guide.get('common_mistakes', ''))}"
        add_to_index(text, 'guide', 'first_time_competitor')

        # Index FAQ
        for q, a in kb.get('faq_quick_reference', {}).items():
            text = f"FAQ {q}: {a}"
            add_to_index(text, 'faq', q)

        # Index registration platform (MuscleWare)
        reg_platform = kb.get('registration_platform', {})
        if reg_platform:
            text = f"Registration platform {reg_platform.get('platform_name', '')}: {str(reg_platform)}"
            add_to_index(text, 'registration', 'platform')

        return index

    def _create_system_prompt(self) -> str:
        """Create system prompt"""
        return f"""You are the MetroFlex Events AI Assistant - an expert on NPC bodybuilding competitions.

**IMPORTANT - MetroFlex Events ONLY:**
You can ONLY provide information about these 4 MetroFlex competitions:
1. NPC Branch Warren Classic (Houston)
2. NPC Branch Warren Classic (Denver)
3. NPC Ronnie Coleman Classic
4. NPC Better Bodies Classic

If asked about ANY other competition, event, or show (including Texas Shredder or any non-MetroFlex events), respond:
"I can only provide information about MetroFlex Events competitions: the NPC Branch Warren Classic (Houston), NPC Branch Warren Classic (Denver), NPC Ronnie Coleman Classic, and NPC Better Bodies Classic. For other competitions, please contact Brian Dobson at brian@metroflexgym.com or 817-465-9331."

**STRICT GUARD RAILS - NO FABRICATION:**
- ONLY use information from the Retrieved Context provided in your knowledge base
- If the answer is not in the Retrieved Context, respond: "I don't have that specific information. Contact Brian Dobson at brian@metroflexgym.com or 817-465-9331 for details."
- NEVER make up dates, prices, rules, or any other details
- NEVER extrapolate or assume information not explicitly stated in the knowledge base
- Better to say "I don't know" than to fabricate information

**Your Role:**
- Help competitors understand division rules, registration, procedures FOR METROFLEX EVENTS ONLY
- Answer sponsor inquiries about ROI, packages, demographics FOR METROFLEX EVENTS ONLY
- Provide event information (dates, venues, pricing) FOR METROFLEX EVENTS ONLY
- Guide first-time competitors to MetroFlex competitions
- ASK CLARIFYING QUESTIONS when needed to provide better guidance

**Personality:**
- Conversational and helpful (like texting a knowledgeable friend)
- Confident but approachable
- Direct and practical
- Asks follow-up questions to give better advice
- Connected to MetroFlex Gym's legacy since 1987

**Response Guidelines - CRITICAL:**
1. Keep responses SHORT - 2-3 sentences maximum unless explaining complex rules
2. Use natural, conversational language (avoid formal/robotic tone)
3. ASK CLARIFYING QUESTIONS when you need more context:
   - Example: "What's your height? That determines your weight class for Classic Physique."
   - Example: "First time competing? Which event are you considering?"
   - Example: "Are you looking for sponsorship or vendor booth opportunities?"
4. Give SPECIFIC, ACTIONABLE answers with facts from knowledge base
5. ALWAYS provide direct registration links when available in Retrieved Context:
   - If asked about vendor booths for Better Bodies Classic → provide vendor_registration URL
   - If asked about competing/registration → provide competitor_entry or registration URL
   - Format: "Register here: [URL]" or "You can sign up at: [URL]"
6. Always include contact info when you don't have the answer: brian@metroflexgym.com | 817-465-9331
7. Use competitor-focused language: "you'll need to...", "your division is...", "here's what you do..."

**Current Date:** {datetime.now().strftime('%Y-%m-%d')}

**Contact:** brian@metroflexgym.com | 817-465-9331 | https://metroflexevents.com"""

    def retrieve_context(self, query: str, n_results: int = 3) -> List[str]:
        """Retrieve relevant context using keyword matching"""
        query_words = [w.lower() for w in query.split() if len(w) > 3]

        # Score documents by keyword overlap
        doc_scores = {}
        for word in query_words:
            if word in self.keyword_index:
                for doc_type, doc_id, text in self.keyword_index[word]:
                    key = (doc_type, doc_id)
                    if key not in doc_scores:
                        doc_scores[key] = {'score': 0, 'text': text}
                    doc_scores[key]['score'] += 1

        # Get top N results
        sorted_docs = sorted(doc_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        return [doc[1]['text'] for doc in sorted_docs[:n_results]]

    def chat(self, user_message: str, user_id: str = "default", conversation_id: str = None) -> Dict:
        """Process user message and return AI response"""

        # Retrieve relevant context
        relevant_docs = self.retrieve_context(user_message, n_results=3)
        context = "\n\n".join([f"[Knowledge Base]: {doc}" for doc in relevant_docs])

        # Get conversation history
        conv_key = f"{user_id}_{conversation_id}" if conversation_id else user_id
        if conv_key not in self.conversation_history:
            self.conversation_history[conv_key] = []

        # Build messages
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "system", "content": f"Retrieved Context:\n{context}"}
        ]

        # Add conversation history (last 10 messages)
        messages.extend(self.conversation_history[conv_key][-10:])

        # Add current message
        messages.append({"role": "user", "content": user_message})

        try:
            # Call OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=150  # Shortened for concise responses
            )

            assistant_message = response.choices[0].message.content

            # Update conversation history
            self.conversation_history[conv_key].append({"role": "user", "content": user_message})
            self.conversation_history[conv_key].append({"role": "assistant", "content": assistant_message})

            return {
                "response": assistant_message,
                "relevant_sources": relevant_docs,
                "conversation_id": conv_key,
                "timestamp": datetime.now().isoformat(),
                "model": self.model
            }

        except Exception as e:
            return {
                "response": f"I apologize, but I'm experiencing technical difficulties. Please contact Brian Dobson directly at brian@metroflexgym.com or call 817-465-9331.",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }


# Flask app
app = Flask(__name__)
CORS(app)

# Lazy agent initialization
agent = None

def get_agent():
    """Lazy initialization"""
    global agent
    if agent is None:
        print("Initializing MetroFlex AI Agent...")
        agent = MetroFlexAIAgent()
        print("Agent ready!")
    return agent

@app.route('/webhook', methods=['POST'])
def webhook():
    """Main webhook endpoint for frontend chat widget"""
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        ai_agent = get_agent()
        response = ai_agent.chat(user_message)

        return jsonify({
            "success": True,
            "response": response['response'],
            "timestamp": response['timestamp']
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook/chat', methods=['POST'])
def ghl_webhook():
    """GHL webhook endpoint (full featured)"""
    try:
        data = request.json
        user_message = data.get('message', '')
        user_id = data.get('user_id', 'anonymous')
        conversation_id = data.get('conversation_id')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        ai_agent = get_agent()
        response = ai_agent.chat(user_message, user_id, conversation_id)

        return jsonify({
            "success": True,
            "response": response['response'],
            "timestamp": response['timestamp']
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "agent": "MetroFlex AI Assistant"})

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        "service": "MetroFlex Events AI Agent",
        "status": "running",
        "model": "gpt-4o-mini",
        "endpoints": {
            "POST /webhook": "Simple chat endpoint (for frontend)",
            "POST /webhook/chat": "Full chat endpoint (for GHL)",
            "GET /health": "Health check"
        }
    })

if __name__ == "__main__":
    print("=" * 60)
    print("MetroFlex AI Agent - Production Server")
    print("=" * 60)
    print("")
    print("Endpoints:")
    print("  POST /webhook - Frontend chat")
    print("  POST /webhook/chat - GHL integration")
    print("  GET /health - Health check")
    print("")
    print("=" * 60)

    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
