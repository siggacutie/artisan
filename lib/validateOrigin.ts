const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://artisanstore.xyz',
  'https://www.artisanstore.xyz',
]

export function validateOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  
  if (!origin && !referer) return false
  
  const isAllowed = (url: string) => {
    try {
      const parsed = new URL(url)
      return ALLOWED_ORIGINS.some(allowed => {
        const allowedParsed = new URL(allowed)
        return parsed.origin === allowedParsed.origin
      })
    } catch {
      return false
    }
  }

  if (origin && isAllowed(origin)) return true
  if (referer && isAllowed(referer)) return true
  
  return false
}
