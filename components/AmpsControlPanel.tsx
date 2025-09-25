'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Settings, Users, Clock, Music, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useAmps } from '@/hooks/useAmps'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLanguageText, UI_TEXT } from '@/utils/languageUtils'

interface AmpsControlPanelProps {
  className?: string
}

export default function AmpsControlPanel({ className = '' }: AmpsControlPanelProps) {
  const { language } = useLanguage()
  const {
    connected,
    connecting,
    error,
    systemStatus,
    currentSession,
    controlPlayback,
    seekTo,
    setVolume,
    refreshSystemStatus,
    refreshCurrentSession
  } = useAmps()

  const [volume, setVolumeLocal] = useState(80)
  const [isDragging, setIsDragging] = useState(false)

  // Update local volume when session changes
  useEffect(() => {
    if (currentSession?.settings.volume !== undefined) {
      setVolumeLocal(currentSession.settings.volume)
    }
  }, [currentSession])

  const handleVolumeChange = async (newVolume: number) => {
    setVolumeLocal(newVolume)
    if (!isDragging) {
      await setVolume(newVolume)
    }
  }

  const handleVolumeCommit = async () => {
    setIsDragging(false)
    await setVolume(volume)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600'
      case 'disconnected': return 'text-red-600'
      case 'error': return 'text-red-600'
      default: return 'text-yellow-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <AlertCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Loader className="w-4 h-4 animate-spin" />
    }
  }

  if (!connected && !connecting) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <AlertCircle className="w-5 h-5" />
          <span>{getLanguageText(UI_TEXT.disconnected, language)}</span>
        </div>
      </div>
    )
  }

  if (connecting) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>{getLanguageText(UI_TEXT.connect, language)}...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 ${getStatusColor(connected ? 'connected' : 'disconnected')}`}>
            {getStatusIcon(connected ? 'connected' : 'disconnected')}
            <span className="font-medium">AMPS</span>
          </div>
          {systemStatus && (
            <div className="text-sm text-gray-500">
              v{systemStatus.version}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshSystemStatus}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh Status"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* System Status */}
      {systemStatus && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Audio:</span>
              <span className={`font-medium ${getStatusColor(systemStatus.hardware.audio)}`}>
                {systemStatus.hardware.audio}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300" />
              <span className="text-gray-600">Network:</span>
              <span className={`font-medium ${getStatusColor(systemStatus.hardware.network)}`}>
                {systemStatus.hardware.network}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300" />
              <span className="text-gray-600">Storage:</span>
              <span className={`font-medium ${getStatusColor(systemStatus.hardware.storage)}`}>
                {systemStatus.hardware.storage}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Sessions:</span>
              <span className="font-medium text-gray-900">
                {systemStatus.sessions.active}/{systemStatus.sessions.total}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Current Session */}
      {currentSession ? (
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-1">{currentSession.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{currentSession.participants} participants</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentSession.status}</span>
              </div>
            </div>
          </div>

          {/* Current Track */}
          {currentSession.currentTrack && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {currentSession.currentTrack.title}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {currentSession.currentTrack.artist}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(currentSession.currentTrack.position)} / {formatTime(currentSession.currentTrack.duration)}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(currentSession.currentTrack.position / currentSession.currentTrack.duration) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => controlPlayback('previous')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => controlPlayback(currentSession.currentTrack ? 'pause' : 'play')}
                className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                title={currentSession.currentTrack ? 'Pause' : 'Play'}
              >
                {currentSession.currentTrack ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => controlPlayback('next')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={handleVolumeCommit}
                onTouchEnd={handleVolumeCommit}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500 w-8">{volume}%</span>
            </div>
          </div>

          {/* Queue Info */}
          {currentSession.queue && currentSession.queue.length > 0 && (
            <div className="text-sm text-gray-500">
              {currentSession.queue.length} items in queue
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <Music className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No active session</p>
        </div>
      )}
    </div>
  )
}
