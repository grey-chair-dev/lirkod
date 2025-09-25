import { NextRequest, NextResponse } from 'next/server'
import { getSessionByJoinCode } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { joinCode: string } }
) {
  try {
    const { joinCode } = params
    const session = await getSessionByJoinCode(joinCode)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
