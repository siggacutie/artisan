"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  History,
  ChevronRight,
  Coins
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [walletData, setWalletData] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch('/api/dashboard/summary', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        setWalletData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('[wallet]', err)
        setError('Failed to load wallet. Tap to retry.')
        setLoading(false)
      })
  }, [refreshKey])

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '200px', color: '#64748b', fontFamily: 'Inter', fontSize: '14px'
    }}>
      Loading wallet...
    </div>
  )

  if (error) return (
    <div
      onClick={() => { setRefreshKey(prev => prev + 1) }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '200px', color: '#ef4444', fontFamily: 'Inter', fontSize: '14px',
        cursor: 'pointer', textAlign: 'center', padding: '24px',
      }}
    >
      {error}
    </div>
  )

  const coinBalance = Math.floor(walletData?.walletBalance ?? 0);
  const totalSpentCoins = Math.floor(walletData?.totalSpent ?? 0);

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      padding: isMobile ? '16px' : '24px',
      paddingBottom: isMobile ? '80px' : '32px',
    }}>
      {/* Wallet balance card */}
      <div style={{
        background: '#0d1120',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: '16px',
        padding: isMobile ? '20px' : '28px',
        marginBottom: '16px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
        }} />

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,215,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,215,0,0.2)'
              }}>
                <Coins size={16} color="#ffd700" />
              </div>
              <span style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Artisan Wallet
              </span>
            </div>

            <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontWeight: '700', fontSize: isMobile ? '40px' : '56px', letterSpacing: '-1px' }}>
              {coinBalance} <span style={{ fontSize: '16px', opacity: 0.6 }}>COINS</span>
            </div>
          </div>

          <Link href="/wallet/add" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
            <button style={{
              width: '100%',
              minWidth: isMobile ? '100%' : '180px',
              height: '48px',
              backgroundColor: '#ffd700',
              color: '#050810',
              fontFamily: 'Inter',
              fontSize: '13px',
              fontWeight: '800',
              textTransform: 'uppercase',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255,215,0,0.2)'
            }}>
              Add Funds
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div>
            <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700' }}>
              {totalSpentCoins}
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', textTransform: 'uppercase', marginTop: '4px', fontWeight: '600' }}>
              Coins Spent
            </div>
          </div>
          <div>
            <div style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '20px', fontWeight: '700' }}>
              {walletData?.orderCount ?? 0}
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', textTransform: 'uppercase', marginTop: '4px', fontWeight: '600' }}>
              Total Orders
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: '#0d1120',
        border: '1px solid rgba(255,215,0,0.1)',
        borderLeft: '4px solid #ffd700',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Coins size={18} color="#ffd700" />
          <div>
            <p style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '13px', fontWeight: '700', margin: 0 }}>
              1 Coin = 1 INR
            </p>
            {!isMobile && <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', margin: '2px 0 0 0' }}>Instant checkout on all games.</p>}
          </div>
        </div>
        <Link href="/wallet/add" style={{ color: '#ffd700', fontFamily: 'Inter', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', textDecoration: 'none' }}>
          Add <ChevronRight size={14} style={{ display: 'inline', marginBottom: '-3px' }} />
        </Link>
      </div>

      {/* Transaction List Section (Placeholder style if transactions exist) */}
      {walletData?.transactions && walletData.transactions.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Recent Transactions
          </h3>
          {walletData.transactions.map((transaction: any, idx: number) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}>
              <div style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
              }}>
                <div style={{
                  color: '#e2e8f0', fontFamily: 'Inter', fontSize: '13px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {transaction.description}
                </div>
                <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '10px', marginTop: '2px' }}>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ flexShrink: 0, color: transaction.type === 'CREDIT' ? '#22c55e' : '#ef4444', fontFamily: 'Orbitron', fontSize: '14px', fontWeight: '700' }}>
                {transaction.type === 'CREDIT' ? '+' : '-'}{Math.floor(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
