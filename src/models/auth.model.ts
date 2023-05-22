import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'employee' | 'veterinary' | 'receptionist' | 'cleaner' | 'salesperson';
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'employee', 'veterinary', 'receptionist', 'cleaner', 'salesperson'],
    default: 'employee',
    required: true,
  },
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;