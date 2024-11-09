// src/routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';
import passport from '../config/authConfig.js';


const router = express.Router();

// auth
router.post('/register', authController.register);
router.post('/login', authController.login);

// oauth2
router.use(passport.initialize());
// Rute Login untuk Google, GitHub, dan Facebook
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback untuk Google
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    authController.oauthCallback(req, res, 'Google');
});

// Callback untuk GitHub
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), (req, res) => {
    authController.oauthCallback(req, res, 'Github');
});

// Callback untuk Facebook
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login' }), (req, res) => {
    authController.oauthCallback(req, res, 'Facebook');
});

export default router;
