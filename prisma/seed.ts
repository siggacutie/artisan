import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const MLBB_PACKAGES = [
  { slug: 'mlbb-78',     supplierProductId: '13',    diamondAmount: 78,   bonusDiamonds: 8,   bonusLabel: '+ 8 Diamonds',   section: 'standard', sortOrder: 1  },
  { slug: 'mlbb-156',    supplierProductId: '23',    diamondAmount: 156,  bonusDiamonds: 16,  bonusLabel: '+ 16 Diamonds',  section: 'standard', sortOrder: 2  },
  { slug: 'mlbb-234',    supplierProductId: '25',    diamondAmount: 234,  bonusDiamonds: 23,  bonusLabel: '+ 23 Diamonds',  section: 'standard', sortOrder: 3  },
  { slug: 'mlbb-625',    supplierProductId: '26',    diamondAmount: 625,  bonusDiamonds: 81,  bonusLabel: '+ 81 Diamonds',  section: 'standard', sortOrder: 4  },
  { slug: 'mlbb-1860',   supplierProductId: '27',    diamondAmount: 1860, bonusDiamonds: 335, bonusLabel: '+ 335 Diamonds', section: 'standard', sortOrder: 5  },
  { slug: 'mlbb-3099',   supplierProductId: '28',    diamondAmount: 3099, bonusDiamonds: 589, bonusLabel: '+ 589 Diamonds', section: 'standard', sortOrder: 6  },
  { slug: 'mlbb-4649',   supplierProductId: '29',    diamondAmount: 4649, bonusDiamonds: 883, bonusLabel: '+ 883 Diamonds', section: 'standard', sortOrder: 7  },
  { slug: 'mlbb-d50',    supplierProductId: '22590', diamondAmount: 50,   bonusDiamonds: 5,   bonusLabel: '+ 5 Diamonds',   section: 'double',   sortOrder: 8  },
  { slug: 'mlbb-d150',   supplierProductId: '22591', diamondAmount: 150,  bonusDiamonds: 15,  bonusLabel: '+ 15 Diamonds',  section: 'double',   sortOrder: 9  },
  { slug: 'mlbb-d250',   supplierProductId: '22592', diamondAmount: 250,  bonusDiamonds: 25,  bonusLabel: '+ 25 Diamonds',  section: 'double',   sortOrder: 10 },
  { slug: 'mlbb-d500',   supplierProductId: '22593', diamondAmount: 500,  bonusDiamonds: 65,  bonusLabel: '+ 65 Diamonds',  section: 'double',   sortOrder: 11 },
  { slug: 'mlbb-weekly', supplierProductId: '16642', diamondAmount: 0,    bonusDiamonds: 0,   bonusLabel: null,             section: 'weekly',   sortOrder: 12 },
  { slug: 'mlbb-elite',  supplierProductId: '26555', diamondAmount: 0,    bonusDiamonds: 0,   bonusLabel: null,             section: 'weekly',   sortOrder: 13 },
  { slug: 'mlbb-epic',   supplierProductId: '26556', diamondAmount: 0,    bonusDiamonds: 0,   bonusLabel: null,             section: 'weekly',   sortOrder: 14 },
]

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

async function main() {
  // 1. Upsert superadmin
  const passwordHash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'changeme', 12)
  await prisma.adminAccount.upsert({
    where: { email: 'alandumspar@gmail.com' },
    update: {},
    create: {
      email: 'alandumspar@gmail.com',
      passwordHash,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  })

  // 2. Upsert default SmilecoinConfig
  const existingConfig = await prisma.smilecoinConfig.findFirst()
  if (!existingConfig) {
    await prisma.smilecoinConfig.create({
      data: {
        smilecoinsAmount: 10000,
        inrPaid: 19000,
        markupPercent: 1.1,
      },
    })
  }

  // 3. Upsert default PricingConfig
  const existingPricing = await prisma.pricingConfig.findFirst()
  if (!existingPricing) {
    await prisma.pricingConfig.create({
      data: {
        userMarkupPercent: 3.5,
        resellerMarkupPercent: 1.5,
        refreshIntervalHours: 2.0,
        inviteLinkExpiryHours: 2.0,
      },
    })
  }

  // 4. Upsert MLBB game
  const mlbbGame = await prisma.game.upsert({
    where: { slug: 'mlbb' },
    update: { name: 'Mobile Legends Bang Bang', isActive: true },
    create: {
      name: 'Mobile Legends Bang Bang',
      slug: 'mlbb',
      description: 'Top up MLBB diamonds instantly.',
      isActive: true,
      supplierName: 'smile.one',
      supplierBaseUrl: 'https://www.smile.one/merchant/mobilelegends',
    },
  })

  // 5. Seed all 14 packages using SmileCoin cost to calculate basePriceInr
  const config = await prisma.smilecoinConfig.findFirst()
  if (!config) throw new Error('SmilecoinConfig not found after seeding')

  const inrPerSmilecoin = config.inrPaid / config.smilecoinsAmount

  for (const pkg of MLBB_PACKAGES) {
    const smilecoins = SMILECOIN_COSTS[pkg.slug]
    const basePriceInr = Math.ceil(smilecoins * inrPerSmilecoin * (1 + config.markupPercent / 100))

    await prisma.diamondPackage.upsert({
      where: { id: pkg.slug },
      update: {
        basePriceInr,
        displayPrice: basePriceInr,
        bonusDiamonds: pkg.bonusDiamonds,
        bonusLabel: pkg.bonusLabel,
        section: pkg.section,
        sortOrder: pkg.sortOrder,
        isVisible: true,
        supplierProductId: pkg.supplierProductId,
      },
      create: {
        id: pkg.slug,
        gameId: mlbbGame.id,
        diamondAmount: pkg.diamondAmount,
        basePriceInr,
        displayPrice: basePriceInr,
        bonusDiamonds: pkg.bonusDiamonds,
        bonusLabel: pkg.bonusLabel,
        section: pkg.section,
        sortOrder: pkg.sortOrder,
        isVisible: true,
        supplierProductId: pkg.supplierProductId,
      },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
