// FileName: MultipleFiles/pathController.ts
import { Request, Response } from 'express';
import Neo4jService from '../services/neo4j.service';

class PathController {
  async getUserPaths(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json({ message: 'User paths logic not implemented yet.' });
  }

  async getTopics(_: Request, res: Response) {
    try {
      const topics = await Neo4jService.getAllTopics();
      return res.json(topics);
    } catch (error) {
      console.error('Error getting topics:', error);
      return res.status(500).json({ message: 'Failed to fetch topics' });
    }
  }

  async generatePath(req: Request, res: Response) {
    try {
      console.log('Learning path generation request received');
      console.log('Request body:', req.body);
      console.log('User:', req.user);
      
      const { knownTopics } = req.body;
      console.log('Known topics:', knownTopics);
      
      const path = await Neo4jService.createLearningPath(knownTopics);
      console.log('Generated path:', path);
      
      res.json(path);
    } catch (error) {
      console.error('Error generating path:', error);
      res.status(500).json({ message: 'Failed to generate learning path' });
    }
  }

  async getTopicDetails(req: Request, res: Response) {
    try {
      const topicId = req.params.id;
      if (!topicId) {
        return res.status(400).json({ message: 'Missing topicId' });
      }
      const details = await Neo4jService.getTopicDetails(topicId);
      if (!details) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      return res.json(details);
    } catch (error) {
      console.error('Error getting topic details:', error);
      return res.status(500).json({ message: 'Failed to fetch topic details' });
    }
  }

  async getMasteryPath(_: Request, res: Response) {
    try {
      const path = await Neo4jService.getMasteryPath();
      return res.json(path);
    } catch (error) {
      console.error('Error getting mastery path:', error);
      return res.status(500).json({ message: 'Failed to generate mastery path' });
    }
  }

  async getFullPath(_: Request, res: Response) {
    try {
      const path = await Neo4jService.getFullLearningPath();
      return res.json(path);
    } catch (error) {
      console.error('Error getting full path:', error);
      return res.status(500).json({ message: 'Failed to fetch full learning path' });
    }
  }

  async getMasteryTopicDetails(req: Request, res: Response) {
    try {
      const topicId = req.params.id;
      if (!topicId) {
        return res.status(400).json({ message: 'Missing topicId' });
      }
      const topic = await Neo4jService.getMasteryTopicDetails(topicId);
      return res.json(topic);
    } catch (error) {
      console.error('Error getting mastery topic details:', error);
      return res.status(500).json({ message: 'Failed to fetch mastery topic details' });
    }
  }

  async getTopicProblems(req: Request, res: Response) {
    try {
      const topicId = req.params.topicId;
      if (!topicId) {
        return res.status(400).json({ message: 'Missing topicId' });
      }
      const problems = await Neo4jService.getTopicProblems(topicId);
      return res.json(problems);
    } catch (error) {
      console.error('Error getting topic problems:', error);
      return res.status(500).json({ message: 'Failed to fetch topic problems' });
    }
  }

  async getTopicResources(req: Request, res: Response) {
    try {
      const topicId = req.params.topicId;
      if (!topicId) {
        return res.status(400).json({ message: 'Missing topicId' });
      }
      const resources = await Neo4jService.getTopicResources(topicId);
      if (!resources || resources.length === 0) {
        return res.status(404).json({ message: 'Resources not found for topic' });
      }
      return res.json(resources);
    } catch (error) {
      console.error('Error getting topic resources:', error);
      return res.status(500).json({ message: 'Failed to fetch topic resources' });
    }
  }

  async submitProblemSolution(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { problemId } = req.body;
      if (!problemId) {
        return res.status(400).json({ message: 'Missing problemId' });
      }
      // TODO: Implement actual submission logic
      console.log(`User ${userId} submitted solution for problem ${problemId}`);
      // Mock result
      const verdicts = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'];
      const result = verdicts[Math.floor(Math.random() * verdicts.length)];
      return res.json({ success: result === 'Accepted', result, output: 'Mock output', error: result === 'Accepted' ? null : 'Mock error' });
    } catch (error) {
      console.error('Error submitting problem solution:', error);
      return res.status(500).json({ message: 'Failed to submit problem solution' });
    }
  }
}

export default new PathController();
