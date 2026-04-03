const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const generateToken = ({ email, userId }) => {
    return jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: '1h' });
}

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };