// FileName: MultipleFiles/api.ts
import axios from 'axios';
import {
  Topic,
  PathItem,
  TopicDetailsResponse,
  MasteryTopic,
  MasteryTopicDetail,
  ProgressStatistics,
  TopicProgress,
  Resource,
  UserSettings,
  DashboardStats,
  Problem,
  ProblemSubmission,
  SubmissionResult,
  LearningPathNode,
  PersonalAnalytics,
  NextRecommendedTopic,
  TopicCompletionStatus
} from '../types'; // Import all necessary types from consolidated file

// API base URL - will use environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAllTopics = async (): Promise<Topic[]> => {
  console.debug('Fetching all topics from backend');
  const response = await api.get('/topics');
  return response.data;
};

export const getLearningPath = async (knownTopics: string[]): Promise<PathItem[]> => {
  console.log('Making request to:', `${API_BASE_URL}/path`);
  console.log('Request payload:', { knownTopics });
  const response = await api.post('/path', { knownTopics });
  console.log('Response received:', response.data);
  return response.data;
};

export const getTopicDetails = async (topicId: string): Promise<TopicDetailsResponse> => {
  console.debug('API getTopicDetails called with topicId:', topicId);
  const response = await api.get(`/topics/${topicId}`);
  return response.data;
};

// Updated to use Partial<UserProgress> as not all fields might be sent
export const updateUserProgress = async (progressData: Partial<TopicProgress>): Promise<void> => {
  // Assuming backend infers userId from token
  await api.post('/user/progress', progressData);
};

export const getMasteryPath = async (): Promise<MasteryTopic[]> => {
  const response = await api.get('/path/mastery');
  return response.data;
};

export const getUserProgress = async (): Promise<ProgressStatistics> => {
  const response = await api.get('/user/progress/summary');
  return response.data;
};

export const getUserDetailedProgress = async (): Promise<TopicProgress[]> => {
  const response = await api.get('/user/progress/detailed');
  return response.data;
};

export const getMasteryTopicDetails = async (topicId: string): Promise<MasteryTopicDetail> => {
  const response = await api.get(`/mastery/${topicId}`);
  return response.data;
};

export const getTopicProblems = async (topicId: string): Promise<Problem[]> => {
  console.debug('API getTopicProblems called with topicId:', topicId);
  const response = await api.get(`/problems/topic/${topicId}`);
  return response.data;
};

export const getTopicResources = async (topicId: string, type: string = 'pdf'): Promise<Resource[]> => {
  const response = await api.get(`/resources/topic/${topicId}?type=${type}`);
  return response.data;
};

export const getUserSettings = async (): Promise<UserSettings> => {
  const response = await api.get('/user/settings');
  return response.data;
};

export const updateUserSettings = async (settings: UserSettings): Promise<void> => {
  await api.put('/user/settings', settings);
};

export const getUserDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/user/dashboard-stats');
  return response.data;
};

export const updateQuizPerformance = async (topicId: string, quizScore: number, threshold: number = 70): Promise<{ success: boolean; isWeakTopic: boolean; message: string }> => {
  const response = await api.post('/user/quiz-performance', {
    topicId,
    quizScore,
    threshold
  });
  return response.data;
};

export const getAdaptiveLearningPath = async (knownTopics: string[]): Promise<LearningPathNode[]> => {
  const response = await api.post('/user/adaptive-learning-path', {
    knownTopics
  });
  return response.data;
};

export const getPersonalAnalytics = async (): Promise<PersonalAnalytics> => {
  const response = await api.get('/user/personal-analytics');
  return response.data;
};

export const getNextRecommendedTopic = async (topicId: string): Promise<NextRecommendedTopic> => {
  const response = await api.get(`/user/next-topic/${topicId}`);
  return response.data;
};

export const checkTopicCompletion = async (topicId: string): Promise<TopicCompletionStatus> => {
  const response = await api.get(`/user/topic-completion/${topicId}`);
  return response.data;
};

export const getInitialSetupStatus = async (): Promise<{ completed: boolean; date?: string }> => {
  const response = await api.get('/user/initial-setup-status');
  return response.data;
};

export const markInitialSetupComplete = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/user/mark-initial-setup-complete', {});
  return response.data;
};

export const getFullLearningPath = async (): Promise<PathItem[]> => {
  const response = await api.get('/path/full');
  return response.data;
};

export const submitProblemSolution = async (submission: ProblemSubmission): Promise<SubmissionResult> => {
  const response = await api.post('/problems/submit', submission);
  return response.data;
};

export const getProblemCompletionStatus = async (problemId: string): Promise<{ problemId: string; isCompleted: boolean }> => {
  const response = await api.get(`/user/problem-completion/${problemId}`);
  return response.data;
};

export const updateProblemCompletion = async (problemId: string, isCompleted: boolean): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/user/problem-completion', { problemId, isCompleted });
  return response.data;
};

export const getTopicProblemProgress = async (topicId: string): Promise<{ completedProblems: string[]; totalProblems: number; progressPercentage: number }> => {
  const response = await api.get(`/user/topic-problem-progress/${topicId}`);
  return response.data;
};

export const getResourceCompletionStatus = async (resourceId: string): Promise<{ resourceId: string; isCompleted: boolean }> => {
  const response = await api.get(`/user/resource-completion/${resourceId}`);
  return response.data;
};

export const updateResourceCompletion = async (resourceId: string, isCompleted: boolean): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/user/resource-completion', { resourceId, isCompleted });
  return response.data;
};

export const getSubtopicCompletionStatus = async (subtopicId: string): Promise<{ subtopicId: string; isCompleted: boolean }> => {
  const response = await api.get(`/user/subtopic-completion/${subtopicId}`);
  return response.data;
};

export const updateSubtopicCompletion = async (subtopicId: string, isCompleted: boolean): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/user/subtopic-completion', { subtopicId, isCompleted });
  return response.data;
};

export const getKnownTopics = async (): Promise<string[]> => {
  const response = await api.get('/user/known-topics');
  return response.data.knownTopics;
};

export const setKnownTopics = async (knownTopics: string[]): Promise<void> => {
  await api.post('/user/known-topics', { knownTopics });
};

export const notifyUserProgressUpdated = () => {
  window.dispatchEvent(new Event('user-progress-updated'));
};

export default api;
