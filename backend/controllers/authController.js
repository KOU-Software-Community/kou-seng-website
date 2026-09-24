import generateToken from "../helpers/generateToken.js";
import User, { MIN_PASSWORD_LENGTH } from "../models/User.js";
import bcrypt from "bcryptjs";
import logger from "../helpers/logger.js";

// @desc    Admin girişi
// @route   GET /auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'E-posta adresi veya şifre yanlış' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'E-posta adresi veya şifre yanlış' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'E-posta adresi veya şifre yanlış' });
        }
        res.status(200).json({
            token: generateToken(user._id)
        });
    } catch (error) {
        logger.error(`Giriş sırasında hata: ${error.message}`);
        res.status(500).json({ message: 'Error logging in' });
    }
}

// @desc    Admin bilgilerini getir
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.status(200).json({
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
    } catch (error) {
        logger.error(`Kullanıcı bilgisi getirilemedi: ${error.message}`);
        res.status(500).json({ message: 'Error getting user' });
    }
}

// @desc    Oturumdaki kullanıcının şifresini değiştir
// @route   PATCH /auth/password
// @access  Private
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body ?? {};
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({ message: 'Mevcut ve yeni şifre gerekli' });
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ message: `Yeni şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır` });
    }
    try {
        const user = await User.findById(req.user._id);
        if (!(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Mevcut şifre yanlış' });
        }
        user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        // Yalnızca şifre doğrulanır; eski kayıtlardaki başka bir alan (ör.
        // migration'ı yapılmamış `web` rolü) şifre değişikliğini engellemesin.
        await user.save({ validateModifiedOnly: true });
        res.status(200).json({ message: 'Şifre değiştirildi' });
    } catch {
        res.status(500).json({ message: 'Şifre değiştirilemedi' });
    }
}

export { loginUser, getMe, changePassword };