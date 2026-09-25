import mongoose from 'mongoose';
import logger from '../helpers/logger.js';

// @desc    Sistem sağlık durumunu kontrol et
// @route   GET /health
// @access  Public
const getHealthStatus = async (req, res) => {
    try {
        // Veritabanı bağlantı durumunu kontrol et
        const dbState = mongoose.connection.readyState;
        const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
        
        // Herkese açık uç: Node sürümü, platform ve bellek bilgisi bilerek yok.
        const systemInfo = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: {
                status: dbStatus,
                readyState: dbState
            }
        };

        // Veritabanı bağlı değilse unhealthy olarak işaretle
        if (dbState !== 1) {
            systemInfo.status = 'unhealthy';
            systemInfo.database.error = 'Veritabanı bağlantısı kurulamadı';
        }

        logger.debug(`Health check yapıldı - Durum: ${systemInfo.status}`);

        return res.status(200).json({
            success: true,
            message: "Sistem sağlık durumu başarıyla getirildi.",
            data: systemInfo
        });
    } catch (error) {
        logger.error(`Health check sırasında hata oluştu: ${error.message}`);
        
        return res.status(500).json({
            success: false,
            message: "Sistem sağlık durumu kontrol edilirken bir hata oluştu.",
            data: {
                status: 'unhealthy',
                timestamp: new Date().toISOString()
            }
        });
    }
};

export { getHealthStatus };
