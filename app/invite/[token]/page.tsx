'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [validating, setValidating] = useState(true)
  const [inviteValid, setInviteValid] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [membershipMonths, setMembershipMonths] = useState(1)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/invite/validate/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setInviteValid(true)
          setMembershipMonths(data.membershipMonths ?? 1)
        } else {
          setInviteError(data.error || 'Invalid or expired invite link')
        }
      })
      .catch(() => setInviteError('Failed to validate invite link'))
      .finally(() => setValidating(false))
  }, [token])

  async function handleSignup() {
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service, Privacy Policy, and Refund Policy')
      return
    }
    if (!username.trim() || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/invite/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username: username.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create account')
        return
      }
      router.replace('/games')
    } catch {
      setError('Network error. Please try again.')
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
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>Create your reseller account</p>
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

        {!validating && inviteValid && (
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
              <p style={{ color: '#475569', fontSize: '11px', marginTop: '4px' }}>
                3-20 characters. Letters, numbers, underscores only.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button onClick={() => setShowConfirm(!showConfirm)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Policy Agreement Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="policy-agree"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                style={{ accentColor: '#ffd700', marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="policy-agree" style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', cursor: 'pointer' }}>
                I agree to the <Link href="/terms" target="_blank" style={{ color: '#ffd700', textDecoration: 'none' }}>Terms of Service</Link>, <Link href="/privacy" target="_blank" style={{ color: '#ffd700', textDecoration: 'none' }}>Privacy Policy</Link>, and <Link href="/refund" target="_blank" style={{ color: '#ffd700', textDecoration: 'none' }}>Refund Policy</Link>.
              </label>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading || !agreedToTerms}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: (loading || !agreedToTerms) ? '#334155' : '#ffd700',
                color: '#050810',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                cursor: (loading || !agreedToTerms) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
