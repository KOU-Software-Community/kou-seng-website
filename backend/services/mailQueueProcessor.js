import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import MailJob from '../models/MailJob.js';
import { buildMailHtml } from '../helpers/mailTemplateBuilder.js';
import logger from '../helpers/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelayMs() {
    return (Math.floor(Math.random() * 16) + 15) * 1_000; // 15–30 sn
}

let isProcessing = false;
let processorTimer = null;

/**
 * Ana işlemci döngüsü.
 * Sıradaki 'pending' görevi alır, tüm alıcılara tek tek mail gönderir,
 * aralarında 15–30 sn bekler. Her adım MongoDB'ye kaydedilir.
 */
async function processJobs() {
    if (isProcessing) return;
    isProcessing = true;

    try {
        while (true) {
            // Atomik olarak bir pending görevi 'running' durumuna al
            const job = await MailJob.findOneAndUpdate(
                { status: 'pending' },
                { $set: { status: 'running' } },
                { sort: { createdAt: 1 }, new: true },
            );

            if (!job) break; // İşlenecek görev kalmadı

            logger.info(`Kuyruk işlemcisi görevi başlattı: ${job._id} (${job.recipients.length} alıcı)`);

            const mailUser = process.env.MAIL_USER;
            const mailAppPassword = process.env.MAIL_APP_PASSWORD;
            const mailSenderName = process.env.MAIL_SENDER_NAME || 'KOU SENG';

            if (!mailUser || !mailAppPassword) {
                logger.error('Mail kimlik bilgileri eksik; görev pending\'e alındı.');
                await MailJob.updateOne({ _id: job._id }, { $set: { status: 'pending' } });
                break;
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: mailUser, pass: mailAppPassword },
            });

            const htmlContent = buildMailHtml(job.blocks);

            // Her alıcı için gönderim döngüsü
            for (let i = job.currentIndex; i < job.recipients.length; i++) {
                // İptal kontrolü
                const fresh = await MailJob.findById(job._id).lean();
                if (!fresh || fresh.status === 'cancelled') {
                    logger.info(`Kuyruk görevi iptal edildi: ${job._id}`);
                    break;
                }

                const email = job.recipients[i];

                const mailAttachments = [
                    { filename: 'logo.png', path: path.join(assetsDir, 'logo.png'), cid: 'logo' },
                    { filename: 'teknopark-logo.png', path: path.join(assetsDir, 'teknopark-logo.png'), cid: 'teknopark-logo' },
                    ...fresh.attachments.map((att) => ({
                        filename: att.filename,
                        content: att.data,
                        contentType: att.contentType,
                    })),
                ];

                let result;
                try {
                    await transporter.sendMail({
                        from: `"${mailSenderName}" <${mailUser}>`,
                        to: email,
                        subject: fresh.subject,
                        html: htmlContent,
                        attachments: mailAttachments,
                    });
                    result = { email, status: 'sent' };
                    logger.info(`Kuyruk maili gönderildi → ${email} (görev: ${job._id})`);
                } catch (err) {
                    result = { email, status: 'failed', error: err.message };
                    logger.error(`Kuyruk maili gönderilemedi → ${email} (görev: ${job._id}): ${err.message}`);
                }

                // İlerlemeyi hemen kaydet
                await MailJob.updateOne(
                    { _id: job._id },
                    {
                        $set: { currentIndex: i + 1 },
                        $push: { results: result },
                    },
                );

                // Son alıcı değilse gecikme uygula
                if (i < job.recipients.length - 1) {
                    const delayMs = randomDelayMs();
                    const nextSendAt = new Date(Date.now() + delayMs);
                    await MailJob.updateOne({ _id: job._id }, { $set: { nextSendAt } });
                    logger.info(`Sonraki gönderim için ${Math.round(delayMs / 1000)}s bekleniyor (görev: ${job._id})`);
                    await sleep(delayMs);
                }
            }

            // Tamamlandı olarak işaretle (iptal edilmediyse)
            const updated = await MailJob.findOneAndUpdate(
                { _id: job._id, status: 'running' },
                { $set: { status: 'done', nextSendAt: null } },
                { new: true },
            );
            if (updated) {
                logger.info(`Kuyruk görevi tamamlandı: ${job._id}`);
            }
        }
    } catch (err) {
        logger.error(`Kuyruk işlemci hatası: ${err.message}`);
        // Crash durumunda running görevleri pending'e al
        await MailJob.updateMany({ status: 'running' }, { $set: { status: 'pending' } }).catch(() => {});
    } finally {
        isProcessing = false;
        // 5 saniyede bir yeni görev var mı kontrol et
        processorTimer = setTimeout(processJobs, 5_000);
    }
}

/**
 * Uygulama başlangıcında çağrılır.
 * Önceki çökmelerden kalan 'running' görevleri 'pending''e alır, ardından işlemciyi başlatır.
 */
export function startMailQueueProcessor() {
    MailJob.updateMany({ status: 'running' }, { $set: { status: 'pending' } })
        .then(() => {
            logger.info('Mail kuyruk işlemcisi başlatılıyor...');
            processJobs();
        })
        .catch((err) => logger.error(`Kuyruk başlatılamadı: ${err.message}`));
}

/**
 * Yeni görev eklendiğinde işlemciyi hemen uyandırır.
 */
export function wakeProcessor() {
    clearTimeout(processorTimer);
    processJobs();
}
