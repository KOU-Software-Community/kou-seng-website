import express from 'express';
import { 
  createGeneralSubmission,
  createTechnicalSubmission,
  getAllSubmissions,
  getSubmissionById,
  exportSubmissionsToCSV,
  updateSubmission
} from '../controllers/submissionsController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Genel başvuru al
router.post('/general', createGeneralSubmission);

// Teknik takım başvurusu al (:slug parametresi ile)
router.post('/technical/:slug', createTechnicalSubmission);

// Tüm başvuruları listele (yöneticiler için)
router.get('/', protect, adminOnly, getAllSubmissions);

// Başvuruları CSV olarak dışa aktar
router.get('/export', protect, adminOnly, exportSubmissionsToCSV);

router.route('/:id')
    .get(protect, adminOnly, getSubmissionById) // Belirli bir başvurunun detaylarını görüntüle
    .patch(protect, adminOnly, updateSubmission) // Başvuru güncelle (sadece status ve reviewNotes)

export default router;
