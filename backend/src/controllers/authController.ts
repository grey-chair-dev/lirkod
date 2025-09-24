import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/database';
import { sessionCache } from '../services/redis';
import { asyncHandler } from '../middleware/errorHandler';

// Types
interface RegisterRequest extends Request {
  body: {
    email: string;
    username: string;
    password: string;
    displayName: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    isPremium: boolean;
  };
  body: any;
  params: any;
  headers: any;
}

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

// Register new user
export const register = asyncHandler(async (req: RegisterRequest, res: Response) => {
  const { email, username, password, displayName } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
    });
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      displayName,
      isVerified: false,
      isPremium: false
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      isVerified: true,
      isPremium: true,
      createdAt: true
    }
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Store refresh token in database
  await prisma.session.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  });

  // Cache user session
  await sessionCache.setSession(user.id, {
    userId: user.id,
    email: user.email,
    username: user.username
  });

  return res.status(201).json({
    success: true,
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

// Login user
export const login = asyncHandler(async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      displayName: true,
      avatar: true,
      isVerified: true,
      isPremium: true
    }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Store refresh token in database
  await prisma.session.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  });

  // Cache user session
  await sessionCache.setSession(user.id, {
    userId: user.id,
    email: user.email,
    username: user.username
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() }
  });

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isPremium: user.isPremium
      },
      accessToken,
      refreshToken
    }
  });
});

// Logout user
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;
  const userId = req.user?.id;

  if (refreshToken) {
    // Remove refresh token from database
    await prisma.session.deleteMany({
      where: {
        token: refreshToken,
        userId: userId
      }
    });
  }

  // Clear session cache
  if (userId) {
    await sessionCache.deleteSession(userId);
  }

  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token required'
    });
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret') as { userId: string };

  // Check if token exists in database
  const session = await prisma.session.findFirst({
    where: {
      token: refreshToken,
      userId: decoded.userId,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }

  // Generate new tokens
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

  // Update session with new refresh token
  await prisma.session.update({
    where: { id: session.id },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  });

  return res.json({
    success: true,
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});

// Forgot password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1h' }
  );

  // Store reset token in database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    }
  });

  // In production, send email with reset link
  // For now, just return success
  return res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// Reset password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      error: 'Token and password required'
    });
  }

  // Verify reset token
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };

  // Find user with valid reset token
  const user = await prisma.user.findFirst({
    where: {
      id: decoded.userId,
      resetToken: token,
      resetTokenExpires: {
        gt: new Date()
      }
    }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired reset token'
    });
  }

  // Hash new password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null
    }
  });

  return res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// Resend verification email
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      error: 'User already verified'
    });
  }

  // In production, send verification email
  // For now, just return success
  return res.json({
    success: true,
    message: 'Verification email sent'
  });
});

// Verify email
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Verification token required'
    });
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };

  // Update user verification status
  await prisma.user.update({
    where: { id: decoded.userId },
    data: { isVerified: true }
  });

  return res.json({
    success: true,
    message: 'Email verified successfully'
  });
});