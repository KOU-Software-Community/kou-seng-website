import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
        type: String, required: true, trim: true, lowercase: true, maxlength: 254,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz'],
    },
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    isRead: { type: Boolean, default: false }
},
    { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
