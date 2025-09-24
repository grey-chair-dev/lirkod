// Simple in-memory cache for development when Redis is not available
// This is a fallback implementation - use Redis for production

interface CacheEntry {
  value: string;
  expiresAt?: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();

  async get(key: string): Promise<string | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiresAt = ttl ? Date.now() + (ttl * 1000) : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async increment(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = current ? parseInt(current) + 1 : 1;
    await this.set(key, newValue.toString());
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<void> {
    const entry = this.cache.get(key);
    if (entry) {
      entry.expiresAt = Date.now() + (seconds * 1000);
    }
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

const memoryCache = new MemoryCache();

export { memoryCache as cache };

// Session management
export const sessionCache = {
  async setSession(userId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    const key = `session:${userId}`;
    await memoryCache.set(key, JSON.stringify(sessionData), ttl);
  },

  async getSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    const data = await memoryCache.get(key);
    return data ? JSON.parse(data) : null;
  },

  async deleteSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await memoryCache.del(key);
  }
};

// Rate limiting
export const rateLimit = {
  async checkLimit(identifier: string, limit: number, window: number): Promise<boolean> {
    const key = `rate_limit:${identifier}`;
    const current = await memoryCache.increment(key);
    
    if (current === 1) {
      await memoryCache.expire(key, window);
    }
    
    return current <= limit;
  }
};

// Music streaming cache
export const streamCache = {
  async cacheStreamData(songId: string, data: any, ttl: number = 1800): Promise<void> {
    const key = `stream:${songId}`;
    await memoryCache.set(key, JSON.stringify(data), ttl);
  },

  async getStreamData(songId: string): Promise<any | null> {
    const key = `stream:${songId}`;
    const data = await memoryCache.get(key);
    return data ? JSON.parse(data) : null;
  }
};
