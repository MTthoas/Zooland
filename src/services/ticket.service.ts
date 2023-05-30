import { ISpace } from '../models/spaces.model';
import SpaceModel from '../models/spaces.model';

import { IUser } from '../models/auth.model';

import { ITicket } from '../models/ticket.model';
import TicketModel from '../models/ticket.model';

class TicketService {

    async getAllTickets(): Promise<ITicket[]> {
        return TicketModel.find();
    }

    async getAllTicketsFromASpace(space: ISpace): Promise<ITicket[]> {
        return TicketModel.find({ spaces: space.nom });
    }
    

    // async getAllTicketsBySpace(space: ISpace): Promise<ITicket[]> {

    //     const tickets = await TicketModel.find({ espace: space.nom });
    //     return tickets;
    // }



    async createTicket(spaces: ISpace[], user: IUser, type: 'journee' | 'weekend' | 'annuel' | '1daymonth'): Promise<ITicket[]> {
        const tickets = [];

        const processedInput = TicketService.removeAccentsAndLowerCase(type);

        let validUntil: Date | undefined;

    switch (processedInput) {
        case 'journee':
        validUntil = TicketService.getEndOfDay();  // La validité est jusqu'à la date actuelle pour le PASS journée
        break;
        case 'weekend':
        validUntil = TicketService.getEndOfWeek(); // La validité est jusqu'à la fin de la semaine pour le PASS Week-end
        break;
        case 'annuel':
        validUntil = TicketService.getEndOfYear(); // La validité est jusqu'à la fin de l'année pour le PASS Annuel
        break;
        case '1daymonth':
        validUntil = TicketService.getEndOfNextMonth(); // La validité est jusqu'à la fin du mois suivant pour le PASS 1daymonth
        break;
        default:
        break;
    }
        
        for (const space of spaces) {
            const ticket = new TicketModel({
                user: user.username,
                validUntil: validUntil,
                spaces: [space.nom],
                type: processedInput
            });
    
            const savedTicket = await ticket.save();
            tickets.push(savedTicket);
        }
    
        return tickets;
    }

    static getEndOfDay(): Date {
        const today = new Date();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        return endOfDay;
      }

    static getEndOfWeek(): Date {
        const today = new Date();
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
        endOfWeek.setHours(23, 59, 59, 999);
        return endOfWeek;
      }
      
    static getEndOfYear(): Date {
        const today = new Date();
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        return endOfYear;
    }
      
    static getEndOfNextMonth(): Date {
        const today = new Date();
        const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);
        return endOfNextMonth;
    }

    static removeAccentsAndLowerCase(str: string): string {
        const normalizedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedStr.toLowerCase();
    }
    

}

export default new TicketService();