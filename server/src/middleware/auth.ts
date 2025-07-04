// File: src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  console.log('Authentication middleware called');
  console.log('Headers:', req.headers);
  
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token extracted:', token ? 'Token present' : 'No token');
  
  if (!token) {
     console.log('No token provided, returning 401');
     res.status(401).json({ message: 'No token provided' });
     return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-here', (err, decoded) => {
    if (err) {
       console.log('Token verification failed:', err.message);
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }

    console.log('Token verified successfully, user:', decoded);
    req.user = decoded as User; // Cast decoded to User type
    next();
  });
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return next();
};
