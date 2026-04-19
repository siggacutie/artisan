import { prisma } from './prisma'

export async function debitWallet(userId: string, amount: number, description: string, referenceId: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    })
    if (!user) throw new Error('User not found')
    if (user.walletBalance < amount) throw new Error('Insufficient wallet balance')
    
    const updated = await tx.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: amount } },
    })
    
    await tx.walletTransaction.create({
      data: {
        userId,
        type: 'DEBIT',
        amount,
        currency: 'INR',
        method: 'WALLET',
        referenceId,
        status: 'COMPLETED',
        description,
      },
    })
    
    return updated
  })
}
