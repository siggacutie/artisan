import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { checkSuspiciousActivity } from "@/lib/suspiciousActivity"
import { cookies, headers } from "next/headers"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // 1. Find user by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { 
            id: true, 
            role: true, 
            isBanned: true, 
            isReseller: true, 
            membershipExpiresAt: true,
            isFrozen: true
          }
        })

        const headerList = await headers()
        const ip = headerList.get('x-forwarded-for') || '0.0.0.0'
        const ua = headerList.get('user-agent') || 'unknown'

        if (existingUser) {
          // 2. Reject if not reseller
          if (!existingUser.isReseller) {
            return false
          }

          // 3. Reject if banned
          if (existingUser.isBanned) {
            return false
          }

          // 5. Update lastSeenAt
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastSeenAt: new Date() }
          })

          // Single device enforcement
          const sessionId = crypto.randomUUID()
          const existingSession = await prisma.activeSession.findUnique({
            where: { userId: existingUser.id }
          })

          if (existingSession) {
            await checkSuspiciousActivity(existingUser.id, existingSession)
          }

          await prisma.activeSession.upsert({
            where: { userId: existingUser.id },
            create: { userId: existingUser.id, sessionId, ip, userAgent: ua },
            update: { sessionId, ip, userAgent: ua, updatedAt: new Date() },
          })

          return true
        }

        // New user — must have valid pending invite claim
        const cookieStore = await cookies()
        const inviteToken = cookieStore.get('pending_invite')?.value

        if (!inviteToken) {
          return false
        }

        const pendingInvite = await prisma.inviteLink.findUnique({
          where: { token: inviteToken }
        })

        if (!pendingInvite || pendingInvite.isUsed || (pendingInvite.expiresAt && new Date() > pendingInvite.expiresAt)) {
          return false
        }

        // Mark as used immediately
        await prisma.inviteLink.update({
          where: { id: pendingInvite.id },
          data: { isUsed: true, usedBy: user.email, usedAt: new Date() },
        })

        return true
      }
      return false
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        // On sign-in: fetch fresh user data from DB
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          select: {
            id: true,
            isReseller: true,
            isBanned: true,
            isFrozen: true,
            walletBalance: true,
            membershipExpiresAt: true,
            membershipMonths: true,
          },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.isReseller = dbUser.isReseller
          token.isBanned = dbUser.isBanned
          token.isFrozen = dbUser.isFrozen
          token.walletBalance = dbUser.walletBalance
          token.membershipExpiresAt = dbUser.membershipExpiresAt?.toISOString() ?? null
          token.membershipMonths = dbUser.membershipMonths
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        ;(session.user as any).isReseller = token.isReseller as boolean
        ;(session.user as any).isBanned = token.isBanned as boolean
        ;(session.user as any).isFrozen = token.isFrozen as boolean
        ;(session.user as any).walletBalance = token.walletBalance as number
        ;(session.user as any).membershipExpiresAt = token.membershipExpiresAt as string | null
        ;(session.user as any).membershipMonths = token.membershipMonths as number | null
      }
      return session
    }
  },

  events: {
    async createUser({ user }) {
      const cookieStore = await cookies()
      const inviteToken = cookieStore.get('pending_invite')?.value
      
      let membershipExpiresAt: Date | null = null
      let membershipMonths: number = 1

      if (inviteToken) {
        const invite = await prisma.inviteLink.findUnique({ where: { token: inviteToken } })
        if (invite) {
          membershipMonths = invite.membershipMonths || 1
          membershipExpiresAt = new Date()
          membershipExpiresAt.setMonth(membershipExpiresAt.getMonth() + membershipMonths)
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isReseller: true, 
          role: 'RESELLER',
          membershipExpiresAt,
          membershipMonths,
          lastSeenAt: new Date()
        }
      })
    }
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
})
