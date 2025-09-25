import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const dances = await prisma.dance.findMany({
      include: {
        choreographer: true,
        song: true,
        artist: true,
        danceType: true
      }
    })

    return NextResponse.json(dances)
  } catch (error) {
    console.error('Error fetching dances:', error)
    return NextResponse.json({ error: 'Failed to fetch dances' }, { status: 500 })
  }
}
