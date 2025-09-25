'use client'

import { useState, useEffect } from 'react'
import { X, Play, Pause, Plus, Heart, Share2, MoreHorizontal, Clock, Users, MapPin, Music, Calendar, ExternalLink, Globe, Video, Headphones } from 'lucide-react'
import type { Dance } from '@/hooks/useApiData'
import { useMusicPlayer } from '@/hooks/useMusicPlayer'
import { useLanguage } from '@/contexts/LanguageContext'
import { getDanceDisplayName, getChoreographerDisplayName, getArtistDisplayName, getSongDisplayName, getDanceTypeDisplayName, getDanceTypeColor, getLanguageText, UI_TEXT } from '@/utils/languageUtils'

interface SongCardPopupProps {
  song: Dance | null
  isOpen: boolean
  onClose: () => void
}

export default function SongCardPopup({ song, isOpen, onClose }: SongCardPopupProps) {
  const { currentSong, isPlaying, play, pause, addToQueue } = useMusicPlayer()
  const { language } = useLanguage()
  const [isLiked, setIsLiked] = useState(false)

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !song) return null

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pause()
    } else {
      play(song)
    }
  }

  const handleAddToQueue = () => {
    addToQueue(song)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'text-green-600 bg-green-100'
      case 'INTERMEDIATE': return 'text-yellow-600 bg-yellow-100'
      case 'ADVANCED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Get real song details from the Dance data
  const getSongDetails = (song: Dance) => {
    return {
      hebrewTitle: song.nameHeb || 'Unknown',
      translation: song.nameEng || 'Unknown',
      yearCreated: song.yearCreated?.toString() || 'Unknown',
      composer: getSongDisplayName(song.song ?? null, language),
      singer: getArtistDisplayName(song.artist ?? null, language)
    }
  }

  // Get streaming links for the song
  const getStreamingLinks = (song: Dance) => {
    // Use actual song data if available
    if (song.song) {
      return {
        spotify: song.song.spotifyUrl,
        appleMusic: song.song.appleUrl,
        youtube: song.song.youtubeUrl,
        soundcloud: null, // Not in our schema
        deezer: null // Not in our schema
      }
    }
    
    // No streaming links available
    return {
      spotify: null,
      appleMusic: null,
      youtube: null,
      soundcloud: null,
      deezer: null
    }
  }

  const songDetails = getSongDetails(song)
  const streamingLinks = getStreamingLinks(song)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Spotify-style Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
        {/* Album Art Section */}
        <div className="relative h-64 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
          {/* Album Art */}
          {song.song?.coverImage ? (
            <img 
              src={song.song.coverImage} 
              alt={`${song.nameEng} album cover`}
              className="w-40 h-40 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Music className="w-16 h-16 text-white" />
            </div>
          )}
          
          {/* Floating Play Button */}
          <button
            onClick={handlePlayPause}
            className={`absolute bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
              isCurrentlyPlaying 
                ? 'bg-white text-black hover:scale-105' 
                : 'bg-green-500 hover:bg-green-400 text-white hover:scale-105'
            }`}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Song Title and Artist */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{getDanceDisplayName(song, language)}</h1>
            <p className="text-gray-600 text-sm">
              {getChoreographerDisplayName(song.choreographer ?? null, language) || getArtistDisplayName(song.artist ?? null, language) || 'Unknown'}
            </p>
          </div>

          {/* Song Details - Compact */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{getLanguageText(UI_TEXT.hebrew, language)}:</span>
              <span className="text-gray-900 font-medium" dir="rtl">{songDetails.hebrewTitle}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">{getLanguageText(UI_TEXT.type, language)}:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDanceTypeColor(song.danceType?.nameEng)}`}>
                {getDanceTypeDisplayName(song.danceType ?? null, language)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">{getLanguageText(UI_TEXT.year, language)}:</span>
              <span className="text-gray-900 font-medium">{songDetails.yearCreated}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">{getLanguageText(UI_TEXT.composer, language)}:</span>
              <span className="text-gray-900 font-medium">{songDetails.composer}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleAddToQueue}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>{getLanguageText(UI_TEXT.addToQueue, language)}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-green-500 hover:bg-green-50' 
                    : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Audio Player */}
          {song.song?.audioFull && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <audio 
                controls 
                className="w-full h-8"
                src={song.song.audioFull}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Streaming Links */}
          {(streamingLinks.spotify || streamingLinks.appleMusic || streamingLinks.youtube || streamingLinks.soundcloud || streamingLinks.deezer) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Listen on</h3>
              <div className="flex flex-wrap gap-2">
                {streamingLinks.spotify && (
                  <a
                    href={streamingLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors text-sm font-medium"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Spotify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {streamingLinks.appleMusic && (
                  <a
                    href={streamingLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors text-sm font-medium"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                    <span>Apple Music</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {streamingLinks.youtube && (
                  <a
                    href={streamingLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors text-sm font-medium"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {streamingLinks.soundcloud && (
                  <a
                    href={streamingLinks.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors text-sm font-medium"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span>SoundCloud</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {streamingLinks.deezer && (
                  <a
                    href={streamingLinks.deezer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors text-sm font-medium"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span>Deezer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
