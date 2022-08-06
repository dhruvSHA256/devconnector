const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.JWT_TOKEN;

if (!JWT_TOKEN) {
    console.error('[error]: The "JWT_TOKEN" environment variable is required');
    process.exit(1);
}

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'Authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_TOKEN);
        req.user = decoded.user;
    } catch (err) {
        res.status(401).json({ msg: 'Invalid Token' });
    }

    next();
};
