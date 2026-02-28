import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildMailHtml } from '../helpers/mailTemplateBuilder.js';
import logger from '../helpers/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');

const emailRegex = /^\S+@\S+\.\S+$/;

// @desc    Sponsorluk mailini gönderir
// @route   POST /mail/send
// @access  Private/SponsorOrAdmin
const sendSponsorMail = async (req, res) => {
    try {
        const { to, subject } = req.body;

        // blocks FormData'dan JSON string olarak gelir
        let blocks;
        try {
            blocks = JSON.parse(req.body.blocks || '[]');
        } catch {
            return res.status(400).json({ success: false, message: 'Geçersiz blok verisi.' });
        }

        if (!to || !subject || !Array.isArray(blocks) || blocks.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Alıcı, konu ve en az bir içerik bloğu zorunludur.'
            });
        }

        if (!emailRegex.test(to)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir alıcı e-posta adresi giriniz.'
            });
        }

        const mailUser = process.env.MAIL_USER;
        const mailAppPassword = process.env.MAIL_APP_PASSWORD;
        const mailSenderName = process.env.MAIL_SENDER_NAME || 'KOU SENG';

        if (!mailUser || !mailAppPassword) {
            logger.error('Mail kimlik bilgileri eksik: MAIL_USER veya MAIL_APP_PASSWORD tanımlı değil.');
            return res.status(500).json({
                success: false,
                message: 'Mail gönderimi yapılandırılmamış. Lütfen yönetici ile iletişime geçiniz.'
            });
        }

        const htmlContent = buildMailHtml(blocks);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailUser,
                pass: mailAppPassword,
            },
        });

        const attachments = [
            {
                filename: 'logo.png',
                path: path.join(assetsDir, 'logo.png'),
                cid: 'logo',
            },
            {
                filename: 'teknopark-logo.png',
                path: path.join(assetsDir, 'teknopark-logo.png'),
                cid: 'teknopark-logo',
            },
        ];

        // Kullanıcının yüklediği dosya eki (opsiyonel)
        if (req.file) {
            attachments.push({
                filename: req.file.originalname,
                content: req.file.buffer,
            });
        }

        await transporter.sendMail({
            from: `"${mailSenderName}" <${mailUser}>`,
            to,
            subject,
            html: htmlContent,
            attachments,
        });

        const attachmentInfo = req.file ? ` | ek: ${req.file.originalname}` : '';
        logger.info(`Sponsorluk maili gönderildi: ${to} (gönderen: ${req.user?.email}${attachmentInfo})`);

        return res.status(200).json({
            success: true,
            message: 'Mail başarıyla gönderildi.'
        });
    } catch (error) {
        logger.error(`Mail gönderilemedi: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Mail gönderilirken bir hata oluştu.',
            error: error.message
        });
    }
};

export { sendSponsorMail };
