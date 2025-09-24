import { Request, Response } from 'express';
import { prisma } from '../services/database';
import { streamCache } from '../services/redis';
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

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      artist: true,
      album: true
    }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  return res.json({
    success: true,
    data: song
  });
});

// Get stream URL (for frontend to use)
export const getStreamUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const song = await prisma.song.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      duration: true,
      filePath: true
    }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // In a real implementation, you would generate a signed URL or token
  // For now, return the file path
  const streamUrl = `/api/stream/play/${song.id}`;

  return res.json({
    success: true,
    data: {
      id: song.id,
      title: song.title,
      duration: song.duration,
      streamUrl
    }
  });
});

// Stream song (actual audio streaming)
export const streamSong = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Check if user has access to this song
  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      artist: true,
      album: true
    }
  });

  if (!song) {
    return res.status(404).json({
      success: false,
      error: 'Song not found'
    });
  }

  // Check if user is premium or if song is free
  if (!req.user?.isPremium && !song.isFree) {
    return res.status(403).json({
      success: false,
      error: 'Premium subscription required'
    });
  }

  // Check cache first
  const cachedStream = await streamCache.getStreamData(`song:${id}`);
  if (cachedStream) {
    res.set({
      'Content-Type': cachedStream.contentType,
      'Content-Length': cachedStream.contentLength.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    });
    return res.send(cachedStream.buffer);
  }

  // In a real implementation, you would:
  // 1. Read the audio file from storage
  // 2. Handle range requests for streaming
  // 3. Cache the stream data
  // 4. Return the audio stream

  // For now, return a placeholder response
  return res.json({
    success: true,
    message: 'Stream endpoint ready',
    data: {
      songId: id,
      title: song.title,
      artist: song.artist?.name,
      album: song.album?.title
    }
  });
});

// Record play (for analytics)
export const recordPlay = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Record the play in database
  await prisma.play.create({
    data: {
      userId,
      songId: id,
      playedAt: new Date()
    }
  });

  // Update song play count
  await prisma.song.update({
    where: { id },
    data: {
      playCount: {
        increment: 1
      }
    }
  });

  return res.json({
    success: true,
    message: 'Play recorded'
  });
});