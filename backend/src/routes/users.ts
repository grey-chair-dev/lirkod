import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Profile updated successfully' });
});

// Get user playlists
router.get('/playlists', authenticateToken, (req, res) => {
  res.json({ playlists: [] });
});

// Get user favorites
router.get('/favorites', authenticateToken, (req, res) => {
  res.json({ favorites: [] });
});

export default router;
