import Neo4jService from './neo4j.service';
import bcrypt from 'bcrypt';

class UserService {
  private userSettings: Record<string, any> = {};

  async authenticate(username: string, password: string): Promise<User | null> {
    const user = await Neo4jService.getUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async createUser (username: string, password: string, email: string): Promise<User | null> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser  = await Neo4jService.createUser (username, hashedPassword, email);
    return newUser ;
  }

  async getUserById(userId: string): Promise<User | null> { // Fixed method name
    return await Neo4jService.getUserById(userId); // Fixed method name
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await Neo4jService.getUserProgressByUserId(userId); // Ensure this method exists in Neo4jService
  }

  async updateUserProgress(userId: string, progressData: UserProgress): Promise<void> {
    await Neo4jService.updateUserProgress(userId, progressData); // Ensure this method exists in Neo4jService
  }

  async getUserProgressSummary(userId: string): Promise<any> {
    const progress = await Neo4jService.getUserProgressByUserId(userId);
    const completed = progress.filter(p => p.status === 'completed').length;
    const total = progress.length;
    return { completed, total };
  }

  async getUserDetailedProgress(userId: string): Promise<any[]> {
    return await Neo4jService.getUserProgressByUserId(userId);
  }

  async getUserSettings(userId: string): Promise<any> {
    // In-memory settings for now
    if (!this.userSettings[userId]) {
      this.userSettings[userId] = { theme: 'light', notifications: true };
    }
    return this.userSettings[userId];
  }

  async updateUserSettings(userId: string, settings: any): Promise<void> {
    this.userSettings[userId] = { ...this.userSettings[userId], ...settings };
  }

  async getUserDashboardStats(userId: string): Promise<any> {
    // Example: solvedProblems = completed progress, streak = random/mock
    const progress = await Neo4jService.getUserProgressByUserId(userId);
    const solvedProblems = progress.filter(p => p.status === 'completed').length;
    const streakDays = Math.floor(Math.random() * 10) + 1; // Mock streak
    const completedTopics = Math.floor(Math.random() * 10) + 5; // Mock
    const totalTopics = 20; // Mock
    const accuracy = Math.floor(Math.random() * 30) + 70; // Mock accuracy 70-100
    const masteryProgress = Math.floor(Math.random() * 40) + 60; // Mock mastery progress 60-100
    const activityMap = {
      '2024-06-01': 2,
      '2024-06-02': 1,
      '2024-06-03': 3,
      '2024-06-04': 0,
      '2024-06-05': 4
    };
    const nextRecommendedTopic = {
      id: 'topic-12',
      name: 'Dynamic Programming',
      description: 'Learn about optimal substructure and overlapping subproblems.'
    };
    const quizSummary = {
      recentQuizzes: [
        { topic: 'Arrays', score: 80, date: '2024-06-01' },
        { topic: 'Strings', score: 60, date: '2024-06-02' },
        { topic: 'Hashing', score: 50, date: '2024-06-03' }
      ]
    };
    const weakAreas = [
      { topic: 'Hashing', accuracy: 50 },
      { topic: 'Strings', accuracy: 60 }
    ];
    return {
      completedTopics,
      totalTopics,
      solvedProblems,
      accuracy,
      streakDays,
      activityMap,
      nextRecommendedTopic,
      quizSummary,
      weakAreas,
      masteryProgress
    };
  }

  async updateQuizPerformance(userId: string, topicId: string, quizScore: number, threshold: number = 70): Promise<void> {
    // Track quiz performance and identify weak topics
    const isWeakTopic = quizScore < threshold;
    
    if (isWeakTopic) {
      // Store weak topic for adaptive learning path
      await this.markTopicAsWeak(userId, topicId, quizScore);
    }
    
    // Update user progress with quiz score
    await Neo4jService.updateUserProgress(userId, {
      userId,
      topicId,
      status: isWeakTopic ? 'in_progress' : 'completed',
      lastAccessed: new Date().toISOString(),
      quizScore
    });
  }

  async markTopicAsWeak(userId: string, topicId: string, quizScore: number): Promise<void> {
    // In a real implementation, this would store weak topics in the database
    // For now, we'll use a simple in-memory store
    if (!this.userSettings[userId]) {
      this.userSettings[userId] = {};
    }
    if (!this.userSettings[userId].weakTopics) {
      this.userSettings[userId].weakTopics = [];
    }
    
    // Add or update weak topic
    const existingIndex = this.userSettings[userId].weakTopics.findIndex((wt: any) => wt.topicId === topicId);
    if (existingIndex >= 0) {
      this.userSettings[userId].weakTopics[existingIndex].quizScore = quizScore;
      this.userSettings[userId].weakTopics[existingIndex].lastAttempt = new Date().toISOString();
    } else {
      this.userSettings[userId].weakTopics.push({
        topicId,
        quizScore,
        lastAttempt: new Date().toISOString()
      });
    }
  }

