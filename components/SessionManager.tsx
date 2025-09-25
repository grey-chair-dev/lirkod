'use client'

import { useState } from 'react'
import { Users, Plus, Eye, Music } from 'lucide-react'

interface Session {
  id: string
  name: string
  host: string
  participantCount: number
  currentSong?: string
  isActive: boolean
}

interface SessionManagerProps {
  userRole: 'markid' | 'participant'
  onJoinSession: (sessionId: string) => void
  onCreateSession: (sessionName: string) => void
  ampsConnected?: boolean
  onConnectAmps?: () => void
}

export default function SessionManager({ userRole, onJoinSession, onCreateSession, ampsConnected, onConnectAmps }: SessionManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [joinCode, setJoinCode] = useState('')

  // Mock sessions data
  const mockSessions: Session[] = [
    {
      id: '1',
      name: 'Tel Aviv Hora Night',
      host: 'Sarah Cohen',
      participantCount: 12,
      currentSong: 'Hava Nagila',
      isActive: true
    },
    {
      id: '2',
      name: 'Beginner Debka Workshop',
      host: 'David Levy',
      participantCount: 8,
      currentSong: 'Debka Gilboa',
      isActive: true
    },
    {
      id: '3',
      name: 'Yemenite Dance Session',
      host: 'Rachel Mizrahi',
      participantCount: 15,
      isActive: false
    }
  ]

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault()
    if (sessionName.trim()) {
      onCreateSession(sessionName.trim())
      setSessionName('')
      setShowCreateForm(false)
    }
  }

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (joinCode.trim()) {
      onJoinSession(joinCode.trim())
      setJoinCode('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-600" />
            {userRole === 'markid' ? 'Manage Sessions' : 'Join Sessions'}
          </h2>
          {userRole === 'markid' && (
            <p className="text-sm text-gray-600 mt-1">
              Create and manage dance sessions with AMPS integration
            </p>
          )}
        </div>
        
        {userRole === 'markid' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Session
          </button>
        )}
      </div>

      {/* AMPS Connection Status (for Programmer) */}
      {userRole === 'markid' && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${ampsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-900">
                AMPS Status: {ampsConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {!ampsConnected && onConnectAmps && (
              <button 
                onClick={onConnectAmps}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Connect AMPS
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Session Form */}
      {showCreateForm && userRole === 'markid' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Create New Session</h3>
          <form onSubmit={handleCreateSession} className="space-y-3">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name (e.g., 'Tel Aviv Hora Night')"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Session
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Join by Code */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Join by Code</h3>
        <form onSubmit={handleJoinByCode} className="flex space-x-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter session code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
          >
            Join
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 mb-3">Active Sessions</h3>
        {mockSessions.filter(session => session.isActive).map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
            onClick={() => onJoinSession(session.id)}
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{session.name}</h4>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live
                </span>
              </div>
              <p className="text-sm text-gray-600">Host: {session.host}</p>
              {session.currentSong && (
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Music className="w-3 h-3 mr-1" />
                  Now playing: {session.currentSong}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {session.participantCount}
              </div>
              <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-full transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inactive Sessions */}
      {mockSessions.filter(session => !session.isActive).length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">Recent Sessions</h3>
          {mockSessions.filter(session => !session.isActive).map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{session.name}</h4>
                <p className="text-sm text-gray-600">Host: {session.host}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {session.participantCount}
                </div>
                <span className="text-xs text-gray-500">Ended</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
