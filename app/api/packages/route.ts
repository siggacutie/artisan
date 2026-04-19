import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

const DISPLAY_NAMES: Record<string, string> = {
  'mlbb-78':     '78 + 8 Diamonds',
  'mlbb-156':    '156 + 16 Diamonds',
  'mlbb-234':    '234 + 23 Diamonds',
  'mlbb-625':    '625 + 81 Diamonds',
  'mlbb-1860':   '1860 + 335 Diamonds',
  'mlbb-3099':   '3099 + 589 Diamonds',
  'mlbb-4649':   '4649 + 883 Diamonds',
  'mlbb-d50':    '50 + 5 Diamonds',
  'mlbb-d150':   '150 + 15 Diamonds',
  'mlbb-d250':   '250 + 25 Diamonds',
  'mlbb-d500':   '500 + 65 Diamonds',
  'mlbb-weekly': 'Weekly Diamond Pass',
  'mlbb-elite':  'Elite Weekly Package',
  'mlbb-epic':   'Epic Monthly Package',
}

export async function GET(req: Request) {
  try {
    const isLanding = new URL(req.url).searchParams.get('landing') === 'true'

    const config = await prisma.smilecoinConfig.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    if (!config) {
      return NextResponse.json({ error: 'Pricing config not found' }, { status: 500 })
    }

    const pricingConfig = await prisma.pricingConfig.findFirst()
    const landingDiscount = isLanding ? (pricingConfig?.landingPageDiscountPercent ?? 0) : 0

    const inrPerSmilecoin = config.inrPaid / config.smilecoinsAmount
    const packages = await prisma.diamondPackage.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      include: { game: { select: { slug: true } } },
    })

    const result = packages.map((pkg) => {
      const smilecoins = SMILECOIN_COSTS[pkg.id] ?? 0
      const basePrice = Math.ceil(smilecoins * inrPerSmilecoin * (1 + config.markupPercent / 100))
      
      const displayPrice = isLanding && landingDiscount > 0
        ? Math.ceil(basePrice * (1 - landingDiscount / 100))
        : basePrice

      const displayName = DISPLAY_NAMES[pkg.id] ?? `${pkg.diamondAmount} Diamonds`

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
        resellerPrice: isLanding ? displayPrice : basePrice,
        displayPrice: displayPrice,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[/api/packages] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
