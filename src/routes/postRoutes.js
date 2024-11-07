import express from 'express';
import postController from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getAllPosts);
router.get('/:postId', authMiddleware, postController.getPostById);
router.put('/:postId', authMiddleware, postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);

export default router;
