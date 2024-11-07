import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json(new ErrorResponse("401", "Unauthorized, token is missing"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set user info from token to request
        // console.log("req.user:",req.user);
        next();
    } catch (error) {
        return res.status(401).json(new ErrorResponse("401", "Unauthorized, invalid token"));
    }
};

export default authMiddleware;
