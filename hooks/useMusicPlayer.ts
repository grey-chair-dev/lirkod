'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Dance, LegacySong } from '@/hooks/useApiData'

interface UseMusicPlayerReturn {
  currentSong: Dance | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  queue: Dance[]
  play: (song: Dance) => void
  pause: () => void
  resume: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPlaybackRate: (rate: number) => void
  addToQueue: (song: Dance) => void
  removeFromQueue: (songId: string) => void
  clearQueue: () => void
  moveInQueue: (songId: string, direction: 'up' | 'down') => void
}

export function useMusicPlayer(): UseMusicPlayerReturn {
  const [currentSong, setCurrentSong] = useState<Dance | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [queue, setQueue] = useState<Dance[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      
      const audio = audioRef.current

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleEnded = () => {
        next()
      }

      const handleError = (event: Event) => {
        console.error('Audio playback error:', event)
        setIsPlaying(false)
        // Don't show alert here as it might be called multiple times
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
    }
  }, [])

  // Update audio properties when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.playbackRate = playbackRate
    }
  }, [volume, playbackRate])

  const play = useCallback((song: Dance) => {
    if (audioRef.current) {
      setCurrentSong(song)
      
      // Check if audio URL exists and is valid
      const audioUrl = song.song?.audioFull
      if (audioUrl && audioUrl.startsWith('http')) {
        audioRef.current.src = audioUrl
        audioRef.current.load()
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.error('Error playing audio:', error)
            setIsPlaying(false)
            // Show user-friendly message
            alert(`Audio not available for "${song.nameEng}". This is a demo - real audio files would be loaded here.`)
          })
      } else {
        // No valid audio URL - show demo message
        console.log(`No audio available for "${song.nameEng}" - this is a demo`)
        alert(`Audio not available for "${song.nameEng}". This is a demo - real audio files would be loaded here.`)
        setIsPlaying(false)
      }
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [isPlaying])

  const resume = useCallback(() => {
    if (audioRef.current && !isPlaying && currentSong?.song?.audioFull) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error('Error resuming audio:', error)
          setIsPlaying(false)
        })
    }
  }, [isPlaying, currentSong])

  const next = useCallback(() => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(song => song.id === currentSong?.id)
      const nextIndex = currentIndex + 1
      
      if (nextIndex < queue.length) {
        play(queue[nextIndex])
      } else {
        // End of queue
        setIsPlaying(false)
        setCurrentSong(null)
      }
    } else {
      setIsPlaying(false)
      setCurrentSong(null)
    }
  }, [queue, currentSong, play])

  const previous = useCallback(() => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(song => song.id === currentSong?.id)
      const prevIndex = currentIndex - 1
      
      if (prevIndex >= 0) {
        play(queue[prevIndex])
      }
    }
  }, [queue, currentSong, play])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const setVolumeHandler = useCallback((newVolume: number) => {
    setVolume(newVolume)
  }, [])

  const setPlaybackRateHandler = useCallback((rate: number) => {
    setPlaybackRate(rate)
  }, [])

  const addToQueue = useCallback((song: Dance) => {
    setQueue(prev => [...prev, song])
  }, [])

  const removeFromQueue = useCallback((songId: string) => {
    setQueue(prev => prev.filter(song => song.id !== songId))
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  const moveInQueue = useCallback((songId: string, direction: 'up' | 'down') => {
    setQueue(prev => {
      const newQueue = [...prev]
      const currentIndex = newQueue.findIndex(song => song.id === songId)
      
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      if (newIndex >= 0 && newIndex < newQueue.length) {
        [newQueue[currentIndex], newQueue[newIndex]] = [newQueue[newIndex], newQueue[currentIndex]]
      }
      
      return newQueue
    })
  }, [])

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    queue,
    play,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume: setVolumeHandler,
    setPlaybackRate: setPlaybackRateHandler,
    addToQueue,
    removeFromQueue,
    clearQueue,
    moveInQueue
  }
}
