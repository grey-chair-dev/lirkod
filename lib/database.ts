import { prisma } from './db'

// Dance operations
export async function getAllDances() {
  return await prisma.dance.findMany({
    include: {
      artist: true,
      choreographer: true,
      createdBy: true,
      song: true
    },
    orderBy: { eng_title: 'asc' }
  })
}

export async function getDanceById(id: string) {
  return await prisma.dance.findUnique({
    where: { id },
    include: {
      artist: true,
      choreographer: true,
      createdBy: true,
      song: true
    }
  })
}

export async function searchDances(query: string) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  
  return await prisma.dance.findMany({
    where: {
      OR: searchTerms.map(term => ({
        OR: [
          { eng_title: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { danceType: { contains: term, mode: 'insensitive' } },
          { region: { contains: term, mode: 'insensitive' } },
          { culturalNotes: { contains: term, mode: 'insensitive' } },
          { instructions: { contains: term, mode: 'insensitive' } },
          { artist: { name: { contains: term, mode: 'insensitive' } } },
          { choreographer: { name: { contains: term, mode: 'insensitive' } } }
        ]
      }))
    },
    include: {
      artist: true,
      choreographer: true,
      createdBy: true,
      song: true
    },
    orderBy: { eng_title: 'asc' }
  })
}

export async function getDancesByDanceType(danceType: string) {
  return await prisma.dance.findMany({
    where: { danceType },
    include: {
      artist: true,
      choreographer: true,
      createdBy: true,
      song: true
    },
    orderBy: { eng_title: 'asc' }
  })
}

export async function getDancesByDifficulty(difficulty: string) {
  return await prisma.dance.findMany({
    where: { difficulty: difficulty.toUpperCase() as any },
    include: {
      artist: true,
      choreographer: true,
      createdBy: true,
      song: true
    },
    orderBy: { eng_title: 'asc' }
  })
}

export async function getDancesByRegion(region: string) {
  return await prisma.dance.findMany({
    where: { region },
    include: {
      artist: true,
      choreographer: true,
      createdBy: true,
      song: true
    },
    orderBy: { eng_title: 'asc' }
  })
}

// Artist operations
export async function getAllArtists() {
  return await prisma.artist.findMany({
    include: {
      dances: true
    },
    orderBy: { name: 'asc' }
  })
}

export async function getArtistById(id: string) {
  return await prisma.artist.findUnique({
    where: { id },
    include: {
      dances: {
        include: {
          choreographer: true
        }
      }
    }
  })
}

// Choreographer operations
export async function getAllChoreographers() {
  return await prisma.choreographer.findMany({
    include: {
      dances: true
    },
    orderBy: { name: 'asc' }
  })
}

export async function getChoreographerById(id: string) {
  return await prisma.choreographer.findUnique({
    where: { id },
    include: {
      dances: {
        include: {
          artist: true
        }
      }
    }
  })
}

// Playlist operations
export async function getAllPlaylists() {
  return await prisma.playlist.findMany({
    include: {
      dances: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      createdBy: true
    },
    orderBy: { name: 'asc' }
  })
}

export async function getPlaylistById(id: string) {
  return await prisma.playlist.findUnique({
    where: { id },
    include: {
      dances: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      createdBy: true
    }
  })
}

export async function createPlaylist(data: {
  name: string
  description?: string
  category?: string
  createdById: string
}) {
  return await prisma.playlist.create({
    data
  })
}

export async function addDanceToPlaylist(playlistId: string, danceId: string, order: number) {
  return await prisma.playlistDance.create({
    data: {
      playlistId,
      danceId,
      order
    }
  })
}

// Session operations
export async function getAllSessions() {
  return await prisma.session.findMany({
    include: {
      dances: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        }
      },
      queue: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      host: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getSessionById(id: string) {
  return await prisma.session.findUnique({
    where: { id },
    include: {
      dances: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        }
      },
      queue: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      host: true
    }
  })
}

export async function getSessionByJoinCode(joinCode: string) {
  return await prisma.session.findUnique({
    where: { joinCode },
    include: {
      dances: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        }
      },
      queue: {
        include: {
          dance: {
            include: {
              artist: true,
              choreographer: true
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      host: true
    }
  })
}

export async function createSession(data: {
  name: string
  description?: string
  hostId: string
  joinCode: string
}) {
  return await prisma.session.create({
    data
  })
}

export async function addDanceToSession(sessionId: string, danceId: string, addedBy?: string) {
  return await prisma.sessionDance.create({
    data: {
      sessionId,
      danceId,
      addedBy
    }
  })
}

export async function addDanceToQueue(sessionId: string, danceId: string, order: number, addedBy?: string) {
  return await prisma.queueItem.create({
    data: {
      sessionId,
      danceId,
      order,
      addedBy
    }
  })
}

export async function removeDanceFromQueue(sessionId: string, danceId: string) {
  return await prisma.queueItem.deleteMany({
    where: {
      sessionId,
      danceId
    }
  })
}

export async function updateSessionParticipantCount(sessionId: string, count: number) {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { participantCount: count }
  })
}

