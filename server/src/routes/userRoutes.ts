import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/progress', authenticate, UserController.getUserProgress); // Fixed method name
router.post('/progress', authenticate, UserController.updateUserProgress); // Fixed method name
router.get('/progress/summary', authenticate, UserController.getUserProgressSummary);
router.get('/progress/detailed', authenticate, UserController.getUserDetailedProgress);
router.get('/settings', authenticate, UserController.getUserSettings);
router.put('/settings', authenticate, UserController.updateUserSettings);
router.get('/dashboard-stats', authenticate, UserController.getUserDashboardStats);
router.post('/quiz-performance', authenticate, UserController.updateQuizPerformance);
router.post('/adaptive-learning-path', authenticate, UserController.getAdaptiveLearningPath);
router.get('/personal-analytics', authenticate, UserController.getPersonalAnalytics);
router.get('/next-topic/:topicId', authenticate, UserController.getNextRecommendedTopic);
router.get('/topic-completion/:topicId', authenticate, UserController.checkTopicCompletion);
router.get('/initial-setup-status', authenticate, UserController.getInitialSetupStatus);
router.post('/mark-initial-setup-complete', authenticate, UserController.markInitialSetupComplete);
router.get('/problem-completion/:problemId', authenticate, UserController.getProblemCompletionStatus);
router.post('/problem-completion', authenticate, UserController.updateProblemCompletion);
router.get('/topic-problem-progress/:topicId', authenticate, UserController.getTopicProblemProgress);
router.get('/resource-completion/:resourceId', authenticate, UserController.getResourceCompletionStatus);
router.post('/resource-completion', authenticate, UserController.updateResourceCompletion);
router.get('/subtopic-completion/:subtopicId', authenticate, UserController.getSubtopicCompletionStatus);
router.post('/subtopic-completion', authenticate, UserController.updateSubtopicCompletion);
router.get('/known-topics', authenticate, UserController.getKnownTopics);
router.post('/known-topics', authenticate, UserController.setKnownTopics);

export default router;
