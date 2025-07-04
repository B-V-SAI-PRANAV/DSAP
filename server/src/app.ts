import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import pathRoutes from './routes/pathRoutes';
import adminRoutes from './routes/adminRoutes';
import errorHandler from './middleware/errorHandler';
import Neo4jService from './services/neo4j.service';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', pathRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', async (_req, res) => {
  const healthy = await db.getHealth();
  if (!healthy) {
    console.log('Neo4j not available, using mock data for development');
  } else {
    console.log('Connected to Neo4j database');
  }
  res.json({ status: 'ok', neo4j: healthy });
});

// Error handling middleware
app.use(errorHandler);

const db = Neo4jService; // Fixed instantiation

export default app;
