import mongoose, { Document, Schema } from 'mongoose';
import { ISpace, SpaceSchema } from './spaces.model';

export interface ITicket {
  user: string; // ID de l'utilisateur qui possède le billet
  validUntil: Date; // Date à laquelle le billet expire
  spaces: any[]; // Espaces accessibles avec ce billet
}

const TicketSchema: Schema = new Schema({
  user: { type: String, required: true },
  validUntil: { type: Date, required: true },
  spaces: { type: [], required: true },
});

export { TicketSchema };
export default mongoose.model<ITicket>('Ticket', TicketSchema);
