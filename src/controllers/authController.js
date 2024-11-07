// src/controllers/authController.js
import authService from '../services/authService.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const register = async (req, res) => {
    const { email, password, username, name } = req.body;
    const response = await authService.registerUser(email, password, username, name);

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    return res.status(200).json(response);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const response = await authService.loginUser(email, password);

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    return res.status(200).json(response);
};

export default {
    register,
    login
};