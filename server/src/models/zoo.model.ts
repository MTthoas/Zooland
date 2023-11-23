import mongoose, { Document, Schema } from 'mongoose';
import { ISpace, SpaceSchema } from './spaces.model';
import { IUser, UserSchema } from './auth.model';

export interface IZoo extends Document {
  nom: string;
  adresse: string;
  espaces: ISpace[];
  isOpen: boolean;
  employees: IUser[];
}

const ZooSchema: Schema = new Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  espaces: { type: [SpaceSchema], required: true },
  isOpen: { type: Boolean, required: true },
  employees: { type: [UserSchema], required: true },
});

export default mongoose.model<IZoo>('Zoo', ZooSchema);
