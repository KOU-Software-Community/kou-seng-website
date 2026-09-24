import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    // JWT_EXPIRES_IN tanımsızsa jwt.sign hata fırlatıp login'i 500'e düşürüyordu.
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    return token;
}

export default generateToken;