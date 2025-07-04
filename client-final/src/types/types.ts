export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
  description: string;
  prerequisites?: Array<Subtopic | string>;
  resources: Resource[];
  questions: Question[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'cheatsheet';
  url: string;
  duration?: number; // in minutes
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution?: string;
  hints: string[];
}

export interface UserProgress {
  userId: string;
  topicId: string;
  subtopicId?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessed: string;
  score?: number;
  completionDate?: string;
}
