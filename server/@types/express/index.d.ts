import 'express';

declare global {
  interface User {
    id: string;
    username: string;
    email?: string;
    password: string;
    role?: 'user' | 'admin' | 'premium';
    createdAt: string;
    updatedAt: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
} 