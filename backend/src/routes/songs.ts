import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all songs
router.get('/', (req, res) => {
  res.json({ songs: [] });
});

// Get song by ID
router.get('/:id', (req, res) => {
  res.json({ song: { id: req.params.id } });
});

// Search songs
router.get('/search/:query', (req, res) => {
  res.json({ songs: [] });
});

export default router;
