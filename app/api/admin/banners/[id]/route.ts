import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/adminAuth'

import { validateOrigin } from '@/lib/validateOrigin'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: bannerId } = await params
  const body = await req.json()

  // Validations
  const colorRegex = /^#[0-9a-fA-F]{6}$/
  if (body.gradientStart && !colorRegex.test(body.gradientStart)) return NextResponse.json({ error: 'Invalid color' }, { status: 400 })
  if (body.gradientEnd && !colorRegex.test(body.gradientEnd)) return NextResponse.json({ error: 'Invalid color' }, { status: 400 })

  try {
    const updatedBanner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        ...body,
        sortOrder: body.sortOrder !== undefined ? parseInt(body.sortOrder) : undefined
      }
    })
    return NextResponse.json(updatedBanner)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: bannerId } = await params

  try {
    await prisma.banner.delete({
      where: { id: bannerId }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
