declare global {
  interface User {
    id: string;
    username: string;
    email?: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    active?: boolean;
    role?: string;
  }
  interface UserProgress {
    userId: string;
    topicId: string;
    subtopicId?: string;
    status: 'not_started' | 'in_progress' | 'completed';
    lastAccessed: string;
    score?: number;
    completionDate?: string;
    quizScore?: number;
  }
  interface Topic {
    id: string;
    name: string;
    description?: string;
    skillTags?: string[];
    difficultyScore?: number;
    isCore?: boolean;
    estimatedTimeMins?: number;
    weight?: number;
    priority?: number;
    tags?: string[];
    createdAt?: string;
    category?: string;
    milestones?: string[];
    updatedAt?: string;
    quizQuestions?: QuizQuestion[];
    problems?: Question[];
    quizThreshold?: number;
  }
  interface Subtopic {
    id: string;
    name: string;
    difficultyScore?: number;
    estimatedTimeMins?: number;
    completionThreshold?: number;
    tags?: string[];
    quizQuestions?: QuizQuestion[];
    problems?: Question[];
  }
  interface Resource {
    id: string;
    title: string;
    type: 'Video' | 'Book' | 'Article' | 'E-Book';
    link?: string;
    author?: string;
    qualityScore?: number;
    durationMins?: number;
    lastVerified?: string;
  }
  interface Question {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    leetcodeId?: number;
    leetcodeLink?: string;
    companies?: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    premiumOnly?: boolean;
    tags?: string[];
    solutionLink?: string;
  }
  interface LearningPathNode {
    id: string;
    name: string;
    type: 'topic' | 'subtopic' | 'concept';
    status: 'available' | 'in_progress' | 'completed' | 'locked';
    difficultyScore?: number;
    estimatedTimeMins?: number;
    prerequisites?: string[];
    nextTopics?: string[];
  }
  interface MasteryTopic {
    id: string;
    name: string;
    description: string;
    essentialProblems: Question[];
    cheatSheets: Resource[];
    videoTutorials: Resource[];
    difficultyScore?: number;
    estimatedTimeMins?: number;
    quizQuestions?: QuizQuestion[];
    problems?: Question[];
  }
  interface UserSettings {
    preferredLanguage: 'javascript' | 'python' | 'java' | 'cpp';
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    darkMode: boolean;
    weeklyGoal: number;
    [key: string]: any;
  }
  interface DashboardStats {
    solvedProblems: number;
    totalProblems?: number;
    accuracy?: number;
    currentStreak?: number;
    [key: string]: any;
  }
  interface ProgressStatistics {
    completedTopics: number;
    totalTopics: number;
    solvedProblems: number;
    totalProblems: number;
    accuracy: number;
    currentStreak: number;
  }
  interface TopicsResponse {
    topics: Topic[];
    total: number;
  }
  interface TopicDetailsResponse {
    topic: Topic;
    subtopics: Subtopic[];
    resources: Resource[];
    questions: Question[];
    quizTemplate?: QuizTemplate;
    prerequisites: Topic[];
    nextTopics: Topic[];
  }
  interface QuizTemplate {
    id: string;
    version?: number;
    easyPercentage?: number;
    mediumPercentage?: number;
    hardPercentage?: number;
    multipleChoiceQuestions?: number;
    codingChallenges?: number;
    conceptCoverage?: string[];
    generationPrompt?: string;
    applicationQuestions?: number;
    adaptiveLearningEnabled?: boolean;
    proofQuestions?: number;
    performanceQuestions?: number;
    mediumWeight?: number;
    hardWeight?: number;
    easyWeight?: number;
    timePressureEnabled?: boolean;
  }
  interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }
}

// Weak Topic tracking
export interface WeakTopic {
  topicId: string;
  quizScore: number;
  lastAttempt: string;
}

// Personal Analytics
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

// Initial Setup Status
export interface InitialSetupStatus {
  completed: boolean;
  date?: string;
}

// Next Recommended Topic
export interface NextRecommendedTopic {
  id: string;
  name: string;
  description: string;
  type: 'reinforcement' | 'next' | 'completion';
  priority: 'high' | 'medium' | 'low' | 'none';
}

// Topic Completion Requirements
export interface TopicCompletionRequirements {
  quizPassed: boolean;
  problemsSolved: boolean;
  resourcesViewed: boolean;
  allRequirementsMet: boolean;
}

// Topic Completion Status
export interface TopicCompletionStatus {
  isCompleted: boolean;
  requirements: TopicCompletionRequirements;
}

export {};
// Add other shared backend types here as needed 