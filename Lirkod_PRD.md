# Lirkod Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** Lirkod
**Vision:** To become the premier digital platform for Israeli folk dance music, seamlessly integrating with professional audio systems to connect dancers, instructors, and cultural enthusiasts worldwide.

**Mission:** We provide a modern web-based interface that enhances the AMPS (AudioBox Media Player System) ecosystem, specifically designed for Israeli folk dance communities, enabling seamless discovery, sharing, and collaborative music management.

## 2. Target Users

### Two-Tier User System:

**Tier 1: Markidim (Session Leaders) - AMPS Integration Users**
- Professional dance instructors and session leaders
- Event organizers and cultural coordinators  
- Community center music directors
- Professional DJs specializing in Israeli folk dance
- Use AMPS desktop software for professional audio control

**Tier 2: Session Participants - Lirkod Web App Users**
- Israeli folk dance enthusiasts and participants (ages 25-65)
- Dance students and beginners
- Cultural community members
- Event attendees and workshop participants
- Use Lirkod web app for discovery and participation

**Secondary Users:**
- Jewish community centers, cultural organizations, and dance schools
- Folk dance musicians, choreographers, and cultural preservationists
- Music researchers and ethnomusicologists

## 3. Core User Stories

### As a Markid (Session Leader using AMPS), I want to:
- Sync my AMPS library with Lirkod for enhanced metadata and community features
- Create and manage dance sessions that participants can join
- Receive song requests from session participants in real-time
- Control session queue and playback through AMPS while participants interact via Lirkod
- Access enhanced dance-specific metadata (choreographer, cultural context, difficulty)
- Share my professional playlists with the community
- Manage multiple concurrent sessions for different groups

### As a Session Participant (using Lirkod web app), I want to:
- Discover authentic Israeli folk dance music by dance name (Hora, Debka, etc.)
- Join active dance sessions and see the current queue
- Request songs to be added to the session playlist
- Access music with cultural context and dance instructions
- Create personal playlists and share them with my dance group
- View session information and current song details
- Access dance instruction videos and cultural notes
- Browse music by choreographer, region, and difficulty level

### As a Community Member, I want to:
- Access the complete Israeli folk dance music library
- Discover new dances and music through community recommendations
- Contribute to the cultural database with dance information
- Connect with other dancers and instructors in my area
- Access multiple versions of the same dance
- Higher audio quality for performance use
- Create unlimited themed playlists

## 4. Essential Features

### Core Features (MVP)

#### For Markidim (AMPS Integration)
1. **AMPS Library Sync**
   - Import AMPS database and playlists
   - Enhanced metadata integration (choreographer, cultural context)
   - Real-time sync between AMPS and Lirkod
   - Professional audio control through AMPS

2. **Session Management**
   - Create and manage dance sessions
   - Generate join codes for participants
   - Real-time queue management
   - Receive and approve song requests from participants

3. **Professional Tools**
   - Advanced playlist management
   - Session analytics and participant tracking
   - Multi-session management
   - Professional audio output control

#### For Session Participants (Lirkod Web App)
1. **Music Discovery & Streaming**
   - Search functionality with dance-specific filters
   - Browse by dance type, choreographer, region, difficulty
   - Access to enhanced metadata and cultural context
   - Mobile-optimized web interface

2. **Session Participation**
   - Join sessions via join code
   - View current song and queue
   - Request songs for the session
   - Real-time session updates

3. **Personal Features**
   - Create personal playlists
   - Save favorite dances and songs
   - Access dance instructions and cultural notes
   - Share playlists with dance groups

#### Shared Features
4. **Cultural Music Discovery**
   - Browse by dance type and region (Israeli, International, Circle, Partners, Line, Kids, Mixers)
   - Featured Israeli folk dance playlists
   - Traditional vs. modern arrangements
   - Recommended songs based on dance preferences
   - Cultural context and history for each song

5. **Session Management**
   - Join dance sessions/events
   - Add songs to shared queue
   - View current session queue
   - Real-time collaboration features

### Premium Features
1. **Ad-free listening**
2. **Offline downloads for events and practice**
3. **Dance instruction videos and tutorials**
4. **Cultural notes and song histories**
5. **Multiple tempo versions of songs**
6. **Higher audio quality for performances**
7. **Access to rare and archival recordings**

## 5. AMPS Integration Architecture

### System Overview
Lirkod is designed as a web-based frontend that enhances the existing AMPS (AudioBox Media Player System) ecosystem, creating a seamless two-tier user experience.

