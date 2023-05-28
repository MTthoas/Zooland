import { Schema, model, Document } from 'mongoose';

export interface IUser{
  username: string;
  password: string;
  role: 'admin' | 'employee' | 'veterinary' | 'receptionist' | 'cleaner' | 'salesperson';
}

export const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'employee', 'veterinary', 'receptionist', 'cleaner', 'salesperson'],
    default: 'employee',
    required: true,
  },
});

export default model<IUser>('User', UserSchema);
