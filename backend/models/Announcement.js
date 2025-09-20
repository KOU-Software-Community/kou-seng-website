import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true},
    category: { type: String, required: true, trim: true},
    author: { type: String, required: true, trim: true}
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);