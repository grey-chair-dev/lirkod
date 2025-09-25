'use client'

import { useState } from 'react'
import { Search, Music, Users, Play, Filter } from 'lucide-react'
import MusicPlayer from '@/components/MusicPlayer'
import SongCard from '@/components/SongCard'
import SongCardPopup from '@/components/SongCardPopup'
import SessionManager from '@/components/SessionManager'
import QueueManager from '@/components/QueueManager'
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'
import LanguageToggle from '@/components/LanguageToggle'
import { useMusicPlayer } from '@/hooks/useMusicPlayer'
import { useDances, useSongs, usePlaylists, useSessions, useDanceTypes, createSession, joinSession } from '@/hooks/useApiData'
import { danceTypes, regions, difficultyLevels } from '@/lib/musicData'
import type { Dance, Song, Playlist } from '@/hooks/useApiData'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAmps } from '@/hooks/useAmps'
import { getLanguageText, UI_TEXT, getDanceTypeDisplayName, getDanceTypeColor } from '@/utils/languageUtils'
import AmpsControlPanel from '@/components/AmpsControlPanel'

export default function Home() {
  const { language } = useLanguage()
  const [userRole, setUserRole] = useState<'markid' | 'participant'>('participant')
  const [activeTab, setActiveTab] = useState<'browse' | 'sessions' | 'queue'>('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDanceType, setSelectedDanceType] = useState<string>('')
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  // AMPS integration
  const { 
    connected: ampsConnected, 
    connecting: ampsConnecting,
    connect: connectAmps,
    disconnect: disconnectAmps,
    currentSession: ampsSession,
    systemStatus: ampsStatus
  } = useAmps()
  const [selectedSongForPopup, setSelectedSongForPopup] = useState<Dance | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    queue,
    play,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume,
    setPlaybackRate,
    addToQueue,
    removeFromQueue,
    moveInQueue
  } = useMusicPlayer()

  // Fetch data from database
  const { dances: allDances, loading: dancesLoading } = useDances(searchQuery)
  const { songs: allSongs, loading: songsLoading } = useSongs(searchQuery, {
    danceType: selectedDanceType,
    region: selectedRegion,
    difficulty: selectedDifficulty
  })
  
  const { playlists, loading: playlistsLoading } = usePlaylists()
  const { sessions, loading: sessionsLoading } = useSessions()
  const { danceTypes: availableDanceTypes, loading: danceTypesLoading } = useDanceTypes()

  // Use dances from database (already filtered by API)
  const filteredDances = allDances

  // Filter playlists based on search
  const filteredPlaylists = playlists.filter(playlist => {
    if (!searchQuery.trim()) return true
    
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0)
    const searchableText = [
      playlist.name,
      playlist.description,
      playlist.category
    ].join(' ').toLowerCase()
    
    return searchTerms.every(term => searchableText.includes(term))
  })

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      resume()
    }
  }

  const handlePlaySong = (song: Dance) => {
    play(song)
  }

  const handleAddToQueue = (song: Dance) => {
    addToQueue(song)
  }

  const handleJoinSession = (sessionId: string) => {
    console.log('Joining session:', sessionId)
    setActiveTab('queue')
  }

  const handleCreateSession = (sessionName: string) => {
    console.log('Creating session:', sessionName)
    setActiveTab('queue')
  }

  const handleMoveInQueue = (songId: string, direction: 'up' | 'down') => {
    moveInQueue(songId, direction)
  }

  const handleSearchResultSelect = (result: any) => {
    if (result.type === 'song') {
      const song = allDances.find(s => s.id === result.id)
      if (song) {
        handlePlaySong(song)
      }
    } else if (result.type === 'playlist') {
      const playlist = playlists.find(p => p.id === result.id)
      if (playlist) {
        handleSelectPlaylist(playlist)
      }
    } else if (result.type === 'dance') {
      setSelectedDanceType(result.id)
      setSearchQuery('')
    } else if (result.type === 'artist') {
      setSearchQuery(result.id)
    } else if (result.type === 'choreographer') {
      // Navigate to choreographer page
      const choreographerSlug = result.id.toLowerCase().replace(/\s+/g, '-')
      window.location.href = `/choreographer/${choreographerSlug}`
    }
  }

  const handleSelectPlaylist = (playlist: Playlist) => {
    // Add all dances from playlist to queue
    if (playlist.dances && Array.isArray(playlist.dances)) {
      playlist.dances.forEach((playlistDance: { dance: Song; order: number }) => {
        if (playlistDance.dance) {
          addToQueue(playlistDance.dance)
        }
      })
    }
    console.log('Added playlist to queue:', playlist.name)
  }

  const handleConnectAmps = async () => {
    try {
      const success = await connectAmps()
      if (success) {
        console.log('AMPS connected successfully')
      } else {
        console.error('Failed to connect to AMPS')
      }
    } catch (error) {
      console.error('Error connecting to AMPS:', error)
    }
  }

  const handleSyncContentDatabase = async () => {
    try {
      console.log('Syncing with content database...')
      const response = await fetch('/api/sync/israelidances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Sync completed:', result)
        alert(`Sync completed! Fetched ${result.results.dances} dances, ${result.results.choreographers} choreographers, ${result.results.events} events.`)
      } else {
        console.error('Sync failed:', response.statusText)
        alert('Sync failed. Please try again.')
      }
    } catch (error) {
      console.error('Error syncing:', error)
        alert('Error syncing with content database.')
    }
  }

  const handleSongCardClick = (song: Dance) => {
    setSelectedSongForPopup(song)
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedSongForPopup(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AMPS Companion</h1>
                <p className="text-sm text-gray-600">
                  {language === 'he' ? 'מערכת ניהול מוזיקה מתקדמת' : 'Advanced Music Management System'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* User Role Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {language === 'he' ? 'תפקיד:' : 'Role:'}
                </span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as 'markid' | 'participant')}
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white ${
                    userRole === 'markid' ? 'text-blue-600 font-medium' : 'text-green-600 font-medium'
                  }`}
                >
                  <option value="participant" className="text-green-600 bg-white">
                    {language === 'he' ? 'משתתף' : 'Participant'}
                  </option>
                <option value="markid" className="text-blue-600 bg-white">
                  {language === 'he' ? 'מתכנת' : 'Programmer'}
                </option>
                </select>
              </div>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* AMPS Connection Status (for Markid) */}
              {userRole === 'markid' && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${ampsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    AMPS {ampsConnected ? (language === 'he' ? 'מחובר' : 'Connected') : (language === 'he' ? 'מנותק' : 'Disconnected')}
                  </span>
                  <span className="text-sm text-gray-600 sm:hidden">
                    {ampsConnected ? (language === 'he' ? 'מחובר' : 'Connected') : (language === 'he' ? 'מנותק' : 'Disconnected')}
                  </span>
                  {!ampsConnected && (
                    <button
                      onClick={handleConnectAmps}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      {language === 'he' ? 'התחבר' : 'Connect'}
                    </button>
                  )}
                </div>
              )}

              <div className="w-full sm:w-auto">
                <SearchBar
                  onSearch={setSearchQuery}
                  onResultSelect={handleSearchResultSelect}
                  placeholder="Search songs, artists, or content..."
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* AMPS Control Panel - Only for Programmers */}
      {userRole === 'markid' && ampsConnected && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <AmpsControlPanel />
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'browse'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {userRole === 'markid' 
                ? (language === 'he' ? 'ניהול ספרייה' : 'Library Management')
                : (language === 'he' ? 'עיון במוזיקה' : 'Browse Music')
              }
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sessions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              {userRole === 'markid' 
                ? (language === 'he' ? 'ניהול מפגשים' : 'Manage Sessions')
                : (language === 'he' ? 'הצטרף למפגשים' : 'Join Sessions')
              }
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'queue'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {userRole === 'markid' 
                ? (language === 'he' ? 'תור המפגש' : 'Session Queue')
                : (language === 'he' ? 'הפלייליסט שלי' : 'My Playlist')
              } ({queue.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'he' ? 'סוג תוכן' : 'Content Type'}
                  </label>
                <select
                  value={selectedDanceType}
                  onChange={(e) => setSelectedDanceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                >
                    <option value="" className="text-gray-900 bg-white">
                      {language === 'he' ? 'כל סוגי התוכן' : 'All Content Types'}
                    </option>
                  {availableDanceTypes.map(type => (
                    <option key={type.id} value={type.nameEng} className="text-gray-900 bg-white">
                      {getDanceTypeDisplayName(type, language)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                >
                  <option value="" className="text-gray-900 bg-white">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region} className="text-gray-900 bg-white">{region}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
                >
                  <option value="" className="text-gray-900 bg-white">All Levels</option>
                  {difficultyLevels.map(level => (
                    <option key={level} value={level} className="text-gray-900 bg-white">{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-32">
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Participant Practice Mode */}
            {userRole === 'participant' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-green-600" />
                  Practice & Discovery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Browse by Dance Type</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Explore various content types including sessions, performances, and educational content
                    </p>
                    <button 
                      onClick={() => setShowFilters(true)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      Filter Dances
                    </button>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Build Your Playlist</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Add songs to your personal playlist and practice your favorite dances
                    </p>
                    <button 
                      onClick={() => setActiveTab('queue')}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      View Playlist
                    </button>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Join Live Sessions</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Connect with other dancers in real-time sessions
                    </p>
                    <button 
                      onClick={() => setActiveTab('sessions')}
                      className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                    >
                      Find Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Markid Library Management */}
            {userRole === 'markid' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-primary-600" />
                  Library Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">AMPS Integration</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Sync your AMPS library with enhanced metadata
                    </p>
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                      Sync Library
                    </button>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Content Database</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Sync with the global content database
                    </p>
                    <button 
                      onClick={handleSyncContentDatabase}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      Sync Content Database
                    </button>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Professional Playlists</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Create and share professional content playlists
                    </p>
                    <button className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors">
                      Create Playlist
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery.trim() && (
              <SearchResults
                query={searchQuery}
                songs={filteredDances}
                playlists={filteredPlaylists}
                onPlaySong={handlePlaySong}
                onAddToQueue={handleAddToQueue}
                onSelectPlaylist={handleSelectPlaylist}
              />
            )}

            {/* Featured Content (when not searching) */}
            {!searchQuery.trim() && (
              <>
                {/* Featured Playlists */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Playlists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {playlists.map(playlist => (
                      <div
                        key={playlist.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleSelectPlaylist(playlist)}
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg mb-3 flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{playlist.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{playlist.description}</p>
                        <p className="text-xs text-primary-600 font-medium">{playlist.dances.length} dances</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* All Dances */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    All Dances ({filteredDances.length})
                  </h2>
                  
                  {/* Table Header */}
                  <div className="flex items-center space-x-4 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <div className="flex-shrink-0 w-8"></div>
                    <div className="flex-1">Title</div>
                    <div className="hidden md:block flex-shrink-0 w-32">Content Type</div>
                    <div className="hidden lg:block flex-shrink-0 w-24">Difficulty</div>
                    <div className="flex-shrink-0 w-16 text-right">Duration</div>
                    <div className="flex-shrink-0 w-8"></div>
                  </div>
                  
                  {/* Dance List */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {filteredDances.map(dance => (
                      <SongCard
                        key={dance.id}
                        song={dance}
                        isPlaying={currentSong?.id === dance.id && isPlaying}
                        onPlay={() => handlePlaySong(dance)}
                        onAddToQueue={() => handleAddToQueue(dance)}
                        onCardClick={() => handleSongCardClick(dance)}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <SessionManager
            userRole={userRole}
            onJoinSession={handleJoinSession}
            onCreateSession={handleCreateSession}
            ampsConnected={ampsConnected}
            onConnectAmps={handleConnectAmps}
          />
        )}

        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Standalone Music Player Info */}
            {userRole === 'participant' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Personal Music Player</h3>
                    <p className="text-sm text-gray-600">
                      Build your own playlist and practice your favorite content
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <QueueManager
              queue={queue}
              currentSongId={currentSong?.id || null}
              onRemoveFromQueue={removeFromQueue}
              onMoveUp={(songId) => handleMoveInQueue(songId, 'up')}
              onMoveDown={(songId) => handleMoveInQueue(songId, 'down')}
              onPlaySong={handlePlaySong}
              userRole={userRole}
            />
          </div>
        )}
      </main>

      {/* Music Player */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={next}
        onPrevious={previous}
        onSeek={seek}
        onVolumeChange={setVolume}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        playbackRate={playbackRate}
        onPlaybackRateChange={setPlaybackRate}
      />

      {/* Song Card Popup */}
      <SongCardPopup
        song={selectedSongForPopup}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  )
}
