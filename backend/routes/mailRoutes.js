import express from 'express';
import multer from 'multer';
import { sendSponsorMail } from '../controllers/mailController.js';
import { protect, sponsorOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        const allowed = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Desteklenmeyen dosya türü. PDF, görsel veya Word belgesi yükleyebilirsiniz.'));
        }
    },
});

// Multer hatalarını tutarlı JSON formatında döndürür
const uploadMiddleware = (req, res, next) => {
    upload.array('attachments', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            const msg = err.code === 'LIMIT_FILE_SIZE'
                ? 'Bir dosyanın boyutu 10 MB sınırını aşıyor.'
                : err.code === 'LIMIT_FILE_COUNT'
                    ? 'En fazla 10 dosya eklenebilir.'
                    : err.message;
            return res.status(400).json({ success: false, message: msg });
        }
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// @route   POST /mail/send
// @access  Private/SponsorOrAdmin
router.post('/send', protect, sponsorOrAdmin, uploadMiddleware, sendSponsorMail);

export default router;
