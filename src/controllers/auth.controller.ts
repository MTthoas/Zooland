import AuthService from '../services/auth.service'
import { Request, Response, NextFunction } from 'express';
import User from '../models/auth.model';
import CustomRequest from '../utils/types';

export default class AuthController {

    static async authenticate(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
          const token = await AuthService.login(username, password);
          res.json({ token });
        } catch (error) {
          res.status(401).json({ error: (error as Error).message });
        }
    }


    static async signup(req: Request, res: Response) {
        const { username, password, key} = req.body;
        try {
          const user = await AuthService.signup(username, password, key);
          res.json({ message: 'Inscription réussie.', user });
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        const users = await User.find({}, '-password');
        res.json(users);
    }

    static async deleteUser(req: Request, res: Response) {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        res.sendStatus(204);
    }

    static ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
        try {
          AuthService.verifyToken(req);
          next();
        } catch (error) {
          res.status(401).json({ message: 'Authentification requise.' });
        }
    }
      
}