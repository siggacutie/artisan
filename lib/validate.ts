export function sanitizeInput(input: string): boolean {
  if (!input) return true
  const forbidden = ['<', '>', '"', "'", ';', '--', '/*', '*/']
  return !forbidden.some(char => input.includes(char))
}

export function validatePassword(password: string): boolean {
  if (password.length < 8) return false
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  return hasLetter && hasNumber
}

export function validateUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{3,20}$/
  return regex.test(username)
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const otpAttempts = new Map<string, { count: number, resetAt: number }>()

export function checkOtpBruteForce(userId: string, type: string): { allowed: boolean, remaining?: number } {
  const key = `${userId}:${type}`
  const now = Date.now()
  const entry = otpAttempts.get(key)

  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) {
      return { allowed: false }
    }
  } else {
    // Reset or new entry
    otpAttempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 })
  }

  return { allowed: true }
}

export function recordOtpFailure(userId: string, type: string) {
  const key = `${userId}:${type}`
  const entry = otpAttempts.get(key)
  if (entry) {
    entry.count += 1
  } else {
    otpAttempts.set(key, { count: 1, resetAt: Date.now() + 15 * 60 * 1000 })
  }
}

export function clearOtpAttempts(userId: string, type: string) {
  otpAttempts.delete(`${userId}:${type}`)
}