export async function updateSessionCurrentDance(sessionId: string, danceId: string | null) {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { currentDanceId: danceId }
  })
}

// Utility functions
export function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Seed data function
export async function seedDatabase() {
  // Check if we already have data
  const danceCount = await prisma.dance.count()
  if (danceCount > 0) {
    console.log('Database already seeded')
    return
  }

  // Create a default user
  const defaultUser = await prisma.user.create({
    data: {
      email: 'admin@lirkod.com',
      name: 'Lirkod Admin',
      isInstructor: true
    }
  })

  // Create artists
  const traditionalArtist = await prisma.artist.create({
    data: {
      name: 'Traditional',
      bio: 'Traditional Israeli folk music artists',
      region: 'Israel'
    }
  })

  const modernArtist = await prisma.artist.create({
    data: {
      name: 'Modern Israeli Folk',
      bio: 'Contemporary Israeli folk music artists',
      region: 'Israel'
    }
  })

  // Create choreographers
  const baruchAgadati = await prisma.choreographer.create({
    data: {
      name: 'Baruch Agadati',
      bio: 'Pioneer of cultural dance',
      region: 'Israel'
    }
  })

  const rivkaSturman = await prisma.choreographer.create({
    data: {
      name: 'Rivka Sturman',
      bio: 'Renowned cultural dance choreographer',
      region: 'Israel'
    }
  })

  // Create dances
  const mockDances = [
    {
      eng_title: 'Hava Nagila',
      description: 'One of the most famous Jewish folk songs, often played at celebrations and weddings.',
      danceType: 'Israeli',
      difficulty: 'BEGINNER',
      tempo: 120,
      duration: 180,
      audioUrl: '/audio/hava-nagila.mp3',
      culturalNotes: 'Traditional celebration dance from Eastern Europe',
      region: 'Eastern Europe',
      instructions: 'Form a circle, hold hands, step right-left-right-left in rhythm',
      artistId: traditionalArtist.id,
      choreographerId: baruchAgadati.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Debka Gilboa',
      description: 'A traditional cultural dance with intricate footwork.',
      danceType: 'Line',
      difficulty: 'INTERMEDIATE',
      tempo: 140,
      duration: 240,
      audioUrl: '/audio/debka-gilboa.mp3',
      culturalNotes: 'Traditional Middle Eastern line dance',
      region: 'Middle East',
      instructions: 'Form a line, stomp feet in rhythm, move forward and backward',
      artistId: traditionalArtist.id,
      choreographerId: rivkaSturman.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Mayim Mayim',
      description: 'A celebratory dance about water, often performed in a circle formation.',
      danceType: 'Circle',
      difficulty: 'BEGINNER',
      tempo: 110,
      duration: 200,
      audioUrl: '/audio/mayim-mayim.mp3',
      culturalNotes: 'Celebration of water and life',
      region: 'Israel',
      instructions: 'Form a circle, hold hands, step in and out of circle',
      artistId: traditionalArtist.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Yemenite Step',
      description: 'Traditional Yemenite Jewish dance with distinctive hand movements and steps.',
      danceType: 'Israeli',
      difficulty: 'INTERMEDIATE',
      tempo: 130,
      duration: 220,
      audioUrl: '/audio/yemenite-step.mp3',
      culturalNotes: 'Traditional Yemenite Jewish dance',
      region: 'Yemen',
      instructions: 'Small steps with hand movements, maintain upright posture',
      artistId: traditionalArtist.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Hora Medura',
      description: 'A fire hora, traditionally danced around a bonfire during celebrations.',
      danceType: 'Circle',
      difficulty: 'BEGINNER',
      tempo: 125,
      duration: 190,
      audioUrl: '/audio/hora-medura.mp3',
      culturalNotes: 'Fire hora for special celebrations',
      region: 'Israel',
      instructions: 'Circle dance around fire, faster tempo than regular hora',
      artistId: traditionalArtist.id,
      choreographerId: baruchAgadati.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Debka Kfar Giladi',
      description: 'A complex debka from the northern region of Israel.',
      danceType: 'Line',
      difficulty: 'ADVANCED',
      tempo: 135,
      duration: 280,
      audioUrl: '/audio/debka-kfar-giladi.mp3',
      culturalNotes: 'Complex debka from northern Israel',
      region: 'Northern Israel',
      instructions: 'Complex footwork patterns, requires practice',
      artistId: traditionalArtist.id,
      choreographerId: rivkaSturman.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Sephardic Romance',
      description: 'A romantic dance from the Sephardic Jewish tradition.',
      danceType: 'Partners',
      difficulty: 'INTERMEDIATE',
      tempo: 100,
      duration: 210,
      audioUrl: '/audio/sephardic-romance.mp3',
      culturalNotes: 'Romantic Sephardic Jewish dance',
      region: 'Spain/Mediterranean',
      instructions: 'Graceful movements, partner dance elements',
      artistId: traditionalArtist.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Hora Agadati',
      description: 'Named after Baruch Agadati, this hora has become a classic cultural dance.',
      danceType: 'Israeli',
      difficulty: 'BEGINNER',
      tempo: 115,
      duration: 195,
      audioUrl: '/audio/hora-agadati.mp3',
      culturalNotes: 'Classic hora by Baruch Agadati',
      region: 'Israel',
      instructions: 'Traditional hora steps, moderate tempo',
      artistId: traditionalArtist.id,
      choreographerId: baruchAgadati.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'Kids Hora',
      description: 'A simplified hora designed for children to learn cultural dance.',
      danceType: 'Kids',
      difficulty: 'BEGINNER',
      tempo: 100,
      duration: 150,
      audioUrl: '/audio/kids-hora.mp3',
      culturalNotes: 'Educational dance for children',
      region: 'Israel',
      instructions: 'Simple circle steps, easy to follow',
      artistId: traditionalArtist.id,
      choreographerId: rivkaSturman.id,
      createdById: defaultUser.id
    },
    {
      eng_title: 'International Mixer',
      description: 'A mixer dance that brings together different cultural influences.',
      danceType: 'Mixers',
      difficulty: 'INTERMEDIATE',
      tempo: 120,
      duration: 200,
      audioUrl: '/audio/international-mixer.mp3',
      culturalNotes: 'Combines elements from multiple cultures',
      region: 'International',
      instructions: 'Change partners throughout the dance',
      artistId: modernArtist.id,
      createdById: defaultUser.id
    }
  ]

  // Create dances
  for (const danceData of mockDances) {
    await prisma.dance.create({
      data: danceData
    })
  }

  // Create playlists
  const israeliPlaylist = await prisma.playlist.create({
    data: {
      name: 'Israeli Classics',
      description: 'Traditional cultural dances',
      category: 'Israeli',
      createdById: defaultUser.id
    }
  })

  const circlePlaylist = await prisma.playlist.create({
    data: {
      name: 'Circle Dances',
      description: 'Beautiful circle formations and group dances',
      category: 'Circle',
      createdById: defaultUser.id
    }
  })

  const weddingPlaylist = await prisma.playlist.create({
    data: {
      name: 'Wedding Celebration',
      description: 'Popular dances for Jewish weddings and celebrations',
      category: 'All',
      createdById: defaultUser.id
    }
  })

  // Add dances to playlists
  const culturalDances = await prisma.dance.findMany({
    where: { danceType: 'Israeli' }
  })

  for (let i = 0; i < culturalDances.length; i++) {
    await prisma.playlistDance.create({
      data: {
        playlistId: israeliPlaylist.id,
        danceId: culturalDances[i].id,
        order: i + 1
      }
    })
  }

  const circleDances = await prisma.dance.findMany({
    where: { danceType: 'Circle' }
  })

  for (let i = 0; i < circleDances.length; i++) {
    await prisma.playlistDance.create({
      data: {
        playlistId: circlePlaylist.id,
        danceId: circleDances[i].id,
        order: i + 1
      }
    })
  }

  const weddingDances = await prisma.dance.findMany({
    where: {
      OR: [
        { eng_title: { contains: 'Hava Nagila' } },
        { eng_title: { contains: 'Mayim' } },
        { danceType: 'Israeli' }
      ]
    }
  })

  for (let i = 0; i < weddingDances.length; i++) {
    await prisma.playlistDance.create({
      data: {
        playlistId: weddingPlaylist.id,
        danceId: weddingDances[i].id,
        order: i + 1
      }
    })
  }

  console.log('Database seeded successfully!')
}
