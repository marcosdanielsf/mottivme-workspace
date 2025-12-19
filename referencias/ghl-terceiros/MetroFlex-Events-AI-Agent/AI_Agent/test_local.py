#!/usr/bin/env python3
"""
Local Testing Script for MetroFlex AI Agent
Run this to test the AI agent on your machine before deploying.

Usage:
    python3 test_local.py

Then open browser to: http://localhost:5000
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Check if OpenAI API key is set
if not os.getenv('OPENAI_API_KEY'):
    print("=" * 60)
    print("SETUP REQUIRED: OpenAI API Key")
    print("=" * 60)
    print("")
    print("To test the AI agent, you need an OpenAI API key.")
    print("")
    print("Quick setup:")
    print("1. Get your API key from: https://platform.openai.com/api-keys")
    print("2. Create a .env file in this directory with:")
    print("   OPENAI_API_KEY=your-key-here")
    print("")
    print("Or run this command (replace with your actual key):")
    print("   export OPENAI_API_KEY='sk-...'")
    print("")
    sys.exit(1)

# Import the AI agent
try:
    from metroflex_ai_agent import MetroFlexAIAgent
except ImportError as e:
    print(f"Error importing agent: {e}")
    print("")
    print("Make sure you've installed dependencies:")
    print("   pip3 install -r requirements.txt")
    print("")
    sys.exit(1)

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize AI agent (will be lazy-loaded on first request)
print("MetroFlex AI Agent configured...")
agent = None

def get_agent():
    """Lazy initialization of agent"""
    global agent
    if agent is None:
        print("Initializing MetroFlex AI Agent...")
        agent = MetroFlexAIAgent()
        print("Agent ready!")
    return agent

@app.route('/', methods=['GET'])
def home():
    """Test endpoint"""
    return """
    <html>
    <head><title>MetroFlex AI Agent - Local Test</title></head>
    <body style="font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px;">
        <h1>MetroFlex AI Agent - Local Testing</h1>
        <p>Agent is running!</p>

        <h2>Test the Agent:</h2>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
            <form id="testForm">
                <label for="question">Ask a question:</label><br>
                <input type="text" id="question" style="width: 100%; padding: 10px; margin: 10px 0;"
                       placeholder="e.g., What types of events do you specialize in?">
                <button type="submit" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Send
                </button>
            </form>
            <div id="response" style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px; min-height: 50px;">
                <em>Response will appear here...</em>
            </div>
        </div>

        <h2>Webhook Endpoint:</h2>
        <p><code>POST http://localhost:5000/webhook</code></p>

        <script>
            document.getElementById('testForm').onsubmit = async (e) => {
                e.preventDefault();
                const question = document.getElementById('question').value;
                const responseDiv = document.getElementById('response');

                responseDiv.innerHTML = '<em>Thinking...</em>';

                try {
                    const response = await fetch('/webhook', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({message: question})
                    });
                    const data = await response.json();
                    responseDiv.innerHTML = '<strong>AI:</strong><br>' + data.response;
                } catch (error) {
                    responseDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
                }
            };
        </script>
    </body>
    </html>
    """

@app.route('/webhook', methods=['POST'])
def webhook():
    """Main webhook endpoint for chat messages"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        user_message = data['message']
        logger.info(f"Received message: {user_message}")

        # Get AI response
        ai_agent = get_agent()
        ai_response = ai_agent.chat(user_message)
        logger.info(f"AI response: {ai_response}")

        return jsonify({
            'response': ai_response.get('response', str(ai_response)),
            'status': 'success'
        })

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'agent': 'ready'})

if __name__ == '__main__':
    print("")
    print("=" * 60)
    print("MetroFlex AI Agent - Local Test Server")
    print("=" * 60)
    print("")
    print("Server starting on: http://localhost:5000")
    print("")
    print("Open your browser to:")
    print("  http://localhost:5000")
    print("")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    print("")

    app.run(host='0.0.0.0', port=5000, debug=True)
