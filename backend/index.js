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
import mailRoutes from './routes/mailRoutes.js';
import mailQueueRoutes from './routes/mailQueueRoutes.js';
import ConnectDB from './config/dbConnection.js';
import logger from './helpers/logger.js';
import rateSkip from './helpers/rateSkip.js';
import { startMailQueueProcessor } from './services/mailQueueProcessor.js';
import { initTransporter } from './helpers/mailTransporter.js';

const app = express();

app.set("trust proxy", 1);
app.disable('x-powered-by');

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3001;
ConnectDB();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const err = new Error('The CORS policy for this site does not allow access from the specified Origin.');
      err.status = 403;
      return callback(err, false);
    }
    return callback(null, true);
  },
};
// API JSON ve CSV döndürüyor; tarayıcı içerik türünü tahmin etmeye kalkmasın.
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});
app.use(cors(corsOptions));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => rateSkip(req)
});
app.use(limiter);

// Genel limit oturumlu kullanıcıları saymıyor (mail kuyruğu 3 sn'de bir
// yokluyor), bu yüzden login ve herkese açık formlar ayrıca, muafiyetsiz
// sınırlanır. Şifre değiştirme login'le aynı kovayı kullanır; yoksa ele
// geçirilmiş bir token'la mevcut şifre sınırsız denenebilirdi. Kampüs ağında
// çok sayıda öğrenci aynı IP'yi paylaşabildiği için form limiti 15 dakikada 30.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true, // yalnızca hatalı girişler sayılır
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Çok fazla hatalı giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
});
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla gönderim yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' },
});
app.post('/auth/login', loginLimiter);
app.patch('/auth/password', loginLimiter);
app.post(['/submissions/general', '/submissions/technical/:slug', '/contact'], formLimiter);

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
app.use('/mail', mailRoutes);
app.use('/mail/queue', mailQueueRoutes);

// Yakalanmayan hatalar (CORS reddi, bozuk JSON, handler'dan fırlayan istisna)
// Express'in stack içeren HTML sayfası yerine JSON döner. 4xx mesajları
// istemciye yöneliktir; 500'ün ayrıntısı yalnızca loga yazılır.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) logger.error(`${req.method} ${req.originalUrl} işlenemedi: ${err.message}`);
  res.status(status).json({ message: status === 500 ? 'Sunucu hatası' : err.message });
});

startMailQueueProcessor();
initTransporter();

app.listen(PORT, () => {
    logger.info(`Server ${PORT} portunda çalışıyor`);
});