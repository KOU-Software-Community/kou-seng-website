import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: true, trim: true, lowercase: true, unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz']
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'web', 'ai', 'game', 'sponsor', 'user'], default: 'user' }
}, {
    timestamps: true
});

export default mongoose.model("User", UserSchema);