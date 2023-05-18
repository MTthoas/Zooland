import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
