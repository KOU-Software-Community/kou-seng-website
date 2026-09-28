import ApplicationWindow from "../models/ApplicationWindow.js";
import logger from "../helpers/logger.js";
import { APPLICATION_SLUGS, DEFAULT_WINDOWS, toPublicWindow } from "../helpers/applicationWindow.js";

// Veritabanındaki kayıt; kayıt yoksa varsayılan pencere.
export const getWindow = async (slug) =>
  (await ApplicationWindow.findOne({ slug }).lean()) ?? DEFAULT_WINDOWS[slug];

// ISO 8601, saat dilimi zorunlu (Z ya da +03:00): saat dilimi olmayan metin
// sunucunun saatine göre okunur ve tarih sessizce kayardı.
const ISO_WITH_ZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
// null → null, geçerli metin → Date, diğer her şey (nesne, sayı, eksik alan) → undefined
const toDate = (value) => {
  if (value === null) return null;
  if (typeof value !== "string" || !ISO_WITH_ZONE.test(value) || Number.isNaN(Date.parse(value))) return undefined;
  return new Date(value);
};

// @desc    Başvuru formlarının açık/kapalı durumu
// @route   GET /submissions/windows
// @access  Public
export const getWindows = async (req, res) => {
  try {
    const saved = await ApplicationWindow.find().lean();
    const now = new Date();
    const data = APPLICATION_SLUGS.map((slug) =>
      toPublicWindow(slug, saved.find((w) => w.slug === slug) ?? DEFAULT_WINDOWS[slug], now));
    res.set("Cache-Control", "no-store");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error(`Başvuru dönemleri getirilemedi: ${error.message}`);
    return res.status(500).json({ success: false, message: "Başvuru dönemleri getirilemedi." });
  }
};

// @desc    Bir formun açılış ve kapanış tarihini ayarla
// @route   PATCH /submissions/windows/:slug
// @access  Private (yalnızca admin)
export const updateWindow = async (req, res) => {
  const { slug } = req.params;
  if (!APPLICATION_SLUGS.includes(slug)) {
    return res.status(400).json({ success: false, message: "Geçersiz başvuru formu." });
  }
  const opensAt = toDate(req.body?.opensAt);
  const closesAt = toDate(req.body?.closesAt);
  if (opensAt === undefined || closesAt === undefined) {
    return res.status(400).json({ success: false, message: "Tarih geçersiz." });
  }
  if (closesAt && !opensAt) {
    return res.status(400).json({ success: false, message: "Kapanış tarihi için açılış tarihi gerekli." });
  }
  if (closesAt && closesAt <= opensAt) {
    return res.status(400).json({ success: false, message: "Kapanış tarihi açılış tarihinden sonra olmalı." });
  }

  try {
    const saved = await ApplicationWindow.findOneAndUpdate(
      { slug },
      { opensAt, closesAt, updatedBy: req.user._id },
      { upsert: true, returnDocument: "after", runValidators: true }
    ).lean();
    const when = (d) => d?.toISOString() ?? "-";
    logger.info(`Başvuru dönemi güncellendi: ${slug} ${when(opensAt)} → ${when(closesAt)} (${req.user.email})`);
    return res.status(200).json({ success: true, data: toPublicWindow(slug, saved) });
  } catch (error) {
    logger.error(`Başvuru dönemi güncellenemedi: ${error.message}`);
    return res.status(500).json({ success: false, message: "Başvuru dönemi güncellenemedi." });
  }
};
