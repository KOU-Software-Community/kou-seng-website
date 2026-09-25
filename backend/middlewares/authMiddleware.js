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
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer')) {
            token = token.split(' ')[1];
            
            // Sistem key kontrolü (/users POST isteğinde özel durum)
            const isFirstUserRequest = req.originalUrl === '/users' && req.method === 'POST';
            if (isFirstUserRequest && matchesSystemKey(token)) {
                const usersCount = await User.countDocuments();
                if (usersCount === 0) {
                    // Sistemde kullanıcı yoksa, özel KEY ile erişime izin ver
                    req.isSystemKey = true;
                    return next();
                }
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findOne({ _id: decoded.id }).select('-password');
            // İmza geçerli ama hesap silinmiş: oturum da geçersiz.
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        }
        else {
            res.status(401).json({ message: 'Not authorized, no token provided' })
        }
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

export { adminOnly, roleOnlyForCategory, roleOnlyForSubmission, protect, firstUserCreation, sponsorOrAdmin };