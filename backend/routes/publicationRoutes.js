import express from 'express';
import { getRssFeed } from '../controllers/publicationsController.js';

const router = express.Router();

// @route   GET /rss
// @desc    Medium RSS feed'ini çekip parse et
// @access  Public
router.get('/', getRssFeed);

export default router;
