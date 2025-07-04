import { Router } from 'express';
import PathController from '../controllers/pathController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/topics', PathController.getTopics);
router.get('/path/mastery', PathController.getMasteryPath);
router.get('/path/full', PathController.getFullPath);
router.get('/topics/:id', PathController.getTopicDetails);
router.get('/resources/topic/:topicId', PathController.getTopicResources);

// Protected routes (authentication required)
router.post('/path', authenticate, PathController.generatePath);
router.get('/mastery/:id', authenticate, PathController.getMasteryTopicDetails);
router.get('/problems/topic/:topicId', authenticate, PathController.getTopicProblems);
router.post('/problems/submit', authenticate, PathController.submitProblemSolution);

export default router;
