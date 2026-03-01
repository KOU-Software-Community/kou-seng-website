import MailJob from '../models/MailJob.js';
import logger from '../helpers/logger.js';
import { wakeProcessor } from '../services/mailQueueProcessor.js';

// Toplam ek boyutu sınırı (MongoDB BSON 16 MB limitini aşmamak için)
const MAX_TOTAL_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

const emailRegex = /^\S+@\S+\.\S+$/;

/** Hassas/büyük alanları çıkarır; API yanıtı için güvenli obje döner */
function sanitizeJob(job) {
    return {
        id: job._id ?? job.id,
        subject: job.subject,
        recipients: job.recipients,
        currentIndex: job.currentIndex,
        status: job.status,
        results: job.results ?? [],
        nextSendAt: job.nextSendAt ?? null,
        createdAt: job.createdAt,
        // Ek verisi (Buffer) gönderilmez; yalnızca meta bilgiler
        attachments: (job.attachments ?? []).map((a) => ({
            filename: a.filename,
            contentType: a.contentType,
        })),
    };
}

// @desc    Mail kuyruğuna görev ekle
// @route   POST /mail/queue
// @access  Private/SponsorOrAdmin
export const createMailJob = async (req, res) => {
    try {
        let blocks;
        try {
            blocks = JSON.parse(req.body.blocks || '[]');
        } catch {
            return res.status(400).json({ success: false, message: 'Geçersiz blok verisi.' });
        }

        const { subject } = req.body;

        // Virgülle ayrılmış alıcı listesi
        const recipientsRaw = (req.body.recipients || '')
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean);

        if (!subject || !recipientsRaw.length || !Array.isArray(blocks) || blocks.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Konu, en az bir alıcı ve içerik bloğu zorunludur.',
            });
        }

        const validRecipients = recipientsRaw.filter((e) => emailRegex.test(e));
        if (!validRecipients.length) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli e-posta adresi bulunamadı.',
            });
        }

        // Toplam ek boyutu kontrolü
        const totalSize = (req.files ?? []).reduce((sum, f) => sum + f.size, 0);
        if (totalSize > MAX_TOTAL_ATTACHMENT_BYTES) {
            return res.status(400).json({
                success: false,
                message: `Toplam ek boyutu 10 MB'ı aşıyor (şu an: ${(totalSize / 1024 / 1024).toFixed(1)} MB). Daha küçük dosyalar kullanın.`,
            });
        }

        const attachments = (req.files ?? []).map((f) => ({
            filename: f.originalname,
            contentType: f.mimetype,
            data: f.buffer,
        }));

        const job = await MailJob.create({
            createdBy: req.user._id,
            subject,
            recipients: validRecipients,
            blocks,
            attachments,
        });

        logger.info(
            `Mail kuyruğuna görev eklendi: ${validRecipients.length} alıcı` +
            (attachments.length ? ` · ${attachments.length} ek` : '') +
            ` (gönderen: ${req.user.email})`,
        );

        wakeProcessor();

        return res.status(201).json({
            success: true,
            message: 'Görev kuyruğa eklendi.',
            job: sanitizeJob(job),
        });
    } catch (error) {
        logger.error(`Mail kuyruğu görev oluşturma hatası: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Görev oluşturulamadı.' });
    }
};

// @desc    Kullanıcının görevlerini listele (admin tüm görevleri görür)
// @route   GET /mail/queue
// @access  Private/SponsorOrAdmin
export const getMailJobs = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

        const jobs = await MailJob.find(filter)
            .select('-attachments.data') // Binary veriyi gönderme
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return res.status(200).json({
            success: true,
            jobs: jobs.map(sanitizeJob),
        });
    } catch (error) {
        logger.error(`Mail kuyruk listeleme hatası: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Görevler listelenemedi.' });
    }
};

// @desc    Görevi iptal et (pending veya running)
// @route   PATCH /mail/queue/:id/cancel
// @access  Private/SponsorOrAdmin
export const cancelMailJob = async (req, res) => {
    try {
        const job = await MailJob.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Görev bulunamadı.' });
        }

        if (
            job.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ success: false, message: 'Erişim engellendi.' });
        }

        if (job.status === 'done' || job.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Bu görev zaten tamamlandı veya iptal edildi.',
            });
        }

        await MailJob.updateOne(
            { _id: job._id },
            { $set: { status: 'cancelled', nextSendAt: null } },
        );

        logger.info(`Mail kuyruğu görevi iptal edildi: ${job._id} (${req.user.email})`);
        return res.status(200).json({ success: true, message: 'Görev iptal edildi.' });
    } catch (error) {
        logger.error(`Mail kuyruğu iptal hatası: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Görev iptal edilemedi.' });
    }
};

// @desc    Tamamlanmış/iptal edilmiş görevi sil
// @route   DELETE /mail/queue/:id
// @access  Private/SponsorOrAdmin
export const deleteMailJob = async (req, res) => {
    try {
        const job = await MailJob.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Görev bulunamadı.' });
        }

        if (
            job.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ success: false, message: 'Erişim engellendi.' });
        }

        if (job.status === 'pending' || job.status === 'running') {
            return res.status(400).json({
                success: false,
                message: 'Aktif görev silinemez. Önce iptal edin.',
            });
        }

        await MailJob.deleteOne({ _id: job._id });

        logger.info(`Mail kuyruğu görevi silindi: ${job._id} (${req.user.email})`);
        return res.status(200).json({ success: true, message: 'Görev silindi.' });
    } catch (error) {
        logger.error(`Mail kuyruğu silme hatası: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Görev silinemedi.' });
    }
};
