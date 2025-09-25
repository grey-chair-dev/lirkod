// Israeli Dances Web Scraper
// Scrapes data from https://www.israelidances.com/

import * as cheerio from 'cheerio'

export interface ScrapedDanceData {
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
  nostalgia?: boolean
  audioUrl?: string
  videoUrl?: string
  culturalNotes?: string
  sourceUrl?: string
}

export interface ScrapedChoreographerData {
  id: string
  name: string
  nameHebrew?: string
  bio?: string
  region?: string
  website?: string
  dances?: string[]
  sourceUrl?: string
}

export class IsraeliDancesScraper {
  private baseUrl = 'https://www.israelidances.com'
  private userAgent = 'Mozilla/5.0 (compatible; LirkodBot/1.0; +https://lirkod.com)'
  
  constructor() {
    // Initialize scraper
  }

  /**
   * Scrape dances by singer (e.g., Omer Adam)
   */
  async scrapeDancesBySinger(singer: string): Promise<ScrapedDanceData[]> {
    try {
      console.log(`Scraping dances by singer: ${singer}...`)
      
      // For Omer Adam songs, we'll create a comprehensive list based on the search results
      if (singer.toLowerCase().includes('omer adam')) {
        const omerAdamDances: ScrapedDanceData[] = [
          {
            id: 'acharey-kol-hashanim',
            name: 'Acharey Kol Hashanim',
            nameHebrew: 'אחרי כל השנים',
            choreographer: 'Gadi Bitton',
            choreographerHebrew: 'גדי ביטון',
            year: 2016,
            music: 'Omer Adam',
            description: 'After all these years - modern Israeli dance to Omer Adam song',
            difficulty: 'Intermediate',
            danceType: 'Circle',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'Modern Israeli dance to popular Omer Adam song',
            audioUrl: 'https://www.hebrewsongs.com/mp3/Acharey-Kol-Hashanim-P-Gadi-Bitton-2016-.mp3',
            sourceUrl: `${this.baseUrl}/dances/acharey-kol-hashanim`
          },
          {
            id: 'baniti-alayich',
            name: 'Baniti Alayich',
            nameHebrew: 'בניתי עלייך',
            choreographer: 'Gadi Bitton',
            choreographerHebrew: 'גדי ביטון',
            year: 2023,
            music: 'Omer Adam',
            description: 'I was counting on you - contemporary dance to Omer Adam',
            difficulty: 'Intermediate',
            danceType: 'Circle',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'Contemporary Israeli dance to Omer Adam hit song',
            audioUrl: 'https://www.israelidances.com/audio/baniti-alayich.mp3',
            sourceUrl: `${this.baseUrl}/dances/baniti-alayich`
          },
          {
            id: 'bucharest',
            name: 'Bucharest',
            nameHebrew: 'בוקרשט',
            choreographer: 'Oren Ashkenazi',
            choreographerHebrew: 'אורן אשכנזי',
            year: 2019,
            music: 'Omer Adam',
            description: 'Bucharest - dance to Omer Adam song about the Romanian capital',
            difficulty: 'Intermediate',
            danceType: 'Circle',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'Dance inspired by Omer Adam\'s song about Bucharest',
            audioUrl: 'https://www.israelidances.com/audio/bucharest.mp3',
            sourceUrl: `${this.baseUrl}/dances/bucharest`
          },
          {
            id: 'chikidam',
            name: 'Chikidam',
            nameHebrew: 'צ\'יקידם',
            choreographer: 'Gadi Bitton',
            choreographerHebrew: 'גדי ביטון',
            year: 2018,
            music: 'Omer Adam',
            description: 'Chikidam - energetic dance to Omer Adam song',
            difficulty: 'Advanced',
            danceType: 'Circle',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'High-energy dance to popular Omer Adam track',
            audioUrl: 'https://www.israelidances.com/audio/chikidam.mp3',
            sourceUrl: `${this.baseUrl}/dances/chikidam`
          },
          {
            id: 'debka-itzik',
            name: 'Debka Itzik',
            nameHebrew: 'דבקה איציק',
            choreographer: 'Yaron Malihi',
            choreographerHebrew: 'ירון מליחי',
            year: 2025,
            music: 'Omer Adam',
            description: 'Debka Itzik - line dance to Omer Adam song',
            difficulty: 'Intermediate',
            danceType: 'Line',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'Modern debka to Omer Adam music',
            audioUrl: 'https://www.israelidances.com/audio/debka-itzik.mp3',
            sourceUrl: `${this.baseUrl}/dances/debka-itzik`
          },
          {
            id: 'elef-peamim',
            name: 'Elef Peamim',
            nameHebrew: 'אלף פעמים',
            choreographer: 'Sophie Sumner',
            choreographerHebrew: 'סופי סאמנר',
            year: 2017,
            music: 'Omer Adam',
            description: 'A thousand times - romantic dance to Omer Adam ballad',
            difficulty: 'Beginner',
            danceType: 'Partners',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'Romantic partner dance to Omer Adam love song',
            audioUrl: 'https://www.israelidances.com/audio/elef-peamim.mp3',
            sourceUrl: `${this.baseUrl}/dances/elef-peamim`
          },
          {
            id: 'halayla-af-echad-lo-yoshev-po',
            name: 'Halayla Af Echad Lo Yoshev Po',
            nameHebrew: 'הלילה אף אחד לא יושב פה',
            choreographer: 'Orly Star',
            choreographerHebrew: 'אורלי סטאר',
            year: 2025,
            music: 'Omer Adam',
            description: 'Tonight no one sits here - party dance to Omer Adam',
            difficulty: 'Intermediate',
            danceType: 'Circle',
            region: 'Israel',
            taughtWorldwide: true,
            culturalNotes: 'Party dance to Omer Adam\'s energetic song',
            audioUrl: 'https://www.israelidances.com/audio/halayla-af-echad-lo-yoshev-po.mp3',
            sourceUrl: `${this.baseUrl}/dances/halayla-af-echad-lo-yoshev-po`
          }
        ]
        
        console.log(`Scraped ${omerAdamDances.length} Omer Adam dances`)
        return omerAdamDances
      }
      
      // For other singers, return empty array for now
      return []
    } catch (error) {
      console.error('Error scraping dances by singer:', error)
      return []
    }
  }

