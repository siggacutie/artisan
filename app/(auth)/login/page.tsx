'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff, AlertTriangle, Mail } from 'lucide-react'
import Link from 'next/link'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const reason = searchParams.get('reason')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // OTP / Forgot Flow State
  const [step, setStep] = useState<'LOGIN' | 'OTP' | 'FORGOT_EMAIL' | 'FORGOT_RESET'>('LOGIN')
  const [userId, setUserId] = useState<string | null>(null)
  const [otp, setOtp] = useState('')

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError('Please enter your username and password')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reseller/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      
      if (res.status === 429) {
        setError(`Too many attempts. Try again in ${data.retryAfter ? Math.ceil(data.retryAfter / 60) : 15} minutes.`)
        return
      }

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      if (data.requiresOtp) {
        setUserId(data.userId)
        setStep('OTP')
      } else {
        router.replace(redirect || '/games')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify2fa() {
    if (otp.length !== 6) {
      setError('Enter 6-digit code')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reseller/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        return
      }
      router.replace(redirect || '/games')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotEmail() {
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reseller/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }
      setStep('FORGOT_RESET')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    if (!otp || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reseller/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: otp, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Password reset failed')
        return
      }
      alert('Password reset. You can now log in.')
      setStep('LOGIN')
      setOtp('')
      setPassword('')
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '24px',
    }}>
      {/* Task 4B: Reason Banners */}
      {reason === 'session_expired' && (
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#0d1120',
          border: '1px solid rgba(255,215,0,0.1)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#ffd700',
          fontSize: '13px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          You were signed out because your account was accessed from another device.
        </div>
      )}

      {reason === 'banned' && (
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#ef4444',
          fontSize: '13px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          Your account has been suspended. Contact support.
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#0d1120',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: '16px',
        padding: '40px 32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 700 }}>
            <span style={{ color: '#ffffff' }}>ARTISAN</span>
            <span style={{ color: '#ffd700' }}>store</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>Reseller Portal</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {step === 'LOGIN' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your_username"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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
            {/* Task 2D: Forgot Password Link */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <span 
                onClick={() => { setStep('FORGOT_EMAIL'); setError(null); }}
                style={{ color: '#ffd700', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
              >
                Forgot password?
              </span>
            </div>
            <div onClick={handleLogin} style={buttonStyle}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </div>
          </>
        )}

        {step === 'OTP' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '30px', backgroundColor: 'rgba(255,215,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#ffd700'
            }}>
              <Mail size={32} />
            </div>
            <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Security Verification</p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              A verification code has been sent to your email.
            </p>
            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                style={{ ...inputStyle, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 700 }}
              />
            </div>
            <div onClick={handleVerify2fa} style={buttonStyle}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Verifying...' : 'Verify & Login'}
            </div>
            <div style={{ marginTop: '20px' }}>
              <span onClick={() => setStep('LOGIN')} style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>Back to Login</span>
            </div>
          </div>
        )}

        {step === 'FORGOT_EMAIL' && (
          <>
            <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>Forgot Password</p>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
              Enter your email to receive a password reset code.
            </p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
            <div onClick={handleForgotEmail} style={buttonStyle}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Sending...' : 'Send Reset Code'}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <span onClick={() => setStep('LOGIN')} style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>Back to Login</span>
            </div>
          </>
        )}

        {step === 'FORGOT_RESET' && (
          <>
            <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>Reset Password</p>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
              Enter the code sent to your email and your new password.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                style={{ ...inputStyle, textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, 1 number, 1 letter"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                style={inputStyle}
              />
            </div>
            <div onClick={handleResetPassword} style={buttonStyle}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Resetting...' : 'Reset Password'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050810]" />}>
      <LoginContent />
    </Suspense>
  )
}
