import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("imafatwhalelollololol", 12)
  
  await prisma.adminAccount.upsert({
    where: { email: "alandumspar@gmail.com" },
    update: { passwordHash, role: "SUPERADMIN" },
    create: {
      email: "alandumspar@gmail.com",
      passwordHash,
      role: "SUPERADMIN",
    }
  })

  // Also seed initial SmilecoinConfig if not exists
  const config = await prisma.smilecoinConfig.findFirst()
  if (!config) {
    await prisma.smilecoinConfig.create({
      data: {
        smilecoinsAmount: 10000,
        inrPaid: 19000,
        markupPercent: 1.1
      }
    })
  }

  console.log("Admin account seeded: alandumspar@gmail.com")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
