// src/routes/authRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// users
router.get('/', authMiddleware, userController.findAllUser);
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/user-activities/:username', authMiddleware, userController.getUserActivitiesByUsername);
router.get('/user-activities-summary/:username', authMiddleware, userController.aggregateUserActivitiesSortedByDay);

export default router;
