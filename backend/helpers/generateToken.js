import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    // Ömür sabit ve çerezle aynı (SESSION_MS); ortam değişkeniyle uzatılamaz.
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

export default generateToken;