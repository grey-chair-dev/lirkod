import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Clone - Music Streaming Platform',
  description: 'A modern music streaming platform built with Next.js, React, and Node.js',
  keywords: ['music', 'streaming', 'spotify', 'clone', 'react', 'nextjs'],
  authors: [{ name: 'Spotify Clone Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1db954',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#282828',
                color: '#ffffff',
                border: '1px solid #535353',
              },
              success: {
                iconTheme: {
                  primary: '#1db954',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
