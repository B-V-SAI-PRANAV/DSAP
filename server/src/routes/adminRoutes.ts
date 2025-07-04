import express from 'express';
import AdminController from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(authenticate);
router.use(requireAdmin);

// User Management
router.get('/stats', AdminController.getAdminStats);
router.get('/users', AdminController.getUsersList);
router.post('/users', AdminController.createUser);
router.put('/users/:userId', AdminController.updateUser);
router.delete('/users/:userId', AdminController.deleteUser);
router.patch('/users/:userId/status', AdminController.updateUserStatus);
router.get('/users/:userId/analytics', AdminController.getUserAnalytics);

// Topic Management
router.get('/topics', AdminController.getAllTopics);
router.post('/topics', AdminController.createTopic);
router.put('/topics/:topicId', AdminController.updateTopic);
router.delete('/topics/:topicId', AdminController.deleteTopic);

// Subtopic Management
router.post('/topics/:topicId/subtopics', AdminController.addSubtopic);
router.put('/topics/:topicId/subtopics/:subtopicId', AdminController.updateSubtopic);
router.delete('/topics/:topicId/subtopics/:subtopicId', AdminController.deleteSubtopic);

// Resource Management
router.get('/resources', AdminController.getAllResources);
router.post('/resources', AdminController.createResource);
router.put('/resources/:resourceId', AdminController.updateResource);
router.delete('/resources/:resourceId', AdminController.deleteResource);

// Quiz Management
router.get('/quiz-questions', AdminController.getAllQuizQuestions);
router.post('/quiz-questions', AdminController.createQuizQuestion);
router.put('/quiz-questions/:questionId', AdminController.updateQuizQuestion);
router.delete('/quiz-questions/:questionId', AdminController.deleteQuizQuestion);

// Problem Management
router.get('/problems', AdminController.getAllProblems);
router.post('/problems', AdminController.createProblem);
router.put('/problems/:problemId', AdminController.updateProblem);
router.delete('/problems/:problemId', AdminController.deleteProblem);

// Analytics
router.get('/analytics', AdminController.getAdminAnalytics);
router.get('/learning-path-analytics', AdminController.getLearningPathAnalytics);

// System Settings
router.get('/settings', AdminController.getSystemSettings);
router.put('/settings', AdminController.updateSystemSettings);
router.get('/health', AdminController.getSystemHealth);
router.post('/backup', AdminController.backupDatabase);
router.post('/cache/clear', AdminController.clearCache);

// Content Management
router.post('/upload-resource', AdminController.uploadResource);
router.post('/bulk-import-topics', AdminController.bulkImportTopics);
router.post('/bulk-import-resources', AdminController.bulkImportResources);

export default router; 