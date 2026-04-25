type WebhookType = 'general' | 'error' | 'signup' | 'order' | 'payment'

const WEBHOOK_URLS: Record<WebhookType, string | undefined> = {
  general: process.env.DISCORD_WEBHOOK,
  error: process.env.DISCORD_WEBHOOK_ERRORS,
  signup: process.env.signup_alerts_webhook,
  order: process.env.ORDERS_DISCORD_WEBHOOK,
  payment: process.env.DISCORD_PAYMENT_WEBHOOK,
}

interface DiscordEmbed {
  title: string
  color: number
  fields: { name: string; value: string; inline?: boolean }[]
  timestamp?: string
}

export async function sendDiscord(
  type: WebhookType,
  embed: DiscordEmbed,
  username = 'ArtisanStore'
): Promise<void> {
  const url = WEBHOOK_URLS[type]
  if (!url) {
    console.warn(`[discord/${type}] No webhook URL configured`)
    return
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      embeds: [{ ...embed, timestamp: embed.timestamp ?? new Date().toISOString() }],
    }),
  }).catch(err => console.error(`[discord/${type}]`, err))
}
