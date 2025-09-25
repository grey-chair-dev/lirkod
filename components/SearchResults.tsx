'use client'

import { useState } from 'react'
import { Music, Users, Clock, MapPin, Star } from 'lucide-react'
import type { Song, Playlist } from '@/hooks/useApiData'

interface SearchResultsProps {
  query: string
  songs: Song[]
  playlists: Playlist[]
  onPlaySong: (song: Song) => void
  onAddToQueue: (song: Song) => void
  onSelectPlaylist: (playlist: Playlist) => void
}

export default function SearchResults({ 
  query, 
  songs, 
  playlists, 
  onPlaySong, 
  onAddToQueue, 
  onSelectPlaylist 
}: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<'songs' | 'playlists'>('songs')

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const getSearchStats = () => {
    const totalResults = songs.length + playlists.length
    const songCount = songs.length
    const playlistCount = playlists.length
    
    return { totalResults, songCount, playlistCount }
  }

  const stats = getSearchStats()

  if (!query.trim()) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results for "{query}"
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {stats.totalResults} result{stats.totalResults !== 1 ? 's' : ''} found
              {stats.songCount > 0 && ` • ${stats.songCount} song${stats.songCount !== 1 ? 's' : ''}`}
              {stats.playlistCount > 0 && ` • ${stats.playlistCount} playlist${stats.playlistCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Results Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'songs'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Music className="w-4 h-4 inline mr-2" />
            Songs ({stats.songCount})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'playlists'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Playlists ({stats.playlistCount})
          </button>
        </div>
      </div>

      {/* Songs Results */}
      {activeTab === 'songs' && (
        <div className="space-y-4">
          {songs.length > 0 ? (
            songs.map(song => (
              <div
                key={song.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {highlightText(song.title, query)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {highlightText(song.choreographer || song.artist || 'Unknown', query)}
                    </p>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {highlightText(song.danceType, query)}
                      </span>
                      
                      {song.region && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {highlightText(song.region, query)}
                        </span>
                      )}
                      
                      {song.tempo && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {song.tempo} BPM
                        </span>
                      )}
                      
                      {song.difficulty && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          song.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          song.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          <Star className="w-3 h-3 mr-1" />
                          {song.difficulty}
                        </span>
                      )}
                    </div>

                    {song.culturalNotes && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {highlightText(song.culturalNotes, query)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onPlaySong(song)}
                      className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                      title="Play song"
                    >
                      <Music className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => onAddToQueue(song)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-secondary-100 hover:text-secondary-600 transition-colors"
                      title="Add to queue"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Music className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-2">No songs found</h3>
              <p className="text-sm text-gray-600">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* Playlists Results */}
      {activeTab === 'playlists' && (
        <div className="space-y-4">
          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectPlaylist(playlist)}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg mb-3 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {highlightText(playlist.name, query)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {highlightText(playlist.description, query)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-600 font-medium">
                      {playlist.dances.length} dances
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                      {highlightText(playlist.category, query)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-2">No playlists found</h3>
              <p className="text-sm text-gray-600">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
