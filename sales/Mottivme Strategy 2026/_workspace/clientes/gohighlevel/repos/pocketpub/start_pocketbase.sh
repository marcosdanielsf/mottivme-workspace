#!/bin/bash

# Ensure the data directory exists
mkdir -p pocketbase_data

# Start PocketBase with the data directory
cd pocketbase_data
../pocketbase/pocketbase serve 