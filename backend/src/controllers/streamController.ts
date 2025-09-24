import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../services/database';
import { streamCache, rateLimit } from '../services/redis';
import { asyncHandler } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    isPremium: boolean;
  };
}

// Get song information
export const getSongInfo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check cache first
  const cachedData = await streamCache.getStreamData(id);
  if (cachedData) {
    return res.json({
      success: true,
      data: cachedData
    });
  }

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      artist: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      album: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          releaseDate: true
        }
      }
    }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  const songData = {
    id: song.id,
    title: song.title,
    duration: song.duration,
    trackNumber: song.trackNumber,
    isExplicit: song.isExplicit,
    playCount: song.playCount,
    artist: song.artist,
    album: song.album,
    previewUrl: song.previewUrl
  };

  // Cache the data
  await streamCache.cacheStreamData(id, songData);

  res.json({
    success: true,
    data: songData
  });
});

// Get streaming URL (for client-side streaming)
export const getStreamUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quality = 'medium' } = req.query;

  const song = await prisma.song.findUnique({
    where: { id },
    select: {
      id: true,
      audioUrl: true,
      title: true
    }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // In a real implementation, you'd generate signed URLs or streaming URLs
  // For demo purposes, we'll return the audio URL directly
  res.json({
    success: true,
    data: {
      streamUrl: song.audioUrl,
      quality,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    }
  });
});

// Stream song (server-side streaming)
export const streamSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const isPremium = req.user?.isPremium;

  // Rate limiting for free users
  if (!isPremium) {
    const isAllowed = await rateLimit.checkLimit(`stream:${userId}`, 100, 3600); // 100 streams per hour
    if (!isAllowed) {
      return res.status(429).json({
        success: false,
        error: 'Stream limit exceeded. Upgrade to Premium for unlimited streaming.'
      });
    }
  }

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      artist: {
        select: {
          id: true,
          name: true
        }
      },
      album: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Check if file exists (for local files)
  const filePath = path.join(process.cwd(), 'uploads', 'audio', song.audioUrl);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'Audio file not found'
    });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Handle range requests for streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // Stream entire file
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }

  // Record play in background (don't wait for it)
  if (userId) {
    recordPlayInBackground(userId, song.id);
  }
});

// Record a play
export const recordPlay = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { position = 0 } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const song = await prisma.song.findUnique({
    where: { id }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Record listening history
  await prisma.listeningHistory.create({
    data: {
      userId,
      songId: song.id,
      duration: Math.floor(position)
    }
  });

  // Update song play count
  await prisma.song.update({
    where: { id: song.id },
    data: {
      playCount: {
        increment: 1
      }
    }
  });

  res.json({
    success: true,
    message: 'Play recorded'
  });
});

// Helper function to record play in background
const recordPlayInBackground = async (userId: string, songId: string) => {
  try {
    await prisma.listeningHistory.create({
      data: {
        userId,
        songId,
        duration: 0 // Will be updated when playback ends
      }
    });

    await prisma.song.update({
      where: { id: songId },
      data: {
        playCount: {
          increment: 1
        }
      }
    });
  } catch (error) {
    console.error('Error recording play:', error);
  }
};
