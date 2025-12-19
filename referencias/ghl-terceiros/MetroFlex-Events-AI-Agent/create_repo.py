#!/usr/bin/env python3
import requests
import os
import sys

# GitHub API endpoint
api_url = "https://api.github.com/user/repos"

# Get GitHub token from environment or ask user
token = os.environ.get('GITHUB_TOKEN')

if not token:
    print("⚠️  GitHub token not found in environment")
    print("")
    print("To create the repository, I need a GitHub Personal Access Token.")
    print("")
    print("Quick setup (2 minutes):")
    print("1. Go to: https://github.com/settings/tokens/new")
    print("2. Name: 'MetroFlex Deployment'")
    print("3. Check: 'repo' (full control of private repositories)")
    print("4. Click 'Generate token'")
    print("5. Copy the token and paste it here:")
    print("")
    token = input("Paste your GitHub token: ").strip()
    
    if not token:
        print("❌ No token provided. Exiting.")
        sys.exit(1)

# Repository data
repo_data = {
    "name": "MetroFlex-Events-AI-Agent",
    "description": "GPT-4o-mini RAG agent for MetroFlex Events - $5-35/mo, 83% cost savings, GHL-ready",
    "private": False,
    "auto_init": False
}

# Create repository
headers = {
    "Authorization": f"token {token}",
    "Accept": "application/vnd.github.v3+json"
}

print("🚀 Creating GitHub repository...")
response = requests.post(api_url, json=repo_data, headers=headers)

if response.status_code == 201:
    repo_info = response.json()
    print(f"✅ Repository created successfully!")
    print(f"🌐 URL: {repo_info['html_url']}")
    print(f"📦 Clone URL: {repo_info['clone_url']}")
    print("")
    print("Now pushing code...")
    os.system(f"git remote set-url origin {repo_info['clone_url']}")
    os.system("git push -u origin main")
else:
    print(f"❌ Error creating repository: {response.status_code}")
    print(f"Response: {response.text}")
    sys.exit(1)
