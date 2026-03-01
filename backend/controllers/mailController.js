import path from 'path';
import { fileURLToPath } from 'url';
import { getTransporter } from '../helpers/mailTransporter.js';
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
        const mailSenderName = process.env.MAIL_SENDER_NAME || 'KOU SENG';

        let transporter;
        try {
            transporter = getTransporter();
        } catch {
            logger.error('Mail kimlik bilgileri eksik: MAIL_USER veya MAIL_APP_PASSWORD tanımlı değil.');
            return res.status(500).json({
                success: false,
                message: 'Mail gönderimi yapılandırılmamış. Lütfen yönetici ile iletişime geçiniz.'
            });
        }

        const htmlContent = buildMailHtml(blocks);

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

        // Kullanıcının yüklediği dosya ekleri (opsiyonel, birden fazla olabilir)
        for (const file of (req.files ?? [])) {
            attachments.push({
                filename: file.originalname,
                content: file.buffer,
            });
        }

        await transporter.sendMail({
            from: `"${mailSenderName}" <${mailUser}>`,
            to,
            subject,
            html: htmlContent,
            attachments,
        });

        const attachmentInfo = req.files?.length
            ? ` | ekler: ${req.files.map(f => f.originalname).join(', ')}`
            : '';
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
