'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, Search, Home, Library, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-spotify-black to-background-primary flex items-center justify-center">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockPlaylists = [
    {
      id: '1',
      title: 'Liked Songs',
      description: '50 songs',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      isLiked: true,
    },
    {
      id: '2',
      title: 'My Playlist #1',
      description: '25 songs',
      coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
      isLiked: false,
    },
    {
      id: '3',
      title: 'Workout Mix',
      description: '30 songs',
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      isLiked: false,
    },
    {
      id: '4',
      title: 'Chill Vibes',
      description: '40 songs',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      isLiked: false,
    },
  ];

  const mockRecentlyPlayed = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      duration: 200,
    },
    {
      id: '2',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
      duration: 203,
    },
    {
      id: '3',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      duration: 178,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-background-primary">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-full w-64 bg-background-secondary border-r border-spotify-gray-dark">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-8">Spotify Clone</h1>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 text-white hover:text-spotify-green transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-text-secondary hover:text-white transition-colors">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-text-secondary hover:text-white transition-colors">
              <Library className="w-5 h-5" />
              <span>Your Library</span>
            </a>
          </nav>

          <div className="mt-8">
            <Button className="w-full btn-secondary mb-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Playlists
            </h3>
            <div className="space-y-2">
              {mockPlaylists.map((playlist) => (
                <a
                  key={playlist.id}
                  href="#"
                  className="block text-text-secondary hover:text-white transition-colors truncate"
                >
                  {playlist.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-spotify-gray-dark">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
              <span className="text-black font-semibold text-sm">
                {user.displayName?.charAt(0) || user.username.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.displayName || user.username}</p>
              <p className="text-text-secondary text-xs">{user.isPremium ? 'Premium' : 'Free'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full text-text-secondary hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Good evening</h2>
          <p className="text-text-secondary">Welcome back, {user.displayName || user.username}!</p>
        </div>

        {/* Recently Played */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Recently Played</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRecentlyPlayed.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover group relative"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-spotify-green/20 to-spotify-green/5 rounded-lg flex-shrink-0">
                    <img
                      src={song.coverImage}
                      alt={song.album}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{song.title}</h4>
                    <p className="text-sm text-text-secondary truncate">{song.artist}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-text-secondary hover:text-white">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="text-text-secondary hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="play-button opacity-0 group-hover:opacity-100">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Made for You */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Made for You</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-hover group relative"
              >
                <div className="aspect-square bg-gradient-to-br from-spotify-green/20 to-spotify-green/5 rounded-lg mb-4 flex items-center justify-center">
                  <img
                    src={playlist.coverImage}
                    alt={playlist.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-medium text-white mb-1 truncate">{playlist.title}</h4>
                <p className="text-sm text-text-secondary truncate">{playlist.description}</p>
                <div className="play-button opacity-0 group-hover:opacity-100">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-spotify-green/10 to-spotify-green/5 border-spotify-green/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-text-secondary mb-4">
                Get unlimited skips, offline downloads, and ad-free listening.
              </p>
              <Button className="btn-primary">Upgrade Now</Button>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-spotify-gray/10 to-spotify-gray/5 border-spotify-gray/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Create Your First Playlist</h3>
              <p className="text-text-secondary mb-4">
                It's easy, we'll help you. Create a playlist to get started.
              </p>
              <Button variant="outline" className="btn-secondary">Create Playlist</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
