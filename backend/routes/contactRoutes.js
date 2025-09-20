import express from 'express';
import { createContactMessage, getContactMessages, deleteContactMessage, updateContactIsRead } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(createContactMessage) // İletişim formundan gelen mesajı kaydeder
    .get(protect, adminOnly, getContactMessages) // Tüm iletişim mesajlarını listeler

// Belirtilen ID'ye sahip mesajı siler
router.delete('/:id', protect, adminOnly, deleteContactMessage);

// İletişim mesajının okundu bilgisi güncellenir
router.patch('/:id/read', protect, adminOnly, updateContactIsRead);

export default router;