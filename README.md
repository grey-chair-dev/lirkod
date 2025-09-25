# AMPS Companion - Advanced Music Management System

A comprehensive music management and streaming platform designed for content creators, educators, and music enthusiasts. Features advanced organization, collaborative sessions, and multi-language support.

## Features

### 🎵 Music Content Management
- High-quality audio streaming for diverse music content
- Advanced playback controls with speed adjustment
- Queue management and playlist creation
- Content metadata and cultural context for each item

### 📚 Content Organization
- Content categorized by type (Sessions, Performances, Educational, etc.)
- Difficulty levels (Beginner, Intermediate, Advanced)
- Regional categorization and cultural context
- Tempo and BPM information for each content item
- Color-coded content types for visual identification

### 👥 User Roles & Collaboration
- **Participant**: Browse and play music content
- **Programmer**: Full access to library management features
- Join live music sessions
- Add content to shared queues
- Real-time collaboration with other users
- Session management and participant tracking

### 🔍 Discovery & Search
- Advanced filtering by content type, region, and difficulty
- Featured playlists for different occasions
- Cultural notes and historical context
- Search by content title, artist, or creator
- Multi-language search support (English/Hebrew)

### 🌍 Internationalization
- Full English and Hebrew language support
- Right-to-left (RTL) text direction for Hebrew
- Dynamic UI that switches between languages
- Cultural content with Hebrew titles and notes

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Audio**: HTML5 Audio API with custom controls
- **TypeScript**: Full type safety throughout
- **State Management**: React Context for language and user preferences
- **AMPS Integration**: Complete API client with mock server for development

## AMPS Integration

This application includes comprehensive AMPS (Advanced Music Management System) integration:

### ✅ **What's Working Now**
- **Mock AMPS Server** - Full simulation for development
- **AMPS Client** - Complete API integration
- **Session Management** - Create, join, and control sessions
- **Playback Control** - Play, pause, skip, seek, volume
- **Queue Management** - Add, remove, reorder content
- **System Monitoring** - Hardware status and health checks

### 🔄 **What's Needed for Production**
- **Real AMPS Hardware** - Physical AMPS system with API endpoints
- **Authentication System** - User login and role management
- **Real-time Features** - WebSocket integration for live sync
- **Audio Processing** - High-quality streaming and format support
- **Production Deployment** - Infrastructure and security setup

### **Quick AMPS Test**
1. Switch to "Programmer" role in the app
2. Click "Connect" to establish AMPS connection
3. The mock server will simulate all AMPS functionality
4. Test session creation, playback control, and queue management

For detailed AMPS integration information, see [AMPS_INTEGRATION.md](./AMPS_INTEGRATION.md).

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd amps-companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database connection string
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
amps-companion/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── dances/        # Dance content API
│   │   ├── dance-types/   # Content types API
│   │   └── sync/          # External sync APIs
│   ├── choreographer/     # Creator pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── MusicPlayer.tsx    # Audio player component
│   ├── SongCard.tsx       # Content display component
│   ├── SongCardPopup.tsx  # Content detail popup
│   ├── SessionManager.tsx # Session management
│   ├── QueueManager.tsx   # Queue management
│   ├── SearchBar.tsx      # Search functionality
│   ├── LanguageToggle.tsx # Language switcher
│   └── LanguageWrapper.tsx # RTL support wrapper
├── contexts/              # React contexts
│   └── LanguageContext.tsx # Language state management
├── hooks/                 # Custom React hooks
│   ├── useMusicPlayer.ts  # Music player logic
│   └── useApiData.ts      # Data fetching hooks
├── lib/                   # Utilities and data
│   ├── db.ts             # Database connection
│   ├── database.ts       # Database utilities
│   └── musicData.ts      # Mock data and types
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
└── utils/                # Utility functions
    └── languageUtils.ts  # Language and display utilities
```

## Key Components

### MusicPlayer
Full-featured audio player with:
- Play/pause, skip, and seek controls
- Volume and playback speed adjustment
- Progress bar with time display
- Content information display

### SessionManager
Collaborative session features:
- Create and join music sessions
- View active sessions with participant counts
- Session codes for easy joining
- AMPS connection status monitoring

### QueueManager
Queue management system:
- Add/remove content from queue
- Reorder content in queue
- View queue contributors
- Total duration tracking

### Language Support
Internationalization features:
- English/Hebrew language toggle
- RTL text direction support
- Cultural content with Hebrew titles
- Dynamic UI text translation

## Database Schema

### Core Models
- **Dance**: Main content items with metadata
- **Choreographer**: Content creators
- **Song**: Music tracks and audio files
- **Artist**: Music performers
- **DanceType**: Content categorization
- **User**: System users and participants
- **Session**: Live music sessions
- **Playlist**: User-created content collections

### Content Types
- SESSION, IMITATION_FOR_CHILDREN, WHEELCHAIRS
- CHILDREN_LINES, TRIOS, MEDLEY, CHILDREN_COUPLES
- CHILDREN_CIRCLE, PERFORMANCE, DANCE_DELIGHT
- LINES, COUPLES, CIRCLE

## API Endpoints

- `GET /api/dances` - Fetch all content with filtering
- `GET /api/dance-types` - Fetch content types
- `POST /api/sync/israelidances` - Sync with external databases
- `GET /api/choreographers/[id]` - Fetch creator details

## Customization

### Styling
The app uses a custom color palette with:
- Primary colors: Orange/amber tones
- Secondary colors: Blue tones
- Content type color coding
- Hebrew font support with Noto Sans Hebrew

### Adding New Content
Content can be added through:
- Database seeding scripts
- External API synchronization
- Manual database insertion
- Import from external sources

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time session synchronization
- [ ] Offline content downloads
- [ ] Video content support
- [ ] Social features and community
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Content recommendation engine

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue in the repository or contact the development team.