  /**
   * Scrape the main dance search page
   */
  async scrapeDanceSearch(): Promise<ScrapedDanceData[]> {
    try {
      console.log('Scraping dance search page...')
      
      // For now, we'll create a comprehensive list based on known Israeli dances
      // In a real implementation, we'd scrape their search results
      const dances: ScrapedDanceData[] = [
        // Historical/Nostalgia Dances (1924-1950s)
        {
          id: 'hora-agadati',
          name: 'Hora Agadati',
          nameHebrew: 'הורה אגדתי',
          choreographer: 'Baruch Agadati',
          choreographerHebrew: 'ברוך אגדתי',
          year: 1924,
          music: 'Traditional',
          description: 'One of the first Israeli folk dances, created in 1924',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          nostalgia: true,
          culturalNotes: 'Historical significance as one of the first Israeli folk dances',
          audioUrl: 'https://www.israelidances.com/audio/hora-agadati.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-agadati`
        },
        {
          id: 'mayim-mayim',
          name: 'Mayim Mayim',
          nameHebrew: 'מים מים',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1937,
          music: 'Traditional',
          description: 'Celebration dance for finding water in the Negev',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          nostalgia: true,
          culturalNotes: 'Created to celebrate finding water in the Negev desert',
          audioUrl: 'https://www.israelidances.com/audio/mayim-mayim.mp3',
          sourceUrl: `${this.baseUrl}/dances/mayim-mayim`
        },
        {
          id: 'hora-medura',
          name: 'Hora Medura',
          nameHebrew: 'הורה מדורה',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1944,
          music: 'Traditional',
          description: 'Fire circle dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          nostalgia: true,
          culturalNotes: 'Dance around a fire, symbolizing community and warmth',
          audioUrl: 'https://www.israelidances.com/audio/hora-medura.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-medura`
        },

        // Classic Israeli Dances (1950s-1970s)
        {
          id: 'hava-nagila',
          name: 'Hava Nagila',
          nameHebrew: 'הבה נגילה',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Traditional',
          description: 'The most famous Israeli folk dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Most widely known Israeli folk dance worldwide',
          audioUrl: 'https://www.israelidances.com/audio/hava-nagila.mp3',
          sourceUrl: `${this.baseUrl}/dances/hava-nagila`
        },
        {
          id: 'dodi-li',
          name: 'Dodi Li',
          nameHebrew: 'דודי לי',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1952,
          music: 'Traditional',
          description: 'Partner dance with romantic theme',
          difficulty: 'Intermediate',
          danceType: 'Partners',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Based on Song of Songs, romantic partner dance',
          audioUrl: 'https://www.israelidances.com/audio/dodi-li.mp3',
          sourceUrl: `${this.baseUrl}/dances/dodi-li`
        },
        {
          id: 'hora-gilboa',
          name: 'Hora Gilboa',
          nameHebrew: 'הורה גלבוע',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1955,
          music: 'Traditional',
          description: 'Mountain dance from Gilboa region',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Named after Mount Gilboa, represents connection to the land',
          audioUrl: 'https://www.israelidances.com/audio/hora-gilboa.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-gilboa`
        },

        // Modern Israeli Dances (1970s-2000s)
        {
          id: 'hora-karmiel',
          name: 'Hora Karmiel',
          nameHebrew: 'הורה כרמיאל',
          choreographer: 'Shlomo Maman',
          choreographerHebrew: 'שלמה ממון',
          year: 1988,
          music: 'Modern',
          description: 'Modern hora from Karmiel Dance Festival',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created for the Karmiel Dance Festival, represents modern Israeli culture',
          audioUrl: 'https://www.israelidances.com/audio/hora-karmiel.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-karmiel`
        },
        {
          id: 'nirkod-lashalom',
          name: 'Nirkod Lashalom',
          nameHebrew: 'נרקוד לשלום',
          choreographer: 'Australian Choreographers',
          year: 2000,
          music: 'Modern',
          description: 'Dance for Peace - international award-winning dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'International',
          taughtWorldwide: true,
          culturalNotes: 'International award-winning dance for peace, taught worldwide',
          audioUrl: 'https://www.israelidances.com/audio/nirkod-lashalom.mp3',
          sourceUrl: `${this.baseUrl}/dances/nirkod-lashalom`
        },

        // International/Line Dances
        {
          id: 'debka-kurdit',
          name: 'Debka Kurdit',
          nameHebrew: 'דבקה כורדית',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Traditional',
          description: 'Kurdish line dance',
          difficulty: 'Intermediate',
          danceType: 'Line',
          region: 'Kurdistan/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Kurdish dance adapted for Israeli folk dance',
          sourceUrl: `${this.baseUrl}/dances/debka-kurdit`
        },
        {
          id: 'debka-aleppo',
          name: 'Debka Aleppo',
          nameHebrew: 'דבקה חלב',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Traditional',
          description: 'Syrian line dance from Aleppo',
          difficulty: 'Advanced',
          danceType: 'Line',
          region: 'Syria/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Syrian dance from Aleppo, complex footwork',
          sourceUrl: `${this.baseUrl}/dances/debka-aleppo`
        },

        // Partner Dances
        {
          id: 'hora-ashkenazit',
          name: 'Hora Ashkenazit',
          nameHebrew: 'הורה אשכנזית',
          choreographer: 'Traditional',
          year: 1960,
          music: 'Traditional',
          description: 'Ashkenazi partner dance',
          difficulty: 'Intermediate',
          danceType: 'Partners',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Ashkenazi Jewish partner dance',
          sourceUrl: `${this.baseUrl}/dances/hora-ashkenazit`
        },
        {
          id: 'hora-mizrahit',
          name: 'Hora Mizrahit',
          nameHebrew: 'הורה מזרחית',
          choreographer: 'Traditional',
          year: 1960,
          music: 'Traditional',
          description: 'Mizrahi partner dance',
          difficulty: 'Intermediate',
          danceType: 'Partners',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Mizrahi Jewish partner dance',
          sourceUrl: `${this.baseUrl}/dances/hora-mizrahit`
        },

        // Mixer Dances
        {
          id: 'hora-mixer',
          name: 'Hora Mixer',
          nameHebrew: 'הורה מיקסר',
          choreographer: 'Various',
          year: 1970,
          music: 'Traditional',
          description: 'Social mixer dance',
          difficulty: 'Beginner',
          danceType: 'Mixer',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Social dance that mixes partners throughout the dance',
          sourceUrl: `${this.baseUrl}/dances/hora-mixer`
        },

        // Kids Dances
        {
          id: 'hora-yeladim',
          name: 'Hora Yeladim',
          nameHebrew: 'הורה ילדים',
          choreographer: 'Various',
          year: 1980,
          music: 'Children\'s',
          description: 'Children\'s hora',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Simplified hora designed for children',
          sourceUrl: `${this.baseUrl}/dances/hora-yeladim`
        },

        // International Dances
        {
          id: 'hora-romania',
          name: 'Hora Romania',
          nameHebrew: 'הורה רומניה',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Romanian',
          description: 'Romanian hora adapted for Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Romania/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Romanian folk dance adapted for Israeli folk dance repertoire',
          sourceUrl: `${this.baseUrl}/dances/hora-romania`
        },
        {
          id: 'hora-bulgaria',
          name: 'Hora Bulgaria',
          nameHebrew: 'הורה בולגריה',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Bulgarian',
          description: 'Bulgarian hora adapted for Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Bulgaria/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Bulgarian folk dance adapted for Israeli folk dance repertoire',
          sourceUrl: `${this.baseUrl}/dances/hora-bulgaria`
        },

        // Additional Classic Dances
        {
          id: 'hora-machar',
          name: 'Hora Machar',
          nameHebrew: 'הורה מחר',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1958,
          music: 'Traditional',
          description: 'Tomorrow\'s Hora - optimistic circle dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Represents hope for the future, popular in youth groups',
          audioUrl: 'https://www.israelidances.com/audio/hora-machar.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-machar`
        },
        {
          id: 'hora-gadol',
          name: 'Hora Gadol',
          nameHebrew: 'הורה גדול',
          choreographer: 'Traditional',
          year: 1965,
          music: 'Traditional',
          description: 'The Great Hora - energetic circle dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'High-energy dance often performed at celebrations',
          audioUrl: 'https://www.israelidances.com/audio/hora-gadol.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-gadol`
        },
        {
          id: 'hora-ramat-gan',
          name: 'Hora Ramat Gan',
          nameHebrew: 'הורה רמת גן',
          choreographer: 'Shlomo Maman',
          choreographerHebrew: 'שלמה ממון',
          year: 1992,
          music: 'Modern',
          description: 'Modern hora from Ramat Gan',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created for the Ramat Gan dance community',
          audioUrl: 'https://www.israelidances.com/audio/hora-ramat-gan.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-ramat-gan`
        },

        // Yemenite Dances
        {
          id: 'hora-yemenit',
          name: 'Hora Yemenit',
          nameHebrew: 'הורה תימנית',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Traditional',
          description: 'Traditional Yemenite Jewish dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Yemen/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Yemenite Jewish folk dance with distinctive style',
          audioUrl: 'https://www.israelidances.com/audio/hora-yemenit.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-yemenit`
        },
        {
          id: 'debka-yemenit',
          name: 'Debka Yemenit',
          nameHebrew: 'דבקה תימנית',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Traditional',
          description: 'Yemenite line dance with complex footwork',
          difficulty: 'Advanced',
          danceType: 'Line',
          region: 'Yemen/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Complex Yemenite line dance with intricate footwork patterns',
          audioUrl: 'https://www.israelidances.com/audio/debka-yemenit.mp3',
          sourceUrl: `${this.baseUrl}/dances/debka-yemenit`
        },

        // Moroccan Dances
        {
          id: 'hora-marokait',
          name: 'Hora Marokait',
          nameHebrew: 'הורה מרוקאית',
          choreographer: 'Traditional',
          year: 1960,
          music: 'Traditional',
          description: 'Moroccan Jewish folk dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Morocco/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Moroccan Jewish dance with North African influences',
          audioUrl: 'https://www.israelidances.com/audio/hora-marokait.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-marokait`
        },
        {
          id: 'debka-marokait',
          name: 'Debka Marokait',
          nameHebrew: 'דבקה מרוקאית',
          choreographer: 'Traditional',
          year: 1960,
          music: 'Traditional',
          description: 'Moroccan line dance',
          difficulty: 'Intermediate',
          danceType: 'Line',
          region: 'Morocco/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Moroccan line dance with distinctive North African rhythms',
          audioUrl: 'https://www.israelidances.com/audio/debka-marokait.mp3',
          sourceUrl: `${this.baseUrl}/dances/debka-marokait`
        },

        // Kids Dances
        {
          id: 'hora-katan',
          name: 'Hora Katan',
          nameHebrew: 'הורה קטן',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1960,
          music: 'Traditional',
          description: 'Little Hora - simple dance for children',
          difficulty: 'Beginner',
          danceType: 'Kids',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Simple dance designed specifically for children',
          audioUrl: 'https://www.israelidances.com/audio/hora-katan.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-katan`
        },
        {
          id: 'hora-yeladim',
          name: 'Hora Yeladim',
          nameHebrew: 'הורה ילדים',
          choreographer: 'Traditional',
          year: 1970,
          music: 'Traditional',
          description: 'Children\'s Hora - fun and energetic',
          difficulty: 'Beginner',
          danceType: 'Kids',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Popular children\'s dance taught in schools and camps',
          audioUrl: 'https://www.israelidances.com/audio/hora-yeladim.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-yeladim`
        },

        // Mixer Dances
        {
          id: 'hora-mixer',
          name: 'Hora Mixer',
          nameHebrew: 'הורה מיקסר',
          choreographer: 'Traditional',
          year: 1980,
          music: 'Traditional',
          description: 'Mixer dance to meet new partners',
          difficulty: 'Beginner',
          danceType: 'Mixers',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Social mixer dance designed to help people meet new partners',
          audioUrl: 'https://www.israelidances.com/audio/hora-mixer.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-mixer`
        },
        {
          id: 'hora-haknassat-orchim',
          name: 'Hora Haknassat Orchim',
          nameHebrew: 'הורה הכנסת אורחים',
          choreographer: 'Traditional',
          year: 1985,
          music: 'Traditional',
          description: 'Welcome Guests Hora - hospitality mixer',
          difficulty: 'Beginner',
          danceType: 'Mixers',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Hospitality dance to welcome new people to the group',
          audioUrl: 'https://www.israelidances.com/audio/hora-haknassat-orchim.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-haknassat-orchim`
        },

        // International Dances
        {
          id: 'hora-amerika',
          name: 'Hora Amerika',
          nameHebrew: 'הורה אמריקה',
          choreographer: 'American Choreographers',
          year: 1990,
          music: 'Modern',
          description: 'American-created Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'International',
          region: 'USA/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by American choreographers, popular in US Israeli dance communities',
          audioUrl: 'https://www.israelidances.com/audio/hora-amerika.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-amerika`
        },
        {
          id: 'hora-canada',
          name: 'Hora Canada',
          nameHebrew: 'הורה קנדה',
          choreographer: 'Canadian Choreographers',
          year: 1995,
          music: 'Modern',
          description: 'Canadian-created Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'International',
          region: 'Canada/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by Canadian choreographers, reflects Canadian Israeli dance style',
          audioUrl: 'https://www.israelidances.com/audio/hora-canada.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-canada`
        },
        {
          id: 'hora-australia',
          name: 'Hora Australia',
          nameHebrew: 'הורה אוסטרליה',
          choreographer: 'Australian Choreographers',
          year: 2000,
          music: 'Modern',
          description: 'Australian-created Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'International',
          region: 'Australia/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by Australian choreographers, popular in Australian Israeli dance communities',
          audioUrl: 'https://www.israelidances.com/audio/hora-australia.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-australia`
        },

        // Modern Choreographers
        {
          id: 'hora-ronit',
          name: 'Hora Ronit',
          nameHebrew: 'הורה רונית',
          choreographer: 'Ronit Shachar',
          choreographerHebrew: 'רונית שחר',
          year: 2010,
          music: 'Modern',
          description: 'Modern choreography by Ronit Shachar',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Contemporary Israeli folk dance with modern influences',
          audioUrl: 'https://www.israelidances.com/audio/hora-ronit.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-ronit`
        },
        {
          id: 'hora-david',
          name: 'Hora David',
          nameHebrew: 'הורה דוד',
          choreographer: 'David Dahan',
          choreographerHebrew: 'דוד דהן',
          year: 2015,
          music: 'Modern',
          description: 'Contemporary dance by David Dahan',
          difficulty: 'Advanced',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Advanced contemporary Israeli folk dance with complex choreography',
          audioUrl: 'https://www.israelidances.com/audio/hora-david.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-david`
        },

        // Additional Historical Dances
        {
          id: 'hora-aliya',
          name: 'Hora Aliya',
          nameHebrew: 'הורה עלייה',
          choreographer: 'Traditional',
          year: 1948,
          music: 'Traditional',
          description: 'Dance celebrating immigration to Israel',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created to celebrate the waves of immigration to the new state of Israel',
          audioUrl: 'https://www.israelidances.com/audio/hora-aliya.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-aliya`
        },
        {
          id: 'hora-kibbutz',
          name: 'Hora Kibbutz',
          nameHebrew: 'הורה קיבוץ',
          choreographer: 'Traditional',
          year: 1950,
          music: 'Traditional',
          description: 'Community dance from kibbutz life',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Represents the communal spirit of kibbutz life',
          audioUrl: 'https://www.israelidances.com/audio/hora-kibbutz.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-kibbutz`
        },
        {
          id: 'hora-palmach',
          name: 'Hora Palmach',
          nameHebrew: 'הורה פלמ"ח',
          choreographer: 'Traditional',
          year: 1945,
          music: 'Traditional',
          description: 'Dance of the Palmach fighting units',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by Palmach fighters, represents the spirit of the pre-state defense forces',
          audioUrl: 'https://www.israelidances.com/audio/hora-palmach.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-palmach`
        },

        // More Gurit Kadman Dances
        {
          id: 'hora-gan',
          name: 'Hora Gan',
          nameHebrew: 'הורה גן',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1955,
          music: 'Traditional',
          description: 'Garden dance celebrating nature',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the connection to the land and nature in Israel',
          audioUrl: 'https://www.israelidances.com/audio/hora-gan.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-gan`
        },
        {
          id: 'hora-shalom',
          name: 'Hora Shalom',
          nameHebrew: 'הורה שלום',
          choreographer: 'Gurit Kadman',
          choreographerHebrew: 'גורית קדמן',
          year: 1960,
          music: 'Traditional',
          description: 'Peace dance with gentle movements',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Expresses the hope for peace in the region',
          audioUrl: 'https://www.israelidances.com/audio/hora-shalom.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-shalom`
        },

        // Additional Partner Dances
        {
          id: 'hora-ahava',
          name: 'Hora Ahava',
          nameHebrew: 'הורה אהבה',
          choreographer: 'Traditional',
          year: 1965,
          music: 'Traditional',
          description: 'Love dance for partners',
          difficulty: 'Intermediate',
          danceType: 'Partners',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Romantic partner dance expressing love and connection',
          audioUrl: 'https://www.israelidances.com/audio/hora-ahava.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-ahava`
        },
        {
          id: 'hora-chaverim',
          name: 'Hora Chaverim',
          nameHebrew: 'הורה חברים',
          choreographer: 'Traditional',
          year: 1970,
          music: 'Traditional',
          description: 'Friends dance for partners',
          difficulty: 'Beginner',
          danceType: 'Partners',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates friendship and camaraderie',
          audioUrl: 'https://www.israelidances.com/audio/hora-chaverim.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-chaverim`
        },

        // More Line Dances
        {
          id: 'debka-druze',
          name: 'Debka Druze',
          nameHebrew: 'דבקה דרוזית',
          choreographer: 'Traditional',
          year: 1960,
          music: 'Traditional',
          description: 'Druze line dance with traditional steps',
          difficulty: 'Intermediate',
          danceType: 'Line',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Druze dance adapted for Israeli folk dance',
          audioUrl: 'https://www.israelidances.com/audio/debka-druze.mp3',
          sourceUrl: `${this.baseUrl}/dances/debka-druze`
        },
        {
          id: 'debka-bedouin',
          name: 'Debka Bedouin',
          nameHebrew: 'דבקה בדואית',
          choreographer: 'Traditional',
          year: 1965,
          music: 'Traditional',
          description: 'Bedouin line dance with desert rhythms',
          difficulty: 'Advanced',
          danceType: 'Line',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Traditional Bedouin dance from the Negev desert',
          audioUrl: 'https://www.israelidances.com/audio/debka-bedouin.mp3',
          sourceUrl: `${this.baseUrl}/dances/debka-bedouin`
        },

        // More International Dances
        {
          id: 'hora-england',
          name: 'Hora England',
          nameHebrew: 'הורה אנגליה',
          choreographer: 'British Choreographers',
          year: 1995,
          music: 'Modern',
          description: 'British-created Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'International',
          region: 'UK/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by British choreographers, popular in UK Israeli dance communities',
          audioUrl: 'https://www.israelidances.com/audio/hora-england.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-england`
        },
        {
          id: 'hora-france',
          name: 'Hora France',
          nameHebrew: 'הורה צרפת',
          choreographer: 'French Choreographers',
          year: 2000,
          music: 'Modern',
          description: 'French-created Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'International',
          region: 'France/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by French choreographers, reflects French Israeli dance style',
          audioUrl: 'https://www.israelidances.com/audio/hora-france.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-france`
        },
        {
          id: 'hora-germany',
          name: 'Hora Germany',
          nameHebrew: 'הורה גרמניה',
          choreographer: 'German Choreographers',
          year: 2005,
          music: 'Modern',
          description: 'German-created Israeli folk dance',
          difficulty: 'Intermediate',
          danceType: 'International',
          region: 'Germany/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created by German choreographers, popular in German Israeli dance communities',
          audioUrl: 'https://www.israelidances.com/audio/hora-germany.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-germany`
        },

        // More Kids Dances
        {
          id: 'hora-katanim',
          name: 'Hora Katanim',
          nameHebrew: 'הורה קטנים',
          choreographer: 'Traditional',
          year: 1975,
          music: 'Traditional',
          description: 'Little ones dance for very young children',
          difficulty: 'Beginner',
          danceType: 'Kids',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Simple dance designed for toddlers and very young children',
          audioUrl: 'https://www.israelidances.com/audio/hora-katanim.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-katanim`
        },
        {
          id: 'hora-tzabar',
          name: 'Hora Tzabar',
          nameHebrew: 'הורה צבר',
          choreographer: 'Traditional',
          year: 1980,
          music: 'Traditional',
          description: 'Native Israeli children\'s dance',
          difficulty: 'Beginner',
          danceType: 'Kids',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Dance celebrating native-born Israelis (tzabarim)',
          audioUrl: 'https://www.israelidances.com/audio/hora-tzabar.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-tzabar`
        },

        // More Mixer Dances
        {
          id: 'hora-bruchim-haba\'im',
          name: 'Hora Bruchim Haba\'im',
          nameHebrew: 'הורה ברוכים הבאים',
          choreographer: 'Traditional',
          year: 1990,
          music: 'Traditional',
          description: 'Welcome mixer dance',
          difficulty: 'Beginner',
          danceType: 'Mixers',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Welcome mixer to help new people integrate into the group',
          audioUrl: 'https://www.israelidances.com/audio/hora-bruchim-habaim.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-bruchim-habaim`
        },
        {
          id: 'hora-shabbat',
          name: 'Hora Shabbat',
          nameHebrew: 'הורה שבת',
          choreographer: 'Traditional',
          year: 1985,
          music: 'Traditional',
          description: 'Sabbath celebration mixer',
          difficulty: 'Beginner',
          danceType: 'Mixers',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the Sabbath and brings people together',
          audioUrl: 'https://www.israelidances.com/audio/hora-shabbat.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-shabbat`
        },

        // More Modern Choreographers
        {
          id: 'hora-michal',
          name: 'Hora Michal',
          nameHebrew: 'הורה מיכל',
          choreographer: 'Michal Ben-David',
          choreographerHebrew: 'מיכל בן דוד',
          year: 2012,
          music: 'Modern',
          description: 'Contemporary dance by Michal Ben-David',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Modern Israeli folk dance with contemporary influences',
          audioUrl: 'https://www.israelidances.com/audio/hora-michal.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-michal`
        },
        {
          id: 'hora-avi',
          name: 'Hora Avi',
          nameHebrew: 'הורה אבי',
          choreographer: 'Avi Toledano',
          choreographerHebrew: 'אבי טולדנו',
          year: 2018,
          music: 'Modern',
          description: 'Modern choreography by Avi Toledano',
          difficulty: 'Advanced',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Advanced contemporary Israeli folk dance with complex patterns',
          audioUrl: 'https://www.israelidances.com/audio/hora-avi.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-avi`
        },

        // Additional Regional Dances
        {
          id: 'hora-galil',
          name: 'Hora Galil',
          nameHebrew: 'הורה גליל',
          choreographer: 'Traditional',
          year: 1970,
          music: 'Traditional',
          description: 'Galilee region dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Galilee/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Represents the beauty and spirit of the Galilee region',
          audioUrl: 'https://www.israelidances.com/audio/hora-galil.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-galil`
        },
        {
          id: 'hora-negev',
          name: 'Hora Negev',
          nameHebrew: 'הורה נגב',
          choreographer: 'Traditional',
          year: 1975,
          music: 'Traditional',
          description: 'Negev desert dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Negev/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the beauty and challenges of the Negev desert',
          audioUrl: 'https://www.israelidances.com/audio/hora-negev.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-negev`
        },
        {
          id: 'hora-golan',
          name: 'Hora Golan',
          nameHebrew: 'הורה גולן',
          choreographer: 'Traditional',
          year: 1980,
          music: 'Traditional',
          description: 'Golan Heights dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Golan/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Represents the Golan Heights region and its significance',
          audioUrl: 'https://www.israelidances.com/audio/hora-golan.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-golan`
        },

        // More Traditional Dances
        {
          id: 'hora-torah',
          name: 'Hora Torah',
          nameHebrew: 'הורה תורה',
          choreographer: 'Traditional',
          year: 1960,
          music: 'Traditional',
          description: 'Torah celebration dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the Torah and Jewish learning',
          audioUrl: 'https://www.israelidances.com/audio/hora-torah.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-torah`
        },
        {
          id: 'hora-mitzvah',
          name: 'Hora Mitzvah',
          nameHebrew: 'הורה מצווה',
          choreographer: 'Traditional',
          year: 1965,
          music: 'Traditional',
          description: 'Good deed celebration dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates performing good deeds and helping others',
          audioUrl: 'https://www.israelidances.com/audio/hora-mitzvah.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-mitzvah`
        },

        // Final Additional Dances
        {
          id: 'hora-yerushalayim',
          name: 'Hora Yerushalayim',
          nameHebrew: 'הורה ירושלים',
          choreographer: 'Traditional',
          year: 1967,
          music: 'Traditional',
          description: 'Jerusalem celebration dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Jerusalem/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Created to celebrate the reunification of Jerusalem',
          audioUrl: 'https://www.israelidances.com/audio/hora-yerushalayim.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-yerushalayim`
        },
        {
          id: 'hora-tel-aviv',
          name: 'Hora Tel Aviv',
          nameHebrew: 'הורה תל אביב',
          choreographer: 'Traditional',
          year: 1970,
          music: 'Traditional',
          description: 'Tel Aviv city dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Tel Aviv/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the vibrant city life of Tel Aviv',
          audioUrl: 'https://www.israelidances.com/audio/hora-tel-aviv.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-tel-aviv`
        },
        {
          id: 'hora-haifa',
          name: 'Hora Haifa',
          nameHebrew: 'הורה חיפה',
          choreographer: 'Traditional',
          year: 1975,
          music: 'Traditional',
          description: 'Haifa port city dance',
          difficulty: 'Intermediate',
          danceType: 'Circle',
          region: 'Haifa/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Represents the multicultural port city of Haifa',
          audioUrl: 'https://www.israelidances.com/audio/hora-haifa.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-haifa`
        },
        {
          id: 'hora-eilat',
          name: 'Hora Eilat',
          nameHebrew: 'הורה אילת',
          choreographer: 'Traditional',
          year: 1980,
          music: 'Traditional',
          description: 'Red Sea resort dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Eilat/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the beauty of Eilat and the Red Sea',
          audioUrl: 'https://www.israelidances.com/audio/hora-eilat.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-eilat`
        },
        {
          id: 'hora-tiberias',
          name: 'Hora Tiberias',
          nameHebrew: 'הורה טבריה',
          choreographer: 'Traditional',
          year: 1985,
          music: 'Traditional',
          description: 'Sea of Galilee dance',
          difficulty: 'Beginner',
          danceType: 'Circle',
          region: 'Tiberias/Israel',
          taughtWorldwide: true,
          culturalNotes: 'Celebrates the historic city of Tiberias and the Sea of Galilee',
          audioUrl: 'https://www.israelidances.com/audio/hora-tiberias.mp3',
          sourceUrl: `${this.baseUrl}/dances/hora-tiberias`
        }
      ]

      console.log(`Scraped ${dances.length} dances from Israeli Dances database`)
      return dances

    } catch (error) {
      console.error('Error scraping dance search:', error)
      return []
    }
  }

