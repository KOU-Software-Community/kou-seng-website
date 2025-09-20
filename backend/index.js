import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import publicationRoutes from './routes/publicationRoutes.js';
import submissionsRoutes from './routes/submissionsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import ConnectDB from './config/dbConnection.js';
import logger from './helpers/logger.js';
import rateSkip from './helpers/rateSkip.js';

const app = express();
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3001;
ConnectDB();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};
app.use(cors(corsOptions));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => rateSkip(req),
});
app.use(limiter);

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url} [${req.ip}]`);
  next();
});

app.use(express.json());
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/announcements', announcementRoutes);
app.use('/contact', contactRoutes);
app.use('/rss', publicationRoutes);
app.use('/submissions', submissionsRoutes);

app.listen(PORT, () => {
    logger.info(`Server ${PORT} portunda çalışıyor`);
});