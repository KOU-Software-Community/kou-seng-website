import generateToken from "../helpers/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Admin girişi
// @route   GET /auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
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
        res.status(500).json({ message: 'Error logging in', error: error.message });
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
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
}

export { loginUser, getMe };