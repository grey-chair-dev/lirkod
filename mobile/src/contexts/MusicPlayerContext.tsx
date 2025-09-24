import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Audio } from 'expo-av';

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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SEEK_TO'; payload: number };

interface PlayerContextType extends PlayerState {
  playSong: (song: Song) => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
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
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSong = async (song: Song) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Unload previous sound
      if (sound) {
        await sound.unloadAsync();
      }

      dispatch({ type: 'SET_CURRENT_SONG', payload: song });

      // Create new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.audioUrl },
        { shouldPlay: true, volume: state.isMuted ? 0 : state.volume },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      dispatch({ type: 'PLAY' });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load audio' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      dispatch({ type: 'SET_CURRENT_TIME', payload: status.positionMillis / 1000 });
      dispatch({ type: 'SET_DURATION', payload: status.durationMillis / 1000 });
      
      if (status.didJustFinish) {
        dispatch({ type: 'PAUSE' });
      }
    }
  };

  const seekTo = async (time: number) => {
    if (sound) {
      await sound.setPositionAsync(time * 1000);
      dispatch({ type: 'SEEK_TO', payload: time });
    }
  };

  const setVolume = async (volume: number) => {
    if (sound) {
      await sound.setVolumeAsync(volume);
      dispatch({ type: 'SET_VOLUME', payload: volume });
    }
  };

  const toggleMute = async () => {
    if (sound) {
      const newVolume = state.isMuted ? state.volume : 0;
      await sound.setVolumeAsync(newVolume);
      dispatch({ type: 'TOGGLE_MUTE' });
    }
  };

  const value: PlayerContextType = {
    ...state,
    playSong,
    seekTo,
    setVolume,
    toggleMute,
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
