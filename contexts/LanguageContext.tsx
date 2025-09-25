'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'he'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lirkod-language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'he')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('lirkod-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
