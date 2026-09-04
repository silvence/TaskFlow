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

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('📋 Please copy .env.example to .env and configure all variables');
  process.exit(1);
}

const io = new SocketIOServer(server, {
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// CORS middleware
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  optionsSuccessStatus: 200,
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication failed'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (socket as any).userId = (decoded as any).id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  console.log(`✓ User ${userId} connected:`, socket.id);

  socket.on('task:create', (data: any) => {
    io.emit('task:created', data);
  });

  socket.on('task:update', (data: any) => {
    io.emit('task:updated', data);
  });

  socket.on('task:delete', (taskId: string) => {
    io.emit('task:deleted', taskId);
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected:`, socket.id);
  });

  socket.on('error', (error: any) => {
    console.error(`Socket error for user ${userId}:`, error);
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
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export { app, io };
