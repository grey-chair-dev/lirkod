'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-spotify-black to-background-primary flex items-center justify-center">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-background-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-spotify-green/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Music for
              <span className="text-gradient block">Everyone</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
            >
              Stream millions of songs, create playlists, and discover new music with our premium music streaming platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="btn-primary text-lg px-8 py-4"
                onClick={() => router.push('/auth/register')}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-secondary text-lg px-8 py-4"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Experience music streaming like never before with our cutting-edge features and seamless user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-spotify-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-spotify-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Unlimited Streaming
              </h3>
              <p className="text-text-secondary">
                Access millions of songs and podcasts with high-quality audio streaming.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-spotify-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-spotify-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Personalized Playlists
              </h3>
              <p className="text-text-secondary">
                AI-powered recommendations and custom playlists tailored to your taste.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-spotify-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MoreHorizontal className="w-8 h-8 text-spotify-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Cross-Platform
              </h3>
              <p className="text-text-secondary">
                Listen anywhere on web, mobile, and desktop with seamless synchronization.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Experience the Music
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Try our demo and see what makes our platform special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                className="card-hover group"
              >
                <div className="aspect-square bg-gradient-to-br from-spotify-green/20 to-spotify-green/5 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-spotify-green/20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-spotify-green" />
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">Demo Playlist {item}</h3>
                <p className="text-sm text-text-secondary">Sample tracks to get you started</p>
                <div className="play-button opacity-0 group-hover:opacity-100">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-spotify-green to-spotify-green-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Listening?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of music lovers and start your musical journey today.
          </p>
          <Button
            size="lg"
            className="bg-white text-spotify-green hover:bg-white/90 text-lg px-8 py-4"
            onClick={() => router.push('/auth/register')}
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
}
