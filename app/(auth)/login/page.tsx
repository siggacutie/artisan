'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      router.replace('/games')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
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
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 700 }}>
            <span style={{ color: '#ffffff' }}>ARTISAN</span>
            <span style={{ color: '#ffd700' }}>store</span>
            <span style={{ color: '#475569', fontSize: '12px', marginLeft: '2px' }}>.xyz</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>Reseller Login</p>
        </div>

        {/* Error */}
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

        {/* Username */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="your_username"
            autoComplete="username"
            style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: '#050810',
              border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '12px 44px 12px 14px',
                backgroundColor: '#050810',
                border: '1px solid rgba(255,215,0,0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
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
          }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', marginTop: '20px' }}>
          Don't have access?{' '}
          <a href="https://wa.me/WHATSAPP_NUMBER_PLACEHOLDER" target="_blank" style={{ color: '#64748b' }}>
            Contact us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}
