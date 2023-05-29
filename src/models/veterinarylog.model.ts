import mongoose, { Document, Schema } from 'mongoose';

export interface IVeterinaryLog {
    treatmentDate: string; // Date du traitement
    treatmentBy: string; // ID du vétérinaire qui a effectué le traitement
    condition: string; // Condition de l'animal
    treatmentDetails: string; // Détails du traitement
    species: string; // Espèce ayant reçu le traitement
}

const VeterinaryLogSchema: Schema = new Schema({
    treatmentDate: { type: String },
    treatmentBy: { type: String },
    condition: { type: String },
    treatmentDetails: { type: String },
    species: { type: String } // Espèce ayant reçu le traitement
    
}); 

export { VeterinaryLogSchema };
export default mongoose.model<IVeterinaryLog>('VeterinaryLog', VeterinaryLogSchema);