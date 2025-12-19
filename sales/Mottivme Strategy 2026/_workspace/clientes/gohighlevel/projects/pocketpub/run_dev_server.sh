#!/bin/bash

# Environment variables for development mode
export DEV_MODE=true
export SKIP_POCKETBASE=true
export PORT=8080
export STORAGE_DIR=package_archives

# Create storage directory if it doesn't exist
mkdir -p package_archives/temp

# Run the server
echo "Starting PocketPub server in development mode (without PocketBase)"
echo "Server will be available at http://localhost:8080"
dart run bin/server.dart 