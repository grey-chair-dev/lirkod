import type { Dance, Choreographer, Artist, Song, DanceType } from '@/hooks/useApiData'

type Language = 'en' | 'he'

// Helper function to get display name for a dance
export function getDanceDisplayName(dance: Dance | null, language: Language): string {
  if (!dance) return 'Unknown'
  
  if (language === 'he' && dance.nameHeb) {
    return dance.nameHeb
  }
  
  return dance.nameEng || 'Unknown'
}

// Helper function to get display name for a choreographer
export function getChoreographerDisplayName(choreographer: Choreographer | null, language: Language): string {
  if (!choreographer) return 'Unknown'
  
  if (language === 'he' && choreographer.nameHeb) {
    return choreographer.nameHeb
  }
  
  return choreographer.nameEng || 'Unknown'
}

// Helper function to get display name for an artist
export function getArtistDisplayName(artist: Artist | null, language: Language): string {
  if (!artist) return 'Unknown'
  
  if (language === 'he' && artist.nameHeb) {
    return artist.nameHeb
  }
  
  return artist.nameEng || 'Unknown'
}

// Helper function to get display name for a song
export function getSongDisplayName(song: Song | null, language: Language): string {
  if (!song) return 'Unknown'
  
  if (language === 'he' && song.nameHeb) {
    return song.nameHeb
  }
  
  return song.nameEng || 'Unknown'
}

// Helper function to get display name for a dance type
export function getDanceTypeDisplayName(danceType: DanceType | null, language: Language): string {
  if (!danceType) return 'Unknown'
  
  // Use the predefined translations if available
  const typeKey = danceType.nameEng as keyof typeof UI_TEXT.contentTypes
  if (UI_TEXT.contentTypes[typeKey]) {
    return getLanguageText(UI_TEXT.contentTypes[typeKey], language)
  }
  
  // Fallback to database values
  if (language === 'he' && danceType.nameHeb) {
    return danceType.nameHeb
  }
  
  return danceType.nameEng || 'Unknown'
}

// Helper function to get color classes for dance types
export function getDanceTypeColor(danceTypeName?: string | null): string {
  if (!danceTypeName) return 'bg-gray-100 text-gray-800'
  
  switch (danceTypeName) {
    case 'SESSION':
      return 'bg-blue-100 text-blue-800'
    case 'IMITATION_FOR_CHILDREN':
      return 'bg-pink-100 text-pink-800'
    case 'WHEELCHAIRS':
      return 'bg-purple-100 text-purple-800'
    case 'CHILDREN_LINES':
      return 'bg-yellow-100 text-yellow-800'
    case 'TRIOS':
      return 'bg-indigo-100 text-indigo-800'
    case 'MEDLEY':
      return 'bg-orange-100 text-orange-800'
    case 'CHILDREN_COUPLES':
      return 'bg-rose-100 text-rose-800'
    case 'CHILDREN_CIRCLE':
      return 'bg-cyan-100 text-cyan-800'
    case 'PERFORMANCE':
      return 'bg-red-100 text-red-800'
    case 'DANCE_DELIGHT':
      return 'bg-emerald-100 text-emerald-800'
    case 'LINES':
      return 'bg-teal-100 text-teal-800'
    case 'COUPLES':
      return 'bg-violet-100 text-violet-800'
    case 'CIRCLE':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Helper function to get border color for dance types
export function getDanceTypeBorderColor(danceTypeName?: string | null): string {
  if (!danceTypeName) return 'border-gray-300'
  
  switch (danceTypeName) {
    case 'SESSION':
      return 'border-blue-500'
    case 'IMITATION_FOR_CHILDREN':
      return 'border-pink-500'
    case 'WHEELCHAIRS':
      return 'border-purple-500'
    case 'CHILDREN_LINES':
      return 'border-yellow-500'
    case 'TRIOS':
      return 'border-indigo-500'
    case 'MEDLEY':
      return 'border-orange-500'
    case 'CHILDREN_COUPLES':
      return 'border-rose-500'
    case 'CHILDREN_CIRCLE':
      return 'border-cyan-500'
    case 'PERFORMANCE':
      return 'border-red-500'
    case 'DANCE_DELIGHT':
      return 'border-emerald-500'
    case 'LINES':
      return 'border-teal-500'
    case 'COUPLES':
      return 'border-violet-500'
    case 'CIRCLE':
      return 'border-green-500'
    default:
      return 'border-gray-300'
  }
}

// Helper function to get language-specific text
export function getLanguageText(texts: { en: string; he: string }, language: Language): string {
  return texts[language] || texts.en
}

// Common UI text translations
export const UI_TEXT = {
  search: {
    en: 'Search content...',
    he: 'חפש תוכן...'
  },
  addToQueue: {
    en: 'Add to Queue',
    he: 'הוסף לתור'
  },
  play: {
    en: 'Play',
    he: 'נגן'
  },
  pause: {
    en: 'Pause',
    he: 'השהה'
  },
  connect: {
    en: 'Connect',
    he: 'התחבר'
  },
  disconnected: {
    en: 'Disconnected',
    he: 'מנותק'
  },
  connected: {
    en: 'Connected',
    he: 'מחובר'
  },
  hebrew: {
    en: 'Hebrew',
    he: 'עברית'
  },
  type: {
    en: 'Type',
    he: 'סוג'
  },
  year: {
    en: 'Year',
    he: 'שנה'
  },
  composer: {
    en: 'Composer',
    he: 'מלחין'
  },
  singer: {
    en: 'Singer',
    he: 'זמר'
  },
  listenOn: {
    en: 'Listen on',
    he: 'האזן ב'
  },
  musicContent: {
    en: 'Music Content',
    he: 'תוכן מוזיקלי'
  },
  // Content type translations
  contentTypes: {
    SESSION: { en: 'Session', he: 'מפגש' },
    IMITATION_FOR_CHILDREN: { en: 'Imitation for children', he: 'חיקוי לילדים' },
    WHEELCHAIRS: { en: 'Wheelchairs', he: 'כיסאות גלגלים' },
    CHILDREN_LINES: { en: 'Children - lines', he: 'ילדים - שורות' },
    TRIOS: { en: 'Trios', he: 'שלישיות' },
    MEDLEY: { en: 'Medley', he: 'מדליי' },
    CHILDREN_COUPLES: { en: 'Children - couples', he: 'ילדים - זוגות' },
    CHILDREN_CIRCLE: { en: 'Children - circle', he: 'ילדים - מעגל' },
    PERFORMANCE: { en: 'Performance', he: 'הופעה' },
    DANCE_DELIGHT: { en: 'Content delight', he: 'עונג תוכן' },
    LINES: { en: 'Lines', he: 'שורות' },
    COUPLES: { en: 'Couples', he: 'זוגות' },
    CIRCLE: { en: 'Circle', he: 'מעגל' }
  }
}
