// Import scraped content data into our database

import { prisma } from '@/lib/db'
import { israeliDancesScraper } from './israelidances-scraper'

export interface ImportResult {
  content: number
  creators: number
  events: number
  errors: string[]
  skipped: number
}

export class ContentImporter {
  
  /**
   * Import all scraped data into our database
   */
  async importAll(singer?: string): Promise<ImportResult> {
    const result: ImportResult = {
      content: 0,
      creators: 0,
      events: 0,
      errors: [],
      skipped: 0
    }

    try {
      console.log(`Starting import of content data${singer ? ` for singer: ${singer}` : ''}...`)
      
      let scrapedData
      if (singer) {
        // Import only content for specific singer
        const content = await israeliDancesScraper.scrapeDancesBySinger(singer)
        scrapedData = {
          dances: content,
          choreographers: [],
          events: [],
          errors: []
        }
      } else {
        scrapedData = await israeliDancesScraper.scrapeAll()
      }
      
      // Import creators first (content depends on them)
      result.creators = await this.importCreators(scrapedData.choreographers, result)
      
      // Import content
      result.content = await this.importContent(scrapedData.dances, result)
      
      // Import events
      result.events = await this.importEvents(scrapedData.events, result)
      
      console.log(`Import completed: ${result.content} content items, ${result.creators} creators, ${result.events} events`)
      
    } catch (error) {
      result.errors.push(`Import error: ${error}`)
      console.error('Error during import:', error)
    }

    return result
  }

