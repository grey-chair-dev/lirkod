# Spotify Clone Mobile App

A React Native mobile application for the Spotify Clone platform.

## Features

- **Authentication**: Login and registration with secure token storage
- **Music Streaming**: Audio playback with Expo AV
- **Playlist Management**: Create and manage playlists
- **Search & Discovery**: Find music and browse categories
- **User Library**: Access your saved music and playlists
- **Cross-Platform**: Works on both iOS and Android

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device/simulator**:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (for testing)
   npm run web
   ```

## Project Structure

```
src/
├── contexts/          # React contexts for state management
│   ├── AuthContext.tsx
│   └── MusicPlayerContext.tsx
├── navigation/        # Navigation configuration
│   └── AppNavigator.tsx
└── screens/          # App screens
    ├── LoginScreen.tsx
    ├── RegisterScreen.tsx
    ├── HomeScreen.tsx
    ├── SearchScreen.tsx
    └── LibraryScreen.tsx
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library
- **Expo AV**: Audio playback
- **AsyncStorage**: Local data persistence
- **React Query**: Server state management
- **Zustand**: Client state management

## Development

### Running the App

1. Make sure the backend API is running on `http://localhost:3001`
2. Start the Expo development server:
   ```bash
   npm start
   ```
3. Scan the QR code with Expo Go app or run on simulator

### Building for Production

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## Configuration

The app connects to the backend API at `http://localhost:3001` by default. To change this:

1. Update the API URLs in the context files
2. For production, use environment variables or build-time configuration

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Dependency conflicts**: Use `--legacy-peer-deps` flag
3. **iOS build issues**: Make sure Xcode is properly configured
4. **Android build issues**: Ensure Android Studio and SDK are set up

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native documentation](https://reactnative.dev/)
- Check the main project README for backend setup

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test on both iOS and Android
4. Update documentation as needed

## License

This project is part of the Spotify Clone platform. See the main project for license information.
