#!/bin/bash

# Build script for Render deployment
echo "🔨 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "🔧 Building TypeScript..."
npm run build

echo "✅ Build completed successfully!"