  /**
   * Import creators into database
   */
  private async importCreators(creators: any[], result: ImportResult): Promise<number> {
    let imported = 0
    
    for (const creator of creators) {
      try {
        // Check if creator already exists
        const existing = await prisma.choreographer.findUnique({
          where: { id: creator.id }
        })
        
        if (existing) {
          result.skipped++
          continue
        }
        
        // Create new creator
        await prisma.choreographer.create({
          data: {
            id: creator.id,
            name: creator.name,
            bio: creator.bio || null,
            region: creator.region || null,
            website: creator.website || null,
            imageUrl: null, // We don't have images from scraping
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        imported++
        console.log(`Imported creator: ${creator.name}`)
        
      } catch (error) {
        result.errors.push(`Error importing creator ${creator.name}: ${error}`)
        console.error(`Error importing creator ${creator.name}:`, error)
      }
    }
    
    return imported
  }

  /**
   * Import content into database
   */
  private async importContent(content: any[], result: ImportResult): Promise<number> {
    let imported = 0
    
    for (const item of content) {
      try {
        // Check if content already exists
        const existing = await prisma.dance.findUnique({
          where: { id: item.id }
        })
        
        if (existing) {
          result.skipped++
          continue
        }
        
        // Find or create creator
        let creatorId = null
        if (item.choreographer && item.choreographer !== 'Traditional') {
          let creator = await prisma.choreographer.findFirst({
            where: { name: item.choreographer }
          })
          
          if (!creator) {
            // Create creator if it doesn't exist
            creator = await prisma.choreographer.create({
              data: {
                name: item.choreographer,
                bio: item.choreographerHebrew ? `Creator: ${item.choreographerHebrew}` : null,
                region: item.region || 'Israel',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            })
            console.log(`Created creator: ${item.choreographer}`)
          }
          
          creatorId = creator.id
        }
        
        // Find or create artist based on music/singer information
        let artistId = null
        const artistName = item.music || 'Traditional'
        
        let artist = await prisma.artist.findFirst({
          where: { name: artistName }
        })
        
        if (!artist) {
          // Create artist if it doesn't exist
          artist = await prisma.artist.create({
            data: {
              name: artistName,
              bio: `Music artist: ${artistName}`,
              region: dance.region || 'Israel',
              website: null,
              imageUrl: null,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          console.log(`Created artist: ${artistName}`)
        }
        
        artistId = artist.id
        
        // Find or create a default user for dances
        let createdById = null
        const defaultUser = await prisma.user.findFirst({
          where: { email: 'system@lirkod.com' }
        })
        
        if (defaultUser) {
          createdById = defaultUser.id
        } else {
          // Create default system user if it doesn't exist
          const newUser = await prisma.user.create({
            data: {
              email: 'system@lirkod.com',
              name: 'System User',
              isInstructor: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          createdById = newUser.id
        }
        
        // Create new dance
        await prisma.dance.create({
          data: {
            id: dance.id,
            title: dance.name,
            artistId: artistId,
            choreographerId: choreographerId,
            danceType: dance.danceType || 'Israeli',
            duration: null, // We don't have duration from scraping
            audioUrl: dance.audioUrl || null,
            tempo: null, // We don't have tempo from scraping
            culturalNotes: dance.culturalNotes || null,
            description: dance.description || null,
            difficulty: this.mapDifficulty(dance.difficulty || 'Beginner'),
            region: dance.region || 'Israel',
            instructions: dance.instructions || null,
            // Hebrew and cultural information
            hebrewTitle: dance.nameHebrew || null,
            translation: dance.description || null, // Using description as translation for now
            yearCreated: dance.year || null,
            createdById: createdById,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        imported++
        console.log(`Imported dance: ${dance.name}`)
        
      } catch (error) {
        result.errors.push(`Error importing dance ${dance.name}: ${error}`)
        console.error(`Error importing dance ${dance.name}:`, error)
      }
    }
    
    return imported
  }

  /**
   * Import events into database
   */
  private async importEvents(events: any[], result: ImportResult): Promise<number> {
    let imported = 0
    
    for (const event of events) {
      try {
        // Check if event already exists
        const existing = await prisma.session.findUnique({
          where: { id: event.id }
        })
        
        if (existing) {
          result.skipped++
          continue
        }
        
        // Find or create a default user for events
        let hostId = null
        const defaultUser = await prisma.user.findFirst({
          where: { email: 'system@lirkod.com' }
        })
        
        if (defaultUser) {
          hostId = defaultUser.id
        } else {
          // Create default system user if it doesn't exist
          const newUser = await prisma.user.create({
            data: {
              email: 'system@lirkod.com',
              name: 'System User',
              isInstructor: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          hostId = newUser.id
        }
        
        // Create new session/event
        await prisma.session.create({
          data: {
            id: event.id,
            name: event.name,
            description: event.description || null,
            joinCode: this.generateJoinCode(),
            isActive: false, // Events are not active sessions by default
            currentDanceId: null,
            participantCount: 0,
            hostId: hostId,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        imported++
        console.log(`Imported event: ${event.name}`)
        
      } catch (error) {
        result.errors.push(`Error importing event ${event.name}: ${error}`)
        console.error(`Error importing event ${event.name}:`, error)
      }
    }
    
    return imported
  }

  /**
   * Map difficulty string to enum value
   */
  private mapDifficulty(difficulty: string): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'BEGINNER'
      case 'intermediate':
        return 'INTERMEDIATE'
      case 'advanced':
        return 'ADVANCED'
      default:
        return 'BEGINNER'
    }
  }

  /**
   * Generate a unique join code
   */
  private generateJoinCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  /**
   * Clear all imported data (for testing)
   */
  async clearImportedData(): Promise<void> {
    try {
      console.log('Clearing imported Israeli Dances data...')
      
      // Delete in reverse order of dependencies
      await prisma.queueItem.deleteMany({})
      await prisma.sessionDance.deleteMany({})
      await prisma.session.deleteMany({})
      await prisma.playlistDance.deleteMany({})
      await prisma.playlist.deleteMany({})
      await prisma.dance.deleteMany({})
      await prisma.choreographer.deleteMany({})
      await prisma.artist.deleteMany({})
      
      console.log('Cleared all imported data')
      
    } catch (error) {
      console.error('Error clearing imported data:', error)
      throw error
    }
  }
}

// Export singleton instance
export const israeliDancesImporter = new IsraeliDancesImporter()
