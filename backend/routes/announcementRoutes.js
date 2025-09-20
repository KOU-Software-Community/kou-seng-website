import express from 'express';
import { createAnnouncement, deleteAnnouncement, getAnnouncement, getAnnouncements, updateAnnouncement } from '../controllers/announcementsController.js';
import { adminOnly, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

 
router.route('/')
    .get(getAnnouncements) // Tüm duyuruları listele (limit parametresi alabilir)
    .post(protect, adminOnly, createAnnouncement); // Yeni bir duyuru oluştur

router.route('/:id')
    .get(getAnnouncement) // Tek bir duyurunun detayını getir
    .patch(protect, adminOnly, updateAnnouncement) // Bir duyuruyu güncelle
    .delete(protect, adminOnly, deleteAnnouncement); // Bir duyuruyu sil

export default router;