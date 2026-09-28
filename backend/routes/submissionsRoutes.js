import express from 'express';
import { 
  createGeneralSubmission,
  createTechnicalSubmission,
  getAllSubmissions,
  getSubmissionById,
  exportSubmissionsToCSV,
  updateSubmission,
  purgeSubmissions
} from '../controllers/submissionsController.js';
import { getWindows, updateWindow } from '../controllers/applicationWindowsController.js';
import { protect, adminOnly, roleOnlyForCategory, roleOnlyForSubmission } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Genel başvuru al
router.post('/general', createGeneralSubmission);

// Teknik takım başvurusu al (:slug parametresi ile)
router.post('/technical/:slug', createTechnicalSubmission);

// Tüm başvuruları listele
router.get('/', protect, roleOnlyForCategory, getAllSubmissions);

// Başvuruları CSV olarak dışa aktar
router.get('/export', protect, adminOnly, exportSubmissionsToCSV);

// Seçilen kapsamdaki başvuruları kalıcı olarak sil (önce yedek alınmalı)
router.post('/purge', protect, adminOnly, purgeSubmissions);

// Başvuru dönemleri: herkes okur, yalnızca admin değiştirir. /:id'den önce olmalı,
// yoksa /windows başvuru ID'si sanılır.
router.get('/windows', getWindows);
router.patch('/windows/:slug', protect, adminOnly, updateWindow);

// Role only yapmak lazım burayı
router.route('/:id')
    .get(protect, roleOnlyForSubmission, getSubmissionById) // Belirli bir başvurunun detaylarını görüntüle
    .patch(protect, roleOnlyForSubmission, updateSubmission) // Başvuru güncelle (sadece status ve reviewNotes)

export default router;
