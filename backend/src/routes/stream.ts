import { Router } from 'express';
import { streamSong, getSongInfo, getStreamUrl, recordPlay } from '../controllers/streamController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/song/:id', getSongInfo);
router.get('/url/:id', getStreamUrl);

// Protected routes
router.get('/play/:id', authenticateToken, streamSong);
router.post('/play/:id', authenticateToken, recordPlay);

export default router;
