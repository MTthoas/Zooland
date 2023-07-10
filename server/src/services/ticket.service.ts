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

    async getTicketsByUserId(userId: string): Promise<ITicket[]> {
        return TicketModel.find({ _idOfUser: userId });
    }

    async getTicketById(ticketId: string): Promise<ITicket | null> {
        return TicketModel.findById(ticketId);
    }

    async deleteTicketById(ticketId: string): Promise<ITicket | null> {
        return TicketModel.findByIdAndDelete({ _id : ticketId});
    }

    async deleteAllTicketFromAnUser(userId: string): Promise<ITicket[]> {
        const ticketsToDelete = await TicketModel.find({ _idOfUser: userId });
    
        await TicketModel.deleteMany({ _idOfUser : userId });
    
        return ticketsToDelete;
    }
    

    async createTicket(spaces: ISpace[], user: IUser, type: 'journee' | 'weekend' | 'annuel' | '1daymonth'): Promise<ITicket> {
        const processedInput = TicketService.removeAccentsAndLowerCase(type);
        let validUntil: Date | undefined;
        let escapeGameOrder: string[] | undefined;
    
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
            case 'escapegame':
                validUntil = TicketService.getEndOfWeek();
                escapeGameOrder = spaces.map(space => space.nom);
            default:
                break;
        }
    
        const ticket = new TicketModel({
            _idOfUser: user._id, 
            dateOfPurchase: new Date(),
            validUntil: validUntil,
            spaces: spaces.map(space => space.nom), // assign the names of all spaces
            type: processedInput,
            escapeGameOrder: escapeGameOrder,
        });
    
        const savedTicket = await ticket.save();
    
        return savedTicket;
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