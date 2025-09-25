# Database Setup for Lirkod

This guide will help you connect Lirkod to a Neon database for persistent storage of songs, playlists, and sessions.

## Prerequisites

1. A Neon account (sign up at [neon.tech](https://neon.tech))
2. A Neon database project created

## Setup Steps

### 1. Get Your Neon Database URL

1. Go to your [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to the "Connection Details" section
4. Copy the connection string (it looks like: `postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the `DATABASE_URL` with your actual Neon connection string:
   ```env
   DATABASE_URL="postgresql://your-username:your-password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Database Schema

```bash
npm run db:push
```

This will create all the necessary tables in your Neon database.

### 5. Seed the Database

```bash
npm run db:seed
```

This will populate your database with sample Israeli folk dance music data.

## Database Schema

The database includes the following main entities:

### Songs
- Basic song information (title, artist, duration)
- Dance-specific metadata (dance type, tempo, difficulty)
- Cultural context (region, cultural notes)
- Audio file URL

### Playlists
- Playlist metadata (name, description, category)
- Ordered collection of songs
- Creator information

### Sessions
- Live dance session information
- Host details and participant count
- Join codes for easy access
- Current song tracking

### Queue Management
- Session-based song queues
- Order management
- Contributor tracking

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Database Operations

The application includes comprehensive database operations in `lib/database.ts`:

### Song Operations
- `getAllSongs()` - Get all songs
- `searchSongs(query)` - Search songs by text
- `getSongsByDanceType(type)` - Filter by dance type
- `getSongsByDifficulty(level)` - Filter by difficulty
- `getSongsByRegion(region)` - Filter by region

### Playlist Operations
- `getAllPlaylists()` - Get all playlists with songs
- `createPlaylist(data)` - Create new playlist
- `addSongToPlaylist(playlistId, songId, order)` - Add song to playlist

### Session Operations
- `getAllSessions()` - Get all active sessions
- `createSession(data)` - Create new dance session
- `getSessionByJoinCode(code)` - Join session by code
- `addSongToQueue(sessionId, songId, order)` - Add song to session queue

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is active
- Check that SSL mode is set to `require`

### Schema Issues
- Run `npm run db:generate` after schema changes
- Use `npm run db:push` for development schema updates
- Use `npm run db:migrate` for production migrations

### Data Issues
- Run `npm run db:seed` to reset with sample data
- Use `npm run db:studio` to inspect data visually

## Next Steps

Once your database is set up:

1. The application will automatically use the database instead of mock data
2. All songs, playlists, and sessions will persist between app restarts
3. You can add real audio files to the `public/audio/` directory
4. Consider adding user authentication for personalized features

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive configuration
- Consider using connection pooling for production deployments
- Regularly backup your database data
