import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const choreographerId = params.id

    // Fetch choreographer with their dances
    const choreographer = await prisma.choreographer.findUnique({
      where: { id: choreographerId },
      include: {
        dances: {
          include: {
            artist: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!choreographer) {
      return NextResponse.json(
        { error: 'Choreographer not found' },
        { status: 404 }
      )
    }

    // Get statistics
    const totalDances = choreographer.dances.length
    const danceTypes = [...new Set(choreographer.dances.map(d => d.danceType))]
    const regions = [...new Set(choreographer.dances.map(d => d.region).filter(Boolean))]
    const difficulties = [...new Set(choreographer.dances.map(d => d.difficulty))]

    const response = {
      ...choreographer,
      stats: {
        totalDances,
        danceTypes,
        regions,
        difficulties
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching choreographer:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch choreographer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
