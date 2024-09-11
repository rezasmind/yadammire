import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Create a JWT
export function createToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

// Verify a JWT
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
