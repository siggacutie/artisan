import { NextResponse } from 'next/server'
import { getCurrentPrices } from '@/lib/pricing'

export async function GET() {
  try {
    const data = await getCurrentPrices()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 })
  }
}
