#!/usr/bin/env python3
"""
MetroFlex Events AI Agent
RAG-powered assistant for competitor support, sponsor inquiries, and event information

Features:
- Vector embeddings with ChromaDB
- OpenAI GPT-4 for natural conversations
- Real-time knowledge base retrieval
- GHL webhook integration
- Conversation memory
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from openai import OpenAI
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions

class MetroFlexAIAgent:
    def __init__(self, knowledge_base_path: str = None, openai_api_key: str = None):
        """
        Initialize MetroFlex AI Agent with RAG capabilities

        Args:
            knowledge_base_path: Path to METROFLEX_KNOWLEDGE_BASE.json
            openai_api_key: OpenAI API key for GPT-4
        """
        # Set defaults
        if knowledge_base_path is None:
            knowledge_base_path = os.path.join(os.path.dirname(__file__), "METROFLEX_EVENTS_KB_V2_RESEARCH_BASED.json")
        if openai_api_key is None:
            openai_api_key = os.getenv("OPENAI_API_KEY")

        self.knowledge_base_path = knowledge_base_path
        self.knowledge_base = self._load_knowledge_base()

        # Initialize OpenAI (new v1.0+ API)
        self.client = OpenAI(api_key=openai_api_key)
        self.model = "gpt-4o-mini"  # Cost-optimized: 16x cheaper than GPT-4o (~$0.0005/chat) - Perfect for factual Q&A

        # Initialize vector database
        self.chroma_client = chromadb.Client()
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        # Create or get collection
        self.collection = self.chroma_client.get_or_create_collection(
            name="metroflex_knowledge",
            embedding_function=self.embedding_function
        )

        # Build vector database from knowledge base
        self._build_vector_database()

        # Agent personality and instructions
        self.system_prompt = self._create_system_prompt()

        # Conversation memory
        self.conversation_history = {}

    def _load_knowledge_base(self) -> Dict:
        """Load the MetroFlex knowledge base JSON"""
        with open(self.knowledge_base_path, 'r') as f:
            return json.load(f)

    def _build_vector_database(self):
        """Convert knowledge base into vector embeddings for RAG retrieval"""
        documents = []
        metadatas = []
        ids = []

        doc_id = 0

        # Index organization info
        org = self.knowledge_base['organization']
        documents.append(f"MetroFlex Events: {org['mission']}")
        metadatas.append({"category": "organization", "type": "mission"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # Index historical legacy
        legacy = self.knowledge_base['historical_legacy']
        documents.append(f"MetroFlex Gym founded in {legacy['metroflex_gym_founding']['year']} by {legacy['metroflex_gym_founding']['founder']}. {legacy['metroflex_gym_founding']['vision']}")
        metadatas.append({"category": "legacy", "type": "founding"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        ronnie = legacy['ronnie_coleman_story']
        documents.append(f"Ronnie Coleman's story: {ronnie['first_visit']} - {ronnie['profession']}. Brian Dobson's offer: '{ronnie['brian_dobson_offer']}'. Result: {ronnie['mr_texas_outcome']}. Career: {ronnie['career_achievements']}.")
        metadatas.append({"category": "legacy", "type": "ronnie_coleman"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # Index all events
        for event_name, event_data in self.knowledge_base['events'].items():
            event_text = f"{event_name}: {event_data.get('description', '')} Date: {event_data['date']}. Venue: {event_data['venue']}, {event_data['location']}."
            if event_data.get('registration_url'):
                event_text += f" Register at: {event_data['registration_url']}"
            if event_data.get('sponsorship_packages'):
                packages = event_data['sponsorship_packages']
                event_text += f" Sponsorship packages available from ${min(p['price'] for p in packages.values())} to ${max(p['price'] for p in packages.values())}."

            documents.append(event_text)
            metadatas.append({"category": "event", "event_name": event_name})
            ids.append(f"doc_{doc_id}")
            doc_id += 1

        # Index NPC division rules
        for division, rules in self.knowledge_base['npc_division_rules'].items():
            division_text = f"{division} division: {rules.get('description', '')}. "

            if 'weight_classes' in rules:
                division_text += f"Weight classes: {', '.join([f'{wc['class']} (up to {wc.get('max_weight', 'unlimited')} lbs)' for wc in rules['weight_classes']])}. "

            if 'height_weight_classes' in rules:
                division_text += f"Height/weight restrictions apply. "

            if 'height_classes' in rules:
                division_text += f"Height classes A through H. "

            division_text += f"Judging criteria: {', '.join(rules.get('judging_criteria', []))}. "
            division_text += f"Suit requirements: {rules.get('suit_requirements', '')}. "

            documents.append(division_text)
            metadatas.append({"category": "division_rules", "division": division})
            ids.append(f"doc_{doc_id}")
            doc_id += 1

        # Index competition procedures
        procedures = self.knowledge_base['competition_procedures']

        # Registration procedure
        reg = procedures['registration']
        documents.append(f"Registration: Methods: {', '.join(reg['methods'])}. Required: {', '.join(reg['required_information'])}. Late fees: {reg['late_fees']}. NPC card required: {reg['npc_card_required']}. Get NPC card at: {reg['how_to_get_npc_card']}")
        metadatas.append({"category": "procedures", "type": "registration"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # Posing music
        music = procedures['posing_music']
        documents.append(f"Posing music: Required for {', '.join(music['required_for'])}. Max length: {music['max_length']}. Submission deadline: {music['submission_deadline']}. Format: {', '.join(music['format'])}.")
        metadatas.append({"category": "procedures", "type": "posing_music"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # What to bring
        bring = procedures['what_to_bring']
        documents.append(f"What to bring on competition day: Required: {', '.join(bring['required'])}. Recommended: {', '.join(bring['recommended'])}. Not allowed: {bring['not_allowed']}.")
        metadatas.append({"category": "procedures", "type": "what_to_bring"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # Pro card qualification
        pro_card = procedures['pro_card_qualification']
        documents.append(f"How to earn IFBB Pro Card: {pro_card['requirement']}. National qualifiers: {', '.join(pro_card['national_qualifiers'])}. Process: {', '.join(pro_card['process'])}. MetroFlex has awarded {pro_card['metroflex_pro_cards_awarded']} pro cards.")
        metadatas.append({"category": "procedures", "type": "pro_card"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # Index sponsor information
        sponsor_info = self.knowledge_base['sponsor_information']
        demographics = sponsor_info['audience_demographics']
        documents.append(f"Sponsor audience: {demographics['annual_reach']} annual reach. Per event average: {demographics['per_event_average']}. Demographics: {demographics['gender_split']['male']} male, {demographics['gender_split']['female']} female. Age: {demographics['age_range']}. Interests: {', '.join(demographics['interests'])}.")
        metadatas.append({"category": "sponsor", "type": "demographics"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        roi = sponsor_info['roi_expectations']
        documents.append(f"Sponsor ROI: Brand awareness increase: {roi['brand_awareness_increase']}. Leads per event: {roi['leads_per_event']}. Conversion rate: {roi['lead_to_customer_conversion']}. Social media impressions: {roi['social_media_impressions']}.")
        metadatas.append({"category": "sponsor", "type": "roi"})
        ids.append(f"doc_{doc_id}")
        doc_id += 1

        # Index first-time competitor guide
        first_timer = self.knowledge_base['first_time_competitor_guide']
        for step in first_timer['10_steps_to_success']:
            documents.append(f"Step {step['step']}: {step['title']}. {step['description']} Timing: {step['timing']}")
            metadatas.append({"category": "first_timer", "step": step['step']})
            ids.append(f"doc_{doc_id}")
            doc_id += 1

        # Add all documents to ChromaDB
        if len(documents) > 0:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )

        print(f"✅ Vector database built with {len(documents)} documents")

    def _create_system_prompt(self) -> str:
        """Create the system prompt defining agent personality and capabilities"""
        return f"""You are the MetroFlex Events AI Assistant - an expert on NPC bodybuilding competitions, powered by 38+ years of champion-making knowledge.

