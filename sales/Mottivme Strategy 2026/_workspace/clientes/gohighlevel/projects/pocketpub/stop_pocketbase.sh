#!/bin/bash

# Find PocketBase processes
PIDS=$(pgrep -f "pocketbase serve")

if [ -z "$PIDS" ]; then
  echo "No PocketBase instance is currently running."
  exit 0
fi

# Kill PocketBase processes
echo "Stopping PocketBase instances with PIDs: $PIDS"
kill $PIDS

echo "PocketBase stopped." 