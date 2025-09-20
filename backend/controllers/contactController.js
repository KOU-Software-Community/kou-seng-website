import Contact from '../models/Contact.js';
import logger from '../helpers/logger.js';

// @desc    İletişim formundan gelen mesajı kaydeder
// @route   POST /contact
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Lütfen tüm alanları doldurunuz' 
      });
    }

    await Contact.create({ name, email, subject, message });

    logger.debug(`Yeni bir iletişim mesajı alındı: ${name} (${email})`);
    
    return res.status(201).json({
      success: true,
      message: 'İletişim mesajınız başarıyla gönderildi'
    });
  } catch (error) {
    logger.error(`İletişim mesajı oluşturulamadı: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası, lütfen daha sonra tekrar deneyiniz'
    });
  }
};

// @desc    Tüm iletişim mesajlarını listeler
// @route   GET /contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().select('-__v').sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    logger.error(`İletişim mesajları getirilemedi: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası, iletişim mesajları getirilemedi'
    });
  }
};

// @desc    İletişim mesajının okundu bilgisini günceller
// @route   PATCH /contact/:id/read
// @access  Private/Admin
const updateContactIsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'İletişim mesajı bulunamadı'
      });
    }

    contact.isRead = !contact.isRead;
    await contact.save();

    logger.debug(`İletişim mesajı isRead güncellendi: ${contact._id} -> ${contact.isRead}`);

    return res.status(200).json({
      success: true,
      message: `İletişim mesajı okundu bilgisi güncellendi. ${!contact.isRead} -> ${contact.isRead}`
    });
  } catch (error) {
    logger.error(`İletişim mesajı isRead güncellenemedi: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası, işlem gerçekleştirilemedi'
    });
  }
};

// @desc    Belirtilen ID'ye sahip mesajı siler
// @route   DELETE /contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'İletişim mesajı bulunamadı'
      });
    }

    await Contact.findByIdAndDelete(req.params.id);
    
    logger.debug(`İletişim mesajı silindi: ${contact._id}`);

    return res.status(200).json({
      success: true,
      message: 'İletişim mesajı başarıyla silindi'
    });
  } catch (error) {
    logger.error(`İletişim mesajı silinemedi: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası, iletişim mesajı silinemedi'
    });
  }
};

export { createContactMessage, getContactMessages, updateContactIsRead, deleteContactMessage };