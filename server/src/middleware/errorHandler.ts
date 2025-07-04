// FileName: MultipleFiles/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Safely log error stack or the error itself
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

export default errorHandler;
