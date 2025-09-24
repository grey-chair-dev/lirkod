'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Howl } from 'howler';

interface Song {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    coverImage?: string;
  };
  duration: number;
  audioUrl: string;
  previewUrl?: string;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  queue: Song[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}

type PlayerAction =
  | { type: 'SET_CURRENT_SONG'; payload: Song }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_QUEUE'; payload: Song[] }
  | { type: 'NEXT_SONG' }
  | { type: 'PREVIOUS_SONG' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SEEK_TO'; payload: number };

interface PlayerContextType extends PlayerState {
  playSong: (song: Song, queue?: Song[], index?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  addToQueue: (songs: Song[]) => void;
  clearQueue: () => void;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  queue: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      return { ...state, currentSong: action.payload, error: null };
    
    case 'PLAY':
      return { ...state, isPlaying: true };
    
    case 'PAUSE':
      return { ...state, isPlaying: false };
    
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    
    case 'SET_QUEUE':
      return { ...state, queue: action.payload, currentIndex: 0 };
    
    case 'NEXT_SONG':
      const nextIndex = state.isShuffled 
        ? Math.floor(Math.random() * state.queue.length)
        : (state.currentIndex + 1) % state.queue.length;
      return { ...state, currentIndex: nextIndex };
    
    case 'PREVIOUS_SONG':
      const prevIndex = state.currentIndex === 0 
        ? state.queue.length - 1 
        : state.currentIndex - 1;
      return { ...state, currentIndex: prevIndex };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SEEK_TO':
      return { ...state, currentTime: action.payload };
    
    default:
      return state;
  }
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const howlRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Howler.js
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update current song when index changes
  useEffect(() => {
    if (state.queue.length > 0 && state.currentIndex < state.queue.length) {
      const song = state.queue[state.currentIndex];
      if (song && song.id !== state.currentSong?.id) {
        playSong(song);
      }
    }
  }, [state.currentIndex, state.queue]);

  // Update Howler.js when state changes
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(state.isMuted ? 0 : state.volume);
    }
  }, [state.volume, state.isMuted]);

  const playSong = (song: Song, queue?: Song[], index?: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    // Unload previous song
    if (howlRef.current) {
      howlRef.current.unload();
    }

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set queue and index if provided
    if (queue) {
      dispatch({ type: 'SET_QUEUE', payload: queue });
      if (index !== undefined) {
        dispatch({ type: 'SET_CURRENT_SONG', payload: song });
      }
    } else {
      dispatch({ type: 'SET_CURRENT_SONG', payload: song });
    }

    // Create new Howl instance
    howlRef.current = new Howl({
      src: [song.audioUrl],
      html5: true,
      volume: state.isMuted ? 0 : state.volume,
      onload: () => {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_DURATION', payload: howlRef.current?.duration() || 0 });
        dispatch({ type: 'PLAY' });
        howlRef.current?.play();
      },
      onplay: () => {
        dispatch({ type: 'PLAY' });
        startTimeTracking();
      },
      onpause: () => {
        dispatch({ type: 'PAUSE' });
        stopTimeTracking();
      },
      onend: () => {
        stopTimeTracking();
        if (state.repeatMode === 'one') {
          howlRef.current?.play();
        } else if (state.repeatMode === 'all' || state.currentIndex < state.queue.length - 1) {
          playNext();
        } else {
          dispatch({ type: 'PAUSE' });
        }
      },
      onloaderror: (id, error) => {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio' });
        dispatch({ type: 'SET_LOADING', payload: false });
      },
    });
  };

  const startTimeTracking = () => {
    intervalRef.current = setInterval(() => {
      if (howlRef.current) {
        const currentTime = howlRef.current.seek() as number;
        dispatch({ type: 'SET_CURRENT_TIME', payload: currentTime });
      }
    }, 1000);
  };

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playNext = () => {
    if (state.queue.length > 0) {
      dispatch({ type: 'NEXT_SONG' });
    }
  };

  const playPrevious = () => {
    if (state.queue.length > 0) {
      dispatch({ type: 'PREVIOUS_SONG' });
    }
  };

  const seekTo = (time: number) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      dispatch({ type: 'SEEK_TO', payload: time });
    }
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const setRepeatMode = (mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT_MODE', payload: mode });
  };

  const addToQueue = (songs: Song[]) => {
    dispatch({ type: 'SET_QUEUE', payload: [...state.queue, ...songs] });
  };

  const clearQueue = () => {
    dispatch({ type: 'SET_QUEUE', payload: [] });
    if (howlRef.current) {
      howlRef.current.pause();
    }
    dispatch({ type: 'PAUSE' });
  };

  const value: PlayerContextType = {
    ...state,
    playSong,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    addToQueue,
    clearQueue,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function useMusicPlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