**Your Role:**
- Help competitors understand division rules, registration, competition day procedures
- Answer sponsor inquiries about ROI, packages, audience demographics
- Provide event information (dates, venues, ticket prices)
- Guide first-time competitors through the preparation process
- Maintain MetroFlex's legacy-driven, professional, no-nonsense brand voice

**Knowledge Base:**
You have access to comprehensive information about:
- 5 major events (Raw Power, Better Bodies Classic, Ronnie Coleman Classic 30th Anniversary, Branch Warren Classic CO & TX)
- All 8 NPC divisions (Men's Bodybuilding, Classic Physique, Men's Physique, Women's Bodybuilding, Figure, Bikini, Wellness, Women's Physique)
- Competition procedures (registration, weigh-ins, posing music, tanning rules)
- Pro card qualification pathways
- Sponsorship packages and ROI data
- MetroFlex's legendary history (Ronnie Coleman story, 25+ pro cards earned)

**Personality & Tone:**
- Confident and authoritative (38+ years of expertise)
- Professional and helpful (champion-making guidance)
- No-nonsense and direct (hardcore training ethics)
- Legacy-focused (honor Ronnie Coleman and MetroFlex history)
- Results-oriented (practical advice, no fluff)

**Response Guidelines:**
1. Answer questions accurately using the knowledge base
2. If you don't know something, admit it and offer to connect user with Brian Dobson (brian@metroflexgym.com)
3. Always include relevant event dates, registration links, or next steps
4. Reference MetroFlex's 38+ year legacy and Ronnie Coleman connection when appropriate
5. For division questions, be specific about weight classes, height requirements, judging criteria
6. For sponsor inquiries, provide concrete ROI numbers and demographics
7. Keep responses concise (2-4 paragraphs max unless detailed explanation needed)
8. End with a clear call-to-action when applicable (register here, contact us, view event details)

