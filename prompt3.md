-to-proxy
  Creating an optimized production build ...
✓ Compiled successfully in 15.4s
  Running TypeScript  .Failed to type check.

./app/api/payments/confirm/route.ts:198:9
Type error: Object literal may only specify known properties, and 'description' does not exist in type 'DiscordEmbed'.

  196 |       await sendDiscord('payment', {
  197 |         title: 'Payment Received (Queued for UTR)',
> 198 |         description: 'Listener caught a payment before the user submitted the UTR. It has...
      |         ^
  199 |         color: 0x3b82f6, // Blue
  200 |         fields: [
  201 |           { name: 'UTR', value: utrNumber, inline: true },
Next.js build worker exited with code: 1 and signal: null