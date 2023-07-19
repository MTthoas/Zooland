import AuthService from '../services/auth.service'
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/auth.model';
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

    static async getUserById(req: Request, res: Response) {
        const { userId } = req.params;

        const user = await AuthService.getUserById(userId);
        if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        } 
        res.json(user);
    }

    


	static async getUserByName(req: Request, res: Response) {
		const nom: string = req.params.username;
		const user = await AuthService.getUserByName(nom);
		if (!user ) {
			return res.status(404).json({ error: 'Utilisateur non trouvé.' });
		}
		res.json(user);	
	}

  static async getUserInfo(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({ error: 'No token provided.' });
      }

      const token = authHeader.split(' ')[1]; // Bearer <token>
      const user = AuthService.getUserInfo(token);
      
      res.json({ user });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token.' });
    }
  }


    static async deleteUser(req: Request, res: Response) {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        res.json({ message: 'Utilisateur supprimé.' });
    }

    static ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
        
        try {
          AuthService.verifyToken(req);
          next();
        } catch (error) {
          res.status(401).json({ message: 'Authentification requise.' });
        }

    }

    static async ensureAdmin(req: CustomRequest, res: Response, next: NextFunction) {
      try {
        const decodedToken = AuthService.verifyToken(req);
  
        if (decodedToken.role !== 'admin') {
          throw new Error('Vous n\'avez pas les droits d\'administrateur.');
        }
  
        next();
      } catch (error) {
        res.status(401).json({ message: 'Authentification requise en tant qu\'administrateur.' });
      }
    }

    static async setUserRole(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
    
            const user = await User.findById(userId);
            if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
    
            // Vérifier et mettre à jour le rôle de l'utilisateur
            user.role = role;
            await user.save();
    
            res.json({ message: 'Rôle de l\'utilisateur mis à jour avec succès.' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle de l\'utilisateur.' });
        }
    }

    static async ensureVeterinary(req: CustomRequest, res: Response, next: NextFunction) {
      try {
          const decodedToken = AuthService.verifyToken(req);

          if (decodedToken.role !== 'veterinary') {
              throw new Error('Vous n\'avez pas les droits de vétérinaire.');
          }

          next();
      } catch (error) {
          res.status(401).json({ message: 'Authentification requise en tant que vétérinaire.' });
      }
    }

    static ensureRole(roles: string[]) {
      return (req: Request, res: Response, next: NextFunction) => {
        try {
          const decodedToken = AuthService.verifyToken(req);
  
          // Nettoyez et normalisez le rôle du token
          const tokenRole = decodedToken.role.trim().toLowerCase();

          // Nettoyez et normalisez les rôles
          const cleanedRoles = roles.map(role => role.trim().toLowerCase());
      
          console.log(tokenRole, cleanedRoles)
          if (!cleanedRoles.includes(tokenRole)) {
            throw new Error(`Vous n'avez pas les droits requis.`);
          }
      
          next();
        } catch (error : any) {
          res.status(401).json({ message: error.message });
        }
      };
    }

    static async addAllUsers(req: Request, res: Response) {
      try {
		const users: Partial<IUser>[] = [
          {
            username: 'receptionist',
            password: 'password',
            role: 'receptionist',
          },
          {
            username: 'veterinarian',
            password: 'password',
            role: 'veterinary',
          },
          {
            username: 'cleaner',
            password: 'password',
            role: 'cleaner',
          },
          {
            username: 'salesperson',
            password: 'password',
            role: 'salesperson',
          },
        ];
  
        await User.insertMany(users);
  
        res.json({ message: 'Utilisateurs ajoutés avec succès.' });
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout des utilisateurs.' });
      }
    }


    
      
}