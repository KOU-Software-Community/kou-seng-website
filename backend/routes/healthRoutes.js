import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = express.Router();

// Health check endpoint
router.get('/', getHealthStatus);

export default router;