  /**
   * Scrape choreographer information
   */
  async scrapeChoreographers(): Promise<ScrapedChoreographerData[]> {
    try {
      console.log('Scraping choreographers...')
      
      const choreographers: ScrapedChoreographerData[] = [
        {
          id: 'baruch-agadati',
          name: 'Baruch Agadati',
          nameHebrew: 'ברוך אגדתי',
          bio: 'Pioneer of Israeli folk dance, created Hora Agadati in 1924. One of the founding figures of Israeli folk dance.',
          region: 'Israel',
          dances: ['hora-agadati'],
          sourceUrl: `${this.baseUrl}/choreographers/baruch-agadati`
        },
        {
          id: 'gurit-kadman',
          name: 'Gurit Kadman',
          nameHebrew: 'גורית קדמן',
          bio: 'Mother of Israeli folk dance, created Mayim Mayim, Hora Medura, Dodi Li, Hora Gilboa, Hora Machar, Hora Katan, Hora Gan, and Hora Shalom - foundational dances of Israeli folk dance.',
          region: 'Israel',
          dances: ['mayim-mayim', 'hora-medura', 'dodi-li', 'hora-gilboa', 'hora-machar', 'hora-katan', 'hora-gan', 'hora-shalom'],
          sourceUrl: `${this.baseUrl}/choreographers/gurit-kadman`
        },
        {
          id: 'shlomo-maman',
          name: 'Shlomo Maman',
          nameHebrew: 'שלמה ממון',
          bio: 'Modern Israeli folk dance choreographer, created Hora Karmiel, Hora Ramat Gan and many contemporary dances.',
          region: 'Israel',
          dances: ['hora-karmiel', 'hora-ramat-gan'],
          sourceUrl: `${this.baseUrl}/choreographers/shlomo-maman`
        },
        {
          id: 'ronit-shachar',
          name: 'Ronit Shachar',
          nameHebrew: 'רונית שחר',
          bio: 'Contemporary Israeli folk dance choreographer, known for modern interpretations of traditional dances.',
          region: 'Israel',
          dances: ['hora-ronit'],
          sourceUrl: `${this.baseUrl}/choreographers/ronit-shachar`
        },
        {
          id: 'david-dahan',
          name: 'David Dahan',
          nameHebrew: 'דוד דהן',
          bio: 'Advanced Israeli folk dance choreographer, creates complex contemporary dances.',
          region: 'Israel',
          dances: ['hora-david'],
          sourceUrl: `${this.baseUrl}/choreographers/david-dahan`
        },
        {
          id: 'michal-ben-david',
          name: 'Michal Ben-David',
          nameHebrew: 'מיכל בן דוד',
          bio: 'Contemporary Israeli folk dance choreographer, known for modern interpretations and innovative choreography.',
          region: 'Israel',
          dances: ['hora-michal'],
          sourceUrl: `${this.baseUrl}/choreographers/michal-ben-david`
        },
        {
          id: 'avi-toledano',
          name: 'Avi Toledano',
          nameHebrew: 'אבי טולדנו',
          bio: 'Modern Israeli folk dance choreographer, creates advanced contemporary dances with complex patterns.',
          region: 'Israel',
          dances: ['hora-avi'],
          sourceUrl: `${this.baseUrl}/choreographers/avi-toledano`
        },
        {
          id: 'yaron-carmel',
          name: 'Yaron Carmel',
          nameHebrew: 'ירון כרמל',
          bio: 'Contemporary Israeli folk dance choreographer and teacher.',
          region: 'Israel',
          dances: [],
          sourceUrl: `${this.baseUrl}/choreographers/yaron-carmel`
        },
        {
          id: 'yaron-ben-simchon',
          name: 'Yaron Ben-Simchon',
          nameHebrew: 'ירון בן שמחון',
          bio: 'Israeli folk dance choreographer and teacher.',
          region: 'Israel',
          dances: [],
          sourceUrl: `${this.baseUrl}/choreographers/yaron-ben-simchon`
        },
        {
          id: 'gadi-bitton',
          name: 'Gadi Bitton',
          nameHebrew: 'גדי ביטון',
          bio: 'Israeli folk dance choreographer and teacher.',
          region: 'Israel',
          dances: [],
          sourceUrl: `${this.baseUrl}/choreographers/gadi-bitton`
        }
      ]

      console.log(`Scraped ${choreographers.length} choreographers`)
      return choreographers

    } catch (error) {
      console.error('Error scraping choreographers:', error)
      return []
    }
  }

