'use client'

import { useState } from 'react'
import { Music, Trash2, ArrowUp, ArrowDown, Users } from 'lucide-react'
import type { Song } from '@/hooks/useApiData'

interface QueueSong extends Song {
  addedBy?: string
}

interface QueueManagerProps {
  queue: Song[]
  currentSongId: string | null
  onRemoveFromQueue: (songId: string) => void
  onMoveUp: (songId: string) => void
  onMoveDown: (songId: string) => void
  onPlaySong: (song: Song) => void
  userRole?: 'markid' | 'participant'
}

export default function QueueManager({
  queue,
  currentSongId,
  onRemoveFromQueue,
  onMoveUp,
  onMoveDown,
  onPlaySong,
  userRole = 'participant'
}: QueueManagerProps) {
  const [showContributors, setShowContributors] = useState(false)

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    return queue.reduce((total, song) => total + (song.duration || 0), 0)
  }

  const getContributors = () => {
    const contributors = new Set(queue.map(song => song.addedBy).filter(Boolean))
    return Array.from(contributors)
  }

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Music className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="font-medium text-gray-900 mb-2">Queue is Empty</h3>
          <p className="text-sm">Add songs to the queue to start a collaborative playlist</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {userRole === 'markid' ? 'Session Queue' : 'My Playlist'}
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {queue.length} {queue.length === 1 ? 'song' : 'songs'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowContributors(!showContributors)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Users className="w-4 h-4 mr-1" />
            Contributors
          </button>
        </div>
      </div>

      {/* Contributors */}
      {showContributors && getContributors().length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Session Contributors</h4>
          <div className="flex flex-wrap gap-2">
            {getContributors().map((contributor, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
              >
                {contributor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Queue Stats */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total duration: <span className="font-medium">{formatDuration(getTotalDuration())}</span>
          </span>
          <span className="text-gray-600">
            {queue.length} song{queue.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {queue.map((song, index) => (
          <div
            key={`${song.id}-${index}`}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
              currentSongId === song.id
                ? 'bg-primary-50 border-primary-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {/* Position */}
            <div className="flex-shrink-0 w-8 text-center">
              <span className={`text-sm font-medium ${
                currentSongId === song.id ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {index + 1}
              </span>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className={`font-medium truncate ${
                  currentSongId === song.id ? 'text-primary-900' : 'text-gray-900'
                }`}>
                  {song.title}
                </h4>
                {currentSongId === song.id && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Now Playing
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">{song.choreographer || song.artist || 'Unknown'}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {song.danceType}
                </span>
                <span className="text-xs text-gray-500">{formatDuration(song.duration)}</span>
                {song.addedBy && (
                  <span className="text-xs text-gray-500">by {song.addedBy}</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onMoveUp(song.id)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onMoveDown(song.id)}
                disabled={index === queue.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onPlaySong(song)}
                className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                title="Play now"
              >
                <Music className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onRemoveFromQueue(song.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove from queue"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
