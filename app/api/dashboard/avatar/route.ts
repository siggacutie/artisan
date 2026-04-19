import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { validateOrigin } from '@/lib/validateOrigin'
import { securityLog } from '@/lib/securityLog'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    securityLog('CSRF_BLOCKED', { origin: req.headers.get('origin'), path: req.nextUrl.pathname })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = rateLimit(`avatar:${session.user.id}`, 5, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many upload attempts.' }, { status: 429 })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Storage service misconfigured' }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    if (buffer.byteLength > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
    }

    const bytes = new Uint8Array(buffer)
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
    const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50

    if (!isJpeg && !isPng && !isWebp) {
      securityLog('FILE_UPLOAD_REJECTED', { userId: session.user.id, detectedBytes: `${bytes[0]},${bytes[1]},${bytes[2]}` })
      return NextResponse.json({ error: 'Invalid image file. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }

    const detectedExt = isPng ? 'png' : isWebp ? 'webp' : 'jpg'
    const detectedMime = isPng ? 'image/png' : isWebp ? 'image/webp' : 'image/jpeg'
    const storagePath = `avatars/${session.user.id}.${detectedExt}`

    const { error } = await supabase.storage.from('avatars').upload(storagePath, buffer, {
      contentType: detectedMime,
      upsert: true,
    })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(storagePath)
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

    await prisma.user.update({ where: { id: session.user.id }, data: { image: publicUrl } })

    return NextResponse.json({ success: true, image: publicUrl })
  } catch (err: any) {
    console.error('Avatar upload route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
