'use client'

import { Play, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Dance } from '@/hooks/useApiData'
import { useLanguage } from '@/contexts/LanguageContext'
import { getDanceDisplayName, getChoreographerDisplayName, getArtistDisplayName, getDanceTypeDisplayName, getDanceTypeColor, getDanceTypeBorderColor } from '@/utils/languageUtils'

interface SongCardProps {
  song: Dance
  isPlaying: boolean
  onPlay: () => void
  onAddToQueue?: () => void
  onCardClick?: () => void
}

export default function SongCard({ song, isPlaying, onPlay, onAddToQueue, onCardClick }: SongCardProps) {
  const router = useRouter()
  const { language } = useLanguage()
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Helper function to safely extract name from artist or choreographer
  const getArtistOrChoreographerName = () => {
    return getChoreographerDisplayName(song.choreographer ?? null, language) || 
           getArtistDisplayName(song.artist ?? null, language) || 
           'Unknown'
  }

  // Handle choreographer click
  const handleChoreographerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (song.choreographer?.nameEng) {
      // For now, we'll use a simple slug generation
      // In a real app, you'd want to store choreographer IDs
      const choreographerSlug = song.choreographer.nameEng.toLowerCase().replace(/\s+/g, '-')
      router.push(`/choreographer/${choreographerSlug}`)
    }
  }



  return (
    <div 
      className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer border-l-4 ${getDanceTypeBorderColor(song.danceType?.nameEng)}`}
      onClick={onCardClick}
    >
      {/* Play Button */}
      <div className="flex-shrink-0">
        <button
          onClick={onPlay}
          className={`p-2 rounded-full transition-colors ${
            isPlaying
              ? 'bg-primary-500 text-white'
              : 'bg-transparent text-gray-400 group-hover:text-gray-600'
          }`}
        >
          <Play className="w-4 h-4" />
        </button>
      </div>

      {/* Dance Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${
          isPlaying ? 'text-primary-600' : 'text-gray-900'
        }`}>
          {getDanceDisplayName(song, language)}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {song.choreographer?.nameEng ? (
            <button
              onClick={handleChoreographerClick}
              className="hover:text-primary-600 hover:underline transition-colors"
            >
              {getChoreographerDisplayName(song.choreographer, language)}
            </button>
          ) : (
            getArtistOrChoreographerName()
          )}
        </p>
      </div>

      {/* Dance Type */}
      <div className="hidden md:block flex-shrink-0 w-32">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDanceTypeColor(song.danceType?.nameEng)}`}>
          {getDanceTypeDisplayName(song.danceType ?? null, language)}
        </span>
      </div>

      {/* Year */}
      <div className="hidden lg:block flex-shrink-0 w-16 text-right">
        <span className="text-sm text-gray-500">
          {song.yearCreated || 'N/A'}
        </span>
      </div>

      {/* Add to Queue Button */}
      {onAddToQueue && (
        <div className="flex-shrink-0">
          <button
            onClick={onAddToQueue}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Add to queue"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

