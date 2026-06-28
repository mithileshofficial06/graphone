// Simple sliding window rate limiter

interface RateLimitEntry {
  requests: number[];
  windowStart: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>;
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.requests = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry) {
      // First request from this identifier
      this.requests.set(identifier, {
        requests: [now],
        windowStart: now,
      });
      return { allowed: true, remaining: this.limit - 1 };
    }

    // Remove requests outside the current window
    const windowStart = now - this.windowMs;
    entry.requests = entry.requests.filter((timestamp) => timestamp > windowStart);

    if (entry.requests.length >= this.limit) {
      return { allowed: false, remaining: 0 };
    }

    // Add current request
    entry.requests.push(now);
    entry.windowStart = windowStart;

    return {
      allowed: true,
      remaining: this.limit - entry.requests.length,
    };
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [identifier, entry] of this.requests.entries()) {
      if (now - entry.windowStart > this.windowMs) {
        this.requests.delete(identifier);
      }
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    rateLimiter.cleanup();
  }, 60000);
}
