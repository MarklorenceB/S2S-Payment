// Simple in-memory rate limiter
// Tracks request counts per IP within a sliding window

const rateMap = new Map<string, { count: number; resetAt: number }>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateMap) {
    if (now > value.resetAt) {
      rateMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(
  identifier: string,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count };
}
