import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import { PACKAGE_DEFINITIONS } from '@/lib/pricing'
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

  const updatedConfig = await prisma.$transaction(async (tx) => {
    const updated = await tx.smilecoinConfig.upsert({
      where: { id: config?.id || 'default' },
      update: { smilecoinsAmount, inrPaid, markupPercent },
      create: { smilecoinsAmount, inrPaid, markupPercent },
    })

    // Update all packages based on new rate
    const inrPerSmilecoin = inrPaid / smilecoinsAmount
    
    for (const def of PACKAGE_DEFINITIONS) {
      const basePriceInr = Math.ceil(def.smilecoins * inrPerSmilecoin * (1 + markupPercent / 100))
      await tx.diamondPackage.updateMany({
        where: { id: def.id },
        data: { 
          basePriceInr,
          displayPrice: basePriceInr // Default display price matches base
        }
      })
    }

    return updated
  })

  return NextResponse.json(updatedConfig)
}
