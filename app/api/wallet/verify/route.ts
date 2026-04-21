import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import Razorpay from 'razorpay'

const ALLOWED_AMOUNTS = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000]

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const session = await getResellerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
  }

  // Step 1: Verify HMAC signature — cannot be faked without key_secret
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    console.error('[wallet/verify] Signature mismatch')
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  // Step 2: Fetch order from Razorpay to get authoritative amount — never trust client
  let rzpOrder: any
  try {
    rzpOrder = await razorpay.orders.fetch(razorpay_order_id)
  } catch (err) {
    console.error('[wallet/verify] Failed to fetch Razorpay order', err)
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 })
  }

  // Step 3: Verify the order belongs to this user via notes
  if (rzpOrder.notes?.userId !== session.id) {
    console.error('[wallet/verify] userId mismatch', rzpOrder.notes?.userId, session.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Step 4: Verify order status is paid
  if (rzpOrder.status !== 'paid') {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
  }

  // Step 5: Get amount from Razorpay order (paise → INR) — never from client
  const amountInr = rzpOrder.amount / 100

  // Step 6: Whitelist check on server-fetched amount
  if (!ALLOWED_AMOUNTS.includes(amountInr)) {
    console.error('[wallet/verify] Invalid amount from Razorpay order', amountInr)
    return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
  }

  // Step 7: Idempotency — check if this order was already credited
  const alreadyProcessed = await prisma.walletTransaction.findFirst({
    where: { referenceId: razorpay_order_id },
  })

  if (alreadyProcessed) {
    // Already credited — return success silently (idempotent)
    return NextResponse.json({ success: true, alreadyCredited: true })
  }

  // Step 8: Credit wallet atomically
  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.id },
      data: { walletBalance: { increment: amountInr } },
    }),
    prisma.walletTransaction.create({
      data: {
        userId: session.id,
        type: 'CREDIT',
        amount: amountInr,
        currency: 'INR',
        method: 'RAZORPAY',
        referenceId: razorpay_order_id,
        status: 'COMPLETED',
        description: `Wallet top-up via Razorpay (${razorpay_payment_id})`,
      },
    }),
  ])

  return NextResponse.json({ success: true, amountCredited: amountInr })
}
