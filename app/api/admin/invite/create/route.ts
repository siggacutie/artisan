import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession()
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const membershipMonths: number = Number(body.membershipMonths) || 1

    if (![1, 3, 6, 12].includes(membershipMonths)) {
      return NextResponse.json({ error: 'Invalid membership duration' }, { status: 400 })
    }

    const pricingConfig = await prisma.pricingConfig.findFirst()
    const expiryHours = pricingConfig?.inviteLinkExpiryHours ?? 2
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000)

    const invite = await prisma.inviteLink.create({
      data: {
        createdBy: admin.email,
        expiresAt,
        membershipMonths,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const link = `${baseUrl}/invite/${invite.token}`

    return NextResponse.json({ link, token: invite.token, expiresAt, membershipMonths })
  } catch (error) {
    console.error('[invite/create] Error:', error)
    return NextResponse.json({ error: 'Failed to create invite link' }, { status: 500 })
  }
}
