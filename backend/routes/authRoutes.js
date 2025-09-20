import express from "express";
import { loginUser, getMe } from "../controllers/authController.js";
import { getSystemStatus } from "../controllers/statusController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/status', protect, getSystemStatus);

export default router;