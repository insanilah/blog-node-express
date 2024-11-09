// src/controllers/authController.js
import authService from '../services/authService.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Response from '../utils/Response.js';
import jwtConfig from '../config/jwt.js';

const register = async (req, res) => {
    const { email, password, username, name } = req.body;
    const response = await authService.registerUser(email, password, username, name);

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    const resp = new Response("200", "User registered successfully", response);
    return res.status(200).json(resp);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const response = await authService.loginUser(email, password);

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    const resp = new Response("200", "Success", response);
    return res.status(200).json(resp);
};

const oauthCallback = (req, res, provider) => {
    const user = req.user;  // Passport stores user in req.user
    
    const message = `Login with ${provider} successful`;
    const generateToken = jwtConfig.generateToken(user);
    const accessToken = jwtConfig.createObjectToken(generateToken);
    
    const resp = new Response("200", message, accessToken);
    return res.status(200).json(resp);
};

export default {
    register,
    login,
    oauthCallback
};