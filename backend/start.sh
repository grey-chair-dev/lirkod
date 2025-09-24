#!/bin/bash

# Start script for Render deployment
echo "🚀 Starting Lirkod Backend..."

# Set environment variables if not set
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-10000}

# Start the application
echo "📡 Starting server on port $PORT..."
node dist/index.js
