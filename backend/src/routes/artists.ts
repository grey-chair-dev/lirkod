import { Router } from 'express';

const router = Router();

// Get all artists
router.get('/', (req, res) => {
  res.json({ artists: [] });
});

// Get artist by ID
router.get('/:id', (req, res) => {
  res.json({ artist: { id: req.params.id } });
});

// Get artist albums
router.get('/:id/albums', (req, res) => {
  res.json({ albums: [] });
});

// Get artist songs
router.get('/:id/songs', (req, res) => {
  res.json({ songs: [] });
});

export default router;
