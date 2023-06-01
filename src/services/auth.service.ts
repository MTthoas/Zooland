// auth.service.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import User, { IUser } from '../models/auth.model';

export interface DecodedToken {
  userId: string;
  username: string;
  role: string;
}

class AuthService {
  private static readonly JWT_SECRET = 'your-secret-key';
  private static readonly JWT_EXPIRATION = '1h';

  static async signup(username: string, password: string, key: string): Promise<IUser> {

    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error('Le nom d\'utilisateur existe déjà.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (key === process.env.ADMIN_KEY) ? 'admin' : 'visitor';
    console.log(role)
    const user = new User({ username, password: hashedPassword, role });
    return await user.save();
  }


  static async login(username: string, password: string): Promise<string> {
    const user = await User.findOne({ username });
    if (!user) throw new Error('Utilisateur introuvable.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Mot de passe incorrect.');

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      AuthService.JWT_SECRET,
      { expiresIn: AuthService.JWT_EXPIRATION }
    );

    return token;
  }

  static verifyToken(req: Request): DecodedToken {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Token: " + token)
    if (!token) throw new Error('Token non fourni.');
  
    try {
      const decodedToken = jwt.verify(token, AuthService.JWT_SECRET) as DecodedToken;
      console.log("there")
      return decodedToken;
    } catch (error) {
      console.error(error);
      throw new Error('Token invalide ou expiré.');
    }
  }

  static async getUserByName(username: string): Promise<IUser | null> {
		const user = await User.findOne({ username }, '-password');
		return user;
	}

  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId, '-password');
    return user;
  }
  
}

export default AuthService;
