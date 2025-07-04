// User related types
export interface User {
  id: string;
  username: string;
  email?: string;
  token?: string; // Only for AuthContext, not typically stored in DB
  createdAt?: string;
  updatedAt?: string;
  active?: boolean; // For AdminUser Table
  joinedDate?: string; // For AdminUser Table
  lastActive?: string; // For AdminUser Table
  topicsCompleted?: number; // For AdminUser Table
  role?: 'user' | 'admin' | 'premium';
}

// Topic related types
export interface Topic {
  id: string;
  name: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  subtopics?: Subtopic[];
  quizQuestions?: QuizQuestion[];
  quizThreshold?: number;
  lastQuizScore?: number; // Added for progress bar
}

// New: Match backend TopicDetailsResponse
export interface TopicDetailsResponse {
  topic: Topic;
  subtopics: Subtopic[];
  resources: Resource[];
  questions: Problem[];
  quizTemplate?: any; // You can define a QuizTemplate type if needed
  prerequisites: Topic[];
  nextTopics: Topic[];
}

export interface TopicDetail extends Topic {
  concepts: Concept[];
  quiz: QuizQuestion[];
}

export interface Subtopic {
  id: string;
  name: string;
  description?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  resourcesCount?: number;
  problemsCount?: number;
  completed?: boolean; // For TopicProgress in ProgressPage
  prerequisites?: Array<Subtopic | string>;
  resources?: Resource[];
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  resources: Array<{ title: string; url: string; type?: 'video' | 'article' | 'cheatsheet' }>;
}

// Resource related types
export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'book' | 'cheatsheet' | 'document';
  url: string;
  description: string;
  duration?: string; // For video duration
  meta?: string; // Generic meta info
  subtopicId?: string; // Optional: to associate with a subtopic
}

// Problem/Question related types
export interface Problem {
  id: string;
  title: string;
  description: string; // Ensure description is required
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode?: string;
  testCases?: Array<{ input: string; output: string; }>;
  premium?: boolean; // For MasteryTopicPage
  // Topic association
  topicId?: string;
  subtopicId?: string;
  // External coding platform links
  leetcodeId?: number;
  leetcodeLink?: string;
  hackerrankLink?: string;
  codeforcesLink?: string;
  geeksforgeeksLink?: string;
  // Problem metadata
  timeComplexity?: string;
  spaceComplexity?: string;
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Progress related types
export interface UserProgress {
  userId: string;
  topicId: string;
  subtopicId?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessed: string;
  score?: number;
  completionDate?: string;
  quizScore?: number;
}

export interface ProgressStatistics {
  totalTopics: number;
  completedTopics: number;
  totalProblems: number;
  solvedProblems: number;
  accuracy: number;
  currentStreak: number;
}

export interface TopicProgress {
  topicId: string;
  name: string;
  progress: number; // This should represent the completion percentage
  lastAccessed: string;
  score?: number; // Optional score property
  subtopics: Array<{
    name: string;
    completed: boolean;
  }>;
}

// Learning Path related types
export interface LearningPathNode {
  id: string;
  name: string;
  type: 'topic' | 'subtopic' | 'concept';
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  difficultyScore?: number;
  estimatedTimeMins?: number;
  prerequisites?: string[];
  nextTopics?: string[];
}

export interface PathItem {
  id: string;
  name: string;
  type: 'topic' | 'subtopic';
  description: string;
  status: 'locked' | 'available' | 'completed';
}

export interface MasteryTopic {
  id: string;
  name: string;
  description: string;
  essentialProblems: Problem[]; // Ensure this is an array of Problem
  cheatSheets?: Resource[]; // Make this optional
  videoTutorials?: Resource[]; // Make this optional
  quickSummary?: string; // Optional quick summary
}

export interface MasteryTopicDetail extends MasteryTopic {
  quickSummary: string; // Ensure this is required
  essentialProblems: Problem[]; // Ensure this is an array of Problem
  cheatSheets: Resource[]; // Ensure this is an array of Resource
  videoTutorials: Resource[]; // Ensure this is an array of Resource
  lastQuizScore?: number; // Added for progress bar
}

// Settings related types
export interface UserSettings {
  preferredLanguage: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  darkMode: boolean;
  weeklyGoal: number;
}

// Admin related types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  topicsCompletedThisWeek: number;
  popularTopics: Array<{ name: string; count: number }>;
}

