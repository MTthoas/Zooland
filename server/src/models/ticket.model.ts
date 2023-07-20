import mongoose, { Document, Schema } from 'mongoose';
import { ISpace, SpaceSchema } from './spaces.model';

export interface ITicket {
  _idOfUser: string;
  dateOfPurchase: Date; // Date d'achat du billet
  validUntil: Date; // Date à laquelle le billet expire
  spaces: string[]; // Espaces accessibles avec ce billet
  // spaceName?: string; // Espaces accessibles avec ce billet
  // ticketId?: string;
  type: 'journee' | 'weekend' | 'annuel' | '1daymonth' | 'escapegame';
  escapeGameOrder?: string[]; 
}

const TicketSchema: Schema = new Schema({
  _idOfUser: { type: String, required: true },
  dateOfPurchase: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  spaces: { type: [], required: true },
  type: { type: String, enum: ['journee', 'weekend', 'annuel', '1daymonth', 'escapegame'], required: true },
  escapeGameOrder: { type: [String], required: false},
});

export { TicketSchema };
export default mongoose.model<ITicket>('Ticket', TicketSchema);
