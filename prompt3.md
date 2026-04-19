Style: color #64748b, fontSize 14px, with a small note "(contact admin to change)" in #475569 12px

### 2b. Fix avatar upload — Open file: app/api/dashboard/avatar/route.ts

The avatar upload saves to Supabase Storage but the URL never shows up. The issue is likely the public URL is not being saved correctly to the user record, or the Supabase bucket is not public.

Replace the entire route with:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(req: NextRequest) {
  try {
    const user = await getResellerSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('avatar') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and WebP files are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File must be under 2MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate magic bytes
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50
    const isWebp = buffer.slice(8, 12).toString('ascii') === 'WEBP'
    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const fileName = `avatars/${user.id}.${ext}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[avatar upload] Supabase error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // Save URL to user record
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: publicUrl },
    })

    return NextResponse.json({ success: true, avatarUrl: publicUrl })
  } catch (error) {
    console.error('[avatar upload]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### 2c. Make sure Supabase avatars bucket is public

In Supabase dashboard → Storage → Buckets → avatars bucket → click the bucket → Policies tab → make sure there is a public read policy. If not, run this in Supabase SQL Editor:

```sql
CREATE POLICY "Public read avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

Also make sure the bucket exists. If it doesn't, create it:
Go to Supabase → Storage → New Bucket → name: "avatars" → check "Public bucket" → Create.

### 2d. Update profile page to show avatar after upload

Open file: app/(main)/dashboard/profile/page.tsx

After a successful avatar upload (API returns { avatarUrl }), update the displayed avatar immediately without requiring a page refresh:

```typescript
const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null)

// After successful upload:
setAvatarUrl(data.avatarUrl)
```

The avatar display:
- Show circular image if avatarUrl exists: borderRadius 50%, width 80px, height 80px, objectFit cover, border 2px solid rgba(255,215,0,0.3)
- If no avatar: show a circle with user's first letter of username, background rgba(255,215,0,0.1), color #ffd700, Orbitron font, 32px

---
## TASK 3 — Hide authenticated navbar on public pages

Open file: app/(main)/layout.tsx

The Navbar component currently shows for all routes in the (main) layout group. It should only show the authenticated navbar when the user is logged in. When the user is NOT logged in, pages like /terms, /privacy, /refund, /contact should show a minimal navbar (logo only + login button).

The Navbar component already handles two modes (public vs authenticated). The issue is it always renders. Fix the layout so:
- /terms, /privacy, /refund, /contact — always show minimal public navbar regardless of auth state
- /games, /dashboard, /reseller, /wallet, /membership — show authenticated navbar (middleware already protects these)
- / (homepage) — existing logic (minimal if unauthed, redirect if authed)

The simplest fix: in Navbar.tsx, when fetching /api/reseller/auth/me returns 401, show the minimal public navbar (logo left + Login button right). This is likely already the behavior — confirm it works correctly by checking that the fetch to /api/reseller/auth/me is happening and the public mode renders correctly when it returns 401.

If the navbar is incorrectly showing the authenticated version on public pages, the root cause is that the navbar is reading a stale cached session. Add cache: 'no-store' to the fetch('/api/reseller/auth/me') call in Navbar.tsx.

---

## TASK 4 — Add policy agreement checkbox to invite signup page

Open file: app/invite/[token]/page.tsx

Add a checkbox above the "Create Account" button:

State: `const [agreedToTerms, setAgreedToTerms] = useState(false)`

Checkbox UI:
- Checkbox: actual HTML input type="checkbox" styled with accentColor: '#ffd700'
- Label text in Inter 13px #94a3b8
- "Terms of Service" is a link to /terms — color #ffd700, no underline
- "Privacy Policy" is a link to /privacy — color #ffd700, no underline  
- "Refund Policy" is a link to /refund — color #ffd700, no underline
- Links open in new tab (target="_blank")
- Container: display flex, alignItems flex-start, gap 10px, marginBottom 20px

The "Create Account" button must be DISABLED if agreedToTerms is false:
- When disabled: backgroundColor #334155, cursor not-allowed
- When enabled: backgroundColor #ffd700, cursor pointer

In the handleSignup function, add this check at the top:
```typescript
if (!agreedToTerms) {
  setError('You must agree to the Terms of Service, Privacy Policy, and Refund Policy')
  return
}
```
## VERIFICATION STEPS

1. Visit artisanstore.xyz — confirm browser tab shows "ArtisanStore.xyz — Cheapest MLBB Diamond Top-Ups"
2. Visit /terms — confirm tab shows "Terms of Service | ArtisanStore.xyz"
3. Visit /dashboard/profile — confirm NO email field, username shows as read-only
4. Upload a profile picture — confirm it appears immediately without page refresh
5. Refresh the profile page — confirm avatar persists

## DO NOT:
- Do NOT add framer-motion
- Do NOT use emojis
- Do NOT change any auth logic
- Do NOT modify admin pages
- Do NOT add email field back anywhere on the profile page
- Do NOT change the color palette