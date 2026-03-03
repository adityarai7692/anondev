interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const postLimits = new Map<string, RateLimitEntry>();
const boardLimits = new Map<string, RateLimitEntry>();

export function checkPostRateLimit(ipHash: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const windowMs = 20 * 1000;
  const entry = postLimits.get(ipHash);

  if (!entry || now > entry.resetAt) {
    postLimits.set(ipHash, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (entry.count >= 1) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true };
}

export function checkBoardRateLimit(ipHash: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;
  const entry = boardLimits.get(ipHash);

  if (!entry || now > entry.resetAt) {
    boardLimits.set(ipHash, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (entry.count >= 1) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of postLimits) {
    if (now > val.resetAt) postLimits.delete(key);
  }
  for (const [key, val] of boardLimits) {
    if (now > val.resetAt) boardLimits.delete(key);
  }
}, 60 * 1000);