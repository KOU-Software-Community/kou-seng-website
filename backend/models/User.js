import mongoose from "mongoose";

// Yeni şifreler için alt sınır (kullanıcı oluşturma, şifre değiştirme). Login
// formundaki min(6) bilerek aynı kaldı: kısa şifreli eski hesaplar giriş yapıp
// şifresini değiştirebilsin.
export const MIN_PASSWORD_LENGTH = 10;

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, required: true, trim: true, lowercase: true, unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz']
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'mobil-web', 'ai', 'game', 'sponsor', 'user'], default: 'user' }
}, {
    timestamps: true
});

export default mongoose.model("User", UserSchema);