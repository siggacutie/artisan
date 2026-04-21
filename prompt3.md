You are working on ArtisanStore.xyz. Implement Razorpay TEST mode wallet top-up with zero exploits. Surgical edits only.

---

## CONTEXT

Payment flow: User visits /wallet/add → selects preset amount → pays via Razorpay test checkout → wallet credited in INR → displayed as coins (INR / 1.5, Math.floor).

Preset amounts (INR): 100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000.

Razorpay is in TEST mode. Keys:
- Server: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- Client: NEXT_PUBLIC_RAZORPAY_KEY_ID

Webhook secret: RAZORPAY_WEBHOOK_SECRET (value: crackingniggers2020)

---

## TASK 1 — Fix /wallet/add page

File: app/(main)/wallet/add/page.tsx

Requirements:
- Show preset amount buttons: 100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000
- Each button shows "₹X" and below it "= Y coins" where Y = Math.floor(X / 1.5)
- Selected amount highlighted with gold border (#ffd700) and background rgba(255,215,0,0.08)
- One "Add ₹X to Wallet" button at bottom, disabled until amount selected
- On click: POST /api/wallet/create-order with { amountInr }
- Load Razorpay script dynamically in useEffect
- Open Razorpay checkout with returned orderId
- On payment success handler: POST /api/wallet/verify with { razorpay_order_id, razorpay_payment_id, razorpay_signature }
- On verify success: show success message "₹X added to your wallet!" then redirect to /dashboard/wallet after 2 seconds
- On failure: show error in red (#ef4444)
- Full loading and error states required

Razorpay checkout config:
```ts
{
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: data.amount, // in paise from server
  currency: 'INR',
  name: 'ArtisanStore.xyz',
  description: 'Wallet Top-Up',
  order_id: data.orderId,
  handler: async (response) => {
    // call /api/wallet/verify
  },
  modal: {
    ondismiss: () => setLoading(false)
  },
  theme: { color: '#ffd700' },
}
```

Color palette: bg #050810, card #0d1120, section #0a0f1e, border rgba(255,215,0,0.1), gold #ffd700, success #22c55e, error #ef4444, muted #64748b. Fonts: Orbitron headings, Inter body. No emojis. Lucide icons only. No framer-motion. No html form tags.

---

## TASK 2 — Fix /api/wallet/create-order

File: app/api/wallet/create-order/route.ts

Replace entire file with:

```ts
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

  const session = await getResellerSession(req)
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
      receipt: `wallet_${session.userId}_${Date.now()}`,
      notes: {
        userId: session.userId,
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
```

---

## TASK 3 — Fix /api/wallet/verify

File: app/api/wallet/verify/route.ts

Replace entire file with:

```ts
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

  const session = await getResellerSession(req)
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
  if (rzpOrder.notes?.userId !== session.userId) {
    console.error('[wallet/verify] userId mismatch', rzpOrder.notes?.userId, session.userId)
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
      where: { id: session.userId },
      data: { walletBalance: { increment: amountInr } },
    }),
    prisma.walletTransaction.create({
      data: {
        userId: session.userId,
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
```

---

## TASK 4 — Fix /api/webhooks/razorpay (backup credit via webhook)

File: app/api/webhooks/razorpay/route.ts

Replace entire file with:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    console.error('[webhook/razorpay] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event !== 'payment.captured') {
    return NextResponse.json({ received: true })
  }

  const payment = event.payload?.payment?.entity
  if (!payment) return NextResponse.json({ received: true })

  const orderId = payment.order_id
  const paymentId = payment.id
  const amountInr = payment.amount / 100
  const userId = payment.notes?.userId
  const type = payment.notes?.type

  if (type !== 'WALLET_TOPUP' || !userId || !orderId) {
    return NextResponse.json({ received: true })
  }

  const ALLOWED_AMOUNTS = [100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000]
  if (!ALLOWED_AMOUNTS.includes(amountInr)) {
    console.error('[webhook] Invalid amount', amountInr)
    return NextResponse.json({ received: true })
  }

  // Idempotency check
  const alreadyProcessed = await prisma.walletTransaction.findFirst({
    where: { referenceId: orderId },
  })

  if (alreadyProcessed) {
    return NextResponse.json({ received: true })
  }

  // Credit wallet
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: amountInr } },
    }),
    prisma.walletTransaction.create({
      data: {
        userId,
        type: 'CREDIT',
        amount: amountInr,
        currency: 'INR',
        method: 'RAZORPAY_WEBHOOK',
        referenceId: orderId,
        status: 'COMPLETED',
        description: `Wallet top-up via webhook (${paymentId})`,
      },
    }),
  ])

  console.log(`[webhook] Credited ₹${amountInr} to user ${userId}`)
  return NextResponse.json({ received: true })
}
```

---

## SECURITY SUMMARY (built into the code above)

1. Amount whitelist enforced server-side in both create-order and verify — client cannot pass ₹99999
2. HMAC signature verified before any DB write — payment cannot be faked
3. Razorpay order fetched server-side to get authoritative amount — client amount ignored
4. userId from Razorpay order notes verified against session — cannot credit another user's wallet
5. Idempotency check on referenceId — double-processing impossible even if webhook fires twice
6. Prisma $transaction — wallet credit and transaction log are atomic — no partial writes
7. Origin validation on all POST routes
8. Session required — anonymous calls rejected immediately

---

## STRICT RULES
1. Colors: bg #050810, card #0d1120, gold #ffd700, success #22c55e, error #ef4444, muted #64748b. Inter body, Orbitron headings.
2. No html form tags. No emojis in UI. Lucide icons only.
3. No framer-motion on wallet page.
4. lib/prisma.ts: DATABASE_URL only.
5. Surgical changes only.
6. After all tasks: list every file created or modified.