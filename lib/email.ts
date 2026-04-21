import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function getEmailHtml(code: string, type: string): string {
  const configs: Record<string, { title: string; subtitle: string; color: string; icon: string }> = {
    EMAIL_VERIFY: {
      title: 'Verify Your Email',
      subtitle: 'Enter this code to verify your ArtisanStore account.',
      color: '#ffd700',
      icon: '✦',
    },
    LOGIN_2FA: {
      title: 'Login Verification',
      subtitle: 'Someone is trying to sign in to your account. Use this code to confirm it\'s you.',
      color: '#00c3ff',
      icon: '⬡',
    },
    PASSWORD_RESET: {
      title: 'Reset Your Password',
      subtitle: 'Use this code to reset your ArtisanStore password.',
      color: '#f59e0b',
      icon: '◈',
    },
  }

  const cfg = configs[type] ?? configs.EMAIL_VERIFY

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cfg.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#050810;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050810;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#0d1120;border:1px solid rgba(255,215,0,0.15);border-radius:16px;overflow:hidden;">
          
          <!-- Header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1120 0%,#0a0f1e 100%);border-bottom:2px solid ${cfg.color};padding:32px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:12px;padding:10px 20px;margin-bottom:16px;">
                <span style="color:#ffd700;font-size:13px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">ARTISANSTORE.XYZ</span>
              </div>
              <div style="color:${cfg.color};font-size:28px;margin-bottom:6px;">${cfg.icon}</div>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;letter-spacing:1px;">${cfg.title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 28px 0;text-align:center;">${cfg.subtitle}</p>
              
              <!-- Code box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <div style="background:#050810;border:2px solid ${cfg.color};border-radius:12px;padding:20px 32px;display:inline-block;">
                      <div style="color:#64748b;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Your verification code</div>
                      <div style="color:${cfg.color};font-size:38px;font-weight:700;letter-spacing:10px;font-family:'Courier New',monospace;">${code}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:12px 16px;text-align:center;">
                    <span style="color:#f59e0b;font-size:13px;">This code expires in <strong>10 minutes</strong></span>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <p style="color:#475569;font-size:13px;text-align:center;margin:0;line-height:1.6;">
                If you did not request this code, ignore this email.<br>
                Never share this code with anyone — ArtisanStore staff will never ask for it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0f1e;border-top:1px solid rgba(255,215,0,0.08);padding:20px 40px;text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">
                &copy; 2025 ArtisanStore.xyz &bull; Game Credits. Instantly. Delivered.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendOtpEmail(to: string, code: string, type: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('='.repeat(50))
    console.log('[DEV MODE - OTP CODE]')
    console.log('To:', to)
    console.log('Type:', type)
    console.log('Code:', code)
    console.log('='.repeat(50))
    return
  }

  const subjects: Record<string, string> = {
    EMAIL_VERIFY: 'Verify your ArtisanStore email',
    LOGIN_2FA: 'Your ArtisanStore login code',
    PASSWORD_RESET: 'Reset your ArtisanStore password',
  }

  const { error } = await resend.emails.send({
    from: 'ArtisanStore <noreply@artisanstore.xyz>',
    to,
    subject: subjects[type] ?? 'Your ArtisanStore code',
    html: getEmailHtml(code, type),
  })

  if (error) throw error
}
