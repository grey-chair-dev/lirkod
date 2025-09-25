'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import type { Song } from '@/hooks/useApiData'

interface MusicPlayerProps {
  currentSong: Song | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  onPlaybackRateChange: (rate: number) => void
}

export default function MusicPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  currentTime,
  duration,
  volume,
  playbackRate,
  onPlaybackRateChange
}: MusicPlayerProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showSpeedControls, setShowSpeedControls] = useState(false)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleVolumeToggle = () => {
    if (isMuted) {
      onVolumeChange(0.7)
      setIsMuted(false)
    } else {
      onVolumeChange(0)
      setIsMuted(true)
    }
  }

  const handleSpeedChange = (rate: number) => {
    onPlaybackRateChange(rate)
    setShowSpeedControls(false)
  }

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p className="text-sm sm:text-base">Select a song to start playing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto p-3 sm:p-4">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          {/* Song Info - Mobile */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {currentSong.title.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-sm">{currentSong.title}</h3>
              <p className="text-xs text-gray-600 truncate">
                {currentSong.choreographer || currentSong.artist || 'Unknown'}
              </p>
              <p className="text-xs text-primary-600 font-medium">{currentSong.danceType}</p>
            </div>
          </div>

          {/* Progress Bar - Mobile */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs text-gray-500 w-8">{formatTime(currentTime)}</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span className="text-xs text-gray-500 w-8">{formatTime(duration)}</span>
          </div>

          {/* Controls - Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={onPrevious}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipBack className="w-4 h-4 text-gray-700" />
              </button>
              
              <button
                onClick={onPlayPause}
                className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              
              <button
                onClick={onNext}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipForward className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-1">
              {/* Speed Control - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedControls(!showSpeedControls)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Playback Speed"
                >
                  <RotateCcw className="w-4 h-4 text-gray-700" />
                </button>
                {showSpeedControls && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
                    <div className="flex space-x-1">
                      {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedChange(rate)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            playbackRate === rate
                              ? 'bg-primary-500 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Volume Control - Mobile */}
              <div className="relative">
                <button
                  onClick={handleVolumeToggle}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-gray-700" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center space-x-4">
          {/* Song Info */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {currentSong.title.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{currentSong.title}</h3>
              <p className="text-sm text-gray-600 truncate">
                {currentSong.choreographer || currentSong.artist || 'Unknown'}
              </p>
              <p className="text-xs text-primary-600 font-medium">{currentSong.danceType}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevious}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={onPlayPause}
                className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>
              
              <button
                onClick={onNext}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-64">
              <span className="text-xs text-gray-500 w-10">{formatTime(currentTime)}</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            {/* Speed Control */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedControls(!showSpeedControls)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Playback Speed"
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </button>
              {showSpeedControls && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="flex flex-col space-y-1">
                    {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedChange(rate)}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          playbackRate === rate
                            ? 'bg-primary-500 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className="relative">
              <button
                onClick={handleVolumeToggle}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-gray-700" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-700" />
                )}
              </button>
              {showVolumeSlider && (
                <div
                  className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVolume = Number(e.target.value)
                      onVolumeChange(newVolume)
                      setIsMuted(newVolume === 0)
                    }}
                    className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider vertical"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f2740b;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f2740b;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
