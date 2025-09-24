import { Router } from 'express';
import { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../controllers/authController';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.post('/logout', authenticateToken, logout);

export default router;
