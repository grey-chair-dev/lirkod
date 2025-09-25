'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
      title={`Switch to ${language === 'en' ? 'Hebrew' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">
        {language === 'en' ? 'EN' : 'עב'}
      </span>
    </button>
  )
}
