#!/usr/bin/env python3
"""
MetroFlex Events AI Agent - Vercel Serverless Function
Converts Flask app to Vercel-compatible serverless handler
"""

import json
import os
from datetime import datetime
from typing import List, Dict
from openai import OpenAI
from http.server import BaseHTTPRequestHandler
import urllib.parse

class MetroFlexAIAgent:
    def __init__(self):
        """Initialize MetroFlex AI Agent with simple keyword-based RAG"""
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"

        # Load knowledge base from same directory
        kb_path = os.path.join(os.path.dirname(__file__), "..", "AI_Agent", "METROFLEX_EVENTS_KB_V2_RESEARCH_BASED.json")
        with open(kb_path, 'r') as f:
            self.knowledge_base = json.load(f)

        self.keyword_index = self._build_keyword_index()
        self.system_prompt = self._create_system_prompt()
        self.conversation_history = {}

    def _build_keyword_index(self) -> Dict[str, List[str]]:
        """Build simple keyword index for retrieval"""
        index = {}
        kb = self.knowledge_base

        # Index events
        for event_name, event_data in kb.get('events', {}).items():
            text = f"{event_name}: {event_data.get('description', '')} {event_data.get('date', '')} {event_data.get('location', '')}"
            for word in text.lower().split():
                if len(word) > 3:
                    if word not in index:
                        index[word] = []
                    index[word].append(('event', event_name, text))

        # Index divisions
        for division, rules in kb.get('npc_division_rules', {}).items():
            text = f"{division}: {rules.get('description', '')}"
            for word in text.lower().split():
                if len(word) > 3:
                    if word not in index:
                        index[word] = []
                    index[word].append(('division', division, text))

        return index

    def _create_system_prompt(self) -> str:
        """Create system prompt"""
        return f"""You are the MetroFlex Events AI Assistant - an expert on NPC bodybuilding competitions.

**Your Role:**
- Help competitors understand division rules, registration, procedures
- Answer sponsor inquiries about ROI, packages, demographics
- Provide event information (dates, venues, pricing)
- Guide first-time competitors
- Maintain MetroFlex's professional, no-nonsense brand voice

**Personality:**
- Confident and authoritative (38+ years expertise)
- Professional and helpful
- Direct and results-oriented
- Legacy-focused (Ronnie Coleman history)

**Response Guidelines:**
1. Answer accurately using provided context
2. Keep responses concise (2-4 paragraphs)
3. Include relevant dates, links, next steps
4. Reference MetroFlex's 38+ year legacy when appropriate
5. If unsure, offer to connect user with Brian Dobson (brian@metroflexgym.com)

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
                max_tokens=300
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


# Global agent instance (lazy initialization)
agent = None

def get_agent():
    """Lazy initialization for serverless cold starts"""
    global agent
    if agent is None:
        agent = MetroFlexAIAgent()
    return agent


# Vercel serverless handler
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for chat"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)

            # Extract message
            user_message = data.get('message', '')
            user_id = data.get('user_id', 'anonymous')
            conversation_id = data.get('conversation_id')

            if not user_message:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No message provided"}).encode())
                return

            # Get AI response
            ai_agent = get_agent()
            response = ai_agent.chat(user_message, user_id, conversation_id)

            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "response": response['response'],
                "timestamp": response['timestamp']
            }).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle health check"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "healthy",
            "service": "MetroFlex Events AI Agent",
            "model": "gpt-4o-mini"
        }).encode())
