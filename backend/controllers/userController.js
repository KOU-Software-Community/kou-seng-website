import User from "../models/User.js";
import bcrypt from "bcryptjs";
import logger from "../helpers/logger.js";

// @desc    Tüm kullanıcıları getir
// @route   GET /users
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const formattedUsers = users.map(user => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcıları getirirken hata oluştu', error: error.message });
    }
};

// @desc    Yeni kullanıcı oluştur
// @route   POST /users
// @access  Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Gerekli alanları kontrol et
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
        }

        // Kullanıcının zaten var olup olmadığını kontrol et
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Bu email adresi ile kayıtlı bir kullanıcı zaten mevcut' });
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kullanıcıyı oluştur
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        if (user) {
            logger.debug(`Kullanıcı oluşturuldu: ${user.name} - ${user.email} - ${user.role}`);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Kullanıcı oluşturulurken hata oluştu' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu', error: error.message });
    }
};

// @desc    Kullanıcıyı güncelle
// @route   PATCH /users/:id
// @access  Admin
const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        if (req.user._id.toString() === req.params.id && role && role !== req.user.role) {
            return res.status(403).json({ message: 'Kendi kullanıcı rolünüzü değiştiremezsiniz' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();

        logger.debug(`Kullanıcı güncellendi: ${updatedUser.name} - ${updatedUser.email} - ${updatedUser.role}`);

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı güncellenirken hata oluştu', error: error.message });
    }
};

// @desc    Kullanıcıyı sil
// @route   DELETE /users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        if (req.user._id.toString() === req.params.id) {
            return res.status(403).json({ message: 'Kendi kullanıcı hesabınızı silemezsiniz' });
        }

        await User.deleteOne({ _id: user._id });
        logger.debug(`Kullanıcı silindi: ${user.name} - ${user.email} - ${user.role}`);
        res.status(200).json({ message: 'Kullanıcı silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı silinirken hata oluştu', error: error.message });
    }
};

export { getAllUsers, createUser, updateUser, deleteUser };
