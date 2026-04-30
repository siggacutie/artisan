import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePackageLabel } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

const SMILECOIN_COSTS: Record<string, number> = {
  'mlbb-78':     61.5,
  'mlbb-156':    122.0,
  'mlbb-234':    176.7,
  'mlbb-625':    480.0,
  'mlbb-1860':   1453.0,
  'mlbb-3099':   2424.0,
  'mlbb-4649':   3660.0,
  'mlbb-d50':    39.0,
  'mlbb-d150':   116.9,
  'mlbb-d250':   187.5,
  'mlbb-d500':   385.0,
  'mlbb-weekly': 76.0,
  'mlbb-elite':  39.0,
  'mlbb-epic':   196.5,
}

export async function GET(req: Request) {
  try {
    const isLanding = new URL(req.url).searchParams.get('landing') === 'true'

    const pricingConfig = await prisma.pricingConfig.findFirst()
    const landingDiscount = isLanding ? (pricingConfig?.landingPageDiscountPercent ?? 0) : 0

    const packages = await prisma.diamondPackage.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      include: { game: { select: { slug: true } } },
    })

    const result = packages.map((pkg) => {
      const basePrice = pkg.basePriceInr
      
      const displayPrice = isLanding && landingDiscount > 0
        ? Math.ceil(basePrice * (1 - landingDiscount / 100))
        : (pkg.displayPrice || basePrice)

      const displayName = generatePackageLabel(pkg)

      return {
        id: pkg.id,
        gameSlug: pkg.game.slug,
        name: displayName,
        diamondAmount: pkg.diamondAmount,
        bonusDiamonds: pkg.bonusDiamonds,
        bonusLabel: pkg.bonusLabel,
        section: pkg.section,
        sortOrder: pkg.sortOrder,
        supplierProductId: pkg.supplierProductId,
        resellerPrice: basePrice,
        displayPrice: displayPrice,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[/api/packages] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
