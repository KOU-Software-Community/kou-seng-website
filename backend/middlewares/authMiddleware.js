import { createHash, timingSafeEqual } from 'node:crypto';
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import jwt from 'jsonwebtoken';
import logger from "../helpers/logger.js";

// İlk admin anahtarı en az 32 karakter olmalı; tanımsız veya kısa KEY bu yolu
// tamamen kapatır. Karşılaştırma sabit sürede ve uzunluk sızdırmadan yapılır.
const MIN_KEY_LENGTH = 32;
const matchesSystemKey = (token) => {
    const key = process.env.KEY ?? '';
    if (key.length < MIN_KEY_LENGTH) {
        if (key) logger.error(`KEY ${MIN_KEY_LENGTH} karakterden kısa; ilk admin oluşturma yolu kapalı.`);
        return false;
    }
    if (typeof token !== 'string') return false;
    const digest = (value) => createHash('sha256').update(value).digest();
    return timingSafeEqual(digest(token), digest(key));
};

// JWT `iat` saniye hassasiyetinde (aşağı yuvarlanmış), passwordChangedAt
// milisaniye. iat * 1000 < passwordChangedAt: değişiklikten önce verilmiş her
// token, aynı saniyede verilmiş olsa da geçersiz (şifreyi bilen saldırgan
// değişiklik anına denk gelen bir token'la içeride kalamasın). Bedeli: aynı
// saniyede yapılan yeni bir giriş de reddedilir; panel şifre değişince zaten
// çıkış yaptırıyor, tekrar giriş bir saniyeden uzun sürer.
const issuedBeforePasswordChange = (iat, passwordChangedAt) =>
    Boolean(passwordChangedAt) && iat * 1000 < passwordChangedAt.getTime();

// Panelin oturumu httpOnly çerezde (JS okuyamaz, XSS token'ı çalamaz). Betikler
// ve ilk admin KEY'i Authorization: Bearer başlığıyla gelir.
// __Host- öneki: tarayıcı çerezi yalnızca Secure, Path=/ ve Domain'siz kabul eder;
// başka bir *.kouseng.com uygulaması bu ada kendi çerezini koyamaz (cookie tossing).
const SESSION_COOKIE = '__Host-kouseng_session';
const SESSION_MS = 60 * 60 * 1000; // token ve çerez ömrü: 1 saat
const sessionCookieOptions = { httpOnly: true, secure: true, sameSite: 'strict', path: '/' };

const readToken = (req) => {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) return { token: header.slice(7), fromCookie: false };
    const token = req.headers.cookie?.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
    return token ? { token, fromCookie: true } : null;
};

// CSRF: tarayıcı çerezi kendiliğinden gönderir. SameSite=Strict başka sitelerden
// gelen isteğe çerez koymaz; ek olarak çerezle gelen yazma isteğinin Origin'i
// CORS listesinde olmalı (tarayıcı cross-origin ve yazma isteklerinde Origin'i hep
// gönderir, sayfa uyduramaz). Bearer başlığı kendiliğinden gönderilmediği için muaf.
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const isCrossSiteWrite = (req) => {
    if (SAFE_METHODS.includes(req.method)) return false;
    const allowed = (process.env.CORS_ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
    return !allowed.includes(req.headers.origin);
};

// @desc    Yönetici erişim kontrolü
const adminOnly = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        }
        else {
            res.status(403).json({ message: 'Erişim engellendi. Yönetici Bölgesi...' });
        }
    } catch (error) {
        logger.error(`adminOnly hatası: ${error.message}`);
        res.status(500).json({ message: 'Admin only de sunucu hatası alındı.' });
    }
}

// @desc    Yönetici erişim kontrolü category bazlı
const roleOnlyForCategory = (req, res, next) => {
    try {
        if(req.user && req.user.role === 'admin') {
            return next();
        }
    
        if(req.query && req.query.type === "technical" && req.query.category) {
            if(req.user && req.user.role === req.query.category) {
                return next();
            }
        }
        
        res.status(403).json({ message: `Erişim engellendi. Yönetici Bölgesi...` });
    } catch (error) {
        logger.error(`Rol bazlı erişim hatası: ${error.message}`);
        res.status(500).json({ message: `Rol bazlı erişim hatası alındı.` });
    }
}

// @desc    Yönetici erişim kontrolü submission bazlı
const roleOnlyForSubmission = async (req, res, next) => {
    try {
        if(req.user && req.user.role === 'admin') {
            return next();
        }

        if(req.params && req.params.id) {
            const submission = await Submission.findById(req.params.id);

            if(submission && submission.submissionType === 'technical' && submission.technicalCategory === req.user.role) {
                return next();
            }
        }

        res.status(403).json({ message: `Erişim engellendi. Yönetici Bölgesi...` });
    } catch (error) {
        logger.error(`Rol bazlı erişim hatası: ${error.message}`);
        res.status(500).json({ message: `Rol bazlı erişim hatası alındı.` });
    }
}

// @desc    Token kontrolü
const protect = async (req, res, next) => {
    try {
        const credentials = readToken(req);
        if (!credentials) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }
        const { token, fromCookie } = credentials;

        // Sistem key kontrolü (/users POST isteğinde özel durum)
        const isFirstUserRequest = req.originalUrl === '/users' && req.method === 'POST';
        if (!fromCookie && isFirstUserRequest && matchesSystemKey(token)) {
            const usersCount = await User.countDocuments();
            if (usersCount === 0) {
                // Sistemde kullanıcı yoksa, özel KEY ile erişime izin ver
                req.isSystemKey = true;
                return next();
            }
        }

        if (fromCookie && isCrossSiteWrite(req)) {
            return res.status(403).json({ message: 'İstek kaynağı doğrulanamadı.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ _id: decoded.id }).select('-password');
        // İmza geçerli ama hesap silinmiş: oturum da geçersiz.
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        // Şifre değiştikten önce verilmiş token: oturum kapatılır.
        if (issuedBeforePasswordChange(decoded.iat, req.user.passwordChangedAt)) {
            return res.status(401).json({ message: 'Token expired, please login again' });
        }
        next();
    } catch (error) {
        if (error.message == 'jwt expired') {
            res.status(401).json({ message: 'Token expired, please login again' });
        } else {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
}

// @desc    KEY token ile ilk kullanıcı oluşturmayı kontrol eden middleware
const firstUserCreation = async (req, res, next) => {
    try {
        if (req.isSystemKey) {
            logger.debug('KEY token ile ilk kullanıcı oluşturuluyor.');
            return next();
        }
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        res.status(403).json({ message: 'Erişim engellendi. Yönetici Bölgesi...' });
    } catch (error) {
        logger.error(`firstUserCreation hatası: ${error.message}`);
        res.status(500).json({ message: 'Middleware hatası' });
    }
}

// @desc    Sponsor veya admin erişim kontrolü
const sponsorOrAdmin = (req, res, next) => {
    try {
        if (req.user && (req.user.role === 'admin' || req.user.role === 'sponsor')) {
            next();
        } else {
            res.status(403).json({ message: 'Erişim engellendi. Sponsor veya Yönetici Bölgesi...' });
        }
    } catch (error) {
        logger.error(`sponsorOrAdmin hatası: ${error.message}`);
        res.status(500).json({ message: 'sponsorOrAdmin middleware hatası' });
    }
}

export { SESSION_COOKIE, SESSION_MS, sessionCookieOptions, readToken, isCrossSiteWrite, issuedBeforePasswordChange, adminOnly, roleOnlyForCategory, roleOnlyForSubmission, protect, firstUserCreation, sponsorOrAdmin };