const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://artisanstore.xyz',
  'https://www.artisanstore.xyz',
]

export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  
  if (!origin && !referer) return false
  
  if (origin) {
    return ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.startsWith(allowed))
  }
  
  if (referer) {
    return ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed))
  }
  
  return false
}
