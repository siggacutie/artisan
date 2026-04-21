## TASK 1 — Update OTP email sender + beautiful HTML email templates

### File: lib/email.ts

Replace the entire file with this:

```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function getEmailHtml(code: string, type: string): string {
  const configs: Record<string, { title: string; subtitle: string; color: string; icon: string }> = {
    EMAIL_VERIFY: {
      title: 'Verify Your Email',
      subtitle: 'Enter this code to verify your ArtisanStore account.',
      color: '#ffd700',
      icon: '✦',
    },
    LOGIN_2FA: {
      title: 'Login Verification',
      subtitle: 'Someone is trying to sign in to your account. Use this code to confirm it\'s you.',
      color: '#00c3ff',
      icon: '⬡',
    },
    PASSWORD_RESET: {
      title: 'Reset Your Password',
      subtitle: 'Use this code to reset your ArtisanStore password.',
      color: '#f59e0b',
      icon: '◈',
    },
  }

  const cfg = configs[type] ?? configs.EMAIL_VERIFY

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cfg.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#050810;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050810;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#0d1120;border:1px solid rgba(255,215,0,0.15);border-radius:16px;overflow:hidden;">
          
          <!-- Header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1120 0%,#0a0f1e 100%);border-bottom:2px solid ${cfg.color};padding:32px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:10px 20px;margin-bottom:16px;">
                <span style="color:#ffd700;font-size:13px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">ARTISANSTORE.XYZ</span>
              </div>
              <div style="color:${cfg.color};font-size:28px;margin-bottom:6px;">${cfg.icon}</div>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;letter-spacing:1px;">${cfg.title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 28px 0;text-align:center;">${cfg.subtitle}</p>
              
              <!-- Code box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div style="background:#050810;border:2px solid ${cfg.color};border-radius:12px;padding:20px 32px;display:inline-block;">
                      <div style="color:#64748b;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Your verification code</div>
                      <div style="color:${cfg.color};font-size:38px;font-weight:700;letter-spacing:10px;font-family:'Courier New',monospace;">${code}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:12px 16px;text-align:center;">
                    <span style="color:#f59e0b;font-size:13px;">This code expires in <strong>10 minutes</strong></span>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <p style="color:#475569;font-size:13px;text-align:center;margin:0;line-height:1.6;">
                If you did not request this code, ignore this email.<br>
                Never share this code with anyone — ArtisanStore staff will never ask for it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0f1e;border-top:1px solid rgba(255,215,0,0.08);padding:20px 40px;text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">
                &copy; 2025 ArtisanStore.xyz &bull; Game Credits. Instantly. Delivered.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendOtpEmail(to: string, code: string, type: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('='.repeat(50))
    console.log('[DEV MODE - OTP CODE]')
    console.log('To:', to)
    console.log('Type:', type)
    console.log('Code:', code)
    console.log('='.repeat(50))
    return
  }

  const subjects: Record<string, string> = {
    EMAIL_VERIFY: 'Verify your ArtisanStore email',
    LOGIN_2FA: 'Your ArtisanStore login code',
    PASSWORD_RESET: 'Reset your ArtisanStore password',
  }

  const { error } = await resend.emails.send({
    from: 'ArtisanStore <noreply@artisanstore.xyz>',
    to,
    subject: subjects[type] ?? 'Your ArtisanStore code',
    html: getEmailHtml(code, type),
  })

  if (error) throw error
}
```

---

## TASK 2 — Fix profile picture upload

### Step 1 — Check what error occurs

File: app/api/dashboard/avatar/route.ts

Show me the full file. The likely issues are:
- Supabase storage bucket name mismatch (must be exactly `avatars`)
- Missing public URL construction
- File size limit too low
- MIME type validation too strict

### Fix the route to handle uploads correctly:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const session = await getResellerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('avatar') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed' }, { status: 400 })
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Magic byte validation
    const jpg = buffer[0] === 0xFF && buffer[1] === 0xD8
    const png = buffer[0] === 0x89 && buffer[1] === 0x50
    const webp = buffer.slice(8, 12).toString('ascii') === 'WEBP'
    if (!jpg && !png && !webp) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const fileName = `${session.userId}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[avatar upload]', uploadError)
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const avatarUrl = urlData.publicUrl

    // Update user record
    const { prisma } = await import('@/lib/prisma')
    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    })

    return NextResponse.json({ success: true, avatarUrl })
  } catch (error) {
    console.error('[avatar]', error)
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
  }
}
```

Also verify the `avatars` bucket in Supabase has:
- Public access enabled
- The following RLS policy (run in Supabase SQL Editor):

```sql
-- Make avatars bucket public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to read avatars
CREATE POLICY IF NOT EXISTS "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated uploads (service key bypasses this but add for completeness)
CREATE POLICY IF NOT EXISTS "Avatar upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');
```

---

## TASK 3 — Admin panel: Revoke Membership button

### File: app/(admin)/admin/users/page.tsx (or wherever user rows are rendered)

In the user action area (three-dot menu or action buttons), add a "Revoke Membership" button/option.

Clicking it shows a centered confirmation modal:

