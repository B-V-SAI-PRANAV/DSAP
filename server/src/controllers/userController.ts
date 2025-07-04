// FileName: MultipleFiles/userController.ts
import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  async getUserProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await UserService.getUserById(userId);
    return res.json(user);
  }

  async getUserProgress(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const progress = await UserService.getUserProgress(userId);
      return res.json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return res.status(500).json({ message: 'Failed to fetch user progress' });
    }
  }

  async updateUserProgress(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { progressData } = req.body;
      await UserService.updateUserProgress(userId, progressData);
      return res.status(204).send();
    } catch (error) {
      console.error('Error updating user progress:', error);
      return res.status(500).json({ message: 'Failed to update user progress' });
    }
  }

  async getUserProgressSummary(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const summary = await UserService.getUserProgressSummary(userId);
      return res.json(summary);
    } catch (error) {
      console.error('Error fetching user progress summary:', error);
      return res.status(500).json({ message: 'Failed to fetch user progress summary' });
    }
  }

  async getUserDetailedProgress(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const details = await UserService.getUserDetailedProgress(userId);
      return res.json(details);
    } catch (error) {
      console.error('Error fetching user detailed progress:', error);
      return res.status(500).json({ message: 'Failed to fetch user detailed progress' });
    }
  }

  async getUserSettings(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const settings = await UserService.getUserSettings(userId);
      return res.json(settings);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return res.status(500).json({ message: 'Failed to fetch user settings' });
    }
  }

  async updateUserSettings(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const settings = req.body;
      await UserService.updateUserSettings(userId, settings);
      return res.status(204).send();
    } catch (error) {
      console.error('Error updating user settings:', error);
      return res.status(500).json({ message: 'Failed to update user settings' });
    }
  }

  async getUserDashboardStats(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const stats = await UserService.getUserDashboardStats(userId);
      return res.json(stats);
    } catch (error) {
      console.error('Error fetching user dashboard stats:', error);
      return res.status(500).json({ message: 'Failed to fetch user dashboard stats' });
    }
  }

  async updateQuizPerformance(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { topicId, quizScore, threshold = 70 } = req.body;
      
      if (!topicId || typeof quizScore !== 'number') {
        return res.status(400).json({ message: 'Invalid request data' });
      }
      
      await UserService.updateQuizPerformance(userId, topicId, quizScore, threshold);
      
      // Check if this was a failed quiz and path should be updated
      const isWeakTopic = quizScore < threshold;
      
      return res.json({ 
        success: true, 
        isWeakTopic,
        message: isWeakTopic 
          ? 'Topic marked for reinforcement. Your learning path will be updated.' 
          : 'Quiz completed successfully!' 
      });
    } catch (error) {
      console.error('Error updating quiz performance:', error);
      return res.status(500).json({ message: 'Failed to update quiz performance' });
    }
  }

  async getAdaptiveLearningPath(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { knownTopics } = req.body;
      
      if (!Array.isArray(knownTopics)) {
        return res.status(400).json({ message: 'Invalid request data' });
      }
      
      const adaptivePath = await UserService.getAdaptiveLearningPath(userId, knownTopics);
      return res.json(adaptivePath);
    } catch (error) {
      console.error('Error generating adaptive learning path:', error);
      return res.status(500).json({ message: 'Failed to generate adaptive learning path' });
    }
  }

  async getPersonalAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const analytics = await UserService.getPersonalAnalytics(userId);
      return res.json(analytics);
    } catch (error) {
      console.error('Error fetching personal analytics:', error);
      return res.status(500).json({ message: 'Failed to fetch personal analytics' });
    }
  }

  async getNextRecommendedTopic(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { topicId } = req.params;
      
      if (!topicId) {
        return res.status(400).json({ message: 'Topic ID is required' });
      }
      
      const nextTopic = await UserService.getNextRecommendedTopic(userId, topicId);
      return res.json(nextTopic);
    } catch (error) {
      console.error('Error getting next recommended topic:', error);
      return res.status(500).json({ message: 'Failed to get next recommended topic' });
    }
  }

  async checkTopicCompletion(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { topicId } = req.params;
      
      if (!topicId) {
        return res.status(400).json({ message: 'Topic ID is required' });
      }
      
      const completionStatus = await UserService.checkAndMarkTopicCompletion(userId, topicId);
      return res.json(completionStatus);
    } catch (error) {
      console.error('Error checking topic completion:', error);
      return res.status(500).json({ message: 'Failed to check topic completion' });
    }
  }

  async getInitialSetupStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const status = await UserService.getInitialSetupStatus(userId);
      return res.json(status);
    } catch (error) {
      console.error('Error getting initial setup status:', error);
      return res.status(500).json({ message: 'Failed to get initial setup status' });
    }
  }

  async markInitialSetupComplete(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      await UserService.markInitialSetupComplete(userId);
      return res.json({ success: true, message: 'Initial setup marked as complete' });
    } catch (error) {
      console.error('Error marking initial setup complete:', error);
      return res.status(500).json({ message: 'Failed to mark initial setup complete' });
    }
  }

  async getProblemCompletionStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { problemId } = req.params;
      
      if (!problemId) {
        return res.status(400).json({ message: 'Problem ID is required' });
      }
      
      const isCompleted = await UserService.getProblemCompletionStatus(userId, problemId);
      return res.json({ problemId, isCompleted });
    } catch (error) {
      console.error('Error getting problem completion status:', error);
      return res.status(500).json({ message: 'Failed to get problem completion status' });
    }
  }

  async updateProblemCompletion(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { problemId, isCompleted } = req.body;
      
      if (!problemId || typeof isCompleted !== 'boolean') {
        return res.status(400).json({ message: 'Problem ID and completion status are required' });
      }
      
      await UserService.updateProblemCompletion(userId, problemId, isCompleted);
      return res.json({ success: true, message: 'Problem completion status updated' });
    } catch (error) {
      console.error('Error updating problem completion:', error);
      return res.status(500).json({ message: 'Failed to update problem completion status' });
    }
  }

  async getTopicProblemProgress(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { topicId } = req.params;
      
      if (!topicId) {
        return res.status(400).json({ message: 'Topic ID is required' });
      }
      
      const progress = await UserService.getTopicProblemProgress(userId, topicId);
      return res.json(progress);
    } catch (error) {
      console.error('Error getting topic problem progress:', error);
      return res.status(500).json({ message: 'Failed to get topic problem progress' });
    }
  }

  async getResourceCompletionStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { resourceId } = req.params;
      if (!resourceId) return res.status(400).json({ message: 'Resource ID is required' });
      const status = await UserService.getResourceCompletionStatus(userId, resourceId);
      return res.json(status);
    } catch (error) {
      console.error('Error getting resource completion status:', error);
      return res.status(500).json({ message: 'Failed to get resource completion status' });
    }
  }

  async updateResourceCompletion(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { resourceId, isCompleted } = req.body;
      if (!resourceId || typeof isCompleted !== 'boolean') return res.status(400).json({ message: 'Invalid request data' });
      await UserService.updateResourceCompletion(userId, resourceId, isCompleted);
      return res.json({ success: true, message: 'Resource completion updated' });
    } catch (error) {
      console.error('Error updating resource completion:', error);
      return res.status(500).json({ message: 'Failed to update resource completion' });
    }
  }

  async getSubtopicCompletionStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { subtopicId } = req.params;
      if (!subtopicId) return res.status(400).json({ message: 'Subtopic ID is required' });
      const status = await UserService.getSubtopicCompletionStatus(userId, subtopicId);
      return res.json(status);
    } catch (error) {
      console.error('Error getting subtopic completion status:', error);
      return res.status(500).json({ message: 'Failed to get subtopic completion status' });
    }
  }

  async updateSubtopicCompletion(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { subtopicId, isCompleted } = req.body;
      if (!subtopicId || typeof isCompleted !== 'boolean') return res.status(400).json({ message: 'Invalid request data' });
      await UserService.updateSubtopicCompletion(userId, subtopicId, isCompleted);
      return res.json({ success: true, message: 'Subtopic completion updated' });
    } catch (error) {
      console.error('Error updating subtopic completion:', error);
      return res.status(500).json({ message: 'Failed to update subtopic completion' });
    }
  }

  async getKnownTopics(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const knownTopics = await UserService.getKnownTopics(userId);
      return res.json({ knownTopics });
    } catch (error) {
      console.error('Error getting known topics:', error);
      return res.status(500).json({ message: 'Failed to get known topics' });
    }
  }

  async setKnownTopics(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { knownTopics } = req.body;
      if (!Array.isArray(knownTopics)) return res.status(400).json({ message: 'Invalid request data' });
      await UserService.setKnownTopics(userId, knownTopics);
      return res.json({ success: true, message: 'Known topics updated' });
    } catch (error) {
      console.error('Error setting known topics:', error);
      return res.status(500).json({ message: 'Failed to set known topics' });
    }
  }
}

export default new UserController();
