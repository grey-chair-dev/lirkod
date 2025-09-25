import { NextResponse } from 'next/server'
import { getAllPlaylists } from '@/lib/database'

export async function GET() {
  try {
    const playlists = await getAllPlaylists()
    
    // Transform the data to flatten artist and choreographer objects
    const transformedPlaylists = playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      category: playlist.category,
      createdBy: playlist.createdBy?.name || null,
      dances: playlist.dances.map(playlistDance => ({
        dance: {
          id: playlistDance.dance.id,
          title: playlistDance.dance.title,
          artist: playlistDance.dance.artist?.name || null,
          choreographer: playlistDance.dance.choreographer?.name || null,
          danceType: playlistDance.dance.danceType,
          duration: playlistDance.dance.duration,
          audioUrl: playlistDance.dance.audioUrl,
          tempo: playlistDance.dance.tempo,
          culturalNotes: playlistDance.dance.culturalNotes,
          description: playlistDance.dance.description,
          difficulty: playlistDance.dance.difficulty,
          region: playlistDance.dance.region,
          instructions: playlistDance.dance.instructions
        },
        order: playlistDance.order
      }))
    }))

    return NextResponse.json(transformedPlaylists)
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
  }
}
