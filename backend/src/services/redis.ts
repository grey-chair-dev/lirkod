import { createClient, RedisClientType } from 'redis';
import { cache as memoryCache, sessionCache, rateLimit, streamCache } from './memory-cache';

let redisClient: RedisClientType | null = null;
let useMemoryCache = false;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      console.log('🔄 Falling back to memory cache for development');
      useMemoryCache = true;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
      useMemoryCache = false;
    });

    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection failed, using memory cache for development');
    console.log('💡 For production, please set up Redis or use a cloud Redis service');
    useMemoryCache = true;
  }
};

export const getRedisClient = () => {
  if (!redisClient && !useMemoryCache) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

// Cache utilities with fallback to memory cache
export const cache = {
  async get(key: string): Promise<string | null> {
    if (useMemoryCache || !redisClient) {
      return await memoryCache.get(key);
    }
    
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return await memoryCache.get(key);
    }
  },

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (useMemoryCache || !redisClient) {
      return await memoryCache.set(key, value, ttl);
    }
    
    try {
      if (ttl) {
        await redisClient.setEx(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
      await memoryCache.set(key, value, ttl);
    }
  },

  async del(key: string): Promise<void> {
    if (useMemoryCache || !redisClient) {
      return await memoryCache.del(key);
    }
    
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
      await memoryCache.del(key);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (useMemoryCache || !redisClient) {
      return await memoryCache.exists(key);
    }
    
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return await memoryCache.exists(key);
    }
  },

  async increment(key: string): Promise<number> {
    if (useMemoryCache || !redisClient) {
      return await memoryCache.increment(key);
    }
    
    try {
      return await redisClient.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return await memoryCache.increment(key);
    }
  },

  async expire(key: string, seconds: number): Promise<void> {
    if (useMemoryCache || !redisClient) {
      return await memoryCache.expire(key, seconds);
    }
    
    try {
      await redisClient.expire(key, seconds);
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      await memoryCache.expire(key, seconds);
    }
  }
};

// Export the same cache utilities (they now have fallback to memory cache)
export { sessionCache, rateLimit, streamCache } from './memory-cache';
