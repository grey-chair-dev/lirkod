'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Music, Users, MapPin, Calendar, Star, Play, Plus, Heart, Share2 } from 'lucide-react'
import type { Song } from '@/hooks/useApiData'

interface Choreographer {
  id: string
  name: string
  bio?: string
  region?: string
  imageUrl?: string
  website?: string
  createdAt: string
  updatedAt: string
  dances: Array<{
    id: string
    title: string
    danceType: string
    difficulty: string
    region?: string
    culturalNotes?: string
    audioUrl?: string
    artist: {
      id: string
      name: string
    }
  }>
  stats: {
    totalDances: number
    danceTypes: string[]
    regions: string[]
    difficulties: string[]
  }
}

interface ChoreographerPageProps {
  params: {
    id: string
  }
}

export default function ChoreographerPage({ params }: ChoreographerPageProps) {
  const router = useRouter()
  const [choreographer, setChoreographer] = useState<Choreographer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDanceType, setSelectedDanceType] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')

  useEffect(() => {
    const fetchChoreographer = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/choreographers/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch choreographer')
        }
        
        const data = await response.json()
        setChoreographer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChoreographer()
  }, [params.id])

  const handlePlayDance = (dance: any) => {
    // This would integrate with your music player
    console.log('Playing dance:', dance.title)
  }

  const handleAddToQueue = (dance: any) => {
    // This would add the dance to the queue
    console.log('Adding to queue:', dance.title)
  }

  const filteredDances = choreographer?.dances.filter(dance => {
    const matchesType = !selectedDanceType || dance.danceType === selectedDanceType
    const matchesDifficulty = !selectedDifficulty || dance.difficulty === selectedDifficulty
    return matchesType && matchesDifficulty
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !choreographer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Choreographer Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The choreographer you\'re looking for doesn\'t exist.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{choreographer.name}</h1>
              <p className="text-gray-600">Choreographer</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Choreographer Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">
                {choreographer.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{choreographer.name}</h2>
              {choreographer.bio && (
                <p className="text-gray-600 mb-4">{choreographer.bio}</p>
              )}
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {choreographer.region && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{choreographer.region}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Music className="w-4 h-4" />
                  <span>{choreographer.stats.totalDances} dances</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Active since {new Date(choreographer.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Play All</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add All to Queue</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dance Type</label>
              <select
                value={selectedDanceType}
                onChange={(e) => setSelectedDanceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
              >
                <option value="" className="text-gray-900 bg-white">All Dance Types</option>
                {choreographer.stats.danceTypes.map(type => (
                  <option key={type} value={type} className="text-gray-900 bg-white">{type}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
              >
                <option value="" className="text-gray-900 bg-white">All Levels</option>
                {choreographer.stats.difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="text-gray-900 bg-white">{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dances Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Dances ({filteredDances.length})
            </h3>
            <div className="text-sm text-gray-500">
              Showing {filteredDances.length} of {choreographer.stats.totalDances} dances
            </div>
          </div>

          {filteredDances.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No dances found</h4>
              <p className="text-gray-500">Try adjusting your filters to see more dances.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDances.map((dance) => (
                <div
                  key={dance.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{dance.title}</h4>
                      <p className="text-sm text-gray-600">{dance.artist.name}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handlePlayDance(dance)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Play className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleAddToQueue(dance)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dance.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                        dance.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {dance.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {dance.danceType}
                      </span>
                    </div>
                    {dance.region && (
                      <span className="text-gray-500 text-xs">{dance.region}</span>
                    )}
                  </div>
                  
                  {dance.culturalNotes && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{dance.culturalNotes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
