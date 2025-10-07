import User from "../models/User.js";
import Submission from "../models/Submission.js";
import jwt from 'jsonwebtoken';
import logger from "../helpers/logger.js";

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
        res.status(500).json({ message: 'Admin only de sunucu hatası alındı.', error: error.message });
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
        res.status(500).json({ message: `Rol bazlı erişim hatası alındı.`, error: error.message });
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
        res.status(500).json({ message: `Rol bazlı erişim hatası alındı.`, error: error.message });
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
            if (isFirstUserRequest && token === process.env.KEY) {
                const usersCount = await User.countDocuments();
                if (usersCount === 0) {
                    // Sistemde kullanıcı yoksa, özel KEY ile erişime izin ver
                    req.isSystemKey = true;
                    return next();
                }
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findOne({ _id: decoded.id }).select('-password');
            next();
        }
        else {
            res.status(401).json({ message: 'Not authorized, no token provided' })
        }
    } catch (error) {
        if (error.message == 'jwt expired') {
            res.status(401).json({ message: 'Token expired, please login again' });
        } else {
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
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
        res.status(500).json({ message: 'Middleware hatası', error: error.message });
    }
}

export { adminOnly, roleOnlyForCategory, roleOnlyForSubmission, protect, firstUserCreation };