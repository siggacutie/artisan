'use client'
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Loader2, MessageCircle } from 'lucide-react'

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const errorMessages: Record<string, string> = {
    not_authorized: 'Access restricted. Contact us on WhatsApp to become a reseller.',
    account_banned: 'Your account has been suspended. Contact support.',
    not_reseller: 'This account does not have reseller access.',
    no_invite: 'No valid invite found. Please use a valid invite link to sign up.',
    AccessDenied: 'Access restricted. Contact us on WhatsApp to become a reseller.',
  }

  const errorMessage = error ? (errorMessages[error] || 'Login failed. Please try again.') : null

  useEffect(() => {
    if (status === "loading") return
    if (session?.user) {
      router.replace("/games")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#0d1120', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '16px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Orbitron', color: '#ffffff' }}>
            ARTISAN<span style={{ color: '#ffd700' }}>store</span>
          </div>
          <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '8px' }}>
            Reseller Login
          </div>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px',
            padding: '12px 14px',
            color: '#ef4444',
            fontFamily: 'Inter',
            fontSize: '13px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            {errorMessage}
          </div>
        )}

        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              style={{ marginTop: '4px' }}
            />
            <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.4' }}>
              I agree to the <a href="/terms" target="_blank" style={{ color: '#ffd700' }}>Terms of Service</a> and <a href="/privacy" target="_blank" style={{ color: '#ffd700' }}>Privacy Policy</a>.
            </span>
          </label>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/games" })}
          disabled={!acceptedTerms}
          style={{
            width: "100%", padding: "14px 24px",
            backgroundColor: acceptedTerms ? "#ffffff" : "#1a1a1a",
            color: acceptedTerms ? "#050810" : "#475569",
            border: "none", borderRadius: "10px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: "700",
            cursor: acceptedTerms ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "12px", transition: 'all 0.2s'
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
          Continue with Google
        </button>

        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
          <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px', marginBottom: '12px' }}>
            Don't have access?
          </p>
          <a href="https://wa.me/919387606432" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            color: '#ffd700', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600', textDecoration: 'none'
          }}>
            <MessageCircle size={18} />
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#050810' }} />}>
      <LoginContent />
    </Suspense>
  )
}
