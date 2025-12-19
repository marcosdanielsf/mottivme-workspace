#!/bin/bash

# Check if PocketBase is running
if ! curl --silent --head --fail http://localhost:8090 > /dev/null; then
  echo "Error: PocketBase is not running at http://localhost:8090"
  echo "Please start PocketBase first using ./start_pocketbase.sh"
  exit 1
fi

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Using default environment variables."
  export POCKETBASE_URL=http://localhost:8090
  export POCKETBASE_ADMIN=admin@example.com
  export POCKETBASE_PASSWORD=password123
  export PORT=8080
  export STORAGE_DIR=package_archives
  export DEV_MODE=false
fi

# Create storage directory if it doesn't exist
mkdir -p $STORAGE_DIR/temp

# Run the server
echo "Starting PocketPub server connected to PocketBase at $POCKETBASE_URL"
echo "Server will be available at http://localhost:$PORT"
dart run bin/server.dart 