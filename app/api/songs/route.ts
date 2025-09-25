import { NextRequest, NextResponse } from 'next/server'
import { getAllDances, searchDances } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const danceType = searchParams.get('danceType')
    const region = searchParams.get('region')
    const difficulty = searchParams.get('difficulty')

    let dances

    if (query) {
      dances = await searchDances(query)
    } else {
      dances = await getAllDances()
    }

    // Apply additional filters
    if (danceType) {
      dances = dances.filter(dance => dance.eng_danceType === danceType)
    }
    if (region) {
      dances = dances.filter(dance => dance.region === region)
    }
    if (difficulty) {
      dances = dances.filter(dance => dance.difficulty === difficulty.toUpperCase())
    }

    // Transform the data to flatten artist and choreographer objects
    const transformedDances = dances.map(dance => ({
      id: dance.id,
      title: dance.eng_title,
      artist: dance.artist?.name || null,
      choreographer: dance.choreographer?.name || null,
      danceType: dance.eng_danceType,
      duration: dance.duration,
      audioUrl: dance.audioUrl,
      tempo: dance.tempo,
      culturalNotes: dance.culturalNotes,
      description: dance.description,
      difficulty: dance.difficulty,
      region: dance.region,
      instructions: dance.instructions,
      // New Hebrew and cultural fields
      hebrewTitle: dance.hebrewTitle,
      translation: dance.translation,
      yearCreated: dance.yearCreated,
      imageUrl: dance.imageUrl,
      // Song relation
      song: dance.song ? {
        id: dance.song.id,
        title: dance.song.title,
        artist: dance.song.artist,
        album: dance.song.album,
        releaseYear: dance.song.releaseYear,
        duration: dance.song.duration,
        genre: dance.song.genre,
        language: dance.song.language,
        spotifyUrl: dance.song.spotifyUrl,
        appleMusicUrl: dance.song.appleMusicUrl,
        youtubeUrl: dance.song.youtubeUrl,
        soundcloudUrl: dance.song.soundcloudUrl,
        deezerUrl: dance.song.deezerUrl,
        audioUrl: dance.song.audioUrl,
        previewUrl: dance.song.previewUrl,
        isrc: dance.song.isrc,
        lyrics: dance.song.lyrics,
        composer: dance.song.composer,
        lyricist: dance.song.lyricist,
        imageUrl: dance.song.imageUrl
      } : null
    }))

    return NextResponse.json(transformedDances)
  } catch (error) {
    console.error('Error fetching dances:', error)
    return NextResponse.json({ error: 'Failed to fetch dances' }, { status: 500 })
  }
}
