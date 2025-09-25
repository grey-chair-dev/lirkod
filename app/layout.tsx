import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import LanguageWrapper from '@/components/LanguageWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AMPS Companion - Advanced Music Management System',
  description: 'Advanced music management system for AMPS with content organization and streaming capabilities',
  keywords: 'AMPS, music management, content streaming, music organization, advanced system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <LanguageWrapper>
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
              {children}
            </div>
          </LanguageWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}
