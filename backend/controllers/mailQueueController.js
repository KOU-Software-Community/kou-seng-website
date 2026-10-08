import mongoose from 'mongoose';
import MailJob from '../models/MailJob.js';
import logger from '../helpers/logger.js';
import { wakeProcessor } from '../services/mailQueueProcessor.js';
import {
    isSingleEmail, isValidSubject, parseBlocks,
    MAX_RECIPIENTS, MAX_ACTIVE_JOBS, MAX_SUBJECT_LENGTH, MAX_TOTAL_ATTACHMENT_BYTES,
} from '../helpers/mailInput.js';

// Aktif görev sayımı ile create arasında aynı kullanıcının ikinci isteği
// beklemez, reddedilir; yoksa eşzamanlı istekler 5 sınırını birlikte geçerdi.
// ponytail: süreç içi kilit, tek backend süreci varsayıyor (kuyruk işlemcisi de
// öyle). Birden fazla instance'a geçilirse sayım create'ten sonra yapılmalı.
const creatingFor = new Set();

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
        const { subject, recipients } = req.body;

        if (!isValidSubject(subject)) {
            return res.status(400).json({
                success: false,
                message: `Konu zorunludur ve en fazla ${MAX_SUBJECT_LENGTH} karakter olabilir.`,
            });
        }

        const parsed = parseBlocks(req.body.blocks);
        if (parsed.error) {
            return res.status(400).json({ success: false, message: parsed.error });
        }
        const { blocks } = parsed;

        // Virgülle ayrılmış alıcı listesi; tekrarlar atılır (tek kişiye yüzlerce mail gitmesin)
        const recipientsRaw = [...new Set((typeof recipients === 'string' ? recipients : '')
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean))];

        if (!recipientsRaw.length) {
            return res.status(400).json({ success: false, message: 'En az bir alıcı zorunludur.' });
        }

        if (recipientsRaw.length > MAX_RECIPIENTS) {
            return res.status(400).json({
                success: false,
                message: `Bir görevde en fazla ${MAX_RECIPIENTS} alıcı olabilir (şu an: ${recipientsRaw.length}).`,
            });
        }

        const validRecipients = recipientsRaw.filter(isSingleEmail);
        if (!validRecipients.length) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli e-posta adresi bulunamadı.',
            });
        }

        // Toplam ek boyutu kontrolü (MongoDB BSON 16 MB limitini aşmamak için)
        const totalSize = (req.files ?? []).reduce((sum, f) => sum + f.size, 0);
        if (totalSize > MAX_TOTAL_ATTACHMENT_BYTES) {
            return res.status(400).json({
                success: false,
                message: `Toplam ek boyutu 10 MB'ı aşıyor (şu an: ${(totalSize / 1024 / 1024).toFixed(1)} MB). Daha küçük dosyalar kullanın.`,
            });
        }

        const userId = String(req.user._id);
        if (creatingFor.has(userId)) {
            return res.status(429).json({ success: false, message: 'Önceki görev isteğiniz hâlâ işleniyor.' });
        }
        creatingFor.add(userId);
        let job;
        try {
            // sanitizeFilter açık: $in operatörü trusted() ister.
            const activeJobs = await MailJob.countDocuments({
                createdBy: req.user._id,
                status: mongoose.trusted({ $in: ['pending', 'running'] }),
            });
            if (activeJobs >= MAX_ACTIVE_JOBS) {
                return res.status(400).json({
                    success: false,
                    message: `Aynı anda en fazla ${MAX_ACTIVE_JOBS} aktif görev olabilir. Önceki görevlerin bitmesini bekleyin ya da iptal edin.`,
                });
            }

            job = await MailJob.create({
                createdBy: req.user._id,
                subject,
                recipients: validRecipients,
                blocks,
                attachments: (req.files ?? []).map((f) => ({
                    filename: f.originalname,
                    contentType: f.mimetype,
                    data: f.buffer,
                })),
            });
        } finally {
            creatingFor.delete(userId);
        }

        logger.info(
            `Mail kuyruğuna görev eklendi: ${validRecipients.length} alıcı` +
            (job.attachments.length ? ` · ${job.attachments.length} ek` : '') +
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
