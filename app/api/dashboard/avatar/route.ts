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
