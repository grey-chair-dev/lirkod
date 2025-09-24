# Spotify Clone - Setup Instructions

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Make setup script executable and run it
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option 2: Manual Setup

#### 1. Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis 6+ (or use Docker)

#### 2. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# At minimum, update database and Redis URLs
```

#### 3. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..

# Mobile dependencies (with legacy peer deps for compatibility)
cd mobile && npm install --legacy-peer-deps && cd ..
```

#### 4. Database Setup
```bash
# Start Docker services
docker-compose up -d postgres redis

# Wait for services to be ready (10-15 seconds)
sleep 15

# Run database migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

#### 5. Start Development Servers
```bash
# Start all services
npm run dev

# Or start individually:
# Backend: npm run dev:backend
# Frontend: npm run dev:frontend
# Mobile: npm run dev:mobile
```

## 🌐 Access Points

- **Frontend Web App**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/health
- **Database**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

## 📱 Mobile Development

### Prerequisites
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone
- iOS Simulator (for iOS) or Android Studio (for Android)

### Running Mobile App
```bash
cd mobile
npm start

# Then:
# - Scan QR code with Expo Go app
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
```

## 🐳 Docker Deployment

### Development with Docker
```bash
# Start all services with Docker
docker-compose up

# Or start specific services
docker-compose up postgres redis backend frontend
```

### Production Deployment
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Mobile Dependencies
If you get dependency conflicts in mobile:
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 2. Database Connection
If database connection fails:
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

#### 3. Port Conflicts
If ports are already in use:
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:5432 | xargs kill -9
lsof -ti:6379 | xargs kill -9
```

#### 4. Prisma Issues
If Prisma commands fail:
```bash
cd backend
npx prisma generate
npx prisma db push
```

#### 5. Frontend Build Issues
If Next.js build fails:
```bash
cd frontend
rm -rf .next
npm run build
```

### Environment Variables

Make sure these are set in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spotify_clone?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (generate secure ones for production)
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Server
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Mobile Tests
```bash
cd mobile
npm test
```

## 📊 Monitoring

### Health Checks
- Backend: http://localhost:3001/health
- Frontend: http://localhost:3000 (should load)

### Logs
```bash
# Docker logs
docker-compose logs -f

# Individual service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Copy production environment
cp .env.example .env.production

# Update with production values:
# - Database URL (production PostgreSQL)
# - Redis URL (production Redis)
# - JWT secrets (secure random strings)
# - CORS origins (your domain)
# - AWS credentials (if using S3)
```

### 2. Build and Deploy
```bash
# Build all services
npm run build

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Database Migration
```bash
# Run production migrations
cd backend
NODE_ENV=production npx prisma migrate deploy
```

## 📚 Additional Resources

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Mobile App Documentation](./mobile/README.md)
- [Docker Configuration](./docker-compose.yml)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

## 🆘 Getting Help

1. Check the logs for error messages
2. Verify all services are running
3. Ensure environment variables are set correctly
4. Check network connectivity between services
5. Review the troubleshooting section above

## 🎯 Next Steps

Once everything is running:

1. **Test the API**: Visit http://localhost:3001/health
2. **Create an account**: Go to http://localhost:3000 and register
3. **Test mobile app**: Scan QR code with Expo Go
4. **Explore features**: Try creating playlists, searching music, etc.

The application is now ready for development and testing!
