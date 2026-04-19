export const validators = {
  playerId: (v: string) => /^\d{6,12}$/.test(v),
  zoneId: (v: string) => /^\d{1,8}$/.test(v),
  username: (v: string) => typeof v === 'string' && v.trim().length >= 1 && v.trim().length <= 50,
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254,
  name: (v: string) => typeof v === 'string' && v.trim().length >= 2 && v.trim().length <= 50,
  message: (v: string) => typeof v === 'string' && v.trim().length >= 10 && v.trim().length <= 2000,
  subject: (v: string) => typeof v === 'string' && v.trim().length >= 5 && v.trim().length <= 200,
  orderId: (v: string) => !v || /^c[a-z0-9]{20,30}$/.test(v),
  packageId: (v: string, registry: Record<string, any>) => typeof v === 'string' && v in registry,
}

export function sanitizeHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}
