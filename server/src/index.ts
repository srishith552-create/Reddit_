import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file (prioritizes project root or server dir)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import redditRoutes from './routes/reddit';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic security & parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching clientOrigin / localhost
      if (
        !origin ||
        origin === clientOrigin ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/testing
      }
    },
    methods: ['GET', 'OPTIONS'],
  })
);

// Global Rate Limiter to prevent accidental Reddit API flooding
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP. Please wait a minute and try again.',
    },
  },
});

app.use('/api', apiLimiter);

// Register API routes
app.use('/api', redditRoutes);

// Serve static client assets in production if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`[Server] Subreddit Vibe Check backend running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `[Server] Reddit OAuth: ${
      process.env.REDDIT_CLIENT_ID ? 'Configured (OAuth2)' : 'Public Fallback Mode'
    }`
  );
});

export default app;
