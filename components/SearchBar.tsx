'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, Music, Users } from 'lucide-react'
import { useSongs, usePlaylists } from '@/hooks/useApiData'
import type { Song, Playlist } from '@/hooks/useApiData'
import { useLanguage } from '@/contexts/LanguageContext'
import { getLanguageText, UI_TEXT } from '@/utils/languageUtils'

interface SearchResult {
  type: 'song' | 'playlist' | 'dance' | 'artist' | 'choreographer'
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
}

interface SearchBarProps {
  onSearch: (query: string) => void
  onResultSelect: (result: SearchResult) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, onResultSelect, placeholder }: SearchBarProps) {
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const defaultPlaceholder = language === 'he' 
    ? 'חפש שירים, אמנים או תוכן...' 
    : 'Search songs, artists, or content...'

  // Fetch data from database
  const { songs } = useSongs(query)
  const { playlists } = usePlaylists()

  // Generate search suggestions
  const generateSuggestions = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search songs
    songs.forEach(song => {
      if (song.title.toLowerCase().includes(query) || 
          (song.artist && song.artist.toLowerCase().includes(query)) ||
          song.danceType.toLowerCase().includes(query)) {
        results.push({
          type: 'song',
          id: song.id,
          title: song.title,
          subtitle: `${song.artist || 'Unknown Artist'} • ${song.danceType}`,
          icon: <Music className="w-4 h-4" />
        })
      }
    })

    // Search playlists
    playlists.forEach(playlist => {
      if (playlist.name.toLowerCase().includes(query) ||
          playlist.description.toLowerCase().includes(query)) {
        results.push({
          type: 'playlist',
          id: playlist.id,
          title: playlist.name,
          subtitle: `${playlist.dances.length} dances • ${playlist.category}`,
          icon: <Users className="w-4 h-4" />
        })
      }
    })

    // Search dance types
    const danceTypes = ['Israeli', 'International', 'All', 'Circle', 'Partners', 'Line', 'Kids', 'Mixers']
    danceTypes.forEach(dance => {
      if (dance.toLowerCase().includes(query)) {
        const songCount = songs.filter(song => song.danceType === dance).length
        results.push({
          type: 'dance',
          id: dance,
          title: dance,
          subtitle: `${songCount} dances available`,
          icon: <Clock className="w-4 h-4" />
        })
      }
    })

    // Search artists
    const artists = [...new Set(songs.map(song => song.artist).filter(Boolean))]
    artists.forEach(artist => {
      if (artist && artist.toLowerCase().includes(query)) {
        const songCount = songs.filter(song => song.artist === artist).length
        results.push({
          type: 'artist',
          id: artist,
          title: artist,
          subtitle: `${songCount} songs`,
          icon: <Music className="w-4 h-4" />
        })
      }
    })

    // Search choreographers
    const choreographers = [...new Set(songs.map(song => song.choreographer).filter(Boolean))]
    choreographers.forEach(choreographer => {
      if (choreographer && choreographer.toLowerCase().includes(query)) {
        const songCount = songs.filter(song => song.choreographer === choreographer).length
        results.push({
          type: 'choreographer',
          id: choreographer,
          title: choreographer,
          subtitle: `${songCount} dances`,
          icon: <Users className="w-4 h-4" />
        })
      }
    })

    return results.slice(0, 8) // Limit to 8 suggestions
  }

  // Update suggestions when query changes
  useEffect(() => {
    const newSuggestions = generateSuggestions(query)
    setSuggestions(newSuggestions)
    setSelectedIndex(-1)
  }, [query])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
    setShowSuggestions(value.length > 0)
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchResult) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    onResultSelect(suggestion)
    inputRef.current?.blur()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Clear search
  const clearSearch = () => {
    setQuery('')
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onSearch('')
    inputRef.current?.focus()
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 0)}
          placeholder={placeholder || defaultPlaceholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-primary-50' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
              }`}
            >
              <div className={`flex-shrink-0 ${
                suggestion.type === 'song' ? 'text-primary-600' :
                suggestion.type === 'playlist' ? 'text-secondary-600' :
                suggestion.type === 'dance' ? 'text-green-600' :
                suggestion.type === 'choreographer' ? 'text-blue-600' :
                'text-purple-600'
              }`}>
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{suggestion.title}</p>
                <p className="text-sm text-gray-600 truncate">{suggestion.subtitle}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  suggestion.type === 'song' ? 'bg-primary-100 text-primary-800' :
                  suggestion.type === 'playlist' ? 'bg-secondary-100 text-secondary-800' :
                  suggestion.type === 'dance' ? 'bg-green-100 text-green-800' :
                  suggestion.type === 'choreographer' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {suggestion.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && query.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-gray-500 text-center">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
