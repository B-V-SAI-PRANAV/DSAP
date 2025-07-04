import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;
