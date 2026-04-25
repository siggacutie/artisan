type SecurityEvent =
  | 'PAYMENT_INVALID_SIGNATURE'
  | 'PAYMENT_AMOUNT_MISMATCH'
  | 'PAYMENT_ORDER_NOT_FOUND'
  | 'PAYMENT_ALREADY_PROCESSED'
  | 'PAYMENT_FETCH_FAILED'
  | 'WEBHOOK_INVALID_SIGNATURE'
  | 'RATE_LIMIT_VERIFY_PLAYER'
  | 'RATE_LIMIT_CONTACT'
  | 'RATE_LIMIT_ORDER_CREATE'
  | 'CSRF_BLOCKED'
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED_ACCESS'
  | 'FILE_UPLOAD_REJECTED'
  | 'BANNED_USER_ATTEMPT'
  | 'ADMIN_PRICING_CHANGED'
  | 'ADMIN_USER_ACTION'
  | 'ADMIN_ORDER_UPDATE'
  | 'INVALID_PACKAGE_SELECTED'

export function securityLog(event: SecurityEvent, metadata: Record<string, any> = {}) {
  const safeMetadata = sanitizeForLog(metadata)
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...safeMetadata,
  }
  console.error('[SECURITY]', JSON.stringify(entry))
}

function sanitizeForLog(obj: Record<string, any>): Record<string, any> {
  const SENSITIVE_KEYS = [
    'password', 'secret', 'token', 'key', 'signature',
    'authorization', 'cookie', 'session', 'cardNumber',
    'cvv', 'apiKey',
  ]
  const result: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    const keyLower = k.toLowerCase()
    if (SENSITIVE_KEYS.some(s => keyLower.includes(s))) {
      result[k] = '[REDACTED]'
    } else if (typeof v === 'string' && v.length > 100) {
      result[k] = v.substring(0, 20) + '...[truncated]'
    } else {
      result[k] = v
    }
  }
  return result
}
