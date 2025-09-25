// AMPS Client - Real AMPS System Integration
// This service handles communication with the actual AMPS system

export interface AmpsConfig {
  baseUrl: string
  apiKey: string
  timeout?: number
}

export interface AmpsSession {
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
  queue: AmpsQueueItem[]
  settings: {
    volume: number
    shuffle: boolean
    repeat: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface AmpsQueueItem {
  id: string
  contentId: string
  title: string
  artist: string
  duration: number
  addedBy: string
  addedAt: string
  priority: number
}

export interface AmpsSystemStatus {
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

export interface AmpsContent {
  id: string
  title: string
  artist: string
  duration: number
  audioUrl: string
  metadata: {
    genre?: string
    year?: number
    bpm?: number
    key?: string
  }
}

export class AmpsClient {
  private config: AmpsConfig
  private isConnected: boolean = false
  private heartbeatInterval?: NodeJS.Timeout
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5

  constructor(config: AmpsConfig) {
    this.config = {
      timeout: 10000,
      ...config
    }
  }

  /**
   * Connect to AMPS system
   */
  async connect(): Promise<boolean> {
    try {
      console.log('Connecting to AMPS system...')
      
      const response = await this.makeRequest('/api/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientType: 'companion',
          version: '1.0.0',
          capabilities: ['session_control', 'queue_management', 'content_access']
        })
      })

      if (response.success) {
        this.isConnected = true
        this.startHeartbeat()
        console.log('Successfully connected to AMPS system')
        return true
      } else {
        throw new Error(response.error || 'Connection failed')
      }
    } catch (error) {
      console.error('Failed to connect to AMPS:', error)
      this.isConnected = false
      return false
    }
  }

  /**
   * Disconnect from AMPS system
   */
  async disconnect(): Promise<void> {
    try {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval)
        this.heartbeatInterval = undefined
      }

      await this.makeRequest('/api/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      this.isConnected = false
      console.log('Disconnected from AMPS system')
    } catch (error) {
      console.error('Error disconnecting from AMPS:', error)
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<AmpsSystemStatus> {
    try {
      const response = await this.makeRequest('/api/status')
      return response.data
    } catch (error) {
      console.error('Failed to get AMPS status:', error)
      throw error
    }
  }

  /**
   * Create a new AMPS session
   */
  async createSession(name: string, settings?: Partial<AmpsSession['settings']>): Promise<AmpsSession> {
    try {
      const response = await this.makeRequest('/api/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          settings: {
            volume: 80,
            shuffle: false,
            repeat: false,
            ...settings
          }
        })
      })

      return response.data
    } catch (error) {
      console.error('Failed to create AMPS session:', error)
      throw error
    }
  }

  /**
   * Join an existing AMPS session
   */
  async joinSession(sessionId: string): Promise<AmpsSession> {
    try {
      const response = await this.makeRequest(`/api/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Failed to join AMPS session:', error)
      throw error
    }
  }

  /**
   * Leave current AMPS session
   */
  async leaveSession(): Promise<void> {
    try {
      await this.makeRequest('/api/sessions/leave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
    } catch (error) {
      console.error('Failed to leave AMPS session:', error)
      throw error
    }
  }

  /**
   * Get current session details
   */
  async getCurrentSession(): Promise<AmpsSession | null> {
    try {
      const response = await this.makeRequest('/api/sessions/current')
      return response.data
    } catch (error) {
      console.error('Failed to get current session:', error)
      return null
    }
  }

  /**
   * Control session playback
   */
  async controlPlayback(action: 'play' | 'pause' | 'stop' | 'next' | 'previous'): Promise<void> {
    try {
      await this.makeRequest('/api/sessions/control', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })
    } catch (error) {
      console.error(`Failed to ${action} playback:`, error)
      throw error
    }
  }

  /**
   * Seek to specific position in current track
   */
  async seekTo(position: number): Promise<void> {
    try {
      await this.makeRequest('/api/sessions/seek', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ position })
      })
    } catch (error) {
      console.error('Failed to seek:', error)
      throw error
    }
  }

  /**
   * Set session volume
   */
  async setVolume(volume: number): Promise<void> {
    try {
      await this.makeRequest('/api/sessions/volume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ volume: Math.max(0, Math.min(100, volume)) })
      })
    } catch (error) {
      console.error('Failed to set volume:', error)
      throw error
    }
  }

  /**
   * Add content to session queue
   */
  async addToQueue(contentId: string, priority: number = 0): Promise<AmpsQueueItem> {
    try {
      const response = await this.makeRequest('/api/sessions/queue', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contentId, priority })
      })

      return response.data
    } catch (error) {
      console.error('Failed to add to queue:', error)
      throw error
    }
  }

  /**
   * Remove item from session queue
   */
  async removeFromQueue(queueItemId: string): Promise<void> {
    try {
      await this.makeRequest(`/api/sessions/queue/${queueItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
    } catch (error) {
      console.error('Failed to remove from queue:', error)
      throw error
    }
  }

  /**
   * Reorder queue items
   */
  async reorderQueue(queueItemIds: string[]): Promise<void> {
    try {
      await this.makeRequest('/api/sessions/queue/reorder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queueItemIds })
      })
    } catch (error) {
      console.error('Failed to reorder queue:', error)
      throw error
    }
  }

  /**
   * Search content in AMPS library
   */
  async searchContent(query: string, limit: number = 50): Promise<AmpsContent[]> {
    try {
      const response = await this.makeRequest(`/api/content/search?q=${encodeURIComponent(query)}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to search content:', error)
      throw error
    }
  }

  /**
   * Get content details by ID
   */
  async getContent(contentId: string): Promise<AmpsContent> {
    try {
      const response = await this.makeRequest(`/api/content/${contentId}`)
      return response.data
    } catch (error) {
      console.error('Failed to get content:', error)
      throw error
    }
  }

  /**
   * Start heartbeat to maintain connection
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.makeRequest('/api/heartbeat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        })
      } catch (error) {
        console.error('Heartbeat failed:', error)
        this.handleConnectionError()
      }
    }, 30000) // Heartbeat every 30 seconds
  }

  /**
   * Handle connection errors and attempt reconnection
   */
  private async handleConnectionError(): Promise<void> {
    this.isConnected = false
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect to AMPS (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      
      setTimeout(async () => {
        const success = await this.connect()
        if (success) {
          this.reconnectAttempts = 0
        }
      }, 5000 * this.reconnectAttempts) // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached. AMPS connection lost.')
    }
  }

  /**
   * Make HTTP request to AMPS API
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    // Use mock server in development
    if (process.env.NODE_ENV === 'development' && this.config.baseUrl.includes('localhost')) {
      const { mockAmpsServer } = await import('./mock-amps-server')
      return await mockAmpsServer.handleRequest(endpoint, options.method || 'GET', options.body ? JSON.parse(options.body as string) : undefined)
    }

    const url = `${this.config.baseUrl}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'AMPS-Companion/1.0.0',
          ...options.headers
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`AMPS API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('AMPS API request timeout')
      }
      
      throw error
    }
  }

  /**
   * Check if connected to AMPS
   */
  get connected(): boolean {
    return this.isConnected
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean
    reconnectAttempts: number
    maxReconnectAttempts: number
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    }
  }
}

// Export singleton instance
export const ampsClient = new AmpsClient({
  baseUrl: process.env.NEXT_PUBLIC_AMPS_API_URL || 'http://localhost:8080',
  apiKey: process.env.NEXT_PUBLIC_AMPS_API_KEY || 'demo-key'
})
