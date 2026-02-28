import express from 'express';
import { sendSponsorMail } from '../controllers/mailController.js';
import { protect, sponsorOrAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   POST /mail/send
// @access  Private/SponsorOrAdmin
router.post('/send', protect, sponsorOrAdmin, sendSponsorMail);

export default router;
