import { Router } from 'express';

const router = Router();

// Get all albums
router.get('/', (req, res) => {
  res.json({ albums: [] });
});

// Get album by ID
router.get('/:id', (req, res) => {
  res.json({ album: { id: req.params.id } });
});

// Get album songs
router.get('/:id/songs', (req, res) => {
  res.json({ songs: [] });
});

export default router;
