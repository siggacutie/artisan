import { getResellerSession } from '@/lib/resellerAuth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin } from '@/lib/validateOrigin'
import { securityLog } from '@/lib/securityLog'
import { validators, sanitizeHtml } from '@/lib/validate'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    securityLog('CSRF_BLOCKED', { origin: req.headers.get('origin'), path: req.nextUrl.pathname })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const user = await getResellerSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = await req.json()

    if (!validators.name(name)) {
      return NextResponse.json({ error: 'Name must be between 2 and 50 characters.' }, { status: 400 })
    }

    const safeName = sanitizeHtml(name)
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: safeName }
    })

    return NextResponse.json({ success: true, name: updatedUser.name })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const user = await getResellerSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, image } = await req.json()

    const updateData: any = {}
    if (name) updateData.name = sanitizeHtml(name)
    if (image) updateData.avatarUrl = image

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    return NextResponse.json({ success: true, name: updatedUser.name })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
