import jwt from 'jsonwebtoken';

const JWT_SECRET = 'Rez@0019';

// Create a JWT
export function createToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1y' });
}

// Verify a JWT
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}
