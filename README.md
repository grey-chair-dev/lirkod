# Lirkod

A modern, full-stack music streaming platform built with cutting-edge technologies.

## 🎵 Features

- **Music Streaming**: High-quality audio streaming with adaptive bitrate
- **User Authentication**: Secure login with OAuth integration
- **Playlist Management**: Create, edit, and share playlists
- **Music Discovery**: AI-powered recommendations and search
- **Social Features**: Follow friends, share music, collaborative playlists
- **Cross-Platform**: Web, mobile, and desktop applications
- **Offline Mode**: Download music for offline listening (Premium)
- **Real-time Features**: Live listening sessions and friend activity

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Redis** for caching and sessions
- **JWT** for authentication
- **WebSocket** for real-time features

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for data fetching
- **Framer Motion** for animations

### Mobile
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **Expo AV** for audio playback

### Infrastructure
- **Docker** for containerization
- **AWS S3** for audio file storage
- **CloudFront** for CDN
- **Vercel** for frontend deployment

## 📁 Project Structure

```
lirkod/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema
│   └── uploads/            # File uploads
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and configs
│   │   └── stores/        # State management
│   └── public/            # Static assets
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── navigation/    # Navigation setup
│   │   └── services/      # API services
└── shared/                # Shared types and utilities
    └── types/             # TypeScript definitions
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lirkod
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on http://localhost:3001
- Frontend web app on http://localhost:3000
- Mobile app (when running `npm run dev:mobile`)

## 🎯 Key Features Implementation

### Music Streaming
- Adaptive bitrate streaming for optimal quality
- Audio caching for smooth playback
- Crossfade between tracks
- Gapless playback

### User Experience
- Responsive design for all devices
- Dark/light theme support
- Keyboard shortcuts
- Voice commands integration

### Performance
- Server-side rendering (SSR)
- Image optimization
- Code splitting
- CDN integration

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm test            # Run tests
npm run lint        # Lint code
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

### Mobile Development
```bash
cd mobile
npm run start      # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
```

## 🚀 Deployment

### Backend Deployment
- Deploy to AWS EC2, DigitalOcean, or similar
- Use PM2 for process management
- Set up reverse proxy with Nginx

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar
- Configure environment variables
- Set up custom domain

### Mobile Deployment
- Build with EAS Build (Expo)
- Deploy to App Store and Google Play
- Configure app signing

## 📊 Monitoring & Analytics

- **Performance**: Web Vitals, Core Web Vitals
- **Errors**: Sentry for error tracking
- **Analytics**: Google Analytics, Mixpanel
- **Uptime**: Uptime monitoring services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Spotify for inspiration
- Open source community for amazing tools
- Contributors and maintainers

---

**Note**: This is a music streaming platform project. All music content rights belong to their respective owners.
