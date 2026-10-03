import path from 'path';
import { fileURLToPath } from 'url';
import { getTransporter } from '../helpers/mailTransporter.js';
import { buildMailHtml } from '../helpers/mailTemplateBuilder.js';
import logger from '../helpers/logger.js';
import { isSingleEmail, isValidSubject, parseBlocks, MAX_SUBJECT_LENGTH } from '../helpers/mailInput.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');

// @desc    Sponsorluk mailini gönderir
// @route   POST /mail/send
// @access  Private/SponsorOrAdmin
const sendSponsorMail = async (req, res) => {
    try {
        const { to, subject } = req.body;

        if (!isSingleEmail(to)) {
            return res.status(400).json({
                success: false,
                message: 'Tek bir geçerli alıcı e-posta adresi giriniz.'
            });
        }

        if (!isValidSubject(subject)) {
            return res.status(400).json({
                success: false,
                message: `Konu zorunludur ve en fazla ${MAX_SUBJECT_LENGTH} karakter olabilir.`
            });
        }

        // blocks FormData'dan JSON string olarak gelir
        const parsed = parseBlocks(req.body.blocks);
        if (parsed.error) {
            return res.status(400).json({ success: false, message: parsed.error });
        }
        const { blocks } = parsed;

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
        // SMTP mesajı alıcı adresini alıntılıyor; loga yalnızca kod yazılır.
        logger.error(`Mail gönderilemedi: ${error.responseCode ?? error.code ?? error.name}`);
        return res.status(500).json({
            success: false,
            message: 'Mail gönderilirken bir hata oluştu.'
        });
    }
};

export { sendSponsorMail };
