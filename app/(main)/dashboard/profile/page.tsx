"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Lock,
  Loader2,
  Camera
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
    <div className="space-y-8 max-w-2xl">
      <div className="bg-[#0d1120] border border-gold/10 rounded-2xl p-8 space-y-8 shadow-2xl">
        <h3 className="text-xl font-bold font-orbitron text-white tracking-tight uppercase">Profile Settings</h3>
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div style={{ position: 'relative', width: '80px', height: '80px', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                style={{ borderRadius: '50%', width: '80px', height: '80px', objectFit: 'cover', border: '2px solid rgba(255,215,0,0.3)' }}
              />
            ) : (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,215,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Orbitron',
                fontSize: '32px',
                fontWeight: '900',
                color: '#ffd700',
                border: '2px solid rgba(255,215,0,0.3)',
              }}>
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '24px',
              height: '24px',
              backgroundColor: '#ffd700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #050810',
            }}>
              <Camera size={12} color="#050810" />
            </div>
            
            {uploading && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #ffffff40', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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

          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white">{name || user?.username || 'Player'}</h4>
            <p className="text-[12px] text-[#475569] font-medium" style={{ fontFamily: 'Inter' }}>Member since {memberSince}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Username</label>
            <div style={{ color: '#64748b', fontSize: '14px', padding: '12px 14px', backgroundColor: '#0a0f1e', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{user?.username}</span>
              <span style={{ color: '#475569', fontSize: '12px' }}>(contact admin to change)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Display Name</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              className="bg-[#0a0f1e] border border-[rgba(255,215,0,0.1)] text-white focus-visible:ring-gold h-12"
              style={{ fontFamily: 'Inter' }}
            />
          </div>
          
          <Button 
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full h-12 bg-[#ffd700] text-[#050810] font-bold uppercase tracking-widest hover:bg-[#ffd700]/90 transition-all rounded-md shadow-glow-gold"
            style={{ fontFamily: 'Inter' }}
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: toast.type === 'success' ? '#22c55e' : '#ef4444',
              color: 'white',
              fontFamily: 'Inter',
              fontSize: '13px',
              padding: '12px 20px',
              borderRadius: '8px',
              zIndex: 1000,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .shadow-glow-gold {
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
        }
        .shadow-glow-gold:hover {
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
