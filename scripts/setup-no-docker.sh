#!/bin/bash

# Spotify Clone Setup Script (Without Docker)
echo "🎵 Setting up Spotify Clone (No Docker version)..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js check passed: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed."
    echo "   Please install PostgreSQL 14+ or use a cloud database."
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "   Or use a free cloud database like Supabase, Railway, or Neon"
    echo ""
    echo "   For now, we'll continue with frontend and mobile setup..."
    SKIP_DB=true
else
    echo "✅ PostgreSQL found: $(psql --version)"
    SKIP_DB=false
fi

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis is not installed."
    echo "   Please install Redis 6+ or use a cloud Redis service."
    echo "   macOS: brew install redis"
    echo "   Ubuntu: sudo apt-get install redis-server"
    echo "   Or use a free cloud Redis like Redis Cloud or Upstash"
    echo ""
    echo "   For now, we'll continue with frontend and mobile setup..."
    SKIP_REDIS=true
else
    echo "✅ Redis found: $(redis-server --version | head -n1)"
    SKIP_REDIS=false
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your database and Redis configuration"
    echo "   For cloud databases, update DATABASE_URL and REDIS_URL"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install mobile dependencies
echo "📦 Installing mobile dependencies..."
cd mobile
# Clean install to avoid conflicts
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
cd ..

# Setup database if PostgreSQL is available
if [ "$SKIP_DB" = false ]; then
    echo "🗄️  Setting up database..."
    cd backend
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw spotify_clone; then
        echo "✅ Database 'spotify_clone' already exists"
    else
        echo "📝 Creating database 'spotify_clone'..."
        createdb spotify_clone
    fi
    
    # Run migrations
    echo "🔄 Running database migrations..."
    npx prisma migrate dev --name init
    npx prisma generate
    cd ..
else
    echo "⚠️  Skipping database setup. Please set up PostgreSQL and run:"
    echo "   cd backend && npx prisma migrate dev --name init"
fi

# Start Redis if available
if [ "$SKIP_REDIS" = false ]; then
    echo "🔄 Starting Redis server..."
    redis-server --daemonize yes
    echo "✅ Redis server started"
else
    echo "⚠️  Skipping Redis setup. Please start Redis manually or use cloud Redis"
fi

echo ""
echo "✅ Setup completed!"
echo ""
echo "🚀 To start the development servers:"
echo "   npm run dev"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📱 To start mobile development:"
echo "   cd mobile && npm run start"
echo ""
echo "⚠️  Important notes:"
if [ "$SKIP_DB" = true ]; then
    echo "   - Set up PostgreSQL and update DATABASE_URL in .env"
    echo "   - Run: cd backend && npx prisma migrate dev --name init"
fi
if [ "$SKIP_REDIS" = true ]; then
    echo "   - Set up Redis and update REDIS_URL in .env"
    echo "   - Or start Redis: redis-server"
fi
echo "   - Update .env file with your configuration"
echo "   - Check SETUP_INSTRUCTIONS.md for detailed setup guide"
