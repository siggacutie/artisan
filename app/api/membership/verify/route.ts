import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const MEMBERSHIP_PRICES: Record<number, number> = {
  1: 250,
  3: 699,
  6: 1299,
  12: 2699,
}

export async function POST(req: NextRequest) {
  const session = await getResellerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, months } = await req.json()

    // Verify HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const amountInr = MEMBERSHIP_PRICES[months]
    if (!amountInr) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: session.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Calculate new expiry: if already expired, start from now. If somehow still active, extend from current expiry.
    const base = !user.membershipExpiresAt || new Date(user.membershipExpiresAt) < new Date()
      ? new Date()
      : new Date(user.membershipExpiresAt)

    const newExpiry = new Date(base)
    newExpiry.setMonth(newExpiry.getMonth() + months)

    await prisma.user.update({
      where: { id: session.id },
      data: {
        membershipExpiresAt: newExpiry,
        membershipMonths: months,
        isReseller: true,
        isFrozen: false,
      },
    })

    // Log the payment
    await prisma.membershipPayment.create({
      data: {
        userId: session.id,
        months,
        amountInr,
        status: 'PAID',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[membership/verify]', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
