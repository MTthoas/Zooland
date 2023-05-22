import mongoose, { Document, Schema } from 'mongoose';

export interface ISpace extends Document {
  nom: string;
  description: string;
  images: string[];
  type: string;
  capacite: number;
  duree: number;
  horaires: string[];
  accessibleHandicape: boolean;
  isMaintenance: boolean;
  maintenanceLog: {
    bestMonth: string;
    commentary: string;
  }[];
  animalSpecies: string[];
  veterinaryLog: string[];
}

const SpaceSchema: Schema = new Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  type: { type: String, required: true },
  capacite: { type: Number, required: true },
  duree: { type: Number, required: true },
  horaires: { type: [String], required: true },
  accessibleHandicape: { type: Boolean, required: true },
  isMaintenance: { type: Boolean, required: true },
  maintenanceLog: {
    type: [
      {
        bestMonth: {
          type: String,
        },
        commentary: {
          type: String,
        }
      },
    ],
    required: false,
  },
  animalSpecies: { type: [String], required: false },
  veterinaryLog: { type: [String], required: false },
});

export default mongoose.model<ISpace>('Space', SpaceSchema);