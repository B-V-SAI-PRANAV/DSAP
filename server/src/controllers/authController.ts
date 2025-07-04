import { Request, Response } from 'express';
import UserService from '../services/user.service';
import jwt from 'jsonwebtoken';

class AuthController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await UserService.authenticate(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-here', { expiresIn: '1h' });
    return res.json({ token, user: { ...user, role: user.role } });
  }

  async register(req: Request, res: Response) {
    const { username, password, email } = req.body;
    const user = await UserService.createUser(username, password, email);
    if (!user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-here', { expiresIn: '1h' });
    return res.status(201).json({ token, user: { ...user, role: user.role } });
  }

  async getProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  }
}

export default new AuthController();
