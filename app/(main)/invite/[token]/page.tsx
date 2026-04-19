'use client'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function InvitePage() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [valid, setValid] = useState(false)
  const [reason, setReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (token) {
      fetch(`/api/invite/validate/${token}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            setValid(true)
          } else {
            setReason(data.reason)
          }
        })
        .catch(() => setReason('Failed to validate link'))
        .finally(() => setLoading(false))
    }
  }, [token])

  const handleSignUp = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/invite/use-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (res.ok) {
        sessionStorage.setItem('inviteToken', token as string)
        await signIn('google', { callbackUrl: '/games' })
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to use token')
        setProcessing(false)
      }
    } catch (err) {
      alert('Something went wrong')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-6">
      <div className="bg-[#0d1120] border border-white/5 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="font-orbitron font-black text-2xl text-white tracking-tighter uppercase mb-2">
            ARTISAN<span className="text-gold">store</span>
          </div>
          <div className="text-[#64748b] font-inter text-xs uppercase tracking-[3px]">
            Reseller Invite
          </div>
        </div>

        {valid ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <CheckCircle2 size={32} />
              </div>
            </div>
            <h1 className="text-white font-orbitron text-xl font-bold mb-4">Invitation Valid!</h1>
            <p className="text-gray-400 font-inter text-sm mb-8">
              You've been invited to join ArtisanStore as a verified reseller. Sign up with Google to get started.
            </p>
            <button
              onClick={handleSignUp}
              disabled={processing}
              className="w-full bg-[#ffd700] hover:bg-[#e6c200] text-black font-inter font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {processing ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle size={32} />
              </div>
            </div>
            <h1 className="text-white font-orbitron text-xl font-bold mb-4">Invalid Invitation</h1>
            <p className="text-gray-400 font-inter text-sm mb-8">
              {reason || 'This invitation link is no longer valid or has expired.'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-inter font-bold py-4 rounded-xl transition-all"
            >
              Back to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  )
}
