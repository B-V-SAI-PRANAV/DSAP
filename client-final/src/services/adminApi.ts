// FileName: MultipleFiles/adminApi.ts
import api from './api';
import { AdminStats } from '../types'; // Import types from consolidated file

// User Management
export const getAdminStatistics = async (): Promise<AdminStats> => {
  const response = await api.get('/admin/statistics');
  return response.data;
};

export const getUsersList = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (userId: string, active: boolean) => {
  const response = await api.put(`/admin/users/${userId}/status`, { active });
  return response.data;
};

// Topic Management
export const getAllTopics = async () => {
  const response = await api.get('/admin/topics');
  return response.data;
};

export const createTopic = async (topicData: any) => {
  const response = await api.post('/admin/topics', topicData);
  return response.data;
};

export const updateTopic = async (topicId: string, topicData: any) => {
  const response = await api.put(`/admin/topics/${topicId}`, topicData);
  return response.data;
};

export const deleteTopic = async (topicId: string) => {
  const response = await api.delete(`/admin/topics/${topicId}`);
  return response.data;
};

export const addSubtopic = async (topicId: string, subtopicData: any) => {
  const response = await api.post(`/admin/topics/${topicId}/subtopics`, subtopicData);
  return response.data;
};

export const updateSubtopic = async (topicId: string, subtopicId: string, subtopicData: any) => {
  const response = await api.put(`/admin/topics/${topicId}/subtopics/${subtopicId}`, subtopicData);
  return response.data;
};

export const deleteSubtopic = async (topicId: string, subtopicId: string) => {
  const response = await api.delete(`/admin/topics/${topicId}/subtopics/${subtopicId}`);
  return response.data;
};

// Resource Management
export const getAllResources = async () => {
  const response = await api.get('/admin/resources');
  return response.data;
};

export const createResource = async (resourceData: any) => {
  const response = await api.post('/admin/resources', resourceData);
  return response.data;
};

export const updateResource = async (resourceId: string, resourceData: any) => {
  const response = await api.put(`/admin/resources/${resourceId}`, resourceData);
  return response.data;
};

export const deleteResource = async (resourceId: string) => {
  const response = await api.delete(`/admin/resources/${resourceId}`);
  return response.data;
};

// Analytics
export const getAdminAnalytics = async (timeRange: string = 'month') => {
  const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
  return response.data;
};

// System Settings
export const getSystemSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateSystemSettings = async (settings: any) => {
  const response = await api.put('/admin/settings', settings);
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await api.get('/admin/health');
  return response.data;
};

export const backupDatabase = async () => {
  const response = await api.post('/admin/backup');
  return response.data;
};

export const clearCache = async () => {
  const response = await api.post('/admin/cache/clear');
  return response.data;
};

// Quiz Management
export const getAllQuizQuestions = async () => {
  const response = await api.get('/admin/quiz-questions');
  return response.data;
};

export const createQuizQuestion = async (questionData: any) => {
  const response = await api.post('/admin/quiz-questions', questionData);
  return response.data;
};

export const updateQuizQuestion = async (questionId: string, questionData: any) => {
  const response = await api.put(`/admin/quiz-questions/${questionId}`, questionData);
  return response.data;
};

export const deleteQuizQuestion = async (questionId: string) => {
  const response = await api.delete(`/admin/quiz-questions/${questionId}`);
  return response.data;
};

// Problem Management
export const getAllProblems = async () => {
  const response = await api.get('/admin/problems');
  return response.data;
};

export const createProblem = async (problemData: any) => {
  const response = await api.post('/admin/problems', problemData);
  return response.data;
};

export const updateProblem = async (problemId: string, problemData: any) => {
  const response = await api.put(`/admin/problems/${problemId}`, problemData);
  return response.data;
};

export const deleteProblem = async (problemId: string) => {
  const response = await api.delete(`/admin/problems/${problemId}`);
  return response.data;
};

// User Analytics
export const getUserAnalytics = async (userId: string) => {
  const response = await api.get(`/admin/users/${userId}/analytics`);
  return response.data;
};

export const getLearningPathAnalytics = async () => {
  const response = await api.get('/admin/learning-path-analytics');
  return response.data;
};

// Content Management
export const uploadResource = async (file: File, resourceData: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(resourceData));
  
  const response = await api.post('/admin/upload-resource', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const bulkImportTopics = async (topicsData: any[]) => {
  const response = await api.post('/admin/bulk-import/topics', { topics: topicsData });
  return response.data;
};

export const bulkImportResources = async (resourcesData: any[]) => {
  const response = await api.post('/admin/bulk-import/resources', { resources: resourcesData });
  return response.data;
};

// Admin API endpoints
export const adminApi = {
  // Users
  getUsers: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, active: boolean) => {
    const response = await api.put(`/admin/users/${userId}/status`, { active });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Topics
  getTopics: async () => {
    const response = await api.get('/admin/topics');
    return response.data;
  },

  createTopic: async (topicData: any) => {
    const response = await api.post('/admin/topics', topicData);
    return response.data;
  },

  updateTopic: async (topicId: string, topicData: any) => {
    const response = await api.put(`/admin/topics/${topicId}`, topicData);
    return response.data;
  },

  deleteTopic: async (topicId: string) => {
    const response = await api.delete(`/admin/topics/${topicId}`);
    return response.data;
  },

  // Resources
  getResources: async () => {
    const response = await api.get('/admin/resources');
    return response.data;
  },

  createResource: async (resourceData: any) => {
    const response = await api.post('/admin/resources', resourceData);
    return response.data;
  },

  updateResource: async (resourceId: string, resourceData: any) => {
    const response = await api.put(`/admin/resources/${resourceId}`, resourceData);
    return response.data;
  },

  deleteResource: async (resourceId: string) => {
    const response = await api.delete(`/admin/resources/${resourceId}`);
    return response.data;
  },

  // Problems
  getProblems: async () => {
    const response = await api.get('/admin/problems');
    return response.data;
  },

  createProblem: async (problemData: any) => {
    const response = await api.post('/admin/problems', problemData);
    return response.data;
  },

  updateProblem: async (problemId: string, problemData: any) => {
    const response = await api.put(`/admin/problems/${problemId}`, problemData);
    return response.data;
  },

  deleteProblem: async (problemId: string) => {
    const response = await api.delete(`/admin/problems/${problemId}`);
    return response.data;
  },

  // Quiz Questions
  getQuizQuestions: async () => {
    const response = await api.get('/admin/quiz-questions');
    return response.data;
  },

  createQuizQuestion: async (questionData: any) => {
    const response = await api.post('/admin/quiz-questions', questionData);
    return response.data;
  },

  updateQuizQuestion: async (questionId: string, questionData: any) => {
    const response = await api.put(`/admin/quiz-questions/${questionId}`, questionData);
    return response.data;
  },

  deleteQuizQuestion: async (questionId: string) => {
    const response = await api.delete(`/admin/quiz-questions/${questionId}`);
    return response.data;
  },

  // Analytics
  getAnalytics: async (timeRange: string = 'month') => {
    const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },
};

export default adminApi;
