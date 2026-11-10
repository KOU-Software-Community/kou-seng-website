import mongoose from "mongoose";
import { Parser } from "json2csv";
import JamApplication from "../models/JamApplication.js";
import logger from "../helpers/logger.js";
import { parseJamApplication, DISCIPLINES, QUESTIONS } from "../helpers/jamInput.js";
import { isWindowOpen } from "../helpers/applicationWindow.js";
import { getWindow } from "./applicationWindowsController.js";
import { csvString } from "./submissionsController.js";

const SERVER_ERROR = { success: false, message: "Sunucu hatası, lütfen daha sonra tekrar deneyiniz." };

// @desc    Game jam takım başvurusu
// @route   POST /gamejam
// @access  Public (başvuru dönemi açıkken)
export const createJamApplication = async (req, res) => {
  try {
    if (!isWindowOpen(await getWindow("gamejam"))) {
      return res.status(403).json({ success: false, message: "Bu başvuru şu anda kapalı." });
    }
    const data = parseJamApplication(req.body);
    if (!data) {
      return res.status(400).json({ success: false, message: "Form eksik veya hatalı. Lütfen alanları kontrol ediniz." });
    }

    // Takım adı büyük/küçük harf duyarsız tekil; bir lider tek takım başvurusu yapar
    const existing = await JamApplication.findOne({
      $or: [{ teamName: data.teamName }, { "leader.email": data.leader.email }, { "leader.phone": data.leader.phone }],
    }).collation({ locale: "tr", strength: 2 });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Bu takım adıyla ya da bu liderin e-posta/telefonuyla daha önce başvuru yapılmış.",
      });
    }

    const application = await JamApplication.create(data);
    logger.debug(`Yeni game jam başvurusu: ${application._id}`);
    return res.status(201).json({
      success: true,
      message: "Başvurunuz alındı. Teşekkür ederiz.",
      data: { _id: application._id },
    });
  } catch (error) {
    logger.error(`Game jam başvurusu oluşturulamadı: ${error.name}`);
    return res.status(500).json(SERVER_ERROR);
  }
};

// @desc    Tüm game jam başvuruları
// @route   GET /gamejam
// @access  Admin
export const listJamApplications = async (req, res) => {
  try {
    // shortcut: sayfalama yok, tek etkinlikte birkaç yüz takımı geçmez; geçerse sayfala
    const data = await JamApplication.find().select("-__v").sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data, count: data.length });
  } catch (error) {
    logger.error(`Game jam başvuruları listelenemedi: ${error.message}`);
    return res.status(500).json(SERVER_ERROR);
  }
};

// Kişi başına bir satır; takım bilgisi ve lider cevapları lider satırında.
const toRows = (applications) =>
  applications.flatMap((a) =>
    [a.leader, ...a.members].map((p, i) => ({
      team: a.teamName,
      role: i === 0 ? "Lider" : "Üye",
      ...p,
      disciplines: p.disciplines.map((d) => DISCIPLINES[d] ?? d).join(", "),
      // Üyelerin izni formda alınmıyor, etkinlikte kendilerine sorulur
      mediaConsent: i === 0 ? (p.mediaConsent ? "Evet" : "Hayır") : "",
      answers: i === 0 ? a.answers ?? {} : {},
      createdAt: new Date(a.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }),
    }))
  );

// @desc    Game jam başvurularını CSV olarak indir
// @route   GET /gamejam/export
// @access  Admin
export const exportJamApplications = async (req, res) => {
  try {
    const applications = await JamApplication.find().sort({ createdAt: 1 }).lean();
    if (applications.length === 0) {
      return res.status(404).json({ success: false, message: "Dışa aktarılacak başvuru bulunamadı." });
    }
    const fields = [
      { label: "Takım", value: "team" },
      { label: "Rol", value: "role" },
      { label: "Ad Soyad", value: "name" },
      { label: "E-posta", value: "email" },
      { label: "Telefon", value: "phone" },
      { label: "Doğum Tarihi", value: "birthDate" },
      { label: "Üniversite", value: "university" },
      { label: "Bölüm", value: "department" },
      { label: "CV", value: "cvUrl" },
      { label: "Oyun Projesi", value: "projectUrl" },
      { label: "Uzmanlık", value: "disciplines" },
      { label: "Diğer Uzmanlık", value: "otherDiscipline" },
      { label: "Görsel/İşitsel İzin", value: "mediaConsent" },
      ...Object.entries(QUESTIONS).map(([key, label]) => ({ label, value: (row) => row.answers[key] ?? "" })),
      { label: "Başvuru Tarihi", value: "createdAt" },
    ];
    // Türkçe Excel: ';' ayırıcı ve BOM (bkz. exportSubmissionsToCSV)
    const parser = new Parser({ fields, delimiter: ";", withBOM: true, defaultValue: "", formatters: { string: csvString } });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=gamejam.csv");
    return res.status(200).send(parser.parse(toRows(applications)));
  } catch (error) {
    logger.error(`Game jam başvuruları dışa aktarılamadı: ${error.message}`);
    return res.status(500).json(SERVER_ERROR);
  }
};

// @desc    Tüm game jam başvurularını kalıcı olarak sil (önce yedek alınmalı)
// @route   POST /gamejam/purge
// @access  Admin
export const purgeJamApplications = async (req, res) => {
  const { expectedCount } = req.body ?? {};
  if (!Number.isInteger(expectedCount) || expectedCount < 1) {
    return res.status(400).json({ success: false, message: "Silinecek kayıt sayısı (expectedCount) gerekli." });
  }
  try {
    // Yalnızca şu an sayılan kayıtlar silinir: arada gelen başvuru yedeksiz gitmesin
    const ids = await JamApplication.find().distinct("_id");
    if (ids.length !== expectedCount) {
      return res.status(409).json({
        success: false,
        message: `Kayıt sayısı değişmiş (şu an ${ids.length}). Yedeği yeniden indirip tekrar deneyin.`,
        count: ids.length,
      });
    }
    const { deletedCount } = await JamApplication.deleteMany({ _id: mongoose.trusted({ $in: ids }) });
    logger.info(`Game jam başvuruları silindi: ${deletedCount} kayıt (${req.user.email})`);
    return res.status(200).json({ success: true, message: `${deletedCount} başvuru silindi.`, deletedCount });
  } catch (error) {
    logger.error(`Game jam başvuruları silinemedi: ${error.message}`);
    return res.status(500).json(SERVER_ERROR);
  }
};
