# AMPS Integration Guide

This document explains how the AMPS Companion integrates with the Advanced Music Management System (AMPS).

## Overview

The AMPS integration allows the companion app to:
- Connect to real AMPS hardware systems
- Control live music sessions
- Manage content queues
- Monitor system status
- Control playback and volume

## Architecture

### Components

1. **AMPS Client** (`lib/amps-client.ts`)
   - Core API client for communicating with AMPS systems
   - Handles connection, authentication, and all API calls
   - Supports both real AMPS systems and mock development server

2. **AMPS Hook** (`hooks/useAmps.ts`)
   - React hook for AMPS integration
   - Manages state and provides actions
   - Handles automatic reconnection and error recovery

3. **AMPS Control Panel** (`components/AmpsControlPanel.tsx`)
   - UI component for AMPS control
   - Shows system status, current session, and playback controls
   - Only visible to Programmers when connected

4. **Mock AMPS Server** (`lib/mock-amps-server.ts`)
   - Development server that simulates AMPS functionality
   - Used for testing and development without real hardware

## Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# AMPS Configuration
NEXT_PUBLIC_AMPS_API_URL=http://localhost:8080
NEXT_PUBLIC_AMPS_API_KEY=your-api-key-here
NEXT_PUBLIC_AMPS_AUTO_CONNECT=false
```

### Development vs Production

- **Development**: Uses mock AMPS server automatically
- **Production**: Connects to real AMPS API endpoints

## Usage

### Basic Connection

```typescript
import { useAmps } from '@/hooks/useAmps'

function MyComponent() {
  const { 
    connected, 
    connecting, 
    connect, 
    disconnect,
    error 
  } = useAmps()

  const handleConnect = async () => {
    const success = await connect()
    if (success) {
      console.log('Connected to AMPS')
    }
  }

  return (
    <div>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleConnect}>Connect</button>
    </div>
  )
}
```

### Session Management

```typescript
const { 
  currentSession,
  createSession,
  joinSession,
  leaveSession 
} = useAmps()

// Create a new session
const session = await createSession('My Session', {
  volume: 80,
  shuffle: false,
  repeat: true
})

// Join existing session
await joinSession('session-123')

// Leave current session
await leaveSession()
```

### Playback Control

```typescript
const { 
  controlPlayback,
  seekTo,
  setVolume 
} = useAmps()

// Control playback
await controlPlayback('play')
await controlPlayback('pause')
await controlPlayback('next')
await controlPlayback('previous')

// Seek to position (in seconds)
await seekTo(120)

// Set volume (0-100)
await setVolume(75)
```

### Queue Management

```typescript
const { 
  addToQueue,
  removeFromQueue,
  reorderQueue 
} = useAmps()

// Add content to queue
const queueItem = await addToQueue('content-123', 1) // priority 1

// Remove from queue
await removeFromQueue(queueItem.id)

// Reorder queue
await reorderQueue(['item-1', 'item-2', 'item-3'])
```

### Content Search

```typescript
const { 
  searchContent,
  getContent,
  searchResults 
} = useAmps()

// Search for content
await searchContent('jazz music')

// Get specific content
const content = await getContent('content-123')
```

## API Reference

### AMPS Client Methods

#### Connection
- `connect()`: Connect to AMPS system
- `disconnect()`: Disconnect from AMPS system
- `getSystemStatus()`: Get system status and hardware info

#### Sessions
- `createSession(name, settings?)`: Create new session
- `joinSession(sessionId)`: Join existing session
- `leaveSession()`: Leave current session
- `getCurrentSession()`: Get current session details

#### Playback
- `controlPlayback(action)`: Control playback (play/pause/stop/next/previous)
- `seekTo(position)`: Seek to position in current track
- `setVolume(volume)`: Set session volume (0-100)

#### Queue
- `addToQueue(contentId, priority?)`: Add content to queue
- `removeFromQueue(queueItemId)`: Remove item from queue
- `reorderQueue(queueItemIds)`: Reorder queue items

#### Content
- `searchContent(query, limit?)`: Search content library
- `getContent(contentId)`: Get content details

### AMPS Hook State

```typescript
interface AmpsState {
  connected: boolean
  connecting: boolean
  error: string | null
  systemStatus: AmpsSystemStatus | null
  currentSession: AmpsSession | null
  content: AmpsContent[]
  searchResults: AmpsContent[]
  searching: boolean
}
```

## Real AMPS System Integration

### API Endpoints

The AMPS system should provide these REST API endpoints:

```
POST /api/connect
POST /api/disconnect
GET  /api/status
POST /api/heartbeat
GET  /api/sessions
POST /api/sessions
GET  /api/sessions/current
POST /api/sessions/{id}/join
POST /api/sessions/leave
POST /api/sessions/control
POST /api/sessions/seek
POST /api/sessions/volume
GET  /api/sessions/queue
POST /api/sessions/queue
DELETE /api/sessions/queue/{id}
POST /api/sessions/queue/reorder
GET  /api/content/search
GET  /api/content/{id}
```

### Authentication

AMPS API uses Bearer token authentication:

```http
Authorization: Bearer your-api-key-here
```

### Request/Response Format

All requests and responses use JSON format:

```json
{
  "success": true,
  "data": { ... },
  "error": "Error message if failed"
}
```

## Error Handling

The AMPS integration includes comprehensive error handling:

- **Connection errors**: Automatic reconnection with exponential backoff
- **API errors**: Proper error messages and fallback behavior
- **Timeout handling**: Request timeouts with user feedback
- **State recovery**: Graceful handling of connection drops

## Development

### Mock Server

The mock AMPS server simulates all AMPS functionality for development:

```typescript
import { mockAmpsServer } from '@/lib/mock-amps-server'

// Mock server automatically handles all API calls in development
// No additional setup required
```

### Testing

```bash
# Start development server with mock AMPS
npm run dev

# The app will automatically use mock AMPS server
# when NEXT_PUBLIC_AMPS_API_URL contains 'localhost'
```

## Production Deployment

1. Set up real AMPS system with API endpoints
2. Configure environment variables:
   ```env
   NEXT_PUBLIC_AMPS_API_URL=https://your-amps-system.com
   NEXT_PUBLIC_AMPS_API_KEY=your-production-api-key
   NEXT_PUBLIC_AMPS_AUTO_CONNECT=true
   ```
3. Deploy the companion app
4. Test connection and functionality

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check AMPS API URL and key
   - Verify AMPS system is running
   - Check network connectivity

2. **Session Not Found**
   - Ensure session ID is correct
   - Check if session is still active
   - Verify user permissions

3. **Playback Not Working**
   - Check if session is active
   - Verify content is available
   - Check volume settings

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show detailed AMPS API logs in the browser console.

## Security Considerations

- API keys should be kept secure
- Use HTTPS in production
- Implement proper user authentication
- Validate all API responses
- Handle sensitive data appropriately

## Future Enhancements

- Real-time WebSocket connections
- Advanced session management
- Hardware-specific integrations
- Multi-tenant support
- Advanced analytics and monitoring
