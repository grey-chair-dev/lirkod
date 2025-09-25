import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { israeliDancesSync } from '@/lib/israelidances-sync'
import { israeliDancesImporter } from '@/lib/import-israelidances'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting content database sync and import...')
    
    // Check if we should import to database and if we have a specific singer
    const { importToDatabase = true, singer } = await request.json().catch(() => ({}))
    
    let syncResult
    let importResult = null
    
    if (importToDatabase) {
      // Import directly to database (optionally for specific singer)
      importResult = await israeliDancesImporter.importAll(singer)
      syncResult = {
        dances: importResult.dances,
        choreographers: importResult.choreographers,
        events: importResult.events,
        errors: importResult.errors
      }
    } else {
      // Just sync without importing
      syncResult = await israeliDancesSync.syncAll()
    }
    
    const response = {
      message: importToDatabase 
        ? `Content database sync and import completed${singer ? ` for ${singer}` : ''}` 
        : 'Content database sync completed',
      timestamp: new Date().toISOString(),
      results: syncResult,
      import: importResult,
      source: 'https://www.israelidances.com/',
      singer: singer || null,
      features: [
        'Dance Search (English, Hebrew, Chinese)',
        'Choreographers Database', 
        'Dances Taught Worldwide',
        'Nostalgia Dances (since 1924)',
        'Classes and Events',
        ...(singer ? [`Dances by ${singer}`] : [])
      ],
      status: syncResult.errors.length > 0 ? 'partial_success' : 'success'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error syncing with content database:', error)
    return NextResponse.json(
      { 
        error: 'Failed to sync with content database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return information about the content database integration
    const integrationInfo = {
      source: 'https://www.israelidances.com/',
      description: 'The global resource for Israeli dancing, founded in 1998',
      features: {
        danceSearch: ['English', 'Hebrew', 'Chinese'],
        choreographers: 'Comprehensive choreographer database',
        worldwide: 'Dances taught worldwide',
        nostalgia: 'Dances since 1924',
        events: 'Classes and events globally'
      },
      status: 'ready_for_integration',
      nextSteps: [
        'Contact israelidances.com for API access',
        'Implement web scraping if API not available',
        'Map their data structure to our database schema',
        'Create automated sync process'
      ]
    }

    return NextResponse.json(integrationInfo)
  } catch (error) {
    console.error('Error getting content database info:', error)
    return NextResponse.json(
      { error: 'Failed to get content database information' },
      { status: 500 }
    )
  }
}