  async getWeakTopics(userId: string): Promise<string[]> {
    // Get list of weak topics for adaptive learning path
    if (!this.userSettings[userId]?.weakTopics) {
      return [];
    }
    
    // Return topic IDs that need reinforcement
    return this.userSettings[userId].weakTopics.map((wt: any) => wt.topicId);
  }

  async getAdaptiveLearningPath(userId: string, knownTopics: string[]): Promise<any[]> {
    // Get weak topics that need reinforcement
    const weakTopics = await this.getWeakTopics(userId);
    
    // Get user progress to determine completed topics
    const userProgress = await Neo4jService.getUserProgressByUserId(userId);
    const completedTopics = userProgress.filter(p => p.status === 'completed').map(p => p.topicId);
    
    // Get problem completion status for all topics
    const topicProblemProgress = await Promise.all(
      knownTopics.map(async (topicId) => {
        try {
          const progress = await this.getTopicProblemProgress(userId, topicId);
          return {
            topicId,
            progress: progress.progressPercentage,
            isCompleted: progress.progressPercentage === 100
          };
        } catch (error) {
          console.error(`Failed to get problem progress for topic ${topicId}:`, error);
          return { topicId, progress: 0, isCompleted: false };
        }
      })
    );
    
    // Mark topics as completed if all problems are solved
    const topicsWithCompletedProblems = topicProblemProgress
      .filter(topic => topic.isCompleted)
      .map(topic => topic.topicId);
    
    // Combine all completed topics (from progress + problem completion)
    const allCompletedTopics = [...new Set([...completedTopics, ...topicsWithCompletedProblems])];
    
    // Combine known topics with weak topics for path generation
    // Weak topics should be prioritized even if previously "known"
    const topicsForPath = [...new Set([...knownTopics, ...weakTopics])];
    
    // Call Neo4j service to generate path with weak topics included
    const basePath = await Neo4jService.createLearningPath(topicsForPath);
    
    // Update the status of path items based on user progress
    return basePath.map(item => {
      const isCompleted = allCompletedTopics.includes(item.id);
      const isInProgress = !isCompleted && (knownTopics.includes(item.id) || weakTopics.includes(item.id));
      
      return {
        ...item,
        status: isCompleted ? 'completed' : isInProgress ? 'in_progress' : item.status
      };
    });
  }

  async getPersonalAnalytics(userId: string): Promise<any> {
    // Get user progress data
    const progress = await Neo4jService.getUserProgressByUserId(userId);
    
    // Calculate engagement metrics
    const totalTopics = 20; // Mock total topics
    const completedTopics = progress.filter(p => p.status === 'completed').length;
    const inProgressTopics = progress.filter(p => p.status === 'in_progress').length;
    const completionRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    
    // Calculate quiz performance
    const quizAttempts = progress.filter(p => p.quizScore !== undefined);
    const totalQuizScore = quizAttempts.reduce((sum, p) => sum + (p.quizScore || 0), 0);
    const averageQuizScore = quizAttempts.length > 0 ? totalQuizScore / quizAttempts.length : 0;
    const passedQuizzes = quizAttempts.filter(p => (p.quizScore || 0) >= 70).length;
    const quizPassRate = quizAttempts.length > 0 ? (passedQuizzes / quizAttempts.length) * 100 : 0;
    
    // Calculate activity metrics
    const lastWeekActivity = progress.filter(p => {
      const lastAccessed = new Date(p.lastAccessed);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastAccessed >= weekAgo;
    }).length;
    
    const lastMonthActivity = progress.filter(p => {
      const lastAccessed = new Date(p.lastAccessed);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return lastAccessed >= monthAgo;
    }).length;
    
    // Calculate time-based metrics (mock data for now)
    const averageTimePerTopic = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    const totalStudyTime = completedTopics * averageTimePerTopic;
    
    // Get weak topics for analytics
    const weakTopics = await this.getWeakTopics(userId);
    
    // Calculate topic-wise performance
    const topicPerformance = progress.map(p => ({
      topicId: p.topicId,
      status: p.status,
      quizScore: p.quizScore,
      lastAccessed: p.lastAccessed,
      isWeak: weakTopics.includes(p.topicId)
    }));
    
    return {
      engagement: {
        totalTopics,
        completedTopics,
        inProgressTopics,
        completionRate,
        lastWeekActivity,
        lastMonthActivity,
        totalStudyTime
      },
      performance: {
        averageQuizScore,
        quizPassRate,
        totalQuizAttempts: quizAttempts.length,
        passedQuizzes,
        averageTimePerTopic
      },
      progress: {
        topicPerformance,
        weakTopicsCount: weakTopics.length,
        strongTopicsCount: completedTopics - weakTopics.length
      },
      trends: {
        weeklyProgress: Math.floor(Math.random() * 20) + 5, // Mock weekly progress
        monthlyProgress: Math.floor(Math.random() * 50) + 20, // Mock monthly progress
        improvementRate: Math.floor(Math.random() * 30) + 10 // Mock improvement rate
      }
    };
  }

