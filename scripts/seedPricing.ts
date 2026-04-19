import { prisma } from '../lib/prisma'

async function main() {
  const existing = await prisma.pricingConfig.findFirst()
  if (!existing) {
    await prisma.pricingConfig.create({
      data: { userMarkupPercent: 3.5, resellerMarkupPercent: 1.5, refreshIntervalHours: 2.0 }
    })
    console.log('Pricing config seeded')
  } else {
    console.log('Pricing config already exists')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
