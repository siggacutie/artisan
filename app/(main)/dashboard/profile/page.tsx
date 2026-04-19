"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Lock,
  Loader2,
  Camera
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [summary, setSummary] = useState<any>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then(r => r.json())
      .then(s => {
        setSummary(s);
        setName(s.name ?? "");
        setImage(s.image ?? "");
      });
  }, []);

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
        body: JSON.stringify({ name, image })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Profile updated successfully", "success");
        await update();
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const memberSince = summary?.createdAt 
    ? new Date(summary.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "...";

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-[#0d1120] border border-gold/10 rounded-2xl p-8 space-y-8 shadow-2xl">
        <h3 className="text-xl font-bold font-orbitron text-white tracking-tight uppercase">Profile Settings</h3>
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div style={{ position: 'relative', width: '72px', height: '72px', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            {image || summary?.image ? (
              <img
                src={image || summary?.image}
                alt="avatar"
                width={72}
                height={72}
                style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,215,0,0.3)' }}
              />
            ) : (
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#ffd700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter',
                fontSize: '24px',
                fontWeight: '900',
                color: '#050810',
                border: '2px solid rgba(255,215,0,0.3)',
              }}>
                {name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '22px',
              height: '22px',
              backgroundColor: '#ffd700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #050810',
            }}>
              <Camera size={11} color="#050810" />
            </div>
            
            {uploading && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff40', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
                formData.append('file', file);
                const res = await fetch('/api/dashboard/avatar', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                  setImage(data.image);
                  setSummary((prev: any) => ({ ...prev, image: data.image }));
                  showToast('Profile picture updated', 'success');
                  await update();
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
            <h4 className="text-lg font-bold text-white">{name || 'Player'}</h4>
            <p className="text-[12px] text-[#475569] font-medium" style={{ fontFamily: 'Inter' }}>Member since {memberSince}</p>
          </div>
        </div>

        <div className="space-y-6">
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
          
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Profile Picture URL</label>
            <Input 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="bg-[#0a0f1e] border border-[rgba(255,215,0,0.1)] text-white focus-visible:ring-gold h-12"
              style={{ fontFamily: 'Inter' }}
            />
            <p className="text-[10px] text-gray-600 mt-1 italic">Enter a public image URL to update your profile photo.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Input 
                value={summary?.email ?? ""} 
                readOnly
                className="bg-[#0a0f1e]/50 border border-[rgba(255,215,0,0.05)] text-[#64748b] h-12 pr-10 cursor-not-allowed"
                style={{ fontFamily: 'Inter' }}
              />
              <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#334155]" />
            </div>
          </div>
          
          <Button 
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full h-12 bg-[#ffd700] text-[#050810] font-bold uppercase tracking-widest hover:bg-[#ffd700]/90 transition-all rounded-md"
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
      `}</style>
    </div>
  );
}
