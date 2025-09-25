// Mock AMPS Server for Development and Testing
// This simulates a real AMPS system for development purposes

export interface MockAmpsSession {
  id: string
  name: string
  status: 'active' | 'inactive' | 'paused' | 'error'
  currentTrack?: {
    id: string
    title: string
    artist: string
    duration: number
    position: number
  }
  participants: number
  queue: Array<{
    id: string
    contentId: string
    title: string
    artist: string
    duration: number
    addedBy: string
    addedAt: string
    priority: number
  }>
  settings: {
    volume: number
    shuffle: boolean
    repeat: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface MockAmpsSystemStatus {
  connected: boolean
  version: string
  hardware: {
    audio: 'connected' | 'disconnected' | 'error'
    network: 'connected' | 'disconnected' | 'error'
    storage: 'available' | 'low' | 'error'
  }
  sessions: {
    active: number
    total: number
  }
  lastHeartbeat: string
}

export class MockAmpsServer {
  private sessions: Map<string, MockAmpsSession> = new Map()
  private currentSessionId: string | null = null
  private systemStatus: MockAmpsSystemStatus
  private isConnected: boolean = false
  private heartbeatInterval?: NodeJS.Timeout

  constructor() {
    this.systemStatus = {
      connected: false,
      version: '1.0.0-mock',
      hardware: {
        audio: 'connected',
        network: 'connected',
        storage: 'available'
      },
      sessions: {
        active: 0,
        total: 0
      },
      lastHeartbeat: new Date().toISOString()
    }
  }

  // Simulate API endpoints
  async handleRequest(endpoint: string, method: string, body?: any): Promise<any> {
    console.log(`Mock AMPS API: ${method} ${endpoint}`)

    switch (endpoint) {
      case '/api/connect':
        return this.handleConnect(body)
      
      case '/api/disconnect':
        return this.handleDisconnect()
      
      case '/api/status':
        return this.handleGetStatus()
      
      case '/api/heartbeat':
        return this.handleHeartbeat()
      
      case '/api/sessions':
        if (method === 'POST') {
          return this.handleCreateSession(body)
        }
        return this.handleGetSessions()
      
      case '/api/sessions/current':
        return this.handleGetCurrentSession()
      
      case '/api/sessions/leave':
        return this.handleLeaveSession()
      
      case '/api/sessions/control':
        return this.handleControlPlayback(body)
      
      case '/api/sessions/seek':
        return this.handleSeek(body)
      
      case '/api/sessions/volume':
        return this.handleSetVolume(body)
      
      case '/api/sessions/queue':
        if (method === 'POST') {
          return this.handleAddToQueue(body)
        }
        return this.handleGetQueue()
      
      case '/api/content/search':
        return this.handleSearchContent(endpoint)
      
      default:
        if (endpoint.startsWith('/api/sessions/') && endpoint.includes('/join')) {
          const sessionId = endpoint.split('/')[3]
          return this.handleJoinSession(sessionId)
        }
        if (endpoint.startsWith('/api/sessions/queue/') && method === 'DELETE') {
          const queueItemId = endpoint.split('/')[4]
          return this.handleRemoveFromQueue(queueItemId)
        }
        if (endpoint.startsWith('/api/content/')) {
          const contentId = endpoint.split('/')[3]
          return this.handleGetContent(contentId)
        }
        throw new Error(`Unknown endpoint: ${endpoint}`)
    }
  }

  private async handleConnect(body: any): Promise<any> {
    this.isConnected = true
    this.systemStatus.connected = true
    this.startHeartbeat()
    
    return {
      success: true,
      data: {
        clientId: 'mock-client-' + Date.now(),
        capabilities: body.capabilities || []
      }
    }
  }

  private async handleDisconnect(): Promise<any> {
    this.isConnected = false
    this.systemStatus.connected = false
    this.currentSessionId = null
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    }
    
    return { success: true }
  }

  private async handleGetStatus(): Promise<any> {
    this.systemStatus.lastHeartbeat = new Date().toISOString()
    this.systemStatus.sessions.active = this.sessions.size
    this.systemStatus.sessions.total = this.sessions.size
    
    return { data: this.systemStatus }
  }

  private async handleHeartbeat(): Promise<any> {
    this.systemStatus.lastHeartbeat = new Date().toISOString()
    return { success: true }
  }

  private async handleCreateSession(body: any): Promise<any> {
    const sessionId = 'session-' + Date.now()
    const session: MockAmpsSession = {
      id: sessionId,
      name: body.name || 'New Session',
      status: 'active',
      participants: 1,
      queue: [],
      settings: {
        volume: 80,
        shuffle: false,
        repeat: false,
        ...body.settings
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.sessions.set(sessionId, session)
    this.currentSessionId = sessionId
    
    return { data: session }
  }

  private async handleJoinSession(sessionId: string): Promise<any> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    session.participants++
    session.updatedAt = new Date().toISOString()
    this.currentSessionId = sessionId
    
    return { data: session }
  }

  private async handleGetCurrentSession(): Promise<any> {
    if (!this.currentSessionId) {
      return { data: null }
    }
    
    const session = this.sessions.get(this.currentSessionId)
    return { data: session || null }
  }

  private async handleLeaveSession(): Promise<any> {
    if (this.currentSessionId) {
      const session = this.sessions.get(this.currentSessionId)
      if (session) {
        session.participants = Math.max(0, session.participants - 1)
        session.updatedAt = new Date().toISOString()
      }
      this.currentSessionId = null
    }
    
    return { success: true }
  }

  private async handleControlPlayback(body: any): Promise<any> {
    if (!this.currentSessionId) {
      throw new Error('No active session')
    }
    
    const session = this.sessions.get(this.currentSessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    switch (body.action) {
      case 'play':
        session.status = 'active'
        if (!session.currentTrack && session.queue.length > 0) {
          const nextTrack = session.queue[0]
          session.currentTrack = {
            id: nextTrack.id,
            title: nextTrack.title,
            artist: nextTrack.artist,
            duration: nextTrack.duration,
            position: 0
          }
        }
        break
      case 'pause':
        session.status = 'paused'
        break
      case 'stop':
        session.status = 'inactive'
        session.currentTrack = undefined
        break
      case 'next':
        if (session.queue.length > 0) {
          const nextTrack = session.queue[0]
          session.currentTrack = {
            id: nextTrack.id,
            title: nextTrack.title,
            artist: nextTrack.artist,
            duration: nextTrack.duration,
            position: 0
          }
          session.queue.shift()
        }
        break
      case 'previous':
        // Simple implementation - just restart current track
        if (session.currentTrack) {
          session.currentTrack.position = 0
        }
        break
    }
    
    session.updatedAt = new Date().toISOString()
    return { success: true }
  }

  private async handleSeek(body: any): Promise<any> {
    if (!this.currentSessionId) {
      throw new Error('No active session')
    }
    
    const session = this.sessions.get(this.currentSessionId)
    if (!session || !session.currentTrack) {
      throw new Error('No active track')
    }
    
    session.currentTrack.position = Math.max(0, Math.min(body.position, session.currentTrack.duration))
    session.updatedAt = new Date().toISOString()
    
    return { success: true }
  }

  private async handleSetVolume(body: any): Promise<any> {
    if (!this.currentSessionId) {
      throw new Error('No active session')
    }
    
    const session = this.sessions.get(this.currentSessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    session.settings.volume = Math.max(0, Math.min(100, body.volume))
    session.updatedAt = new Date().toISOString()
    
    return { success: true }
  }

  private async handleAddToQueue(body: any): Promise<any> {
    if (!this.currentSessionId) {
      throw new Error('No active session')
    }
    
    const session = this.sessions.get(this.currentSessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    const queueItem = {
      id: 'queue-' + Date.now(),
      contentId: body.contentId,
      title: `Track ${body.contentId}`,
      artist: 'Mock Artist',
      duration: 180, // 3 minutes
      addedBy: 'mock-user',
      addedAt: new Date().toISOString(),
      priority: body.priority || 0
    }
    
    session.queue.push(queueItem)
    session.updatedAt = new Date().toISOString()
    
    return { data: queueItem }
  }

  private async handleGetQueue(): Promise<any> {
    if (!this.currentSessionId) {
      return { data: [] }
    }
    
    const session = this.sessions.get(this.currentSessionId)
    return { data: session?.queue || [] }
  }

  private async handleRemoveFromQueue(queueItemId: string): Promise<any> {
    if (!this.currentSessionId) {
      throw new Error('No active session')
    }
    
    const session = this.sessions.get(this.currentSessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    session.queue = session.queue.filter(item => item.id !== queueItemId)
    session.updatedAt = new Date().toISOString()
    
    return { success: true }
  }

  private async handleSearchContent(endpoint: string): Promise<any> {
    const url = new URL('http://localhost' + endpoint)
    const query = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '50')
    
    // Mock search results
    const results = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      id: `content-${i + 1}`,
      title: `Mock Track ${i + 1}`,
      artist: `Mock Artist ${i + 1}`,
      duration: 120 + (i * 30),
      audioUrl: `/mock-audio/track-${i + 1}.mp3`,
      metadata: {
        genre: ['Pop', 'Rock', 'Electronic'][i % 3],
        year: 2020 + (i % 4),
        bpm: 120 + (i * 10),
        key: ['C', 'D', 'E', 'F', 'G'][i % 5]
      }
    }))
    
    return { data: results }
  }

  private async handleGetContent(contentId: string): Promise<any> {
    return {
      data: {
        id: contentId,
        title: `Mock Track ${contentId}`,
        artist: 'Mock Artist',
        duration: 180,
        audioUrl: `/mock-audio/${contentId}.mp3`,
        metadata: {
          genre: 'Pop',
          year: 2023,
          bpm: 120,
          key: 'C'
        }
      }
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.systemStatus.lastHeartbeat = new Date().toISOString()
    }, 30000)
  }

  // Simulate track progression
  startTrackProgression(): void {
    setInterval(() => {
      if (this.currentSessionId) {
        const session = this.sessions.get(this.currentSessionId)
        if (session?.currentTrack && session.status === 'active') {
          session.currentTrack.position += 1
          if (session.currentTrack.position >= session.currentTrack.duration) {
            // Track finished, play next
            if (session.queue.length > 0) {
              const nextTrack = session.queue.shift()!
              session.currentTrack = {
                id: nextTrack.id,
                title: nextTrack.title,
                artist: nextTrack.artist,
                duration: nextTrack.duration,
                position: 0
              }
            } else {
              session.currentTrack = undefined
              session.status = 'inactive'
            }
          }
          session.updatedAt = new Date().toISOString()
        }
      }
    }, 1000) // Update every second
  }
}

// Export singleton instance
export const mockAmpsServer = new MockAmpsServer()

// Start track progression simulation
mockAmpsServer.startTrackProgression()
