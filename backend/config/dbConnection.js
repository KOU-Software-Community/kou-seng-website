import mongoose from "mongoose";
import logger from "../helpers/logger.js";

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {});
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error from connectionDB ${error}`);
        process.exit(1);
    }
}

export default ConnectDB;