import { NextResponse } from 'next/server'
import { getAllChoreographers } from '@/lib/database'

export async function GET() {
  try {
    const choreographers = await getAllChoreographers()
    return NextResponse.json(choreographers)
  } catch (error) {
    console.error('Error fetching choreographers:', error)
    return NextResponse.json({ error: 'Failed to fetch choreographers' }, { status: 500 })
  }
}
