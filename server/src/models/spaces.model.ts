import mongoose, { Document, Schema } from 'mongoose';

import { MaintenanceLogSchema } from './maintenancelog.model';
import { IMaintenanceLog } from './maintenancelog.model';

import { VeterinaryLogSchema } from './veterinarylog.model';
import { IVeterinaryLog } from './veterinarylog.model';


export interface ISpace extends Document {
  nom: string;
  description: string;
  images?: string[];
  type: string;
  capacite: number;
  horaires: {
    opening: string; // heure d'ouverture
    closing: string; // heure de fermeture
  }[];
  imagePath: string;
  accessibleHandicape: boolean;
  isMaintenance: boolean;
  bestMonth: string;
  maintenanceLog: IMaintenanceLog[];
  animalSpecies: string[];
  veterinaryLog: IVeterinaryLog[];
}

const SpaceSchema: Schema = new Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  type: { type: String, required: true },
  capacite: { type: Number, required: true },
  horaires: {
    type: [
      {
        opening: { type: String, required: true },
        closing: { type: String, required: true }
      },
    ],
    required: true,
  },
  imagePath: { type: String, required: true },
  accessibleHandicape: { type: Boolean, required: true },
  isMaintenance: { type: Boolean, required: true },
  bestMonth: { type: String, required: false },
  maintenanceLog: { type: [MaintenanceLogSchema], required: false },
  animalSpecies: { type: [String], required: false },
  veterinaryLog: { type: [VeterinaryLogSchema], required: false },
});


export { SpaceSchema };
export default mongoose.model<ISpace>('Space', SpaceSchema);
