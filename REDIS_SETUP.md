# Set up Redis for Lirkod

## Option 1: Upstash Redis (Recommended - Free Tier)

1. Go to [upstash.com](https://upstash.com)
2. Sign up for a free account
3. Create a new Redis database:
   - **Name**: `lirkod-redis`
   - **Region**: Choose closest to your users
   - **Type**: `Regional` (free tier)
4. Copy the connection details:
   - **Endpoint**: `redis-xxxxx.upstash.io:6379`
   - **Password**: `xxxxx`
5. Format as Redis URL: `redis://default:password@endpoint:6379`

## Option 2: Railway Redis
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add Redis service
4. Copy connection string

## Option 3: Memory Cache (Development Only)
If you don't set up Redis, the app will automatically use in-memory cache for development. This is fine for testing but not recommended for production.

## Environment Variable
Add to your Render backend environment variables:
```
REDIS_URL=redis://default:your-password@your-endpoint:6379
```

## Benefits of Redis
- Session management
- Rate limiting
- Caching API responses
- Real-time features
- Better performance
