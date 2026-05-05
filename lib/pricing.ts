import { prisma } from './prisma'

export const PACKAGE_DEFINITIONS = [
  { id: 'mlbb-78',     label: '78 + 8 Diamonds',      smilecoins: 61.5 },
  { id: 'mlbb-156',    label: '156 + 16 Diamonds',    smilecoins: 122.0 },
  { id: 'mlbb-234',    label: '234 + 23 Diamonds',    smilecoins: 176.7 },
  { id: 'mlbb-625',    label: '625 + 81 Diamonds',    smilecoins: 480.0 },
  { id: 'mlbb-1860',   label: '1860 + 335 Diamonds',  smilecoins: 1453.0 },
  { id: 'mlbb-3099',   label: '3099 + 589 Diamonds',  smilecoins: 2424.0 },
  { id: 'mlbb-4649',   label: '4649 + 883 Diamonds',  smilecoins: 3660.0 },
  { id: 'mlbb-d50',    label: '50 + 5 Diamonds',      smilecoins: 39.0 },
  { id: 'mlbb-d150',   label: '150 + 15 Diamonds',    smilecoins: 116.9 },
  { id: 'mlbb-d250',   label: '250 + 25 Diamonds',    smilecoins: 187.5 },
  { id: 'mlbb-d500',   label: '500 + 65 Diamonds',    smilecoins: 385.0 },
  { id: 'mlbb-weekly', label: 'Weekly Diamond Pass',  smilecoins: 76.0 },
  { id: 'mlbb-elite',  label: 'Elite Weekly Package', smilecoins: 39.0 },
  { id: 'mlbb-epic',   label: 'Epic Monthly Package', smilecoins: 196.5 },
]

export interface PackageMetadata {
  id: string
  label: string
  diamondAmount: number
  bonusDiamonds: number
  basePriceInr: number
  userPrice: number
  resellerPrice: number
  supplierProductId: string
  section: string
}

export async function getPricingSettings() {
  const [scConfig, pricingConfig] = await Promise.all([
    prisma.smilecoinConfig.findFirst(),
    prisma.pricingConfig.findFirst()
  ])
  
  const scRate = scConfig ? (scConfig.inrPaid / scConfig.smilecoinsAmount) : 1.9
  const userMarkup = pricingConfig?.userMarkupPercent ?? 3.5
  const resellerMarkup = pricingConfig?.resellerMarkupPercent ?? 1.5
  
  return { scRate, userMarkup, resellerMarkup, lastUpdated: scConfig?.updatedAt || new Date() }
}

export function calculatePrice(basePrice: number, markupPercent: number) {
  return Math.ceil(basePrice * (1 + markupPercent / 100))
}

export function generatePackageLabel(pkg: { id?: string; diamondAmount: number; bonusDiamonds: number; bonusLabel?: string | null }) {
  // Try to find in definitions first
  const definition = PACKAGE_DEFINITIONS.find(d => d.id === pkg.id)
  if (definition) return definition.label

  if (pkg.bonusLabel && pkg.bonusLabel.length > 2) {
    // If it starts with + and we have diamond amount, prepend it for clarity
    if (pkg.bonusLabel.startsWith('+') && pkg.diamondAmount > 0) {
      return `${pkg.diamondAmount} ${pkg.bonusLabel}`
    }
    return pkg.bonusLabel
  }
  
  if (pkg.bonusDiamonds > 0) {
    return `${pkg.diamondAmount} + ${pkg.bonusDiamonds} Diamonds`
  }
  return pkg.diamondAmount > 0 ? `${pkg.diamondAmount} Diamonds` : 'Diamond Top-Up'
}

export async function getCurrentPrices() {
  const { userMarkup, resellerMarkup, lastUpdated } = await getPricingSettings()
  const packages = await getPackagesWithPrices(userMarkup, resellerMarkup)
  
  return {
    prices: packages,
    userMarkup,
    resellerMarkup,
    lastUpdated
  }
}

export async function getPackagesWithPrices(userMarkupPercent?: number, resellerMarkupPercent?: number, user?: { id: string, tier: string, ordersCount: number }) {
  let scConfig: any = null
  let pricingConfig: any = null
  
  try {
    [scConfig, pricingConfig] = await Promise.all([
      prisma.smilecoinConfig.findFirst(),
      prisma.pricingConfig.findFirst()
    ])
  } catch (err) {
    console.error("Error fetching pricing config (likely missing columns):", err)
  }
  
  const userMarkup = pricingConfig?.userMarkupPercent ?? 3.5
  const resellerMarkup = pricingConfig?.resellerMarkupPercent ?? 1.5
  const basicDiscount = pricingConfig?.basicDiscountPercent ?? 0
  const premiumDiscount = pricingConfig?.premiumDiscountPercent ?? 0

  const uMarkup = userMarkupPercent !== undefined ? userMarkupPercent : userMarkup
  const rMarkup = resellerMarkupPercent !== undefined ? resellerMarkupPercent : resellerMarkup

  let dbPackages: any[] = []
  try {
    dbPackages = await prisma.diamondPackage.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' }
    })
  } catch (err) {
    console.error("Error fetching packages:", err)
  }

  const lastUpdated = scConfig?.updatedAt || new Date()

  return dbPackages.map(pkg => {
    const basePrice = pkg.basePriceInr
    let resellerPrice = calculatePrice(basePrice, rMarkup) 

    // Apply tiered discount if user has < 3 orders
    if (user && user.ordersCount < 3) {
      try {
        if (user.tier === 'PREMIUM' && premiumDiscount > 0) {
          resellerPrice = Math.floor(basePrice * (1 - premiumDiscount / 100))
        } else if (user.tier === 'BASIC' && basicDiscount > 0) {
          resellerPrice = Math.floor(basePrice * (1 - basicDiscount / 100))
        }
      } catch (err) {
        // Fallback if columns are missing
      }
    }

    const userPrice = calculatePrice(basePrice, uMarkup)
    
    // For landing page (no user), we show standard price
    const landingPrice = userPrice

    return {
      id: pkg.id,
      label: generatePackageLabel(pkg),
      diamondAmount: pkg.diamondAmount,
      bonusDiamonds: pkg.bonusDiamonds,
      basePriceInr: basePrice,
      userPrice,
      resellerPrice,
      landingPrice,
      price: userPrice, // Backward compatibility
      supplierProductId: pkg.supplierProductId,
      section: (pkg as any).section || 'standard',
      lastUpdated
    }
  })
}
