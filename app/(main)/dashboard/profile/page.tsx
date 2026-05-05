"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
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

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: '#050810',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: '14px',
    outline: 'none',
    display: 'block',
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: isMobile ? '72px 16px 80px' : '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#050810',
      boxSizing: 'border-box',
    }}>
      {/* Avatar Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '2px solid rgba(255,215,0,0.3)',
            overflow: 'hidden', position: 'relative',
            marginBottom: '8px',
            backgroundColor: 'rgba(255,215,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: 'Orbitron', fontSize: '32px', fontWeight: '900', color: '#ffd700' }}>
              {user?.username?.[0]?.toUpperCase() ?? 'U'}
            </span>
          )}
          
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px',
            backgroundColor: '#ffd700', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0d1120',
          }}>
            <Camera size={12} color="#050810" />
          </div>

          {uploading && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Loader2 className="animate-spin w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div style={{ color: '#ffd700', fontFamily: 'Orbitron', fontSize: '16px', fontWeight: 700 }}>
          {user.username}
        </div>
        <div style={{ color: '#475569', fontFamily: 'Inter', fontSize: '12px', marginTop: '2px', textTransform: 'uppercase' }}>
          MEMBER SINCE {memberSince}
        </div>
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

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="space-y-2">
          <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Username</label>
          <div style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', color: '#475569' }}>
            {user?.username}
          </div>
        </div>

        <div className="space-y-2">
          <label style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Display Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            style={inputStyle}
          />
        </div>

        <div onClick={handleUpdate} style={{
          width: '100%',
          background: '#ffd700',
          color: '#000',
          fontFamily: 'Inter',
          fontWeight: 700,
          fontSize: '15px',
          padding: '14px',
          borderRadius: '10px',
          textAlign: 'center',
          cursor: isUpdating ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {isUpdating && <Loader2 className="animate-spin w-4 h-4" />}
          {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
        </div>
      </div>

      {/* Auto-renew toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '16px',
        background: '#0d1120',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        marginTop: '16px',
        boxSizing: 'border-box',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#e2e8f0', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            AUTO-RENEW MEMBERSHIP
          </div>
          <div style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '12px', lineHeight: '1.5' }}>
            Automatically renew using coin balance.
          </div>
        </div>
        {/* Toggle */}
        <div style={{ flexShrink: 0 }}>
          <div
            onClick={handleAutoRenewToggle}
            style={{
              width: '40px', height: '22px', borderRadius: '11px',
              background: autoRenew ? '#22c55e' : '#334155',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{
              position: 'absolute', top: '2px',
              left: autoRenew ? '20px' : '2px',
              width: '18px', height: '18px', borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s ease',
            }} />
          </div>
        </div>
      </div>

      {autoRenew && (
        <div style={{
          marginTop: '12px',
          background: '#0d1120',
          border: '1px solid rgba(255,215,0,0.1)',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ color: '#94a3b8', fontFamily: 'Inter', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Renewal duration:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[1, 3, 6, 12].map(m => (
              <div
                key={m}
                onClick={() => setAutoRenewMonths(m)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${autoRenewMonths === m ? '#ffd700' : 'rgba(255,255,255,0.05)'}`,
                  background: autoRenewMonths === m ? 'rgba(255,215,0,0.1)' : '#050810',
                  color: autoRenewMonths === m ? '#ffd700' : '#64748b',
                  fontFamily: 'Inter', fontSize: '12px', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {m}M
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '80px', // Clearance for bottom nav
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
    </div>
  );
}
