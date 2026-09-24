import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import logger from "../helpers/logger.js";
import toSearchPattern from "../helpers/searchPattern.js";
import { Parser, formatters } from "json2csv";

// Formdan gelen alanlar düz metin olmalı: nesne/dizi gibi değerler sorguya
// ulaşmadan reddedilir, uzunluk da sınırlanır.
const isText = (value, max = 200) => typeof value === "string" && value.length <= max;
const INVALID_FIELD_MESSAGE = "Gönderilen alanlardan biri geçersiz veya çok uzun.";

// CSV Excel/Sheets'te açıldığında başvurandan gelen metin formül olarak
// çalışmasın: = + - @ tab veya CR ile başlayan hücrenin başına ' eklenir.
// Yalnızca rakam, boşluk, parantez ve +/- içeren değerler (telefon gibi)
// formül taşıyamaz; görünür bir ' çıkmasın diye olduğu gibi bırakılır.
const quoteCsvString = formatters.string();
const csvString = (value) =>
  quoteCsvString(/^[=+\-@\t\r]/.test(value) && !/^\+?[\d\s()-]+$/.test(value) ? `'${value}` : value);

// @desc    Genel başvuru oluştur
// @route   POST /submissions/general
// @access  Public
export const createGeneralSubmission = async (req, res) => {
  try {
    const { name, studentId, email, phone, faculty, department, grade } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !studentId || !email || !phone || !faculty || !department || grade === undefined || grade === null || grade === '') {
      return res.status(400).json({
        success: false,
        message: "Lütfen tüm zorunlu alanları doldurunuz."
      });
    }

    if (![name, studentId, email, phone, faculty, department].every((v) => isText(v))) {
      return res.status(400).json({ success: false, message: INVALID_FIELD_MESSAGE });
    }

    // Aynı öğrenci numarası veya email ile başka bir başvuru var mı kontrol et
    const existingSubmission = await Submission.findOne({
      $or: [
        { studentId, submissionType: "general" },
        { email, submissionType: "general" },
        { phone, submissionType: "general" }
      ]
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: "Bu öğrenci numarası, e-posta veya telefon ile daha önce başvuru yapılmış."
      });
    }

    // Yeni başvuru oluştur
    const submission = await Submission.create({
      submissionType: "general",
      name,
      studentId,
      email,
      phone,
      faculty,
      department,
      grade
    });

    logger.debug(`Yeni genel başvuru alındı: ${name} (${email})`);

    return res.status(201).json({
      success: true,
      message: "Başvurunuz başarıyla alındı. Teşekkür ederiz.",
      data: { _id: submission._id }
    });
  } catch (error) {
    logger.error(`Genel başvuru oluşturulamadı: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};

// @desc    Teknik başvuru oluştur
// @route   POST /submissions/technical/:slug
// @access  Public
export const createTechnicalSubmission = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, studentId, email, phone, faculty, department, grade, ...customFields } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !studentId || !email || !phone || !faculty || !department || grade === undefined || grade === null || grade === '') {
      return res.status(400).json({
        success: false,
        message: "Lütfen tüm zorunlu alanları doldurunuz."
      });
    }

    // Geçerli bir teknik kategori mi kontrol et
    const validCategories = ["mobil-web", "ai", "game"];
    if (!validCategories.includes(slug)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz başvuru kategorisi."
      });
    }

    // Custom fields validasyonu
    const allowedCustomFields = [
      "question_interests",
      "question_github",
      "question_portfolio",
      "question_experience",
      "question_motivation",
      "question_linkedin",
      "question_itchio"
    ];

    const customFieldKeys = Object.keys(customFields);
    const invalidFields = customFieldKeys.filter(key => !allowedCustomFields.includes(key));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Geçersiz alanlar tespit edildi. Lütfen geçerli alanlar gönderiniz.`
      });
    }

    if (![name, studentId, email, phone, faculty, department].every((v) => isText(v)) ||
        !Object.values(customFields).every((v) => isText(v, 5000))) {
      return res.status(400).json({ success: false, message: INVALID_FIELD_MESSAGE });
    }

    // Aynı öğrenci numarası veya email ile aynı kategoride başka bir başvuru var mı kontrol et
    const existingSubmission = await Submission.findOne({
      $and: [
        { submissionType: "technical" },
        { technicalCategory: slug },
        { $or: [{ studentId }, { email }, { phone }] }
      ]
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: `Bu kategoride (${slug}) daha önce başvuru yaptınız.`
      });
    }

    // Yeni teknik başvuru oluştur
    const submission = await Submission.create({
      submissionType: "technical",
      technicalCategory: slug,
      name,
      studentId,
      email,
      phone,
      faculty,
      department,
      grade,
      customFields
    });

    logger.debug(`Yeni teknik başvuru alındı: ${name} (${email}) - Kategori: ${slug}`);

    return res.status(201).json({
      success: true,
      message: "Teknik takım başvurunuz başarıyla alındı. Teşekkür ederiz.",
      data: { _id: submission._id }
    });
  } catch (error) {
    logger.error(`Teknik başvuru oluşturulamadı: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};

// @desc    Tüm başvuruları getir
// @route   GET /submissions
// @access  Private
export const getAllSubmissions = async (req, res) => {
  try {
    // Filtreleme için query parametrelerini al
    const {
      type,
      category,
      status,
      sort = "createdAt",
      order = "desc"
    } = req.query;
    const search = toSearchPattern(req.query.search);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);

    // Temel filtre nesnesini oluştur
    const filter = {};

    // Filtreleri ekle
    if (type) filter.submissionType = type;
    if (category && type === "technical") filter.technicalCategory = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: mongoose.trusted({ $regex: search, $options: "i" }) },
        { email: mongoose.trusted({ $regex: search, $options: "i" }) },
        { studentId: mongoose.trusted({ $regex: search, $options: "i" }) }
      ];
    }

    // Toplam kayıt sayısını hesapla
    const total = await Submission.countDocuments(filter);

    // Sıralama yönünü belirle
    const sortOrder = order === "asc" ? 1 : -1;
    
    // Sorguyu oluştur ve veritabanından çek
    const submissions = await Submission.find(filter).select('-__v')
      .sort({ [sort]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Başvurular başarıyla listelendi.",
      data: submissions,
      count: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    logger.error(`Başvurular listelenirken hata oluştu: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};

// @desc    Tek bir başvuru detayını getir
// @route   GET /submissions/:id
// @access  Private
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz başvuru ID'si."
      });
    }

    // Başvuruyu bul
    const submission = await Submission.findById(id).lean();

    // Başvuru bulunamadıysa 404 döndür
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Başvuru bulunamadı."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Başvuru detayları başarıyla getirildi.",
      data: submission
    });
  } catch (error) {
    logger.error(`Başvuru detayları getirilirken hata oluştu: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};

// @desc    Başvuruları CSV formatında dışa aktar
// @route   GET /submissions/export
// @access  Private
export const exportSubmissionsToCSV = async (req, res) => {
  try {
    // Filtreleme için query parametrelerini al
    const { type, category, status } = req.query;

    // Temel filtre nesnesini oluştur
    const filter = {};

    // Filtreleri ekle
    if (type) filter.submissionType = type;
    if (category && type === "technical") filter.technicalCategory = category;
    if (status) filter.status = status;

    // Başvuruları getir
    const submissions = await Submission.find(filter).lean();

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dışa aktarılacak başvuru bulunamadı."
      });
    }

    // Tüm customFields anahtarlarını dinamik olarak topla
    const allCustomKeys = [
      ...new Set(
        submissions.flatMap(sub => Object.keys(sub.customFields || {}))
      )
    ];

    // CSV dönüştürme işlemi için temel alanları hazırla
    const baseFields = [
      { label: 'Başvuru Tipi', value: 'submissionType' },
      { label: 'Ad', value: 'name' },
      { label: 'Öğrenci No', value: 'studentId' },
      { label: 'E-posta', value: 'email' },
      { label: 'Telefon', value: 'phone' },
      { label: 'Fakülte', value: 'faculty' },
      { label: 'Bölüm', value: 'department' },
      { label: 'Sınıf', value: 'grade' },
      { label: 'Durum', value: 'status' },
      { label: 'Başvuru Tarihi', value: row => new Date(row.createdAt).toLocaleString('tr-TR') }
    ];

    // Yalnızca teknik başvurular için teknik kategori ekle
    if (type === "technical" || submissions.some(s => s.submissionType === "technical")) {
      baseFields.splice(8, 0, { label: 'Teknik Kategori', value: 'technicalCategory' });
    }

    // Custom field’ları ekle
    const customFieldDefs = allCustomKeys.map(key => ({
      label: key,
      value: row => (row.customFields && row.customFields[key]) ? row.customFields[key] : ''
    }));

    const fields = [...baseFields, ...customFieldDefs];

    // JSON'dan CSV'ye dönüştür
    const json2csvParser = new Parser({ fields, formatters: { string: csvString } });
    const csv = json2csvParser.parse(submissions);

    // CSV dosyasını indirilecek şekilde gönder
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');

    logger.debug(`Başvurular CSV formatında dışa aktarıldı: ${submissions.length} başvuru`);
    return res.status(200).send(csv);

  } catch (error) {
    logger.error(`Başvurular dışa aktarılırken hata oluştu: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};

// @desc    Başvuru güncelle (sadece status ve reviewNotes)
// @route   PATCH /submissions/:id
// @access  Private/Admin
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body || {};

    // ObjectId doğrulama
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz başvuru ID'si."
      });
    }

    // Güncellenecek alan var mı?
    const update = {};
    const allowedStatuses = ["pending", "reviewed", "accepted", "rejected"];

    if (typeof status !== "undefined") {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz durum değeri."
        });
      }
      update.status = status;
    }

    if (typeof reviewNotes !== "undefined") {
      if (typeof reviewNotes !== "string") {
        return res.status(400).json({
          success: false,
          message: "reviewNotes metin olmalıdır."
        });
      }
      update.reviewNotes = reviewNotes.trim();
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Güncellenecek alan bulunamadı. (status veya reviewNotes gönderiniz)"
      });
    }

    // Güncelleme işlemi
    const updated = await Submission.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: 'after', runValidators: true }
    )
      .select('-__v')
      .lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Başvuru bulunamadı."
      });
    }

    logger.debug(`Başvuru güncellendi: ${id} (alanlar: ${Object.keys(update).join(', ')})`);

    return res.status(200).json({
      success: true,
      message: "Başvuru başarıyla güncellendi."
    });
  } catch (error) {
    logger.error(`Başvuru güncellenemedi: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};

// Panelden silme kapsamları. Varsayılan bir "hepsi" yok; kapsam açıkça seçilir.
const PURGE_SCOPES = {
  all: {},
  general: { submissionType: "general" },
  "mobil-web": { submissionType: "technical", technicalCategory: "mobil-web" },
  ai: { submissionType: "technical", technicalCategory: "ai" },
  game: { submissionType: "technical", technicalCategory: "game" },
};

// @desc    Seçilen kapsamdaki başvuruları kalıcı olarak sil
// @route   POST /submissions/purge
// @access  Admin
export const purgeSubmissions = async (req, res) => {
  const { scope, expectedCount } = req.body ?? {};
  if (typeof scope !== "string" || !Object.hasOwn(PURGE_SCOPES, scope)) {
    return res.status(400).json({ success: false, message: "Geçersiz kapsam." });
  }
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    return res.status(400).json({ success: false, message: "Silinecek kayıt sayısı (expectedCount) gerekli." });
  }

  try {
    // Yalnızca şu an sayılan kayıtlar silinir: sayım ile silme arasında gelen
    // bir başvuru yedeksiz gitmesin.
    const ids = await Submission.find(PURGE_SCOPES[scope]).distinct("_id");
    if (ids.length !== expectedCount) {
      return res.status(409).json({
        success: false,
        message: `Kayıt sayısı değişmiş (şu an ${ids.length}). Yedeği yeniden indirip tekrar deneyin.`,
        count: ids.length
      });
    }

    const { deletedCount } = await Submission.deleteMany({ _id: mongoose.trusted({ $in: ids }) });
    // Başvuranlara ait hiçbir bilgi loglanmaz; yalnızca kapsam, sayı ve işlemi yapan.
    logger.info(`Başvurular silindi: kapsam=${scope}, ${deletedCount} kayıt (${req.user.email})`);

    return res.status(200).json({ success: true, message: `${deletedCount} başvuru silindi.`, deletedCount });
  } catch (error) {
    logger.error(`Başvurular silinemedi: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz."
    });
  }
};
