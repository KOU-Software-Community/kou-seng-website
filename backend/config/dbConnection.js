import mongoose from "mongoose";
import logger from "../helpers/logger.js";

const ConnectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        // İstek gövdesinden gelen `$` anahtarlı nesneler filtrede operatör olarak
        // çalışmasın diye `$eq` ile sarılır. Bilerek operatör kullanan sorgular
        // (ör. $regex araması) mongoose.trusted() ile işaretlenmeli, yoksa sessizce
        // eşitlik aramasına döner ve sonuç gelmez.
        mongoose.set('sanitizeFilter', true);

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        logger.info(`MongoDB connected: ${conn.connection.host}`);
        
        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err}`);
        });
        
        mongoose.connection.on('disconnected', () => {
            logger.error('MongoDB disconnected');
        });
        
    } catch (error) {
        logger.error(`Error from connectionDB ${error}`);
        process.exit(1);
    }
}

export default ConnectDB;