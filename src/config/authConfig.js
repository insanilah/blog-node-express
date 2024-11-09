import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import authService from '../services/authService.js';

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await authService.findOrCreateUser(profile, 'google');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUser(profile, 'github');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name'] // Meminta email dari Facebook
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateUser(profile, 'facebook');
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Serialize dan Deserialize User
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;