```tsx
// Confirmation modal
<div style={{
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
}}>
  <div style={{
    background: '#0d1120', border: '1px solid rgba(255,215,0,0.1)',
    borderRadius: '12px', padding: '28px', maxWidth: '400px', width: '90%'
  }}>
    <h3 style={{ color: '#fff', fontFamily: 'Orbitron', fontSize: '16px', marginBottom: '12px' }}>
      Revoke Membership
    </h3>
    <p style={{ color: '#64748b', fontFamily: 'Inter', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
      This will immediately expire <strong style={{ color: '#ffd700' }}>{selectedUser.username}</strong>'s membership.
      Their reseller access will be revoked instantly. They can renew by purchasing a new membership.
    </p>
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <div onClick={() => setShowRevokeModal(false)} style={{
        padding: '8px 20px', background: '#0a0f1e', border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontFamily: 'Inter', fontSize: '14px'
      }}>Cancel</div>
      <div onClick={handleRevokeMembership} style={{
        padding: '8px 20px', background: '#ef4444', borderRadius: '8px',
        color: '#fff', cursor: 'pointer', fontFamily: 'Inter', fontSize: '14px', fontWeight: '600'
      }}>Revoke Now</div>
    </div>
  </div>
</div>
```

The handler calls:
```ts
const handleRevokeMembership = async () => {
  await fetch(`/api/admin/users/${selectedUser.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ revokeMembership: true }),
  })
  setShowRevokeModal(false)
  // refresh user list
}
```

### File: app/api/admin/users/[id]/route.ts

In the PATCH handler, add handling for `revokeMembership: true`:

```ts
if (body.revokeMembership === true) {
  const pastDate = new Date('2000-01-01')
  await prisma.user.update({
    where: { id: params.id },
    data: {
      membershipExpiresAt: pastDate,
      isReseller: false,
    },
  })
  return NextResponse.json({ success: true })
}
```

---

## TASK 4 — Membership renewal via Razorpay after expiry

When a user's membership has expired, they land on `/membership?expired=true`. The "Renew Now" buttons must actually work.

### File: app/(main)/membership/page.tsx

The renewal pricing cards already exist. Make the "Renew Now" buttons functional:

```tsx
const handleRenew = async (months: number, amountInr: number) => {
  setRenewLoading(months)
  try {
    const res = await fetch('/api/membership/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ months, amountInr }),
    })
    const data = await res.json()
    if (!data.orderId) throw new Error('Failed to create order')

    const rzp = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: 'INR',
      name: 'ArtisanStore.xyz',
      description: `${months} Month Membership`,
      order_id: data.orderId,
      handler: async (response: any) => {
        const verifyRes = await fetch('/api/membership/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            months,
          }),
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          window.location.href = '/games'
        } else {
          alert('Payment verification failed. Contact support.')
        }
      },
      prefill: { name: user?.username },
      theme: { color: '#ffd700' },
    })
    rzp.open()
  } catch (err) {
    console.error(err)
    alert('Failed to initiate payment. Try again.')
  } finally {
    setRenewLoading(null)
  }
}
```

Also make sure the Razorpay script is loaded. In the useEffect:
```ts
useEffect(() => {
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true
  document.body.appendChild(script)
  return () => { document.body.removeChild(script) }
}, [])
```

### Create: app/api/membership/create-order/route.ts

```ts
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
  const session = await getResellerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { months } = await req.json()

  const amountInr = MEMBERSHIP_PRICES[months]
  if (!amountInr) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const order = await razorpay.orders.create({
    amount: amountInr * 100,
    currency: 'INR',
    receipt: `membership_${session.userId}_${months}mo_${Date.now()}`,
    notes: {
      userId: session.userId,
      type: 'MEMBERSHIP',
      months: String(months),
    },
  })

  return NextResponse.json({ orderId: order.id, amount: order.amount })
}
```

### Create: app/api/membership/verify/route.ts

```ts
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
  const session = await getResellerSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Calculate new expiry: if already expired, start from now. If somehow still active, extend from current expiry.
  const base = !user.membershipExpiresAt || new Date(user.membershipExpiresAt) < new Date()
    ? new Date()
    : new Date(user.membershipExpiresAt)

  const newExpiry = new Date(base)
  newExpiry.setMonth(newExpiry.getMonth() + months)

  await prisma.user.update({
    where: { id: session.userId },
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
      userId: session.userId,
      months,
      amountInr,
      status: 'PAID',
    },
  })

  return NextResponse.json({ success: true })
}
```

### Security checks for membership renewal:
- HMAC signature verified before any DB update — payment cannot be faked
- `months` value validated against a hardcoded price map — cannot pass arbitrary months
- Session required — anonymous calls rejected
- Price is set server-side from the hardcoded map — client cannot manipulate amount
- One payment creates exactly one membership extension — no double-processing risk (Razorpay order IDs are unique)

---

## STRICT RULES
1. Colors: bg #050810, card #0d1120, section #0a0f1e, border rgba(255,215,0,0.1), gold #ffd700, blue #00c3ff, success #22c55e, error #ef4444, warning #f59e0b, muted #64748b. Fonts: Orbitron headings, Inter body.
2. NO html form tags. Use div + onClick.
3. NO fake games. NO framer-motion on non-product pages.
4. lib/prisma.ts: DATABASE_URL only, never DIRECT_URL.
5. Icons: Lucide React only. No emojis in UI.
6. Surgical changes only. Do not rebuild files that do not need changes.
7. After all tasks: list every file created or modified