import nodemailer from 'nodemailer';
import logger from './logger.js';

let _transporter = null;

/**
 * Uygulama genelinde tek bir nodemailer transporter döndürür (singleton).
 * pool: true ile bağlantı havuzu kullanılır; tekrar eden gönderimler
 * mevcut SMTP bağlantısını yeniden kullanır ve gecikmeyi minimize eder.
 */
export function getTransporter() {
    if (_transporter) return _transporter;

    const mailUser = process.env.MAIL_USER;
    const mailAppPassword = process.env.MAIL_APP_PASSWORD;

    if (!mailUser || !mailAppPassword) {
        throw new Error('Mail kimlik bilgileri eksik: MAIL_USER veya MAIL_APP_PASSWORD tanımlı değil.');
    }

    _transporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true,
        maxConnections: 5,
        auth: { user: mailUser, pass: mailAppPassword },
    });

    return _transporter;
}

/**
 * Sunucu başlangıcında SMTP bağlantısını önceden kurarak ilk mailin
 * gecikmesini ortadan kaldırır.
 */
export async function initTransporter() {
    try {
        const t = getTransporter();
        await t.verify();
        logger.info('Mail transporter bağlantısı doğrulandı ve hazır.');
    } catch (err) {
        logger.error(`Mail transporter başlatılamadı: ${err.message}`);
    }
}
