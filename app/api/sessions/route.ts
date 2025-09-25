import { NextRequest, NextResponse } from 'next/server'
import { getAllSessions, createSession, generateJoinCode } from '@/lib/database'

export async function GET() {
  try {
    const sessions = await getAllSessions()
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, hostId } = body

    if (!name || !hostId) {
      return NextResponse.json({ error: 'Name and host ID are required' }, { status: 400 })
    }

    const joinCode = generateJoinCode()
    const session = await createSession({
      name,
      description,
      hostId,
      joinCode
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
