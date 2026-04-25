'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coins, QrCode, Copy, CheckCircle, AlertTriangle, Info, ArrowLeft, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

const AMOUNTS = [1, 100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000]

// UTR Help Modal content
const UTR_HELP = [
  {
    app: 'PhonePe',
    steps: 'Go to History → tap the transaction → scroll down → find "UPI Transaction ID" — that is your UTR (12 digits starting with a number)',
  },
  {
    app: 'FamPay',
    steps: 'Go to activity → tap the transaction → find "UPI Transaction ID" or "UTR" — 12 digit number',
  },
  {
    app: 'Google Pay',
    steps: 'Go to transaction → tap "View Details" → find "UPI transaction ID" — 12 digit number',
  },
  {
    app: 'Paytm',
    steps: 'Go to Passbook → tap transaction → find "UTR No." at the bottom',
  },
  {
    app: 'BHIM',
    steps: 'Go to transactions → tap entry → find "Transaction Ref No." — 12 digits',
  },
  {
    app: 'Bank App',
    steps: 'Check your SMS or bank app transaction details — look for "UTR" or "Ref No" — 12-22 alphanumeric characters',
  },
]

export default function AddFundsPage() {
  const [step, setStep] = useState<'select' | 'pay' | 'done'>('select')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState<{
    id: string
    amount: number
    upiRef: string
    upiLink: string
    qrDataUrl: string
    expiresAt: string
  } | null>(null)
  const [utr, setUtr] = useState('')
  const [utrError, setUtrError] = useState('')
  const [utrSubmitting, setUtrSubmitting] = useState(false)
  const [showUtrHelp, setShowUtrHelp] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 min in seconds
  const [pollStatus, setPollStatus] = useState<string>('PENDING')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown timer
  useEffect(() => {
    if (step !== 'pay') return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [step])

  // Poll payment status every 8 seconds
  useEffect(() => {
    if (step !== 'pay' || !paymentData) return

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/wallet/payment-status?id=${paymentData.id}`)
        const data = await res.json()
        if (data.status === 'COMPLETED') {
          if (pollRef.current) clearInterval(pollRef.current)
          setPollStatus('COMPLETED')
          setStep('done')
          toast.success(`Deposit of ${paymentData.amount} coins successful!`, {
            position: 'top-right',
            duration: 5000,
          })
        } else if (data.status === 'EXPIRED') {
          if (pollRef.current) clearInterval(pollRef.current)
          setPollStatus('EXPIRED')
          setError('This payment link has expired. Please go back and create a new one.')
        }
      } catch {}
    }, 8000)

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, paymentData])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleCreateLink = async () => {
    if (!selectedAmount) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/wallet/create-upi-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedAmount }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create payment. Please try again.')
        return
      }
      setPaymentData(data)
      setTimeLeft(1800)
      setStep('pay')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyUPI = () => {
    const upiId = 'noblessem@ybl' // Use fallback or fetch from API if possible
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitUTR = async () => {
    setUtrError('')
    const cleaned = utr.trim().toUpperCase()

    if (!cleaned) {
      setUtrError('Please enter your UTR number.')
      return
    }

    if (!/^[A-Z0-9]{12,22}$/.test(cleaned)) {
      setUtrError('Invalid UTR format. UTR is 12-22 alphanumeric characters. Make sure you are entering the UTR number and NOT the Transaction ID.')
      return
    }

    setUtrSubmitting(true)
    try {
      const res = await fetch('/api/wallet/submit-utr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentLinkId: paymentData!.id, utrNumber: cleaned }),
      })
      const data = await res.json()
      if (!res.ok) {
        setUtrError(data.error || 'Failed to submit UTR.')
        return
      }
      // UTR submitted — wait for confirmation via polling
      setUtrError('')
      toast.info('UTR submitted. Waiting for confirmation...')
    } catch {
      setUtrError('Network error. Please try again.')
    } finally {
      setUtrSubmitting(false)
    }
  }

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#050810',
    }}>
      <AnimatePresence mode="wait">

        {/* STEP 1: Select Amount */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ marginBottom: '28px' }}>
              <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
                Add Coins
              </div>
              <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '14px' }}>
                Select an amount to top up your wallet
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {AMOUNTS.map(amount => (
                <div
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  style={{
                    background: selectedAmount === amount ? 'rgba(255,215,0,0.1)' : '#0d1120',
                    border: `1px solid ${selectedAmount === amount ? '#ffd700' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '10px',
                    padding: '14px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: selectedAmount === amount ? '0 0 0 1px rgba(255,215,0,0.3)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {amount === 1 && (
                    <div style={{
                      fontSize: '9px',
                      fontFamily: 'Inter',
                      color: '#f59e0b',
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      marginBottom: '4px',
                    }}>
                      TEST
                    </div>
                  )}
                  <div style={{ color: selectedAmount === amount ? '#ffd700' : '#e2e8f0', fontFamily: 'Orbitron', fontSize: '15px', fontWeight: '700' }}>
                    {amount}
                  </div>
                  <div style={{ color: '#475569', fontFamily: 'Inter', fontSize: '11px', marginTop: '2px' }}>
                    coins
                  </div>
                  <div style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>
                    ₹{amount}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontFamily: 'Inter', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div
              onClick={handleCreateLink}
              style={{
                background: selectedAmount && !loading ? '#ffd700' : 'rgba(255,215,0,0.3)',
                color: '#000',
                fontFamily: 'Inter',
                fontWeight: '700',
                fontSize: '15px',
                padding: '14px',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: selectedAmount && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? 'Creating payment...' : selectedAmount ? 'Buy' : 'Select an amount'}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Pay */}
        {step === 'pay' && paymentData && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div
              onClick={() => setStep('select')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontFamily: 'Inter', fontSize: '13px' }}
            >
              <ArrowLeft size={14} /> Back
            </div>

            {/* Timer */}
            <div style={{
              background: timeLeft < 300 ? 'rgba(239,68,68,0.08)' : 'rgba(255,215,0,0.06)',
              border: `1px solid ${timeLeft < 300 ? 'rgba(239,68,68,0.2)' : 'rgba(255,215,0,0.15)'}`,
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <span style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '12px' }}>Expires in</span>
              <span style={{ color: timeLeft < 300 ? '#ef4444' : '#ffd700', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: '700' }}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Amount */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '32px', fontWeight: '700' }}>
                ₹{paymentData.amount}
              </div>
              <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px' }}>
                = {paymentData.amount} coins after payment
              </div>
            </div>

            {/* QR Code */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}>
              <img src={paymentData.qrDataUrl} alt="UPI QR Code" style={{ width: '220px', height: '220px' }} />
            </div>

            {/* UPI ID copy */}
            <div style={{
              background: '#0d1120',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <div>
                <div style={{ color: '#475569', fontFamily: 'Inter', fontSize: '11px', marginBottom: '2px' }}>Pay to UPI ID</div>
                <div style={{ color: '#e2e8f0', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
                  {paymentData.upiLink.split('pa=')[1]?.split('&')[0] || 'noblessem@ybl'}
                </div>
              </div>
              <div onClick={handleCopyUPI} style={{ cursor: 'pointer', color: copied ? '#22c55e' : '#ffd700' }}>
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </div>
            </div>

            {/* Reference */}
            <div style={{ color: '#475569', fontFamily: 'Inter', fontSize: '11px', textAlign: 'center', marginBottom: '20px' }}>
              Add note: <span style={{ color: '#ffd700', fontWeight: '600' }}>{paymentData.upiRef}</span> (optional but helps)
            </div>

            {/* Open in UPI app button */}
            <a
              href={paymentData.upiLink}
              style={{
                display: 'block',
                background: 'rgba(0,195,255,0.1)',
                border: '1px solid rgba(0,195,255,0.2)',
                borderRadius: '10px',
                padding: '12px',
                color: '#00c3ff',
                fontFamily: 'Inter',
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
                textDecoration: 'none',
                marginBottom: '24px',
              }}
            >
              Open in UPI App
            </a>

            {/* UTR Entry */}
            <div style={{
              background: '#0d1120',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ color: '#e2e8f0', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600' }}>
                  Enter UTR Number
                </div>
                <div onClick={() => setShowUtrHelp(true)} style={{ cursor: 'pointer', color: '#475569' }}>
                  <Info size={16} />
                </div>
              </div>

              <div style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '12px',
              }}>
                <div style={{ color: '#f59e0b', fontFamily: 'Inter', fontSize: '12px', lineHeight: '1.5' }}>
                  Enter your UTR number after completing the payment. Do NOT enter the Transaction ID — the UTR is a 12-digit number found in your payment app history.
                </div>
              </div>

              <input
                type="text"
                value={utr}
                onChange={e => setUtr(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
                maxLength={22}
                placeholder="e.g. 123456789012"
                style={{
                  width: '100%',
                  background: '#050810',
                  border: `1px solid ${utrError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '11px 14px',
                  color: '#fff',
                  fontFamily: 'Inter',
                  fontSize: '15px',
                  letterSpacing: '1px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {utrError && (
                <div style={{ color: '#ef4444', fontFamily: 'Inter', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <AlertTriangle size={12} style={{ marginTop: '2px', flexShrink: 0 }} />
                  {utrError}
                </div>
              )}

              <div
                onClick={handleSubmitUTR}
                style={{
                  background: utrSubmitting ? 'rgba(255,215,0,0.3)' : '#ffd700',
                  color: '#000',
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  fontSize: '14px',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: utrSubmitting ? 'not-allowed' : 'pointer',
                  marginTop: '12px',
                  transition: 'all 0.15s ease',
                }}
              >
                {utrSubmitting ? 'Submitting...' : 'Submit UTR'}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Done */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', paddingTop: '60px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(34,197,94,0.15)',
                border: '2px solid rgba(34,197,94,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <CheckCircle size={40} color="#22c55e" />
            </motion.div>
            <div style={{ color: '#22c55e', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              Payment Confirmed
            </div>
            <div style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '14px', marginBottom: '32px' }}>
              {paymentData?.amount} coins have been added to your wallet.
            </div>
            <div
              onClick={() => window.location.href = '/dashboard/wallet'}
              style={{
                background: '#ffd700', color: '#000', fontFamily: 'Inter',
                fontWeight: '700', fontSize: '14px', padding: '12px 28px',
                borderRadius: '10px', cursor: 'pointer', display: 'inline-block',
              }}
            >
              View Wallet
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* UTR Help Modal */}
      {showUtrHelp && (
        <div
          onClick={() => setShowUtrHelp(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 100, padding: '0',
          }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0d1120',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px 20px 0 0',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ color: '#fff', fontFamily: 'Orbitron', fontSize: '16px', marginBottom: '6px' }}>
              How to find your UTR
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px', marginBottom: '20px' }}>
              The UTR is different from the Transaction ID
            </div>
            {UTR_HELP.map(h => (
              <div key={h.app} style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                paddingBottom: '14px', marginBottom: '14px',
              }}>
                <div style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                  {h.app}
                </div>
                <div style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '13px', lineHeight: '1.6' }}>
                  {h.steps}
                </div>
              </div>
            ))}
            <div
              onClick={() => setShowUtrHelp(false)}
              style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: '8px',
                padding: '12px', textAlign: 'center', color: '#64748b',
                fontFamily: 'Inter', fontSize: '14px', cursor: 'pointer', marginTop: '8px',
              }}
            >
              Close
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
