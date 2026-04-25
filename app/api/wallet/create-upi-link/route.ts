import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
import crypto from 'crypto'

const ALLOWED_AMOUNTS = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000]
const UPI_ID = process.env.UPI_ID || 'noblessem@ybl'
const STORE_NAME = 'ArtisanStore'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getResellerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  // Rate limit: max 3 active PENDING payment links per user at once
  const activeLinkCount = await prisma.paymentLink.count({
    where: {
      userId: session.id,
      status: 'PENDING',
      expiresAt: { gt: new Date() },
    },
  })

  if (activeLinkCount >= 3) {
    return NextResponse.json({
      error: 'You have too many pending payments. Wait for them to expire or complete one first.'
    }, { status: 429 })
  }

  const body = await req.json()
  const amount = Number(body.amount)

  if (!ALLOWED_AMOUNTS.includes(amount)) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  // Generate unique internal reference (8 char alphanumeric)
  const upiRef = 'ART' + crypto.randomBytes(4).toString('hex').toUpperCase()

  // UPI deep link
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(STORE_NAME)}&am=${amount}&cu=INR&tn=${upiRef}`

  // Generate QR as base64 data URL
  const qrDataUrl = await QRCode.toDataURL(upiLink, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

  const paymentLink = await prisma.paymentLink.create({
    data: {
      userId: session.id,
      amount,
      upiRef,
      status: 'PENDING',
      expiresAt,
      ipAddress: ip,
    },
  })

  return NextResponse.json({
    id: paymentLink.id,
    amount,
    upiRef,
    upiLink,
    qrDataUrl,
    expiresAt: expiresAt.toISOString(),
  })
}
