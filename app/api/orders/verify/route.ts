import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { securityLog } from '@/lib/securityLog'
import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: 'Payment gateway misconfigured' }, { status: 500 })
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

  if (!validateOrigin(req)) {
    securityLog('CSRF_BLOCKED', { origin: req.headers.get('origin'), path: req.nextUrl.pathname })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, dbOrderId } = await req.json()

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !dbOrderId) {
    return NextResponse.json({ error: 'Missing payment data' }, { status: 400 })
  }

  // Step 1: Fetch order from DB and verify ownership
  const dbOrder = await prisma.order.findUnique({ where: { id: dbOrderId } })
  if (!dbOrder || dbOrder.userId !== session.user.id) {
    securityLog('PAYMENT_ORDER_NOT_FOUND', { userId: session.user.id, dbOrderId })
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Step 2: Prevent double processing
  if (dbOrder.paymentStatus !== 'PENDING') {
    securityLog('PAYMENT_ALREADY_PROCESSED', { userId: session.user.id, dbOrderId, status: dbOrder.paymentStatus })
    return NextResponse.json({ error: 'Order already processed' }, { status: 409 })
  }

  // Step 3: Verify Razorpay signature
  const body = razorpayOrderId + '|' + razorpayPaymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpaySignature) {
    securityLog('PAYMENT_INVALID_SIGNATURE', { userId: session.user.id, dbOrderId, razorpayOrderId })
    await prisma.order.update({ where: { id: dbOrderId }, data: { paymentStatus: 'FAILED', orderStatus: 'FAILED' } })
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
  }

  // Step 4: Verify payment directly with Razorpay API
  let payment: any
  try {
    payment = await razorpay.payments.fetch(razorpayPaymentId)
  } catch {
    securityLog('PAYMENT_FETCH_FAILED', { userId: session.user.id, razorpayPaymentId })
    return NextResponse.json({ error: 'Could not verify payment with provider' }, { status: 502 })
  }

  const expectedAmount = Math.round(dbOrder.totalPrice * 100)
  const actualAmount = Number(payment.amount)
  const amountMatch = Math.abs(actualAmount - expectedAmount) <= 100 // 1 rupee tolerance

  if (
    payment.order_id !== razorpayOrderId ||
    !amountMatch ||
    payment.currency !== 'INR' ||
    !['captured', 'authorized'].includes(payment.status)
  ) {
    securityLog('PAYMENT_AMOUNT_MISMATCH', {
      userId: session.user.id,
      dbOrderId,
      expected: expectedAmount,
      actual: actualAmount,
      paymentStatus: payment.status,
    })
    await prisma.order.update({ where: { id: dbOrderId }, data: { paymentStatus: 'FAILED', orderStatus: 'FAILED' } })
    return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 })
  }

  // Step 5: Atomic update
  await prisma.$transaction([
    prisma.order.update({
      where: { id: dbOrderId },
      data: { paymentStatus: 'PAID', orderStatus: 'PENDING', supplierOrderId: razorpayPaymentId },
    }),
    prisma.walletTransaction.create({
      data: {
        userId: session.user.id,
        type: 'DEBIT',
        amount: dbOrder.totalPrice,
        currency: 'INR',
        method: 'RAZORPAY',
        referenceId: razorpayPaymentId,
        status: 'COMPLETED',
        description: `Payment for ${dbOrder.notes}`,
      },
    }),
  ])

  return NextResponse.json({ success: true })
}
