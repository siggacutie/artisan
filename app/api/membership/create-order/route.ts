import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

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
    const { months } = await req.json()

    const amountInr = MEMBERSHIP_PRICES[months]
    if (!amountInr) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const order = await razorpay.orders.create({
      amount: amountInr * 100,
      currency: 'INR',
      receipt: `membership_${session.id}_${months}mo_${Date.now()}`,
      notes: {
        userId: session.id,
        type: 'MEMBERSHIP',
        months: String(months),
      },
    })

    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch (error) {
    console.error('[membership/create-order]', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
