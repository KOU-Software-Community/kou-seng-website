import path from 'path';
import { fileURLToPath } from 'url';
import MailJob from '../models/MailJob.js';
import { buildMailHtml } from '../helpers/mailTemplateBuilder.js';
import { getTransporter } from '../helpers/mailTransporter.js';
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

async function processJob(job) {
    logger.info(`Kuyruk işlemcisi görevi başlattı: ${job._id} (${job.recipients.length} alıcı)`);

    const mailUser = process.env.MAIL_USER;
    const mailSenderName = process.env.MAIL_SENDER_NAME || 'KOU SENG';

    let transporter;
    try {
        transporter = getTransporter();
    } catch (err) {
        logger.error(`Mail kimlik bilgileri eksik; görev pending'e alındı. (${job._id})`);
        await MailJob.updateOne({ _id: job._id }, { $set: { status: 'pending' } });
        return;
    }

    const htmlContent = buildMailHtml(job.blocks);

    // Ekleri Mongoose dokümanından al (Buffer tipinde gelir).
    // lean() ile sorgu yapılırsa MongoDB Binary döner — nodemailer ile uyumsuz.
    const mailAttachments = [
        { filename: 'logo.png', path: path.join(assetsDir, 'logo.png'), cid: 'logo' },
        { filename: 'teknopark-logo.png', path: path.join(assetsDir, 'teknopark-logo.png'), cid: 'teknopark-logo' },
        ...job.attachments.map((att) => ({
            filename: att.filename,
            content: att.data, // Buffer — Mongoose dokümanından
            contentType: att.contentType,
        })),
    ];

    try {
        for (let i = job.currentIndex; i < job.recipients.length; i++) {
            // İptal kontrolü için yalnızca status alanını sorgula
            const fresh = await MailJob.findById(job._id).select('status').lean();
            if (!fresh || fresh.status === 'cancelled') {
                logger.info(`Kuyruk görevi iptal edildi: ${job._id}`);
                return;
            }

            const email = job.recipients[i];

            let result;
            try {
                await transporter.sendMail({
                    from: `"${mailSenderName}" <${mailUser}>`,
                    to: email,
                    subject: job.subject,
                    html: htmlContent,
                    attachments: mailAttachments,
                });
                result = { email, status: 'sent' };
                logger.info(`Kuyruk maili gönderildi → ${email} (görev: ${job._id})`);
            } catch (err) {
                result = { email, status: 'failed', error: err.message };
                logger.error(`Kuyruk maili gönderilemedi → ${email} (görev: ${job._id}): ${err.message}`);
            }

            // İlerlemeyi kaydet
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
            { returnDocument: 'after' },
        );
        if (updated) {
            logger.info(`Kuyruk görevi tamamlandı: ${job._id}`);
        }
    } catch (err) {
        logger.error(`Görev işlenirken hata: ${job._id}: ${err.message}`);
        await MailJob.updateOne({ _id: job._id, status: 'running' }, { $set: { status: 'pending' } }).catch(() => {});
    }
}

async function processJobs() {
    if (isProcessing) return;
    isProcessing = true;

    try {
        // Tüm pending job'ları atomik olarak 'running' durumuna al ve paralel işle
        const workers = [];
        while (true) {
            const job = await MailJob.findOneAndUpdate(
                { status: 'pending' },
                { $set: { status: 'running' } },
                { sort: { createdAt: 1 }, returnDocument: 'after' },
            );
            if (!job) break;
            workers.push(processJob(job));
        }

        if (workers.length > 0) {
            await Promise.all(workers);
        }
    } catch (err) {
        logger.error(`Kuyruk işlemci hatası: ${err.message}`);
        await MailJob.updateMany({ status: 'running' }, { $set: { status: 'pending' } }).catch(() => {});
    } finally {
        isProcessing = false;
        processorTimer = setTimeout(processJobs, 5_000);
    }
}

export function startMailQueueProcessor() {
    MailJob.updateMany({ status: 'running' }, { $set: { status: 'pending' } })
        .then(() => {
            logger.info('Mail kuyruk işlemcisi başlatılıyor...');
            processJobs();
        })
        .catch((err) => logger.error(`Kuyruk başlatılamadı: ${err.message}`));
}

export function wakeProcessor() {
    clearTimeout(processorTimer);
    processJobs();
}