export interface AdminAnalytics {
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    retentionRate: number;
  };
  learningProgress: {
    totalTopicsCompleted: number;
    averageCompletionRate: number;
    mostPopularTopics: Array<{ name: string; count: number }>;
    leastPopularTopics: Array<{ name: string; count: number }>;
  };
  performance: {
    averageQuizScore: number;
    averageTimePerTopic: number;
    topPerformingUsers: Array<{ username: string; score: number; topicsCompleted: number }>;
  };
  systemMetrics: {
    totalResources: number;
    totalProblems: number;
    totalQuizzes: number;
    systemUptime: number;
  };
}

export interface SystemSettings {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  quizThreshold: number;
  maxLoginAttempts: number;
  sessionTimeout: number;
  defaultUserRole: string;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  analyticsEnabled: boolean;
  debugMode: boolean;
}

export interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'error';
    connections: number;
    responseTime: number;
  };
  server: {
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  storage: {
    status: 'healthy' | 'warning' | 'error';
    usedSpace: number;
    totalSpace: number;
    freeSpace: number;
  };
}

export interface AdminTopic {
  id: string;
  name: string;
  description: string;
  difficultyScore: number;
  isCore: boolean;
  estimatedTimeMins: number;
  priority: number;
  subtopics: AdminSubtopic[];
}

export interface AdminSubtopic {
  id: string;
  name: string;
  description: string;
  difficultyScore: number;
  estimatedTimeMins: number;
  priority: number;
}

export interface AdminResource {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'Problem' | 'Quiz' | 'PDF';
  url: string;
  description: string;
  qualityScore: number;
  topicId: string;
  subtopicId?: string;
  duration?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  leetcodeId?: number;
  leetcodeLink?: string;
}

export interface AdminQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  topicId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation?: string;
}

export interface AdminProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicId: string;
  subtopicId?: string;
  leetcodeId?: number;
  leetcodeLink?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  tags?: string[];
}

// Dashboard related types
export interface DashboardStats {
  completedTopics: number;
  totalTopics: number;
  solvedProblems: number;
  accuracy: number;
  streakDays: number;
  activityMap: Record<string, number>;
  nextRecommendedTopic: {
    id: string;
    name: string;
    description?: string;
  } | null;
  quizSummary: {
    recentQuizzes: Array<{
      topic: string;
      score: number;
      date: string;
    }>;
  };
  weakAreas: Array<{
    topic: string;
    accuracy: number;
  }>;
  masteryProgress: number;
}

// Personal Analytics Types
export interface PersonalAnalytics {
  engagement: {
    totalTopics: number;
    completedTopics: number;
    inProgressTopics: number;
    completionRate: number;
    lastWeekActivity: number;
    lastMonthActivity: number;
    totalStudyTime: number;
  };
  performance: {
    averageQuizScore: number;
    quizPassRate: number;
    totalQuizAttempts: number;
    passedQuizzes: number;
    averageTimePerTopic: number;
  };
  progress: {
    topicPerformance: Array<{
      topicId: string;
      status: string;
      quizScore?: number;
      lastAccessed: string;
      isWeak: boolean;
    }>;
    weakTopicsCount: number;
    strongTopicsCount: number;
  };
  trends: {
    weeklyProgress: number;
    monthlyProgress: number;
    improvementRate: number;
  };
}

// Next Recommended Topic Types
export interface NextRecommendedTopic {
  id: string;
  name: string;
  description: string;
  type: 'reinforcement' | 'next' | 'completion';
  priority: 'high' | 'medium' | 'low' | 'none';
}

// Topic Completion Types
export interface TopicCompletionRequirements {
  quizPassed: boolean;
  problemsSolved: boolean;
  resourcesViewed: boolean;
  allRequirementsMet: boolean;
}

export interface TopicCompletionStatus {
  isCompleted: boolean;
  requirements: TopicCompletionRequirements;
}

// Problem Submission
export interface ProblemSubmission {
  problemId: string;
  code: string;
  language: string;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  // Add more fields if your backend returns them, e.g., testResults, executionTime
}
