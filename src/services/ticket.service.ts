import { ISpace } from '../models/spaces.model';
import SpaceModel from '../models/spaces.model';

import { ITicket } from '../models/ticket.model';
import TicketModel from '../models/ticket.model';

class TicketService {

    async createTicket(ticket: ITicket, ): Promise<ITicket> {

        const newTicket = new TicketModel(ticket);
        return await newTicket.save();

    }

}

export default new TicketService();