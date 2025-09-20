import Submission from "../models/Submission.js";
import Contact from "../models/Contact.js";
import logger from "../helpers/logger.js";

// @desc    Sistem durumu istatistiklerini getir
// @route   GET /status
// @access  Private
const getSystemStatus = async (req, res) => {
    try {
        // Paralel olarak tüm sayımları yap
        const [
            pendingGeneralSubmissions,
            reviewedGeneralSubmissions,
            acceptedGeneralSubmissions,
            webTechnicalSubmissions,
            aiTechnicalSubmissions,
            gameTechnicalSubmissions,
            readContactMessages,
            unreadContactMessages
        ] = await Promise.all([
            // Bekleyen genel üye başvuru sayısı
            Submission.countDocuments({ 
                submissionType: "general", 
                status: "pending" 
            }),

            // İncelenen genel üye başvuru sayısı
            Submission.countDocuments({ 
                submissionType: "general", 
                status: "reviewed" 
            }),
            
            // Onaylanan genel üye başvuru sayısı
            Submission.countDocuments({ 
                submissionType: "general", 
                status: "accepted" 
            }),
            
            // Teknik takımların hepsine yapılan toplam başvuru sayısı
            Submission.countDocuments({ 
                submissionType: "technical",
                technicalCategory: "web" 
            }),
            
            // Teknik takımların hepsine yapılan toplam başvuru sayısı
            Submission.countDocuments({ 
                submissionType: "technical",
                technicalCategory: "ai" 
            }),

            // Teknik takımların hepsine yapılan toplam başvuru sayısı
            Submission.countDocuments({ 
                submissionType: "technical",
                technicalCategory: "game" 
            }),

            // Okunmuş iletişim mesajı sayısı
            Contact.countDocuments({ 
                isRead: true 
            }),
            
            // Okunmayı bekleyen iletişim mesajı sayısı
            Contact.countDocuments({ 
                isRead: false 
            })
        ]);

        logger.debug(`Sistem durumu istatistikleri getirildi`);

        return res.status(200).json({
            success: true,
            message: "Sistem durumu başarıyla getirildi.",
            data: {
                generalSubmissions: {
                    pending: pendingGeneralSubmissions,
                    reviewed: reviewedGeneralSubmissions,
                    accepted: acceptedGeneralSubmissions
                },
                technicalSubmissions: {
                    web: webTechnicalSubmissions,
                    ai: aiTechnicalSubmissions,
                    game: gameTechnicalSubmissions
                },
                contactMessages: {
                    read: readContactMessages,
                    unread: unreadContactMessages
                }
            }
        });
    } catch (error) {
        logger.error(`Sistem durumu getirilirken hata oluştu: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Sistem durumu getirilirken bir hata oluştu."
        });
    }
};

export { getSystemStatus };
