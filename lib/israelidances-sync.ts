// Content Database Integration Service
// This service handles syncing with external content databases

import { israeliDancesScraper, type ScrapedDanceData, type ScrapedChoreographerData } from './israelidances-scraper'

export interface ContentData {
  id: string
  name: string
  nameHebrew?: string
  nameChinese?: string
  choreographer: string
  choreographerHebrew?: string
  year?: number
  music?: string
  description?: string
  instructions?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  danceType?: 'Circle' | 'Line' | 'Partners' | 'Mixer' | 'Israeli' | 'International'
  region?: string
  taughtWorldwide?: boolean
  nostalgia?: boolean // Dances from 1924 onwards
  audioUrl?: string
  videoUrl?: string
  culturalNotes?: string
}

export interface ChoreographerData {
  id: string
  name: string
  nameHebrew?: string
  bio?: string
  region?: string
  website?: string
  dances?: string[] // Dance IDs
}

export interface ClassEventData {
  id: string
  name: string
  type: 'class' | 'camp' | 'event'
  location: string
  country: string
  instructor?: string
  date?: string
  description?: string
  website?: string
}

export class ContentDatabaseSync {
  private baseUrl = 'https://www.contentdatabase.com'
  
  constructor() {
    // Initialize sync service
  }

  /**
   * Fetch content data from content database using web scraping
   */
  async fetchContent(singer?: string): Promise<ContentData[]> {
    console.log(`Fetching content from content database using web scraping${singer ? ` for singer: ${singer}` : ''}...`)
    
    try {
      let scrapedData: ScrapedDanceData[]
      
      if (singer) {
        scrapedData = await israeliDancesScraper.scrapeDancesBySinger(singer)
      } else {
        scrapedData = await israeliDancesScraper.scrapeDanceSearch()
      }
      
      // Convert scraped data to our format
      const content: ContentData[] = scrapedData.map(dance => ({
        id: dance.id,
        name: dance.name,
        nameHebrew: dance.nameHebrew,
        nameChinese: dance.nameChinese,
        choreographer: dance.choreographer,
        choreographerHebrew: dance.choreographerHebrew,
        year: dance.year,
        music: dance.music,
        description: dance.description,
        instructions: dance.instructions,
        difficulty: dance.difficulty,
        danceType: dance.danceType,
        region: dance.region,
        taughtWorldwide: dance.taughtWorldwide,
        nostalgia: dance.nostalgia,
        audioUrl: dance.audioUrl,
        videoUrl: dance.videoUrl,
        culturalNotes: dance.culturalNotes
      }))

      console.log(`Fetched ${content.length} content items from content database${singer ? ` for ${singer}` : ''}`)
      return content

    } catch (error) {
      console.error('Error fetching content:', error)
      return []
    }
  }

  /**
   * Fetch creator data using web scraping
   */
  async fetchCreators(): Promise<ChoreographerData[]> {
    console.log('Fetching creators from content database using web scraping...')
    
    try {
      const scrapedData = await israeliDancesScraper.scrapeChoreographers()
      
      // Convert scraped data to our format
      const choreographers: ChoreographerData[] = scrapedData.map(choreographer => ({
        id: choreographer.id,
        name: choreographer.name,
        nameHebrew: choreographer.nameHebrew,
        bio: choreographer.bio,
        region: choreographer.region,
        website: choreographer.website,
        dances: choreographer.dances
      }))

      console.log(`Fetched ${choreographers.length} creators from content database`)
      return choreographers

    } catch (error) {
      console.error('Error fetching creators:', error)
      return []
    }
  }

  /**
   * Fetch sessions and events data using web scraping
   */
  async fetchSessionsEvents(): Promise<ClassEventData[]> {
    console.log('Fetching sessions and events from content database using web scraping...')
    
    try {
      const scrapedData = await israeliDancesScraper.scrapeClassesEvents()
      
      // Convert scraped data to our format
      const events: ClassEventData[] = scrapedData.map(event => ({
        id: event.id,
        name: event.name,
        type: event.type,
        location: event.location,
        country: event.country,
        instructor: event.instructor,
        date: event.date,
        description: event.description,
        website: event.website
      }))

      console.log(`Fetched ${events.length} events from content database`)
      return events

    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  }

  /**
   * Sync all data from content database using web scraping
   */
  async syncAll(): Promise<{
    content: number
    creators: number
    events: number
    errors: string[]
  }> {
    const errors: string[] = []
    let contentCount = 0
    let creatorsCount = 0
    let eventsCount = 0

    try {
      console.log('Starting comprehensive sync with content database...')
      
      // Use the scraper to get all data at once
      const scrapedData = await israeliDancesScraper.scrapeAll()
      
      contentCount = scrapedData.dances.length
      creatorsCount = scrapedData.choreographers.length
      eventsCount = scrapedData.events.length
      
      // Add any scraping errors
      errors.push(...scrapedData.errors)
      
      console.log(`Sync completed: ${contentCount} content items, ${creatorsCount} creators, ${eventsCount} events`)

    } catch (error) {
      errors.push(`Sync error: ${error}`)
      console.error('Error during sync:', error)
    }

    return {
      content: contentCount,
      creators: creatorsCount,
      events: eventsCount,
      errors
    }
  }

  /**
   * Search content by name (supports English, Hebrew, Chinese)
   */
  async searchContent(query: string, language: 'english' | 'hebrew' | 'chinese' = 'english'): Promise<ContentData[]> {
    console.log(`Searching content: "${query}" in ${language}`)
    
    try {
      const scrapedResults = await israeliDancesScraper.searchDances(query, language)
      
      // Convert scraped data to our format
      const content: ContentData[] = scrapedResults.map(dance => ({
        id: dance.id,
        name: dance.name,
        nameHebrew: dance.nameHebrew,
        nameChinese: dance.nameChinese,
        choreographer: dance.choreographer,
        choreographerHebrew: dance.choreographerHebrew,
        year: dance.year,
        music: dance.music,
        description: dance.description,
        instructions: dance.instructions,
        difficulty: dance.difficulty,
        danceType: dance.danceType,
        region: dance.region,
        taughtWorldwide: dance.taughtWorldwide,
        nostalgia: dance.nostalgia,
        audioUrl: dance.audioUrl,
        videoUrl: dance.videoUrl,
        culturalNotes: dance.culturalNotes
      }))

      console.log(`Found ${content.length} content items matching "${query}"`)
      return content

    } catch (error) {
      console.error('Error searching content:', error)
      return []
    }
  }

  /**
   * Get content details by ID
   */
  async getContentById(id: string): Promise<ContentData | null> {
    console.log(`Getting content details for ID: ${id}`)
    
    // TODO: Implement actual content lookup
    return null
  }
}

// Export singleton instance
export const contentDatabaseSync = new ContentDatabaseSync()
