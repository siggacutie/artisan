import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Creating Mock Order for Bot Test ---')

  // 1. Get a game (MLBB)
  const game = await prisma.game.findFirst({
    where: { slug: 'mlbb' }
  })

  if (!game) {
    console.error('MLBB game not found in DB. Please run seed first.')
    return
  }

  // 2. Get a package
  const pkg = await prisma.diamondPackage.findFirst({
    where: { gameId: game.id }
  })

  if (!pkg) {
    console.error('No packages found for MLBB.')
    return
  }

  // 3. Get a user
  const user = await prisma.user.findFirst()
  if (!user) {
    console.error('No users found in DB.')
    return
  }

  // 4. Create the Order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      gameId: game.id,
      productId: pkg.id,
      unitPrice: pkg.basePriceInr || pkg.displayPrice || 0,
      paymentStatus: 'PAID',
      orderStatus: 'PENDING',
      type: 'TOPUP',
      playerInputs: {
        userId: '12345678',
        zoneId: '1234'
      },
      paymentMethod: 'WALLET',
      totalPrice: pkg.basePriceInr || pkg.displayPrice || 0
    }
  })

  console.log(`✅ Success! Created Mock Order: ${order.id}`)
  console.log('The bot should pick this up on its next poll.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
