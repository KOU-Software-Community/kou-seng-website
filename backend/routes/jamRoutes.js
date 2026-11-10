import express from 'express';
import {
  createJamApplication,
  listJamApplications,
  exportJamApplications,
  purgeJamApplications,
} from '../controllers/jamController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createJamApplication);
router.get('/', protect, adminOnly, listJamApplications);
router.get('/export', protect, adminOnly, exportJamApplications);
router.post('/purge', protect, adminOnly, purgeJamApplications);

export default router;
