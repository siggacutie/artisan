import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const keys = ['out_of_stock_enabled', 'restock_timer']
    const settings = await prisma.settings.findMany({
      where: {
        key: { in: keys }
      }
    })
    
    const config: Record<string, string> = {}
    settings.forEach(s => config[s.key] = s.value)
    
    return NextResponse.json({
      out_of_stock_enabled: config['out_of_stock_enabled'] === 'true',
      restock_timer: config['restock_timer'] || null
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}
