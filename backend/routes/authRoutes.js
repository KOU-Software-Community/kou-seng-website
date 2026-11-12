import express from "express";
import { loginUser, logoutUser, getMe, changePassword } from "../controllers/authController.js";
import { getSystemStatus } from "../controllers/statusController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.patch('/password', protect, changePassword);
router.get('/status', protect, adminOnly, getSystemStatus);

export default router;