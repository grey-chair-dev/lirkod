'use client'

import { useState, useEffect } from 'react'

// New simplified interfaces based on the schema
export interface DanceType {
  id: string
  nameEng: string
  nameHeb?: string | null
  createdAt: string
  updatedAt: string
  dances?: Dance[]
}

export interface Dance {
  id: string
  nameEng: string
  nameHeb: string
  yearCreated?: number | null
  createdAt: string
  updatedAt: string
  choreographerId?: string | null
  songId?: string | null
  artistId?: string | null
  danceTypeId?: string | null
  choreographer?: Choreographer | null
  song?: Song | null
  artist?: Artist | null
  danceType?: DanceType | null
}

export interface Choreographer {
  id: string
  nameEng: string
  nameHeb: string
  createdAt: string
  updatedAt: string
  dances?: Dance[]
}

export interface Song {
  id: string
  nameEng: string
  nameHeb: string
  audioFull?: string | null
  audioShort?: string | null
  coverImage?: string | null
  youtubeUrl?: string | null
  spotifyUrl?: string | null
  appleUrl?: string | null
  createdAt: string
  updatedAt: string
  dances?: Dance[]
}

export interface Artist {
  id: string
  nameEng: string
  nameHeb: string
  createdAt: string
  updatedAt: string
  dances?: Dance[]
}

// Legacy interfaces for backward compatibility
export interface SongData {
  id: string
  title: string
  artist?: string | null
  album?: string | null
  releaseYear?: number | null
  duration?: number | null
  genre?: string | null
  language?: string | null
  
  // Streaming links
  spotifyUrl?: string | null
  appleMusicUrl?: string | null
  youtubeUrl?: string | null
  soundcloudUrl?: string | null
  deezerUrl?: string | null
  
  // Audio files
  audioUrl?: string | null
  previewUrl?: string | null
  
  // Metadata
  isrc?: string | null
  lyrics?: string | null
  composer?: string | null
  lyricist?: string | null
}

// Legacy Song interface for backward compatibility
export interface LegacySong {
  id: string
  title: string
  artist?: string | null
  choreographer?: string | null
  danceType: string
  duration?: number
  audioUrl?: string
  tempo?: number
  culturalNotes?: string
  description?: string
  difficulty?: string
  region?: string
  instructions?: string
  
  // Hebrew and cultural information
  hebrewTitle?: string | null
  translation?: string | null
  yearCreated?: number | null
  
  // Link to actual song
  song?: SongData | null
}

export interface Playlist {
  id: string
  name: string
  description: string
  category: string
  createdBy?: string
  dances: {
    dance: Dance
    order: number
  }[]
}

interface Session {
  id: string
  name: string
  hostName: string
  participantCount: number
  isActive: boolean
  currentSongId?: string
  joinCode: string
  songs: {
    song: Dance
    addedBy?: string
  }[]
  queue: {
    song: Dance
    order: number
    addedBy?: string
  }[]
}

// New hook for dances
export function useDances(query?: string) {
  const [dances, setDances] = useState<Dance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDances = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (query) params.append('q', query)

        const response = await fetch(`/api/dances?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch dances')
        
        const data = await response.json()
        setDances(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDances()
  }, [query])

  return { dances, loading, error }
}

// Hook for fetching dance types
export function useDanceTypes() {
  const [danceTypes, setDanceTypes] = useState<DanceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDanceTypes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/dance-types')
        if (!response.ok) throw new Error('Failed to fetch dance types')
        
        const data = await response.json()
        setDanceTypes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchDanceTypes()
  }, [])

  return { danceTypes, loading, error }
}

// Legacy hook for backward compatibility
export function useSongs(query?: string, filters?: {
  danceType?: string
  region?: string
  difficulty?: string
}) {
  const [songs, setSongs] = useState<LegacySong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Convert dances to legacy song format
        const { dances } = await useDances(query)
        
        const legacySongs: LegacySong[] = dances.map(dance => ({
          id: dance.id,
          title: dance.nameEng,
          artist: dance.artist?.nameEng || null,
          choreographer: dance.choreographer?.nameEng || null,
          danceType: 'Israeli', // Default since we don't have this in new schema
          duration: null,
          audioUrl: dance.song?.audioFull || null,
          tempo: null,
          culturalNotes: null,
          description: null,
          difficulty: 'INTERMEDIATE', // Default
          region: 'Israel', // Default
          instructions: null,
          hebrewTitle: dance.nameHeb,
          translation: dance.nameEng,
          yearCreated: dance.yearCreated,
          song: dance.song ? {
            id: dance.song.id,
            title: dance.song.nameEng,
            artist: dance.artist?.nameEng || null,
            album: null,
            releaseYear: dance.yearCreated,
            duration: null,
            genre: 'Israeli Folk',
            language: 'Hebrew',
            spotifyUrl: dance.song.spotifyUrl,
            appleMusicUrl: dance.song.appleUrl,
            youtubeUrl: dance.song.youtubeUrl,
            soundcloudUrl: null,
            deezerUrl: null,
            audioUrl: dance.song.audioFull,
            previewUrl: dance.song.audioShort,
            isrc: null,
            lyrics: null,
            composer: null,
            lyricist: null
          } : null
        }))
        
        setSongs(legacySongs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [query, filters?.danceType, filters?.region, filters?.difficulty])

  return { songs, loading, error }
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/playlists')
        if (!response.ok) throw new Error('Failed to fetch playlists')
        
        const data = await response.json()
        setPlaylists(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  return { playlists, loading, error }
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/sessions')
        if (!response.ok) throw new Error('Failed to fetch sessions')
        
        const data = await response.json()
        setSessions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  return { sessions, loading, error }
}

export async function createSession(name: string, hostName: string): Promise<Session> {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, hostName }),
  })

  if (!response.ok) {
    throw new Error('Failed to create session')
  }

  return response.json()
}

export async function joinSession(joinCode: string): Promise<Session> {
  const response = await fetch(`/api/sessions/${joinCode}`)
  
  if (!response.ok) {
    throw new Error('Session not found')
  }

  return response.json()
}