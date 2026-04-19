import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { ShieldCheck } from "lucide-react"

interface JoinPageProps {
  params: {
    token: string
  }
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { token } = params

  const invite = await prisma.inviteLink.findUnique({
    where: { token }
  })

  if (!invite) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
        <div className="bg-[#0d1120] border border-red-500/20 rounded-[2.5rem] p-12 text-center max-w-md">
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Invalid Invitation</h1>
          <p className="text-zinc-500 text-sm">This invitation link is invalid or does not exist.</p>
        </div>
      </div>
    )
  }

  if (invite.isUsed) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
        <div className="bg-[#0d1120] border border-red-500/20 rounded-[2.5rem] p-12 text-center max-w-md">
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Link Already Used</h1>
          <p className="text-zinc-500 text-sm">This invitation has already been used to create an account.</p>
        </div>
      </div>
    )
  }

  if (invite.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
        <div className="bg-[#0d1120] border border-red-500/20 rounded-[2.5rem] p-12 text-center max-w-md">
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Link Expired</h1>
          <p className="text-zinc-500 text-sm">This invitation has expired. Please request a new link.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#0d1120] border border-white/5 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold/5 blur-[80px] rounded-full" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 mx-auto">
              <ShieldCheck className="text-gold" size={32} />
            </div>
            
            <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter mb-4 italic leading-tight">
              You've Been Invited
            </h1>
            <p className="text-zinc-500 text-sm font-medium mb-12">
              Join the ArtisanStore.xyz reseller network and get access to exclusive pricing.
            </p>

            <div className="space-y-4">
              <GoogleButton inviteToken={token} />
              <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em] mt-8">
                Strictly for verified resellers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
