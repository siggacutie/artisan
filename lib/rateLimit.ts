interface RateLimitEntry {
  count: number
  resetAt: number
  blocked: boolean
}

const store = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 60 * 1000)

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  blockOnExceed = false
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs, blocked: false })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.blocked || entry.count >= maxRequests) {
    if (blockOnExceed) entry.blocked = true
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  return forwarded
    ? forwarded.split(',')[0].trim()
    : realIp ?? '127.0.0.1'
}
