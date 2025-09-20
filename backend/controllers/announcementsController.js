import Announcement from "../models/Announcement.js";
import logger from "../helpers/logger.js";

// @desc    Yeni duyuru oluştur
// @route   POST /announcements
// @access  Private (Admin)
const createAnnouncement = async (req, res) => {
    const { title, content, summary, category, author } = req.body;
    
    if (!title || !content || !summary || !category || !author) {
        return res.status(400).json({ 
            success: false,
            message: "Lütfen tüm zorunlu alanları doldurun." 
        });
    }
    
    try {
        await Announcement.create({ title, content, summary, category, author });
        logger.debug(`Duyuru başarıyla oluşturuldu: ${title}`);
        return res.status(201).json({ 
            success: true,
            message: "Duyuru başarıyla oluşturuldu."
        });
    } catch (error) {
        logger.error(`Duyuru oluşturulurken bir hata oluştu: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Duyuru oluşturulurken bir hata oluştu."
        });
    }
};

// @desc    Tüm duyuruları getir (Sayfalama, filtreleme ve arama desteği ile)
// @route   GET /announcements
// @access  Public
const getAnnouncements = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        
        // Arama sorgusu oluştur
        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { summary: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                    { author: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        const query = Announcement.find(searchQuery).select('-__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const [announcements, totalCount] = await Promise.all([
            query.lean(),
            Announcement.countDocuments(searchQuery)
        ]);
        
        const totalPages = Math.ceil(totalCount / limit);
        
        return res.status(200).json({
            success: true,
            message: "Duyurular başarıyla getirildi.",
            data: announcements,
            count: totalCount,
            pagination: {
                page,
                limit,
                totalPages
            },
            search: search || null
        });
    } catch (error) {
        logger.error(`Duyurular getirilirken bir hata oluştu: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Duyurular getirilirken bir hata oluştu."
        });
    }
};

// @desc    Tek bir duyuruyu ID'ye göre getir
// @route   GET /announcements/:id
// @access  Public
const getAnnouncement = async (req, res) => {
    const { id } = req.params;
    
    try {
        const announcement = await Announcement.findById(id).select('-__v');
        
        if (!announcement) {
            return res.status(404).json({
                success: false, 
                message: "Duyuru bulunamadı." 
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Duyuru başarıyla getirildi.",
            data: announcement
        });
    } catch (error) {
        logger.error(`Duyuru getirilirken bir hata oluştu: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Duyuru getirilirken bir hata oluştu."
        });
    }
};

// @desc    Duyuru güncelle
// @route   PATCH /announcements/:id
// @access  Private (Admin)
const updateAnnouncement = async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, category, author } = req.body;
    
    try {
        const announcement = await Announcement.findById(id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false, 
                message: "Duyuru bulunamadı." 
            });
        }
        
        // Duyuruyu güncelle
        announcement.title = title || announcement.title;
        announcement.summary = summary || announcement.summary;
        announcement.content = content || announcement.content;
        announcement.category = category || announcement.category;
        announcement.author = author || announcement.author;
        announcement.updatedAt = Date.now();
        
        await announcement.save();
        logger.debug(`Duyuru başarıyla güncellendi: ${title}`);
        
        return res.status(200).json({ 
            success: true,
            message: "Duyuru başarıyla güncellendi."
        });
    } catch (error) {
        logger.error(`Duyuru güncellenirken bir hata oluştu: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Duyuru güncellenirken bir hata oluştu."
        });
    }
};

// @desc    Duyuru sil
// @route   DELETE /announcements/:id
// @access  Private (Admin)
const deleteAnnouncement = async (req, res) => {
    const { id } = req.params;
    
    try {
        const announcement = await Announcement.findById(id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false, 
                message: "Duyuru bulunamadı." 
            });
        }
        
        await announcement.deleteOne();
        logger.debug(`Duyuru başarıyla silindi: ${announcement.title}`);
        return res.status(200).json({
            success: true,
            message: "Duyuru başarıyla silindi." 
        });
    } catch (error) {
        logger.error(`Duyuru silinirken bir hata oluştu: ${error.message}`);
        return res.status(500).json({ 
            success: false,
            message: "Duyuru silinirken bir hata oluştu."
        });
    }
};

export { createAnnouncement, getAnnouncements, getAnnouncement, updateAnnouncement, deleteAnnouncement };