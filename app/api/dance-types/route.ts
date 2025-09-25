import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const danceTypes = await prisma.danceType.findMany({
      orderBy: { nameEng: 'asc' }
    })

    return NextResponse.json(danceTypes)
  } catch (error) {
    console.error('Error fetching dance types:', error)
    return NextResponse.json({ error: 'Failed to fetch dance types' }, { status: 500 })
  }
}
