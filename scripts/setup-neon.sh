#!/bin/bash

echo "🌟 Setting up Neon Database for Spotify Clone..."
echo ""

echo "📋 Follow these steps to get your Neon connection string:"
echo ""
echo "1. 🌐 Go to: https://neon.tech"
echo "2. 👤 Sign up for a free account"
echo "3. 🆕 Create a new project (name it 'spotify-clone')"
echo "4. 📋 Copy the connection string from the dashboard"
echo "5. 🔧 Paste it below when prompted"
echo ""

# Prompt for Neon connection string
echo "📝 Please paste your Neon connection string here:"
echo "   (It should look like: postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require)"
echo ""
read -p "Neon DATABASE_URL: " NEON_URL

if [ -z "$NEON_URL" ]; then
    echo "❌ No connection string provided. Exiting."
    exit 1
fi

# Update .env file with Neon URL
echo "🔧 Updating .env file with Neon database URL..."
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$NEON_URL\"|" .env

echo "✅ Database URL updated in .env file"
echo ""

# Set up Redis (we'll use a simple in-memory solution for now)
echo "🔧 Setting up Redis configuration..."
echo "   For now, we'll use a simple in-memory cache"
echo "   For production, consider using Upstash Redis (free tier available)"
echo ""

# Update Redis URL to a placeholder
sed -i.bak "s|REDIS_URL=.*|REDIS_URL=\"redis://localhost:6379\"|" .env

echo "✅ Environment configuration updated"
echo ""

# Run database migrations
echo "🗄️  Setting up database schema..."
cd backend

# Check if Prisma is properly configured
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Prisma schema not found. Please check your backend setup."
    exit 1
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully!"
else
    echo "❌ Database migration failed. Please check your connection string."
    echo "   Make sure your Neon connection string is correct and the database is accessible."
    exit 1
fi

cd ..

echo ""
echo "🎉 Neon database setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Start the backend server: npm run dev:backend"
echo "   2. Your frontend is already running at: http://localhost:3000"
echo "   3. Test the API at: http://localhost:3001/health"
echo ""
echo "🌐 Your Spotify clone is now fully functional!"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001"
echo "   - Database: Neon PostgreSQL (cloud)"
echo ""
echo "📱 To start mobile development:"
echo "   cd mobile && npm run start"
echo ""
echo "🎵 Enjoy your Spotify clone!"
