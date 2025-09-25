export interface Song {
  id: string
  title: string
  artist: string
  danceType: string
  duration: number
  audioUrl: string
  tempo?: number
  culturalNotes?: string
  region?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface Playlist {
  id: string
  name: string
  description: string
  songs: Song[]
  category: string
  createdBy?: string
}

// Mock data for music content
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Hava Nagila',
    artist: 'Traditional',
    danceType: 'Hora',
    duration: 180,
    audioUrl: '/audio/hava-nagila.mp3',
    tempo: 120,
    culturalNotes: 'One of the most famous Jewish folk songs, often played at celebrations and weddings.',
    region: 'Eastern Europe',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Debka Gilboa',
    artist: 'Traditional',
    danceType: 'Debka',
    duration: 240,
    audioUrl: '/audio/debka-gilboa.mp3',
    tempo: 140,
    culturalNotes: 'A traditional cultural dance with intricate footwork.',
    region: 'Middle East',
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Mayim Mayim',
    artist: 'Traditional',
    danceType: 'Circle Dance',
    duration: 200,
    audioUrl: '/audio/mayim-mayim.mp3',
    tempo: 110,
    culturalNotes: 'A celebratory dance about water, often performed in a circle formation.',
    region: 'Israel',
    difficulty: 'beginner'
  },
  {
    id: '4',
    title: 'Yemenite Step',
    artist: 'Traditional',
    danceType: 'Yemenite',
    duration: 220,
    audioUrl: '/audio/yemenite-step.mp3',
    tempo: 130,
    culturalNotes: 'Traditional Yemenite Jewish dance with distinctive hand movements and steps.',
    region: 'Yemen',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    title: 'Hora Medura',
    artist: 'Traditional',
    danceType: 'Hora',
    duration: 190,
    audioUrl: '/audio/hora-medura.mp3',
    tempo: 125,
    culturalNotes: 'A fire hora, traditionally danced around a bonfire during celebrations.',
    region: 'Israel',
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'Debka Kfar Giladi',
    artist: 'Traditional',
    danceType: 'Debka',
    duration: 280,
    audioUrl: '/audio/debka-kfar-giladi.mp3',
    tempo: 135,
    culturalNotes: 'A complex debka from the northern region of Israel.',
    region: 'Northern Israel',
    difficulty: 'advanced'
  },
  {
    id: '7',
    title: 'Sephardic Romance',
    artist: 'Traditional',
    danceType: 'Sephardic',
    duration: 210,
    audioUrl: '/audio/sephardic-romance.mp3',
    tempo: 100,
    culturalNotes: 'A romantic dance from the Sephardic Jewish tradition.',
    region: 'Spain/Mediterranean',
    difficulty: 'intermediate'
  },
  {
    id: '8',
    title: 'Hora Agadati',
    artist: 'Traditional',
    danceType: 'Hora',
    duration: 195,
    audioUrl: '/audio/hora-agadati.mp3',
    tempo: 115,
    culturalNotes: 'Named after Baruch Agadati, this hora has become a classic cultural dance.',
    region: 'Israel',
    difficulty: 'beginner'
  }
]

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Beginner Hora Collection',
    description: 'Perfect for those just starting with cultural dance',
    category: 'Hora',
    songs: mockSongs.filter(song => song.danceType === 'Hora' && song.difficulty === 'beginner')
  },
  {
    id: '2',
    name: 'Traditional Debka',
    description: 'Classic debka dances from various regions',
    category: 'Debka',
    songs: mockSongs.filter(song => song.danceType === 'Debka')
  },
  {
    id: '3',
    name: 'Wedding Celebration',
    description: 'Popular songs for Jewish weddings and celebrations',
    category: 'Celebration',
    songs: mockSongs.filter(song => 
      song.title.includes('Hava Nagila') || 
      song.title.includes('Mayim') ||
      song.title.includes('Hora')
    )
  },
  {
    id: '4',
    name: 'Yemenite Heritage',
    description: 'Traditional Yemenite Jewish dances and music',
    category: 'Yemenite',
    songs: mockSongs.filter(song => song.danceType === 'Yemenite' || song.region === 'Yemen')
  }
]

export const danceTypes = [
  'Israeli',
  'International',
  'All',
  'Circle',
  'Partners',
  'Line',
  'Kids',
  'Mixers'
]

export const regions = [
  'Israel',
  'Eastern Europe',
  'Middle East',
  'Yemen',
  'Spain/Mediterranean',
  'Northern Israel',
  'Southern Israel'
]

export const difficultyLevels = [
  'beginner',
  'intermediate',
  'advanced'
]
