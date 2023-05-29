import mongoose, { Document, Schema } from 'mongoose';
import { ISpace, SpaceSchema } from './spaces.model';

export interface ITicket extends Document {
  user: string; // ID de l'utilisateur qui possède le billet
  validUntil: Date; // Date à laquelle le billet expire
  spaces: ISpace[]; // Espaces accessibles avec ce billet
}

const TicketSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  validUntil: { type: Date, required: true },
  spaces: { type: [SpaceSchema], required: true },
});

export default mongoose.model<ITicket>('Ticket', TicketSchema);
