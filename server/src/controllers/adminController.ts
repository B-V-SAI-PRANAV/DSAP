import { Request, Response } from 'express';
import Neo4jService from '../services/neo4j.service';

const neo4jService = Neo4jService;

export class AdminController {
  // User Management
  static async getAdminStats(_req: Request, res: Response) {
    try {
      const stats = await neo4jService.getAdminStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
  }

  static async getUsersList(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await neo4jService.getUsersList(page, limit);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users list:', error);
      res.status(500).json({ error: 'Failed to fetch users list' });
    }
  }

  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { active } = req.body;
      await neo4jService.updateUserStatus(userId, active);
      res.json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ error: 'Failed to update user status' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await neo4jService.createUser(username, password, email);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const userData = req.body;
      // For now, just update the status since updateUser doesn't exist yet
      await neo4jService.updateUserStatus(userId, userData.active);
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      // For now, just deactivate the user since deleteUser doesn't exist yet
      await neo4jService.updateUserStatus(userId, false);
      res.json({ message: 'User deactivated successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  // Topic Management
  static async getAllTopics(_req: Request, res: Response) {
    try {
      const topics = await neo4jService.getAllTopics();
      res.json(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      res.status(500).json({ error: 'Failed to fetch topics' });
    }
  }

  static async createTopic(req: Request, res: Response) {
    try {
      const topicData = req.body;
      const topic = await neo4jService.createTopic(topicData);
      res.status(201).json(topic);
    } catch (error) {
      console.error('Error creating topic:', error);
      res.status(500).json({ error: 'Failed to create topic' });
    }
  }

  static async updateTopic(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const topicData = req.body;
      const topic = await neo4jService.updateTopic(topicId, topicData);
      res.json(topic);
    } catch (error) {
      console.error('Error updating topic:', error);
      res.status(500).json({ error: 'Failed to update topic' });
    }
  }

  static async deleteTopic(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      await neo4jService.deleteTopic(topicId);
      res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
      console.error('Error deleting topic:', error);
      res.status(500).json({ error: 'Failed to delete topic' });
    }
  }

  static async addSubtopic(req: Request, res: Response) {
    try {
      const { topicId } = req.params;
      const subtopicData = req.body;
      const subtopic = await neo4jService.addSubtopic(topicId, subtopicData);
      res.status(201).json(subtopic);
    } catch (error) {
      console.error('Error adding subtopic:', error);
      res.status(500).json({ error: 'Failed to add subtopic' });
    }
  }

  static async updateSubtopic(req: Request, res: Response) {
    try {
      const { topicId, subtopicId } = req.params;
      const subtopicData = req.body;
      const subtopic = await neo4jService.updateSubtopic(topicId, subtopicId, subtopicData);
      res.json(subtopic);
    } catch (error) {
      console.error('Error updating subtopic:', error);
      res.status(500).json({ error: 'Failed to update subtopic' });
    }
  }

  static async deleteSubtopic(req: Request, res: Response) {
    try {
      const { topicId, subtopicId } = req.params;
      await neo4jService.deleteSubtopic(topicId, subtopicId);
      res.json({ message: 'Subtopic deleted successfully' });
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      res.status(500).json({ error: 'Failed to delete subtopic' });
    }
  }

  // Resource Management
  static async getAllResources(_req: Request, res: Response) {
    try {
      const resources = await neo4jService.getAllResources();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  }

  static async createResource(req: Request, res: Response) {
    try {
      const resourceData = req.body;
      const resource = await neo4jService.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  }

  static async updateResource(req: Request, res: Response) {
    try {
      const { resourceId } = req.params;
      const resourceData = req.body;
      const resource = await neo4jService.updateResource(resourceId, resourceData);
      res.json(resource);
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  }

  static async deleteResource(req: Request, res: Response) {
    try {
      const { resourceId } = req.params;
      await neo4jService.deleteResource(resourceId);
      res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  }

  // Analytics
  static async getAdminAnalytics(req: Request, res: Response) {
    try {
      const timeRange = req.query.timeRange as string || 'month';
      const analytics = await neo4jService.getAdminAnalytics(timeRange);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  // System Settings
  static async getSystemSettings(_req: Request, res: Response) {
    try {
      const settings = await neo4jService.getSystemSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      res.status(500).json({ error: 'Failed to fetch system settings' });
    }
  }

  static async updateSystemSettings(req: Request, res: Response) {
    try {
      const settings = req.body;
      const updatedSettings = await neo4jService.updateSystemSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating system settings:', error);
      res.status(500).json({ error: 'Failed to update system settings' });
    }
  }

  static async getSystemHealth(_req: Request, res: Response) {
    try {
      const health = await neo4jService.getSystemHealth();
      res.json(health);
    } catch (error) {
      console.error('Error fetching system health:', error);
      res.status(500).json({ error: 'Failed to fetch system health' });
    }
  }

  static async backupDatabase(_req: Request, res: Response) {
    try {
      await neo4jService.backupDatabase();
      res.json({ message: 'Database backup initiated successfully' });
    } catch (error) {
      console.error('Error backing up database:', error);
      res.status(500).json({ error: 'Failed to backup database' });
    }
  }

  static async clearCache(_req: Request, res: Response) {
    try {
      await neo4jService.clearCache();
      res.json({ message: 'Cache cleared successfully' });
    } catch (error) {
      console.error('Error clearing cache:', error);
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  }

  // Quiz Management
  static async getAllQuizQuestions(_req: Request, res: Response) {
    try {
      const questions = await neo4jService.getAllQuizQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }
  }

  static async createQuizQuestion(req: Request, res: Response) {
    try {
      const questionData = req.body;
      if (!questionData.topicId) {
        return res.status(400).json({ error: 'topicId is required to create quiz question' });
      }
      const question = await neo4jService.createQuizQuestion(questionData);
      return res.status(201).json(question);
    } catch (error) {
      console.error('Error creating quiz question:', error);
      return res.status(500).json({ error: 'Failed to create quiz question' });
    }
  }

  static async updateQuizQuestion(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      const questionData = req.body;
      const question = await neo4jService.updateQuizQuestion(questionId, questionData);
      res.json(question);
    } catch (error) {
      console.error('Error updating quiz question:', error);
      res.status(500).json({ error: 'Failed to update quiz question' });
    }
  }

  static async deleteQuizQuestion(req: Request, res: Response) {
    try {
      const { questionId } = req.params;
      await neo4jService.deleteQuizQuestion(questionId);
      res.json({ message: 'Quiz question deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      res.status(500).json({ error: 'Failed to delete quiz question' });
    }
  }

  // Problem Management
  static async getAllProblems(_req: Request, res: Response) {
    try {
      console.log('🔍 Fetching all problems...');
      const problems = await neo4jService.getAllProblems();
      console.log(`✅ Found ${problems.length} problems`);
      console.log('Sample problems:', problems.slice(0, 3));
      res.json(problems);
    } catch (error) {
      console.error('❌ Error fetching problems:', error);
      res.status(500).json({ error: 'Failed to fetch problems' });
    }
  }

  static async createProblem(req: Request, res: Response) {
    try {
      const problemData = req.body;
      const problem = await neo4jService.createProblem(problemData);
      res.status(201).json(problem);
    } catch (error) {
      console.error('Error creating problem:', error);
      res.status(500).json({ error: 'Failed to create problem' });
    }
  }

  static async updateProblem(req: Request, res: Response) {
    try {
      const { problemId } = req.params;
      const problemData = req.body;
      const problem = await neo4jService.updateProblem(problemId, problemData);
      res.json(problem);
    } catch (error) {
      console.error('Error updating problem:', error);
      res.status(500).json({ error: 'Failed to update problem' });
    }
  }

  static async deleteProblem(req: Request, res: Response) {
    try {
      const { problemId } = req.params;
      await neo4jService.deleteProblem(problemId);
      res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
      console.error('Error deleting problem:', error);
      res.status(500).json({ error: 'Failed to delete problem' });
    }
  }

  // User Analytics
  static async getUserAnalytics(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const analytics = await neo4jService.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      res.status(500).json({ error: 'Failed to fetch user analytics' });
    }
  }

  static async getLearningPathAnalytics(_req: Request, res: Response) {
    try {
      const analytics = await neo4jService.getLearningPathAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching learning path analytics:', error);
      res.status(500).json({ error: 'Failed to fetch learning path analytics' });
    }
  }

  // Content Management
  static async uploadResource(req: Request, res: Response) {
    const file = (req as Request & { file?: any }).file;
    const resourceData = req.body;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
      const resource = await neo4jService.uploadResource(file, resourceData);
      return res.status(201).json(resource);
    } catch (error) {
      console.error('Error uploading resource:', error);
      return res.status(500).json({ error: 'Failed to upload resource' });
    }
  }

  static async bulkImportTopics(req: Request, res: Response) {
    try {
      const { topics } = req.body;
      const result = await neo4jService.bulkImportTopics(topics);
      res.json(result);
    } catch (error) {
      console.error('Error bulk importing topics:', error);
      res.status(500).json({ error: 'Failed to bulk import topics' });
    }
  }

  static async bulkImportResources(req: Request, res: Response) {
    try {
      const { resources } = req.body;
      const result = await neo4jService.bulkImportResources(resources);
      res.json(result);
    } catch (error) {
      console.error('Error bulk importing resources:', error);
      res.status(500).json({ error: 'Failed to bulk import resources' });
    }
  }
}

export default AdminController; 