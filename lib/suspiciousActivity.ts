import { prisma } from './prisma'

export async function checkSuspiciousActivity(userId: string, existingSession: any) {
  const recentLogins = await prisma.suspiciousActivity.count({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
    }
  })

  if (recentLogins >= 3) {
    await prisma.suspiciousActivity.create({
      data: { userId, reason: 'Multiple logins from different sessions within 1 hour', metadata: { existingSession } }
    })

    const webhookUrl = process.env.SIGNUP_ALERTS_WEBHOOK
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: 'Suspicious Login Activity',
            color: 16711680,
            fields: [
              { name: 'User ID', value: userId, inline: true },
              { name: 'Reason', value: 'Multiple logins from different devices/IPs', inline: false },
              { name: 'Time', value: new Date().toUTCString(), inline: false },
            ],
            footer: { text: 'ArtisanStore Security Alert' }
          }]
        })
      }).catch(() => {})
    }
  }
}
