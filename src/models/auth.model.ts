import { Schema, model, Document } from 'mongoose';
import { ITicket, TicketSchema  } from './ticket.model';

export interface IUser extends Document{
  username: string;
  password: string;
  role: 'admin' | 'visitor' | 'employee' | 'veterinary' | 'receptionist' | 'cleaner' | 'salesperson';
  tickets?: ITicket[] | undefined;
}

export type IUserDocument = IUser & Document;

export const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'visitor', 'employee', 'veterinary', 'receptionist', 'cleaner', 'salesperson'],
    default: 'visitor',
    required: true,
  },
  tickets: { type: [TicketSchema], required: false },
});

export default model<IUserDocument>('User', UserSchema);

