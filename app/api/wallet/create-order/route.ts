import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { validateOrigin } from '@/lib/validateOrigin'
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

  const { amountInr } = await req.json()

  // Strict whitelist validation — no arbitrary amounts allowed
  if (!ALLOWED_AMOUNTS.includes(Number(amountInr))) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  try {
    const order = await razorpay.orders.create({
      amount: Number(amountInr) * 100, // paise
      currency: 'INR',
      receipt: `wlt_${Date.now()}`,
      notes: {
        userId: session.id,
        type: 'WALLET_TOPUP',
        amountInr: String(amountInr),
      },
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch (err) {
    console.error('[wallet/create-order]', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