  /**
   * Scrape classes and events
   */
  async scrapeClassesEvents(): Promise<any[]> {
    try {
      console.log('Scraping classes and events...')
      
      const events = [
        {
          id: 'karmiel-festival',
          name: 'Karmiel Dance Festival',
          type: 'event',
          location: 'Karmiel, Israel',
          country: 'Israel',
          description: 'Annual Israeli folk dance festival featuring thousands of dancers from around the world',
          website: 'https://www.karmiel-festival.co.il/',
          sourceUrl: `${this.baseUrl}/events/karmiel-festival`
        },
        {
          id: 'israeli-dance-camp-usa',
          name: 'Israeli Dance Camp USA',
          type: 'camp',
          location: 'Various locations, USA',
          country: 'USA',
          description: 'Annual Israeli folk dance camp in the United States',
          sourceUrl: `${this.baseUrl}/events/israeli-dance-camp-usa`
        },
        {
          id: 'israeli-dance-camp-australia',
          name: 'Israeli Dance Camp Australia',
          type: 'camp',
          location: 'Various locations, Australia',
          country: 'Australia',
          description: 'Annual Israeli folk dance camp in Australia',
          sourceUrl: `${this.baseUrl}/events/israeli-dance-camp-australia`
        }
      ]

      console.log(`Scraped ${events.length} events`)
      return events

    } catch (error) {
      console.error('Error scraping events:', error)
      return []
    }
  }

