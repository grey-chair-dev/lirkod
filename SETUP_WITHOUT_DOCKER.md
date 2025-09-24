# Spotify Clone - Setup Without Docker

Since Docker is not installed on your system, here's how to set up the Spotify clone using local services or cloud alternatives.

## 🚀 Quick Setup (No Docker)

### Option 1: Automated Setup
```bash
# Run the no-Docker setup script
./scripts/setup-no-docker.sh
```

### Option 2: Manual Setup

#### 1. Prerequisites
- ✅ Node.js 18+ (already checked)
- ❌ PostgreSQL 14+ (needs installation)
- ❌ Redis 6+ (needs installation)

#### 2. Install Missing Services

**macOS (using Homebrew):**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL and Redis
brew install postgresql redis

# Start services
brew services start postgresql
brew services start redis
```

**Ubuntu/Debian:**
```bash
# Install PostgreSQL and Redis
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib redis-server

# Start services
sudo systemctl start postgresql
sudo systemctl start redis-server
sudo systemctl enable postgresql
sudo systemctl enable redis-server
```

#### 3. Alternative: Use Cloud Services (Recommended for Quick Start)

**Free Cloud Database Options:**
- **Supabase**: https://supabase.com (Free PostgreSQL)
- **Railway**: https://railway.app (Free PostgreSQL + Redis)
- **Neon**: https://neon.tech (Free PostgreSQL)
- **PlanetScale**: https://planetscale.com (Free MySQL)

**Free Cloud Redis Options:**
- **Redis Cloud**: https://redis.com/redis-enterprise-cloud/overview/
- **Upstash**: https://upstash.com (Free Redis)

## 🌐 Cloud Setup Example (Supabase + Upstash)

### 1. Create Supabase Database
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Update `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
   ```

### 2. Create Upstash Redis
1. Go to https://upstash.com
2. Create a new database
3. Copy the connection URL
4. Update `.env` file:
   ```env
   REDIS_URL="redis://default:[password]@[endpoint]:[port]"
   ```

## 🛠️ Manual Setup Steps

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..

# Mobile dependencies
cd mobile && npm install --legacy-peer-deps && cd ..
```

### 2. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database and Redis URLs
# For local services:
DATABASE_URL="postgresql://postgres:password@localhost:5432/spotify_clone"
REDIS_URL="redis://localhost:6379"

# For cloud services, use the URLs provided by your service
```

### 3. Database Setup
```bash
# Create database (if using local PostgreSQL)
createdb spotify_clone

# Run migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### 4. Start Services
```bash
# Start Redis (if using local Redis)
redis-server

# Start development servers
npm run dev
```

## 🎯 Quick Start with Cloud Services

### 1. Use the No-Docker Setup Script
```bash
./scripts/setup-no-docker.sh
```

### 2. Set Up Cloud Database
- Choose a free PostgreSQL service (Supabase recommended)
- Get your connection string
- Update `DATABASE_URL` in `.env`

### 3. Set Up Cloud Redis
- Choose a free Redis service (Upstash recommended)
- Get your connection URL
- Update `REDIS_URL` in `.env`

### 4. Run Database Migrations
```bash
cd backend
npx prisma migrate dev --name init
cd ..
```

### 5. Start Development
```bash
npm run dev
```

## 🌐 Access Points

Once running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📱 Mobile Development

### Prerequisites
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install Expo Go app on your phone
# iOS: App Store
# Android: Google Play Store
```

### Start Mobile Development
```bash
cd mobile
npm run start

# Scan QR code with Expo Go app
# Or press 'i' for iOS simulator
# Or press 'a' for Android emulator
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# or
sudo systemctl status postgresql

# Start PostgreSQL
brew services start postgresql
# or
sudo systemctl start postgresql
```

#### 2. Redis Connection Failed
```bash
# Check if Redis is running
brew services list | grep redis
# or
sudo systemctl status redis

# Start Redis
brew services start redis
# or
sudo systemctl start redis-server
```

#### 3. Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:5432 | xargs kill -9
lsof -ti:6379 | xargs kill -9
```

#### 4. Prisma Issues
```bash
cd backend
npx prisma generate
npx prisma db push
```

## 🚀 Production Deployment

### Option 1: Vercel + Railway
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: Use Railway PostgreSQL
- **Redis**: Use Railway Redis

### Option 2: Netlify + Render
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Render
- **Database**: Use Render PostgreSQL
- **Redis**: Use Render Redis

### Option 3: All-in-One (Railway)
- Deploy everything to Railway
- Use Railway's PostgreSQL and Redis services

## 📚 Next Steps

1. **Choose your setup method** (local services or cloud)
2. **Run the setup script**: `./scripts/setup-no-docker.sh`
3. **Configure your database and Redis URLs** in `.env`
4. **Start development**: `npm run dev`
5. **Test the application**: Visit http://localhost:3000

## 🆘 Need Help?

1. **Check the logs** for specific error messages
2. **Verify services are running** (PostgreSQL, Redis)
3. **Check environment variables** in `.env`
4. **Review the troubleshooting section** above
5. **Use cloud services** for easier setup

The application will work perfectly without Docker - you just need PostgreSQL and Redis running either locally or in the cloud!
