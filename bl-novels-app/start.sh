#!/bin/bash
# Start script for Render deployment
# This script properly handles the PORT environment variable

PORT=${PORT:-4173}
echo "Starting app on port $PORT..."
npx serve -s dist -l $PORT

