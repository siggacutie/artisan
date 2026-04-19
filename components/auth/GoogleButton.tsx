"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/Icons"

interface GoogleButtonProps {
  inviteToken?: string
  callbackUrl?: string
}

export function GoogleButton({ inviteToken, callbackUrl = "/dashboard" }: GoogleButtonProps) {
  const handleSignIn = async () => {
    if (inviteToken) {
      // Set invite token in cookie for the callback to verify
      document.cookie = `invite_token=${inviteToken}; path=/; max-age=3600; SameSite=Lax`
    }
    await signIn("google", { callbackUrl })
  }

  return (
    <Button
      onClick={handleSignIn}
      className="w-full h-14 bg-white hover:bg-zinc-100 text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center space-x-3 transition-all"
    >
      <Icons.google className="w-6 h-6" />
      <span>Continue with Google</span>
    </Button>
  )
}
