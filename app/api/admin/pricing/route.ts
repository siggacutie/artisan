import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const config = await prisma.pricingConfig.findFirst()
    return NextResponse.json(config || { landingPageDiscountPercent: 0 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pricing config' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const updateData: any = {}

    if (typeof body.landingPageDiscountPercent === 'number') {
      updateData.landingPageDiscountPercent = Math.min(50, Math.max(0, body.landingPageDiscountPercent))
    }

    const config = await prisma.pricingConfig.findFirst()
    
    const updated = await prisma.pricingConfig.upsert({
      where: { id: config?.id || 'default' },
      update: updateData,
      create: { ...updateData, id: 'default' }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin Pricing PATCH error:", error)
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { scPurchaseAmount, scPurchaseCost, priceMarkup, inviteLinkExpiryHours, suspiciousIpThreshold, autoFreezeIpThreshold } = await req.json()

    // Only SUPERADMIN can edit markup
    const isSuperAdmin = admin.role === 'SUPERADMIN'

    const updates: { key: string; value: string }[] = []

    if (scPurchaseAmount !== undefined) updates.push({ key: 'scPurchaseAmount', value: String(scPurchaseAmount) })
    if (scPurchaseCost !== undefined) updates.push({ key: 'scPurchaseCost', value: String(scPurchaseCost) })
    if (inviteLinkExpiryHours !== undefined) updates.push({ key: 'inviteLinkExpiryHours', value: String(inviteLinkExpiryHours) })
    if (suspiciousIpThreshold !== undefined) updates.push({ key: 'suspiciousIpThreshold', value: String(suspiciousIpThreshold) })
    if (autoFreezeIpThreshold !== undefined) updates.push({ key: 'autoFreezeIpThreshold', value: String(autoFreezeIpThreshold) })
    
    if (isSuperAdmin && priceMarkup !== undefined) {
      updates.push({ key: 'priceMarkup', value: String(priceMarkup) })
    }

    for (const update of updates) {
      await prisma.settings.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin Pricing Update error:", error)
    return NextResponse.json({ error: "Failed to update pricing settings" }, { status: 500 })
  }
}
