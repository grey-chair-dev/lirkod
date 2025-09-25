'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageWrapperProps {
  children: React.ReactNode
}

export default function LanguageWrapper({ children }: LanguageWrapperProps) {
  const { language } = useLanguage()

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language === 'he' ? 'he' : 'en'
    
    // Update document direction for RTL support
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr'
    
    // Add/remove RTL class to body for additional styling
    if (language === 'he') {
      document.body.classList.add('rtl')
    } else {
      document.body.classList.remove('rtl')
    }
  }, [language])

  return <>{children}</>
}