  async getNextRecommendedTopic(userId: string, currentTopicId: string): Promise<any> {
    // Get user progress to understand what's completed
    const progress = await Neo4jService.getUserProgressByUserId(userId);
    const completedTopicIds = progress.filter(p => p.status === 'completed').map(p => p.topicId);
    
    // Add current topic to completed list if not already there
    if (!completedTopicIds.includes(currentTopicId)) {
      completedTopicIds.push(currentTopicId);
    }
    
    // Get weak topics that need reinforcement
    const weakTopics = await this.getWeakTopics(userId);
    
    // Priority: weak topics first, then next logical topic
    if (weakTopics.length > 0) {
      // Return the first weak topic that needs reinforcement
      const weakTopic = weakTopics[0];
      return {
        id: weakTopic,
        name: `Review: ${weakTopic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        description: 'This topic needs reinforcement based on your quiz performance.',
        type: 'reinforcement',
        priority: 'high'
      };
    }
    
    // If no weak topics, get the next logical topic
    // For now, return a mock next topic
    const mockNextTopics = [
      { id: 'dynamic-programming', name: 'Dynamic Programming', description: 'Learn optimal substructure and overlapping subproblems.' },
      { id: 'graphs', name: 'Graph Algorithms', description: 'Master graph traversal and shortest path algorithms.' },
      { id: 'trees', name: 'Tree Data Structures', description: 'Understand binary trees, BST, and tree traversal.' },
      { id: 'sorting', name: 'Sorting Algorithms', description: 'Learn efficient sorting techniques and their trade-offs.' }
    ];
    
    // Find a topic that's not completed
    const nextTopic = mockNextTopics.find(topic => !completedTopicIds.includes(topic.id));
    
    return nextTopic || {
      id: 'all-completed',
      name: 'All Topics Completed!',
      description: 'Congratulations! You have completed all available topics.',
      type: 'completion',
      priority: 'none'
    };
  }

  async checkAndMarkTopicCompletion(userId: string, topicId: string): Promise<{ isCompleted: boolean; requirements: any }> {
    // Get user progress for this topic
    const progress = await Neo4jService.getUserProgressByUserId(userId);
    const topicProgress = progress.find(p => p.topicId === topicId);
    
    // Get topic details to check requirements
    const topicDetails = await Neo4jService.getTopicDetails(topicId);
    
    // Check completion requirements
    const requirements = {
      quizPassed: false,
      problemsSolved: false,
      resourcesViewed: false,
      allRequirementsMet: false
    };
    
    // Check quiz requirement
    if (topicProgress?.quizScore !== undefined) {
      const quizThreshold = topicDetails?.topic?.quizThreshold || 70;
      requirements.quizPassed = topicProgress.quizScore >= quizThreshold;
    }
    
    // Check problems requirement (mock for now)
    // In a real implementation, you'd check if user solved required problems
    requirements.problemsSolved = true; // Mock: assume problems are solved
    
    // Check resources requirement (mock for now)
    // In a real implementation, you'd check if user viewed required resources
    requirements.resourcesViewed = true; // Mock: assume resources are viewed
    
    // All requirements met
    requirements.allRequirementsMet = requirements.quizPassed && requirements.problemsSolved && requirements.resourcesViewed;
    
    // Mark as completed if all requirements are met
    if (requirements.allRequirementsMet && topicProgress?.status !== 'completed') {
      await Neo4jService.updateUserProgress(userId, {
        userId,
        topicId,
        status: 'completed',
        lastAccessed: new Date().toISOString()
      });
    }
    
    return {
      isCompleted: requirements.allRequirementsMet,
      requirements
    };
  }

  async hasCompletedInitialSetup(userId: string): Promise<boolean> {
    // Check if user has any learning path or progress data
    const progress = await Neo4jService.getUserProgressByUserId(userId);
    
    // If user has any progress data, they've completed initial setup
    return progress.length > 0;
  }

  async markInitialSetupComplete(userId: string): Promise<void> {
    // In a real implementation, you'd store this in the database
    // For now, we'll use the existing user settings mechanism
    if (!this.userSettings[userId]) {
      this.userSettings[userId] = {};
    }
    this.userSettings[userId].initialSetupCompleted = true;
    this.userSettings[userId].initialSetupDate = new Date().toISOString();
  }

  async getInitialSetupStatus(userId: string): Promise<{ completed: boolean; date?: string }> {
    if (!this.userSettings[userId]) {
      return { completed: false };
    }
    
    return {
      completed: this.userSettings[userId].initialSetupCompleted || false,
      date: this.userSettings[userId].initialSetupDate
    };
  }

  async getProblemCompletionStatus(userId: string, problemId: string): Promise<boolean> {
    if (!this.userSettings[userId]) {
      return false;
    }
    
    if (!this.userSettings[userId].completedProblems) {
      this.userSettings[userId].completedProblems = [];
    }
    
    return this.userSettings[userId].completedProblems.includes(problemId);
  }

  async updateProblemCompletion(userId: string, problemId: string, isCompleted: boolean): Promise<void> {
    if (!this.userSettings[userId]) {
      this.userSettings[userId] = {};
    }
    
    if (!this.userSettings[userId].completedProblems) {
      this.userSettings[userId].completedProblems = [];
    }
    
    if (isCompleted) {
      if (!this.userSettings[userId].completedProblems.includes(problemId)) {
        this.userSettings[userId].completedProblems.push(problemId);
      }
    } else {
      this.userSettings[userId].completedProblems = this.userSettings[userId].completedProblems.filter(
        (id: string) => id !== problemId
      );
    }
  }

  async getTopicProblemProgress(userId: string, topicId: string): Promise<{ completedProblems: string[]; totalProblems: number; progressPercentage: number }> {
    // Get all problems for this topic from Neo4j service
    const topicProblems = await Neo4jService.getTopicProblems(topicId);
    const totalProblems = topicProblems.length;
    
    if (!this.userSettings[userId]) {
      return {
        completedProblems: [],
        totalProblems,
        progressPercentage: 0
      };
    }
    
    if (!this.userSettings[userId].completedProblems) {
      this.userSettings[userId].completedProblems = [];
    }
    
    // Filter completed problems for this topic
    const completedProblems = this.userSettings[userId].completedProblems.filter(
      (problemId: string) => topicProblems.some(problem => problem.id === problemId)
    );
    
    const progressPercentage = totalProblems > 0 ? (completedProblems.length / totalProblems) * 100 : 0;
    
    return {
      completedProblems,
      totalProblems,
      progressPercentage
    };
  }

  async getResourceCompletionStatus(userId: string, resourceId: string): Promise<{ resourceId: string; isCompleted: boolean }> {
    return await Neo4jService.getResourceCompletionStatus(userId, resourceId);
  }

  async updateResourceCompletion(userId: string, resourceId: string, isCompleted: boolean): Promise<void> {
    await Neo4jService.updateResourceCompletion(userId, resourceId, isCompleted);
  }

  async getSubtopicCompletionStatus(userId: string, subtopicId: string): Promise<{ subtopicId: string; isCompleted: boolean }> {
    return await Neo4jService.getSubtopicCompletionStatus(userId, subtopicId);
  }

  async updateSubtopicCompletion(userId: string, subtopicId: string, isCompleted: boolean): Promise<void> {
    await Neo4jService.updateSubtopicCompletion(userId, subtopicId, isCompleted);
  }

  async getKnownTopics(userId: string): Promise<string[]> {
    if (!this.userSettings[userId]) this.userSettings[userId] = {};
    return this.userSettings[userId].knownTopics || [];
  }

  async setKnownTopics(userId: string, knownTopics: string[]): Promise<void> {
    if (!this.userSettings[userId]) this.userSettings[userId] = {};
    this.userSettings[userId].knownTopics = knownTopics;
  }
}

export default new UserService();
