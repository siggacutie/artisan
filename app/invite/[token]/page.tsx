'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, CheckCircle, Mail } from 'lucide-react'
import Link from 'next/link'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [validating, setValidating] = useState(true)
  const [inviteValid, setInviteValid] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [membershipMonths, setMembershipMonths] = useState(1)
  const [requireEmail, setRequireEmail] = useState(true)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OTP State
  const [step, setStep] = useState<'SIGNUP' | 'VERIFY'>('SIGNUP')
  const [userId, setUserId] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    fetch(`/api/invite/validate/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setInviteValid(true)
          setMembershipMonths(data.membershipMonths ?? 1)
          setRequireEmail(data.requireEmail ?? true)
        } else {
          setInviteError(data.error || 'Invalid or expired invite link')
        }
      })
      .catch(() => setInviteError('Failed to validate invite link'))
      .finally(() => setValidating(false))
  }, [token])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  async function handleSignup() {
    if (!username.trim() || !password) {
      setError('All fields are required')
      return
    }
    if (requireEmail && !email.trim()) {
      setError('Email is required')
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address')
      return
    }
    if (!agreedToTerms) {
      setError('You must agree to the terms before signing up.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/invite/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username: username.trim(), email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create account')
        return
      }

      if (data.requiresEmailVerification) {
        setUserId(data.userId)
        setStep('VERIFY')
        setResendTimer(60)
      } else {
        router.replace('/login?reason=signup_success')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) {
      setError('Enter 6-digit code')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/invite/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        return
      }
      router.replace('/login')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/invite/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setResendTimer(60)
        setError(null)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to resend code')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#050810',
    border: '1px solid rgba(255,215,0,0.15)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const buttonStyle = {
    width: '100%',
    padding: '13px',
    backgroundColor: loading ? '#334155' : '#ffd700',
    color: '#050810',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textAlign: 'center' as const,
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#0d1120',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: '16px',
        padding: '40px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 700 }}>
            <span style={{ color: '#ffffff' }}>ARTISAN</span>
            <span style={{ color: '#ffd700' }}>store</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
            {step === 'SIGNUP' ? 'Create your reseller account' : 'Verify your email'}
          </p>
        </div>

        {validating && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Validating invite link...</p>
          </div>
        )}

        {!validating && inviteError && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            padding: '16px',
            color: '#ef4444',
            fontSize: '14px',
            textAlign: 'center',
          }}>
            {inviteError}
          </div>
        )}

        {!validating && inviteValid && step === 'SIGNUP' && (
          <>
            <div style={{
              backgroundColor: 'rgba(255,215,0,0.05)',
              border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <CheckCircle size={16} color="#22c55e" />
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Valid invite — grants <strong style={{ color: '#ffd700' }}>{membershipMonths} month{membershipMonths > 1 ? 's' : ''}</strong> of access
              </span>
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#ef4444',
                fontSize: '13px',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your_username"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Email Address {requireEmail ? '' : '(Optional)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 number, 1 letter"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <div onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#ffd700', cursor: 'pointer' }}
              />
              <label htmlFor="agreeTerms" style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.5', cursor: 'pointer' }}>
                I agree to the{' '}
                <a href="/terms" target="_blank" style={{ color: '#ffd700', textDecoration: 'underline' }}>Terms of Service</a>
                ,{' '}
                <a href="/privacy" target="_blank" style={{ color: '#ffd700', textDecoration: 'underline' }}>Privacy Policy</a>
                {' '}and{' '}
                <a href="/refund" target="_blank" style={{ color: '#ffd700', textDecoration: 'underline' }}>Refund Policy</a>
                .
              </label>
            </div>

            <div onClick={handleSignup} style={buttonStyle}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </div>
          </>
        )}

        {!validating && inviteValid && step === 'VERIFY' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              backgroundColor: 'rgba(255,215,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#ffd700'
            }}>
              <Mail size={32} />
            </div>
            
            <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Security Verification</p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              We sent a 6-digit code to <strong style={{ color: '#ffd700' }}>{email}</strong>. Enter it below.
            </p>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#ef4444',
                fontSize: '13px',
                marginBottom: '16px',
                textAlign: 'left',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                style={{
                  ...inputStyle,
                  textAlign: 'center',
                  fontSize: '24px',
                  letterSpacing: '8px',
                  fontWeight: 700,
                }}
              />
            </div>

            <div onClick={handleVerify} style={buttonStyle}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Verifying...' : 'Verify Email'}
            </div>

            <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
              Didn't receive code?{' '}
              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <span
                  onClick={handleResend}
                  style={{ color: '#ffd700', cursor: 'pointer', fontWeight: 600 }}
                >
                  Resend Code
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
