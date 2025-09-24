import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get user playlists
router.get('/', authenticateToken, (req, res) => {
  res.json({ playlists: [] });
});

// Create playlist
router.post('/', authenticateToken, (req, res) => {
  res.json({ message: 'Playlist created successfully' });
});

// Get playlist by ID
router.get('/:id', authenticateToken, (req, res) => {
  res.json({ playlist: { id: req.params.id } });
});

// Update playlist
router.put('/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Playlist updated successfully' });
});

// Delete playlist
router.delete('/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Playlist deleted successfully' });
});

export default router;
