import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import projectRoutes from './routes/projects';
import { errorHandler, authenticate } from './middleware/auth';

const app = express();
const server = http.createServer(app);

// Validate required env vars
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// CORS middleware
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
});

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(generalLimiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/projects', authenticate, projectRoutes);

// WebSocket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// WebSocket events for real-time collaboration
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`User ${userId} connected:`, socket.id);
  socket.join(`user-${userId}`); // Join user-specific room

  socket.on('task:update', (data) => {
    // Only broadcast to the same user (could expand to team members)
    io.to(`user-${userId}`).emit('task:updated', data);
  });

  socket.on('task:create', (data) => {
    // Only send to the user who created it
    io.to(`user-${userId}`).emit('task:created', data);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected:`, socket.id);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ WebSocket listening for authenticated connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export { app, io };
