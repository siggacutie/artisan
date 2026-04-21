import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import Razorpay from 'razorpay'

const MEMBERSHIP_PRICES: Record<number, number> = {
  1: 250,
  3: 699,
  6: 1299,
  12: 2699,
}

export async function POST(req: NextRequest) {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeyId || !razorpayKeySecret) {
    console.error('Missing Razorpay configuration');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });

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
