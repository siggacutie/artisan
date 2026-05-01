import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const settings = await prisma.settings.findMany()
    const config: Record<string, string> = {}
    settings.forEach(s => config[s.key] = s.value)
    
    // Also include SmilecoinConfig if needed
    const scConfig = await prisma.smilecoinConfig.findFirst()
    if (scConfig) {
      config['smilecoinsAmount'] = String(scConfig.smilecoinsAmount)
      config['inrPaid'] = String(scConfig.inrPaid)
      config['markupPercent'] = String(scConfig.markupPercent)
    }

    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const entries = Object.entries(data)

    for (const [key, value] of entries) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: String(value), updatedBy: admin.id },
        create: { key, value: String(value), updatedBy: admin.id }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
