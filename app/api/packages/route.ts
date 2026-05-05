import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPackagesWithPrices } from '@/lib/pricing'
import { getResellerSession } from '@/lib/resellerAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const isLanding = new URL(req.url).searchParams.get('landing') === 'true'
    let user = null
    try {
      user = await getResellerSession()
    } catch (e) {
      console.error("Session fetch failed", e)
    }

    // Pass user info to getPackagesWithPrices for tiered discount calculation
    const packages = await getPackagesWithPrices(undefined, undefined, user ? {
      id: user.id,
      tier: (user as any).tier || 'BASIC',
      ordersCount: (user as any).ordersCount || 0
    } : undefined)

    let basicDiscount = 0
    let premiumDiscount = 0

    try {
      const pricingConfig = await prisma.pricingConfig.findFirst()
      basicDiscount = pricingConfig?.basicDiscountPercent ?? 0
      premiumDiscount = pricingConfig?.premiumDiscountPercent ?? 0
    } catch (e) {
      console.error("Pricing config fetch failed", e)
    }

    const result = packages.map((pkg) => {
      // If landing page, use landingPrice. If logged user, use resellerPrice (which includes tiered discount)
      const displayPrice = isLanding ? pkg.landingPrice : pkg.resellerPrice

      return {
        id: pkg.id,
        name: pkg.label,
        diamondAmount: pkg.diamondAmount,
        bonusDiamonds: pkg.bonusDiamonds,
        section: pkg.section,
        resellerPrice: displayPrice, // We keep the key as resellerPrice for frontend compatibility
        displayPrice: displayPrice,
        basicPrice: isLanding ? Math.floor(pkg.basePriceInr * (1 - basicDiscount / 100)) : undefined,
        premiumPrice: isLanding ? Math.floor(pkg.basePriceInr * (1 - premiumDiscount / 100)) : undefined,
      }
    })

    return NextResponse.json({
      packages: result,
      landingPageDiscountPercent: 0 // Field deprecated
    })
  } catch (error) {
    console.error('[/api/packages] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
