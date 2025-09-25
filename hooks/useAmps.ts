// AMPS Hook - React integration for AMPS system
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ampsClient, type AmpsSession, type AmpsSystemStatus, type AmpsContent, type AmpsQueueItem } from '@/lib/amps-client'

export interface AmpsState {
  connected: boolean
  connecting: boolean
  error: string | null
  systemStatus: AmpsSystemStatus | null
  currentSession: AmpsSession | null
  content: AmpsContent[]
  searchResults: AmpsContent[]
  searching: boolean
}

export interface AmpsActions {
  connect: () => Promise<boolean>
  disconnect: () => Promise<void>
  createSession: (name: string, settings?: Partial<AmpsSession['settings']>) => Promise<AmpsSession | null>
  joinSession: (sessionId: string) => Promise<AmpsSession | null>
  leaveSession: () => Promise<void>
  controlPlayback: (action: 'play' | 'pause' | 'stop' | 'next' | 'previous') => Promise<void>
  seekTo: (position: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  addToQueue: (contentId: string, priority?: number) => Promise<AmpsQueueItem | null>
  removeFromQueue: (queueItemId: string) => Promise<void>
  reorderQueue: (queueItemIds: string[]) => Promise<void>
  searchContent: (query: string) => Promise<void>
  getContent: (contentId: string) => Promise<AmpsContent | null>
  refreshSystemStatus: () => Promise<void>
  refreshCurrentSession: () => Promise<void>
}

export function useAmps(): AmpsState & AmpsActions {
  const [state, setState] = useState<AmpsState>({
    connected: false,
    connecting: false,
    error: null,
    systemStatus: null,
    currentSession: null,
    content: [],
    searchResults: [],
    searching: false
  })

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to AMPS
  const connect = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, connecting: true, error: null }))
    
    try {
      const success = await ampsClient.connect()
      
      if (success) {
        setState(prev => ({ 
          ...prev, 
          connected: true, 
          connecting: false,
          error: null 
        }))
        
        // Start periodic refresh
        startPeriodicRefresh()
        
        // Get initial system status
        await refreshSystemStatus()
        
        return true
      } else {
        setState(prev => ({ 
          ...prev, 
          connected: false, 
          connecting: false,
          error: 'Failed to connect to AMPS system' 
        }))
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error'
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        connecting: false,
        error: errorMessage 
      }))
      return false
    }
  }, [])

  // Disconnect from AMPS
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      await ampsClient.disconnect()
      setState(prev => ({ 
        ...prev, 
        connected: false,
        currentSession: null,
        systemStatus: null,
        error: null 
      }))
      
      // Stop periodic refresh
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    } catch (error) {
      console.error('Error disconnecting from AMPS:', error)
    }
  }, [])

  // Create new session
  const createSession = useCallback(async (name: string, settings?: Partial<AmpsSession['settings']>): Promise<AmpsSession | null> => {
    try {
      const session = await ampsClient.createSession(name, settings)
      setState(prev => ({ ...prev, currentSession: session }))
      return session
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session'
      setState(prev => ({ ...prev, error: errorMessage }))
      return null
    }
  }, [])

  // Join existing session
  const joinSession = useCallback(async (sessionId: string): Promise<AmpsSession | null> => {
    try {
      const session = await ampsClient.joinSession(sessionId)
      setState(prev => ({ ...prev, currentSession: session }))
      return session
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join session'
      setState(prev => ({ ...prev, error: errorMessage }))
      return null
    }
  }, [])

  // Leave current session
  const leaveSession = useCallback(async (): Promise<void> => {
    try {
      await ampsClient.leaveSession()
      setState(prev => ({ ...prev, currentSession: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave session'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  // Control playback
  const controlPlayback = useCallback(async (action: 'play' | 'pause' | 'stop' | 'next' | 'previous'): Promise<void> => {
    try {
      await ampsClient.controlPlayback(action)
      // Refresh session to get updated state
      await refreshCurrentSession()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} playback`
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  // Seek to position
  const seekTo = useCallback(async (position: number): Promise<void> => {
    try {
      await ampsClient.seekTo(position)
      await refreshCurrentSession()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to seek'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  // Set volume
  const setVolume = useCallback(async (volume: number): Promise<void> => {
    try {
      await ampsClient.setVolume(volume)
      await refreshCurrentSession()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set volume'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  // Add to queue
  const addToQueue = useCallback(async (contentId: string, priority: number = 0): Promise<AmpsQueueItem | null> => {
    try {
      const queueItem = await ampsClient.addToQueue(contentId, priority)
      await refreshCurrentSession()
      return queueItem
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to queue'
      setState(prev => ({ ...prev, error: errorMessage }))
      return null
    }
  }, [])

  // Remove from queue
  const removeFromQueue = useCallback(async (queueItemId: string): Promise<void> => {
    try {
      await ampsClient.removeFromQueue(queueItemId)
      await refreshCurrentSession()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from queue'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  // Reorder queue
  const reorderQueue = useCallback(async (queueItemIds: string[]): Promise<void> => {
    try {
      await ampsClient.reorderQueue(queueItemIds)
      await refreshCurrentSession()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reorder queue'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  // Search content
  const searchContent = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, searchResults: [], searching: false }))
      return
    }

    setState(prev => ({ ...prev, searching: true }))
    
    try {
      const results = await ampsClient.searchContent(query)
      setState(prev => ({ ...prev, searchResults: results, searching: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed'
      setState(prev => ({ 
        ...prev, 
        searchResults: [], 
        searching: false,
        error: errorMessage 
      }))
    }
  }, [])

  // Get content details
  const getContent = useCallback(async (contentId: string): Promise<AmpsContent | null> => {
    try {
      const content = await ampsClient.getContent(contentId)
      return content
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get content'
      setState(prev => ({ ...prev, error: errorMessage }))
      return null
    }
  }, [])

  // Refresh system status
  const refreshSystemStatus = useCallback(async (): Promise<void> => {
    try {
      const status = await ampsClient.getSystemStatus()
      setState(prev => ({ ...prev, systemStatus: status }))
    } catch (error) {
      console.error('Failed to refresh system status:', error)
    }
  }, [])

  // Refresh current session
  const refreshCurrentSession = useCallback(async (): Promise<void> => {
    try {
      const session = await ampsClient.getCurrentSession()
      setState(prev => ({ ...prev, currentSession: session }))
    } catch (error) {
      console.error('Failed to refresh current session:', error)
    }
  }, [])

  // Start periodic refresh
  const startPeriodicRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    refreshIntervalRef.current = setInterval(async () => {
      if (ampsClient.connected) {
        await Promise.all([
          refreshSystemStatus(),
          refreshCurrentSession()
        ])
      }
    }, 5000) // Refresh every 5 seconds
  }, [refreshSystemStatus, refreshCurrentSession])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  // Auto-connect on mount if configured
  useEffect(() => {
    const shouldAutoConnect = process.env.NEXT_PUBLIC_AMPS_AUTO_CONNECT === 'true'
    if (shouldAutoConnect && !state.connected && !state.connecting) {
      connect()
    }
  }, [connect, state.connected, state.connecting])

  return {
    ...state,
    connect,
    disconnect,
    createSession,
    joinSession,
    leaveSession,
    controlPlayback,
    seekTo,
    setVolume,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    searchContent,
    getContent,
    refreshSystemStatus,
    refreshCurrentSession
  }
}
