const { verifyToken } = require('../libs/jwt');

const validateRegisterUser = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || name.trim() === '' || email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    next();
}

const validateLoginUser = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    next();
}

const authenticateToken = async (req, res, next) => {
    try {
    const token = req.headers.authorization;
    // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const jwtToken = token.split(' ')[1]; // ['Bearer', <token>]

    if (!jwtToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = await verifyToken(jwtToken); // { email, userId }
    req.user = decoded; // { email, userId }

    next();

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = { validateRegisterUser, validateLoginUser, authenticateToken };