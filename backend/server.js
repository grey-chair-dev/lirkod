const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN || "http://localhost:3000",
      "https://lirkod.vercel.app",
      "https://lirkod-theta.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 10000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || "http://localhost:3000",
    "https://lirkod.vercel.app",
    "https://lirkod-theta.vercel.app"
  ],
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

// Simple root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Lirkod Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

// Basic API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, username, displayName } = req.body;
  
  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ 
      error: 'Email, password, and username are required' 
    });
  }
  
  // Mock successful registration
  const mockUser = {
    id: 'user_' + Date.now(),
    email,
    username,
    displayName: displayName || username,
    isPremium: false,
    createdAt: new Date().toISOString()
  };
  
  const mockTokens = {
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now()
  };
  
  res.status(201).json({
    success: true,
    data: {
      user: mockUser,
      ...mockTokens
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }
  
  // Mock successful login
  const mockUser = {
    id: 'user_' + Date.now(),
    email,
    username: email.split('@')[0],
    displayName: email.split('@')[0],
    isPremium: false,
    createdAt: new Date().toISOString()
  };
  
  const mockTokens = {
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now()
  };
  
  res.json({
    success: true,
    data: {
      user: mockUser,
      ...mockTokens
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

// User routes
app.get('/api/users/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authorization token required' 
    });
  }
  
  // Mock user data
  const mockUser = {
    id: 'user_123',
    email: 'user@example.com',
    username: 'testuser',
    displayName: 'Test User',
    isPremium: false,
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockUser
  });
});

app.put('/api/users/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authorization token required' 
    });
  }
  
  // Mock updated user data
  const mockUser = {
    id: 'user_123',
    email: 'user@example.com',
    username: 'testuser',
    displayName: req.body.displayName || 'Test User',
    isPremium: false,
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockUser
  });
});

// Admin endpoint to list all users (for development)
app.get('/api/users', (req, res) => {
  // Mock users list
  const mockUsers = [
    {
      id: 'user_1',
      email: 'admin@lirkod.com',
      username: 'admin',
      displayName: 'Admin User',
      isPremium: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user_2', 
      email: 'user@example.com',
      username: 'testuser',
      displayName: 'Test User',
      isPremium: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: mockUsers,
    count: mockUsers.length
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { app, io };
