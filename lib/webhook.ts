export async function sendAlert(message: string, data: Record<string, any>) {
  const url = process.env.SIGNUP_ALERTS_WEBHOOK
  if (!url) return
  
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: message,
        embeds: [{
          color: message.includes('AUTO-FROZEN') || message.includes('BANNED') ? 0xef4444 : 
                 message.includes('SUSPICIOUS') ? 0xf59e0b : 0x22c55e,
          fields: Object.entries(data).map(([k, v]) => ({
            name: k, 
            value: String(v), 
            inline: true
          }))
        }]
      })
    })
  } catch (err) {
    console.error("Webhook error:", err)
  }
}
