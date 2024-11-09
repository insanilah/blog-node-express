import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const createObjectToken = (token) => {
    const accessToken = { accessToken: token };
    return accessToken;
};

export default {
    generateToken,
    createObjectToken
};