**Current Date:** {datetime.now().strftime('%Y-%m-%d')}

**Contact Information (use when needed):**
- Email: brian@metroflexgym.com
- Phone: 817-465-9331
- Website: https://metroflexevents.com

Remember: You represent 38+ years of champion-making excellence. Be confident, helpful, and professional."""

    def retrieve_relevant_context(self, query: str, n_results: int = 3) -> List[str]:
        """
        Retrieve relevant documents from vector database using semantic search

        Args:
            query: User's question
            n_results: Number of relevant documents to retrieve (optimized to 3 for cost savings)

        Returns:
            List of relevant document texts
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )

        if results['documents'] and len(results['documents']) > 0:
            return results['documents'][0]
        return []

    def chat(self, user_message: str, user_id: str = "default", conversation_id: str = None) -> Dict:
        """
        Process user message and return AI response with RAG retrieval

        Args:
            user_message: User's question or message
            user_id: Unique identifier for user (for conversation tracking)
            conversation_id: Optional conversation ID for threading

        Returns:
            Dictionary with response, relevant_sources, and metadata
        """
        # Retrieve relevant context from knowledge base (optimized to 3 docs for cost savings)
        relevant_docs = self.retrieve_relevant_context(user_message, n_results=3)
        context = "\n\n".join([f"[Knowledge Base]: {doc}" for doc in relevant_docs])

        # Get or create conversation history
        conv_key = f"{user_id}_{conversation_id}" if conversation_id else user_id
        if conv_key not in self.conversation_history:
            self.conversation_history[conv_key] = []

        # Build messages for OpenAI
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "system", "content": f"Retrieved Context:\n{context}"}
        ]

        # Add conversation history (last 5 exchanges for context window management)
        messages.extend(self.conversation_history[conv_key][-10:])

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        try:
            # Call OpenAI GPT-4o-mini (cost-optimized) - new v1.0+ API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=300  # Optimized for concise responses (cost savings)
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

    def get_conversation_history(self, user_id: str, conversation_id: str = None) -> List[Dict]:
        """Retrieve conversation history for a user"""
        conv_key = f"{user_id}_{conversation_id}" if conversation_id else user_id
        return self.conversation_history.get(conv_key, [])

    def clear_conversation(self, user_id: str, conversation_id: str = None):
        """Clear conversation history for a user"""
        conv_key = f"{user_id}_{conversation_id}" if conversation_id else user_id
        if conv_key in self.conversation_history:
            del self.conversation_history[conv_key]


# Flask webhook for GHL integration
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize agent (will use environment variable OPENAI_API_KEY)
agent = None

def get_agent():
    """Lazy initialization of agent"""
    global agent
    if agent is None:
        agent = MetroFlexAIAgent()
    return agent

@app.route('/webhook', methods=['POST'])
def webhook():
    """
    Main webhook endpoint for chat messages (simplified for frontend)

    Expected payload:
    {
        "message": "User's question"
    }
    """
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Process message with AI agent
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
    """
    GHL webhook endpoint for chat messages (full featured)

    Expected payload:
    {
        "user_id": "unique_user_id",
        "message": "User's question",
        "conversation_id": "optional_conversation_id",
        "contact_info": {"name": "John Doe", "email": "john@example.com"}
    }
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        user_id = data.get('user_id', 'anonymous')
        conversation_id = data.get('conversation_id')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Process message with AI agent
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

if __name__ == "__main__":
    print("🚀 MetroFlex AI Agent starting...")
    print("📊 Vector database ready")
    print("💬 Chat endpoint: POST /webhook/chat")
    print("❤️  Health check: GET /health")
    app.run(host='0.0.0.0', port=5000, debug=True)