### Integration Model
```
AMPS Desktop (Markid) ←→ Lirkod Web App ←→ Session Participants (Mobile/Web)
     ↓                        ↓                        ↓
Professional Audio      Session Management        Community Features
Real-time Control       Queue Management          Song Requests
DSP Processing          Database Sync             Discovery
```

### AMPS Integration Features
- **Library Synchronization**: Import AMPS databases and playlists with enhanced metadata
- **Real-time Session Sync**: Current song, queue position, and session status
- **Professional Audio Control**: Markidim use AMPS for audio playback and DSP
- **Enhanced Metadata**: Add dance-specific information (choreographer, cultural context, difficulty)
- **Session Management**: Create sessions in Lirkod that integrate with AMPS playback
- **Request System**: Participants request songs through Lirkod, approved by Markid in AMPS

### Technical Integration
- **API Integration**: RESTful API between Lirkod and AMPS
- **Database Sync**: Bidirectional sync of playlists and metadata
- **Real-time Updates**: WebSocket connections for live session updates
- **No AMPS Updates Required**: Works with existing AMPS installations

## 6. Technical Requirements

### Platform Support
- **Primary**: Web application (browser-based) for session participants
- **Secondary**: Mobile-responsive web interface
- **Integration**: AMPS desktop software compatibility (Windows, macOS)
- **Future**: Native mobile apps (iOS, Android)

### Core Technical Features
- Real-time audio streaming
- User authentication and authorization
- Payment processing for subscriptions
- Content delivery network (CDN) for global performance
- Recommendation algorithm
- Search indexing

### Performance Requirements
- Audio streaming latency < 2 seconds
- Search results in < 1 second
- 99.9% uptime
- Support for concurrent users globally



## 7. Business Model

### Revenue Streams
1. **Two-Tier Subscription Model**
   - **Markidim (AMPS Users)**: Professional subscription ($24.99/month)
     - Full AMPS integration features
     - Advanced session management
     - Professional analytics and reporting
     - Priority support
   - **Session Participants**: Community subscription ($9.99/month)
     - Full access to music library
     - Session participation features
     - Personal playlist management
     - Cultural content access
   - **Free Tier**: Limited access to basic catalog and session viewing

2. **Session-Based Revenue**
   - Per-session fees for premium events
   - Group session packages for dance schools
   - Event organizer partnerships

3. **Additional Revenue**
   - Dance instruction video subscriptions
   - Cultural event partnerships
   - Merchandise (traditional Israeli music instruments, dance accessories)
   - Licensing to dance schools and cultural centers
   - AMPS integration consulting services

## 8. Success Metrics

### User Engagement
- **Markidim Metrics**:
  - Active AMPS integrations
  - Sessions created per month
  - Library sync frequency
  - Professional feature usage
- **Session Participants**:
  - Monthly Active Users (MAU)
  - Daily Active Users (DAU)
  - Session participation rate
  - Song requests per session
  - Average session duration

### Business Metrics
- Conversion rate (free to premium)
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Churn rate
- AMPS integration adoption rate
- Session-based revenue growth

### Content Metrics
- Total songs in catalog
- New releases added per month
- Playlist creation rate
- Search success rate
- Session creation and participation

## 8. Competitive Landscape

### Direct Competitors
- YouTube (Israeli folk dance videos)
- Jewish music streaming services
- Cultural music platforms
- Dance instruction websites

### Competitive Advantages
- Largest curated Israeli folk dance music catalog
- Dance-specific organization and metadata
- Cultural context and educational content
- Community features for dance groups
- Integration with dance instruction materials
- Authentic and rare recordings
- Real-time session collaboration

## 9. Launch Strategy

### Phase 1: Core MVP
- Basic Israeli folk dance music streaming
- Dance-categorized playlists
- User accounts for dancers and instructors
- Session joining and queue management
- Web and mobile apps

### Phase 2: Enhanced Features
- Dance instruction video integration
- Cultural notes and song histories
- Community features for dance groups
- Premium subscriptions with educational content

### Phase 3: Platform Expansion
- Integration with dance schools and cultural centers
- Live streaming for dance events
- Wearable device support for practice
- International Israeli folk dance community expansion

## 10. Risk Assessment

### Technical Risks
- Streaming infrastructure scalability
- Copyright and licensing issues
- Platform compatibility challenges
- Real-time session synchronization

### Business Risks
- High licensing costs for specialized content
- Competition from general music platforms
- Economic downturns affecting subscriptions

### Mitigation Strategies
- Robust CDN and cloud infrastructure
- Strong legal team for licensing
- Focus on user experience differentiation
- Community-driven content creation
