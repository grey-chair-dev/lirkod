import { Router } from 'express';

const router = Router();

// Search all content
router.get('/', (req, res) => {
  const { q, type } = req.query;
  res.json({ 
    query: q,
    type: type,
    results: {
      songs: [],
      artists: [],
      albums: [],
      playlists: []
    }
  });
});

// Search songs
router.get('/songs', (req, res) => {
  const { q } = req.query;
  res.json({ songs: [] });
});

// Search artists
router.get('/artists', (req, res) => {
  const { q } = req.query;
  res.json({ artists: [] });
});

// Search albums
router.get('/albums', (req, res) => {
  const { q } = req.query;
  res.json({ albums: [] });
});

export default router;
