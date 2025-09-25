# AMPS Integration Guide

This document explains how the AMPS Companion integrates with the Advanced Music Management System (AMPS).

## Overview

The AMPS integration allows the companion app to:
- Connect to real AMPS hardware systems
- Control live music sessions
- Manage content queues
- Monitor system status
- Control playback and volume

## Quick Start Guide

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)
- AMPS hardware system (for production)

### Installation & Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd amps-companion
npm install
```

2. **Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

3. **Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Access the Application**
- Open [http://localhost:3000](http://localhost:3000) in your browser
- Switch to "Programmer" role to access AMPS controls
- Click "Connect" to establish AMPS connection (uses mock server in development)

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/amps_companion"

# AMPS Configuration (Development)
NEXT_PUBLIC_AMPS_API_URL=http://localhost:8080
NEXT_PUBLIC_AMPS_API_KEY=demo-key
NEXT_PUBLIC_AMPS_AUTO_CONNECT=false

# AMPS Configuration (Production)
# NEXT_PUBLIC_AMPS_API_URL=https://your-amps-system.com
# NEXT_PUBLIC_AMPS_API_KEY=your-production-api-key
# NEXT_PUBLIC_AMPS_AUTO_CONNECT=true

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

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
   - Ensure `.env.local` is properly configured

2. **Database Connection Issues**
   - Verify `DATABASE_URL` in `.env.local`
   - Run `npm run db:generate` and `npm run db:push`
   - Check PostgreSQL is running
   - Verify database credentials

3. **Session Not Found**
   - Ensure session ID is correct
   - Check if session is still active
   - Verify user permissions
   - Refresh the page and try again

4. **Playback Not Working**
   - Check if session is active
   - Verify content is available
   - Check volume settings
   - Ensure audio files are accessible

5. **Build Errors**
   - Run `npm run db:generate` to update Prisma client
   - Check for TypeScript errors with `npm run lint`
   - Clear `.next` cache and rebuild
   - Verify all environment variables are set

6. **AMPS Mock Server Issues**
   - Check browser console for errors
   - Verify mock server is running (automatic in development)
   - Restart development server
   - Check network requests in browser dev tools

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will show detailed AMPS API logs in the browser console.

### Development vs Production Issues

**Development:**
- Uses mock AMPS server automatically
- No real hardware required
- All features work with simulated data

**Production:**
- Requires real AMPS hardware
- Needs proper API endpoints
- Requires production database
- Needs SSL/HTTPS configuration

## Security Considerations

- API keys should be kept secure
- Use HTTPS in production
- Implement proper user authentication
- Validate all API responses
- Handle sensitive data appropriately

## Complete Integration Requirements

### For a Fully Functioning App

To make this a production-ready AMPS companion application, you need to integrate:

#### 1. **Database Integration**
- ✅ **PostgreSQL Database** - Already configured with Prisma
- ✅ **Database Schema** - Complete with all required tables
- ✅ **Database Seeding** - Sample data for testing
- ✅ **API Routes** - RESTful endpoints for all data operations

#### 2. **AMPS Hardware Integration**
- ✅ **AMPS Client** - Complete API client for hardware communication
- ✅ **Mock Server** - Development simulation (already working)
- 🔄 **Real AMPS System** - Production hardware integration needed
- 🔄 **Hardware Drivers** - Device-specific drivers for audio equipment
- 🔄 **Network Configuration** - Proper network setup for AMPS communication

#### 3. **Authentication & Authorization**
- 🔄 **User Authentication** - Login/logout system
- 🔄 **Role-Based Access** - Programmer vs Participant permissions
- 🔄 **Session Management** - Secure session handling
- 🔄 **API Security** - Token-based authentication

#### 4. **Real-Time Features**
- 🔄 **WebSocket Integration** - Real-time updates
- 🔄 **Live Session Sync** - Synchronized playback across devices
- 🔄 **Push Notifications** - Real-time alerts and updates
- 🔄 **Event Broadcasting** - Live session events

#### 5. **Content Management**
- ✅ **Content Library** - Database-driven content storage
- ✅ **Search & Filtering** - Advanced content discovery
- 🔄 **File Upload** - Audio file management
- 🔄 **Content Validation** - File format and quality checks
- 🔄 **CDN Integration** - Fast content delivery

#### 6. **Audio Processing**
- 🔄 **Audio Streaming** - High-quality audio delivery
- 🔄 **Format Support** - Multiple audio formats (MP3, WAV, FLAC)
- 🔄 **Audio Processing** - EQ, effects, mixing
- 🔄 **Latency Optimization** - Low-latency audio streaming

#### 7. **User Interface**
- ✅ **Responsive Design** - Mobile and desktop support
- ✅ **Internationalization** - Hebrew/English support
- ✅ **Accessibility** - Screen reader and keyboard navigation
- 🔄 **Custom Themes** - Branding and customization
- 🔄 **Progressive Web App** - Offline functionality

#### 8. **Monitoring & Analytics**
- 🔄 **System Monitoring** - Hardware and software health
- 🔄 **Usage Analytics** - User behavior tracking
- 🔄 **Performance Metrics** - Response times and throughput
- 🔄 **Error Logging** - Comprehensive error tracking

#### 9. **Deployment & Infrastructure**
- 🔄 **Docker Containerization** - Containerized deployment
- 🔄 **Load Balancing** - High availability setup
- 🔄 **SSL/TLS** - Secure communication
- 🔄 **Backup Systems** - Data backup and recovery
- 🔄 **CI/CD Pipeline** - Automated deployment

#### 10. **Testing & Quality Assurance**
- 🔄 **Unit Tests** - Component and function testing
- 🔄 **Integration Tests** - API and database testing
- 🔄 **End-to-End Tests** - Full user workflow testing
- 🔄 **Performance Tests** - Load and stress testing

### Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Database Schema | ✅ Complete | All tables and relationships defined |
| API Routes | ✅ Complete | RESTful endpoints for all operations |
| AMPS Client | ✅ Complete | Full API integration with mock server |
| UI Components | ✅ Complete | Responsive design with i18n support |
| Mock AMPS Server | ✅ Complete | Development simulation working |
| Real AMPS Integration | 🔄 Pending | Requires actual AMPS hardware |
| Authentication | 🔄 Pending | User login system needed |
| Real-time Features | 🔄 Pending | WebSocket integration needed |
| Audio Processing | 🔄 Pending | Streaming and format support needed |
| Production Deployment | 🔄 Pending | Infrastructure setup needed |

### Next Steps for Production

1. **Set up Real AMPS Hardware**
   - Configure AMPS system with API endpoints
   - Test hardware integration
   - Implement device-specific drivers

2. **Implement Authentication**
   - Add user login/logout
   - Implement role-based permissions
   - Secure API endpoints

3. **Add Real-time Features**
   - WebSocket integration
   - Live session synchronization
   - Push notifications

4. **Deploy to Production**
   - Set up production database
   - Configure environment variables
   - Deploy with proper security

## Future Enhancements

- Real-time WebSocket connections
- Advanced session management
- Hardware-specific integrations
- Multi-tenant support
- Advanced analytics and monitoring
