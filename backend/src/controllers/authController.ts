import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../services/database';
import { sessionCache } from '../services/redis';
import { asyncHandler } from '../middleware/errorHandler';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email';

interface RegisterRequest extends Request {
  body: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
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
}

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
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
      displayName: displayName || username,
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

  // Send verification email (in production)
  if (process.env.NODE_ENV === 'production') {
    await sendVerificationEmail(user.email, user.id);
  }

  res.status(201).json({
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
    where: { email }
  });

  if (!user || !user.password) {
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

  res.json({
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
        userId
      }
    });
  }

  // Clear session cache
  if (userId) {
    await sessionCache.deleteSession(userId);
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Refresh access token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token required'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Check if token exists in database
    const session = await prisma.session.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
            isPremium: true
          }
        }
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const { accessToken } = generateTokens(session.user.id);

    res.json({
      success: true,
      data: {
        accessToken,
        user: session.user
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
});

// Forgot password
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    // Don't reveal if email exists
    return res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = uuidv4();
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Store reset token (in production, you'd store this in database)
  await sessionCache.setSession(`reset:${resetToken}`, {
    userId: user.id,
    email: user.email
  }, 3600);

  // Send reset email (in production)
  if (process.env.NODE_ENV === 'production') {
    await sendPasswordResetEmail(user.email, resetToken);
  }

  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent'
  });
});

// Reset password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // Get reset token data
  const resetData = await sessionCache.getSession(`reset:${token}`);
  if (!resetData) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired reset token'
    });
  }

  // Hash new password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Update user password
  await prisma.user.update({
    where: { id: resetData.userId },
    data: { password: hashedPassword }
  });

  // Delete reset token
  await sessionCache.deleteSession(`reset:${token}`);

  // Invalidate all user sessions
  await prisma.session.deleteMany({
    where: { userId: resetData.userId }
  });

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// Verify email
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  // In production, you'd have a proper email verification system
  // For now, we'll just mark the user as verified
  res.json({
    success: true,
    message: 'Email verification not implemented in demo'
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
      error: 'Email already verified'
    });
  }

  // Send verification email (in production)
  if (process.env.NODE_ENV === 'production') {
    await sendVerificationEmail(user.email, user.id);
  }

  res.json({
    success: true,
    message: 'Verification email sent'
  });
});
