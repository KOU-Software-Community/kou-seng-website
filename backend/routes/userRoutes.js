import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, adminOnly, firstUserCreation } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/')
    .get(protect, adminOnly, getAllUsers) // Tüm kullanıcıları getir
    .post(protect, firstUserCreation, createUser); // Yeni kullanıcı oluştur

router.route('/:id')
    .patch(protect, adminOnly, updateUser) // Kullanıcıyı güncelle
    .delete(protect, adminOnly, deleteUser); // Kullanıcıyı sil

export default router;
