const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers?.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error('Unauthorized');
            }
            req.user=decoded.user
            next();
        });
    } else {
        res.status(401);
        throw new Error('Unauthorized - No token provided');
    }
});

module.exports = validateToken;