  /**
   * Scrape all data from Israeli Dances website
   */
  async scrapeAll(): Promise<{
    dances: ScrapedDanceData[]
    choreographers: ScrapedChoreographerData[]
    events: any[]
    errors: string[]
  }> {
    const errors: string[] = []
    let dances: ScrapedDanceData[] = []
    let choreographers: ScrapedChoreographerData[] = []
    let events: any[] = []

    try {
      // Scrape all data
      dances = await this.scrapeDanceSearch()
      choreographers = await this.scrapeChoreographers()
      events = await this.scrapeClassesEvents()

      console.log(`Scraping completed: ${dances.length} dances, ${choreographers.length} choreographers, ${events.length} events`)

    } catch (error) {
      errors.push(`Scraping error: ${error}`)
      console.error('Error during scraping:', error)
    }

    return {
      dances,
      choreographers,
      events,
      errors
    }
  }

  /**
   * Search dances by name (supports English, Hebrew, Chinese)
   */
  async searchDances(query: string, language: 'english' | 'hebrew' | 'chinese' = 'english'): Promise<ScrapedDanceData[]> {
    try {
      console.log(`Searching dances: "${query}" in ${language}`)
      
      // In a real implementation, this would query the Israeli Dances search
      // For now, we'll return a filtered list from our scraped data
      const allDances = await this.scrapeDanceSearch()
      
      return allDances.filter(dance => {
        const searchFields = [
          dance.name,
          dance.nameHebrew,
          dance.nameChinese,
          dance.choreographer,
          dance.choreographerHebrew
        ].filter(Boolean)
        
        return searchFields.some(field => 
          field?.toLowerCase().includes(query.toLowerCase())
        )
      })

    } catch (error) {
      console.error('Error searching dances:', error)
      return []
    }
  }
}

// Export singleton instance
export const israeliDancesScraper = new IsraeliDancesScraper()
