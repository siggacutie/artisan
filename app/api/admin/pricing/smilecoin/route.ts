import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

import { validateOrigin } from '@/lib/validateOrigin'

export async function PATCH(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { smilecoinsAmount, inrPaid, markupPercent } = await req.json()

  if (smilecoinsAmount <= 0 || inrPaid <= 0 || markupPercent < 0 || markupPercent > 50) {
    return NextResponse.json({ error: 'Invalid values' }, { status: 400 })
  }

  const config = await prisma.smilecoinConfig.findFirst()

  const updatedConfig = await prisma.smilecoinConfig.upsert({
    where: { id: config?.id || 'default' },
    update: { smilecoinsAmount, inrPaid, markupPercent },
    create: { smilecoinsAmount, inrPaid, markupPercent },
  })

  return NextResponse.json(updatedConfig)
}
