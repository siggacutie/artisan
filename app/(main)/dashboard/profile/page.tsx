"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fetchUser = async () => {
    try {
      const r = await fetch('/api/reseller/auth/me', { cache: 'no-store' })
      if (r.ok) {
        const data = await r.json()
        setUser(data)
        setName(data.name ?? "")
        setAvatarUrl(data.avatarUrl ?? null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [router])

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [autoRenew, setAutoRenew] = useState(false)
  const [autoRenewMonths, setAutoRenewMonths] = useState(1)

  useEffect(() => {
    if (user) {
      setAutoRenew(user.autoRenew ?? false)
      setAutoRenewMonths(user.autoRenewMonths ?? 1)
    }
  }, [user])

  const handleAutoRenewToggle = async () => {
    const newValue = !autoRenew
    setAutoRenew(newValue)
    try {
      await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRenew: newValue, autoRenewMonths }),
      })
      showToast(`Auto-renew ${newValue ? 'enabled' : 'disabled'}`, 'success')
    } catch {
      showToast('Failed to update auto-renew', 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Profile updated successfully", "success");
        await fetchUser();
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "...";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
      <div style={{
        background: '#0d1120',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '24px',
        padding: isMobile ? '24px' : '32px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent)'
        }} />
        
        <h3 style={{ color: '#ffffff', fontFamily: 'Orbitron', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '32px' }}>Profile</h3>
        
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? '24px' : '32px',
          marginBottom: '40px'
        }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,215,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '2px solid rgba(255,215,0,0.3)',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontFamily: 'Orbitron', fontSize: '40px', fontWeight: '900', color: '#ffd700' }}>
                  {user?.username?.[0]?.toUpperCase() ?? 'U'}
                </span>
              )}
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '32px',
              height: '32px',
              backgroundColor: '#ffd700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #0d1120',
            }}>
              <Camera size={14} color="#050810" />
            </div>
            
            {uploading && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '24px', height: '24px', border: '2px solid #ffffff40', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                showToast('Image must be under 2MB', 'error');
                return;
              }
              setUploading(true);
              try {
                const formData = new FormData();
                formData.append('avatar', file);
                const res = await fetch('/api/dashboard/avatar', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                  setAvatarUrl(data.avatarUrl);
                  showToast('Profile picture updated', 'success');
                  await fetchUser();
                } else {
                  showToast(data.error ?? 'Upload failed', 'error');
                }
              } catch {
                showToast('Upload failed. Please try again.', 'error');
              } finally {
                setUploading(false);
              }
            }}
          />

          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h4 style={{ color: '#ffffff', fontFamily: 'Inter', fontSize: '20px', fontWeight: '700', margin: 0 }}>{name || user?.username || 'Player'}</h4>
            <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Member since {memberSince}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="space-y-3">
            <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>Username</label>
            <div style={{ 
              color: '#94a3b8', 
              fontSize: '14px', 
              padding: '16px 20px', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.05)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <span style={{ fontWeight: '600' }}>{user?.username}</span>
              {!isMobile && <span style={{ color: '#475569', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>(Contact admin to change)</span>}
            </div>
          </div>

          <div className="space-y-3">
            <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>Display Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              style={{
                width: '100%',
                background: '#050810',
                border: '1px solid rgba(255,215,0,0.1)',
                borderRadius: '12px',
                padding: '16px 20px',
                color: '#ffffff',
                fontFamily: 'Inter',
                fontSize: '15px',
                fontWeight: '600',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <Button 
            onClick={handleUpdate}
            disabled={isUpdating}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#ffd700',
              color: '#050810',
              fontFamily: 'Inter',
              fontSize: '13px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Auto-Renewal Section */}
      <div style={{
        background: '#0d1120',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: '24px',
        padding: isMobile ? '24px' : '32px',
      }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ color: '#fff', fontFamily: 'Orbitron', fontSize: '14px', marginBottom: '4px', textTransform: 'uppercase' }}>
              Auto-Renew Membership
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '13px' }}>
              Automatically renew using coin balance.
            </div>
          </div>
          {/* Toggle */}
          <div
            onClick={handleAutoRenewToggle}
            style={{
              width: '44px', height: '24px', borderRadius: '12px',
              background: autoRenew ? '#22c55e' : '#334155',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.2s ease', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: '3px',
              left: autoRenew ? '23px' : '3px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s ease',
            }} />
          </div>
        </div>
        {autoRenew && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '12px', marginBottom: '12px' }}>
              Select renewal duration:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 3, 6, 12].map(m => (
                <div
                  key={m}
                  onClick={() => setAutoRenewMonths(m)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: `1px solid ${autoRenewMonths === m ? '#ffd700' : 'rgba(255,255,255,0.05)'}`,
                    background: autoRenewMonths === m ? 'rgba(255,215,0,0.1)' : '#050810',
                    color: autoRenewMonths === m ? '#ffd700' : '#64748b',
                    fontFamily: 'Inter', fontSize: '13px', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {m} Month{m > 1 ? 's' : ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
              color: 'white',
              fontFamily: 'Inter',
              fontSize: '13px',
              fontWeight: '700',
              padding: '12px 24px',
              borderRadius: '99px',
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
