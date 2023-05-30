import { ISpace } from '../models/spaces.model';
import SpaceModel from '../models/spaces.model';

import { IUser } from '../models/auth.model';

import { ITicket } from '../models/ticket.model';
import TicketModel from '../models/ticket.model';

class TicketService {

    async createTicket(spaces: ISpace[], user: IUser): Promise<ITicket[]> {
        const tickets = [];
        
        for (const space of spaces) {
            const ticket = new TicketModel({
                user: user.username,
                validUntil: new Date(),
                spaces: [space.nom],
            });
    
            const savedTicket = await ticket.save();
            tickets.push(savedTicket);
        }
    
        return tickets;
    }
    

}

export default new TicketService();