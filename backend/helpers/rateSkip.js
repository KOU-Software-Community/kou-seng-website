import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import logger from "./logger.js";


const rateSkip = async (req) => {
    if (req.headers['authorization']) {
        return rateSkipAuth(req.headers['authorization']);
    }
    return rateSkipIP(req);
}

/**
 * Rate limiter skip function - skips rate limiting for specific IP addresses
 * @param {Object} req - Express request object
 * @returns {boolean} - true if IP should skip rate limiting, false otherwise
 */
const rateSkipIP = async (req) => {
    try {
        // Get client IP address
        const clientIP = req.ip || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress ||
                        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                        req.headers['x-real-ip'] ||
                        'unknown';

        // Get allowed IPs from environment variable
        const allowedIPsEnv = process.env.ALLOWED_SERVER_IPS;
        
        if (!allowedIPsEnv) {
            logger.debug('ALLOWED_SERVER_IPS environment variable tanımlanmamış');
            return false;
        }

        // Parse comma-separated IP list and trim whitespace
        const allowedIPs = allowedIPsEnv.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0);

        // Check if client IP is in allowed list
        const shouldSkip = allowedIPs.includes(clientIP);
        
        if (shouldSkip) {
            logger.debug(`Rate limit şu IP adresi için atlandı: ${clientIP}`);
        }

        return shouldSkip;
    } catch (error) {
        logger.error(`IP rate skip kontrolü sırasında hata: ${error.message}`);
        return false;
    }
};

/**
 * Rate limiter skip function - skips rate limiting for authenticated users
 * @param {string} authHeader - Authorization header value
 * @returns {boolean} - true if user is authenticated (skip rate limiting), false otherwise
 */
const rateSkipAuth = async (authHeader) => {
    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return false;
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decoded.id }).select('-password');

        if (!user) {
            return false;
        }

        // If verification succeeds, skip rate limiting
        logger.debug(`Rate limit şu kullanıcı için atlandı: ${user.name}`);
        return true;
    } catch (error) {
        // If token verification fails, apply rate limiting
        return false;
    }
};

export default rateSkip;