import { Request, Response } from 'express';
import { ISpace } from '../models/spaces.model';
import { ITicket } from '../models/ticket.model';
import AuthService from '../services/auth.service';
import SpacesService from '../services/spaces.service';
import TicketService from '../services/ticket.service';
import StatsModel from '../models/stats.model';

import { IVeterinaryLog } from '../models/veterinarylog.model';

class SpacesController {
  
  async getAllSpaces(req: Request, res: Response): Promise<void> {
    try {
      console.log('getAllSpaces');
      const spaces = await SpacesService.getSpaces();
      console.log(spaces)
      res.json(spaces);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async addSpace(req: Request, res: Response): Promise<void> {
    try {
      const space: ISpace = req.body;

      const spaceName = await SpacesService.getSpaceByName(space.nom);
      if (spaceName) {
        res.status(409).json({ message: 'Space already exists' });
        return;
      }
      
      const newSpace = await SpacesService.addSpace(space);
      res.status(201).json({ message: 'Space successfully added', newSpace});
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getSpaceByName(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const space = await SpacesService.getSpaceByName(nom);
      if (space) {
        res.status(200).json(space);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async recordVisit(req: Request, res: Response) {
    try {
      const { spaceId } = req.params;
  
      // Créez une nouvelle entrée de statistiques pour cette visite
      const stats = new StatsModel({
        date: new Date(),
        visitors: 1,
        visitorsLive: 1,
        hour: new Date().getHours(),
        spaceId
      });
  
      await stats.save();
  
      res.json({ message: 'Visite enregistrée avec succès.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement de la visite.' });
    }
  }

  async deleteSpace(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const space = await SpacesService.deleteSpace(nom);

      const getSpace = await SpacesService.getSpaces();
      if (space && getSpace) {
        res.status(200).json(getSpace);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateSpace(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const updatedSpace: ISpace = req.body;

      const getSpace = await SpacesService.getSpaceByName(nom);
      if (!getSpace) {
        res.status(404).json({ message: 'Space not found' });
        return;
      }


      const space = await SpacesService.updateSpace(nom, updatedSpace);
      if (space) {
        res.status(200).json(space);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async toggleMaintenanceStatus(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
   
      const adminUserName: string = AuthService.verifyToken(req).username;
      
      const space = await SpacesService.toggleMaintenanceStatus(nom, adminUserName);
      if (space) {
        res.status(200).json(space);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
  
  async setBestMonthForSpace(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const bestMonth: string = req.body.bestMonth;

      const updatedSpace = await SpacesService.setBestMonthForSpace(nom, bestMonth);

      if (updatedSpace) {
        res.status(200).json(updatedSpace);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }



  
async getAllTickets(req: Request, res: Response): Promise<void> {
    try {
      const tickets = await TicketService.getAllTickets();
      res.json(tickets);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

async getTicketsFromSpace(req: Request, res: Response): Promise<void> {
    try {
        const nom: string = req.params.spaceName;

        const space = await SpacesService.getSpaceByName(nom);
        if (!space) {
            res.status(404).json({ message: 'Space not found' });
            return;
        }

        console.log(space)
        
        const tickets: ITicket[] = await TicketService.getAllTicketsFromASpace(space);
        res.json(tickets);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async checkTicket(req: Request, res: Response): Promise<void> {
    try {
        const ticketId: string = req.params.ticketId;
        const spaceName: string = req.params.spaceName;

        const user = await AuthService.getUserByTicketId(ticketId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const space = await SpacesService.getSpaceByName(spaceName);
        if (!space) {
            res.status(404).json({ message: 'Space not found' });
            return;
        }

        const ticket = await TicketService.getTicketById(ticketId);

        if (!ticket) {
            res.status(404).json({ message: 'No ticket found for the user' });
            return;
        }

        const hasAccess = ticket.spaces.includes(space.nom);
        const isValid = new Date(ticket.validUntil) > new Date();

        if (!hasAccess || !isValid) {
            res.status(403).json({ message: 'Invalid or expired ticket' });
            return;
        }

         // Enregistrez une visite
         const stats = new StatsModel({
          date: new Date(),
          visitors: 1,
          visitorsLive: 1,
          hour: new Date().getHours(),
          spaceId: space._id
        });

        await stats.save();

        if (ticket.type === 'escapegame' && user.currentSpace !== null) {

            console.log(user.currentSpace)
            const currentIndex = user.currentSpace ? ticket.escapeGameOrder?.indexOf(user.currentSpace) : -1;
            const nextIndex = ticket.escapeGameOrder?.indexOf(space.nom);

            if (currentIndex === undefined || nextIndex === undefined || currentIndex === -1) {
                res.status(403).json({ message: 'Invalid ticket order' });
                return;
            }

            if (nextIndex === currentIndex + 1) {
                // Supprimer l'espace en cours dans le tableau spaces du ticket
                ticket.spaces = ticket.spaces.filter(s => s !== space.nom);

                // Supprimer l'espace en cours dans le tableau escapeGameOrder du ticket
                if (ticket.escapeGameOrder) {
                    ticket.escapeGameOrder = ticket.escapeGameOrder.filter(s => s !== space.nom);
                }
            } else {
                res.status(403).json({ message: 'Invalid ticket order' });
                return;
            }
        }

        await SpacesService.updateUserCurrentSpace(user._id, space.nom);

        res.status(200).json({ message: 'Access granted', user: user, ticket: ticket });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async checkOut(req: Request, res: Response): Promise<void> {
  try {
      const ticketId: string = req.params.ticketId;
      const spaceName: string = req.params.spaceName;

      const user = await AuthService.getUserByTicketId(ticketId);

      if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
      }

      const space = await SpacesService.getSpaceByName(spaceName);
      if (!space) {
          res.status(404).json({ message: 'Space not found' });
          return;
      }

      const ticket = await TicketService.getTicketById(ticketId);

      if (!ticket) {
          res.status(404).json({ message: 'No ticket found for the user' });
          return;
      }

      const hasAccess = ticket.spaces.includes(space.nom);
      const isValid = new Date(ticket.validUntil) > new Date();

      if (!hasAccess || !isValid) {
          res.status(403).json({ message: 'Invalid or expired ticket' });
          return;
      }

      // Enregistrez une sortie
      const stats = new StatsModel({
          date: new Date(),
          visitors: 0,
          visitorsLive: -1, // Utilisez -1 pour indiquer une sortie
          hour: new Date().getHours(),
          spaceId: space._id
      });

      await stats.save();

      await SpacesService.updateUserCurrentSpace(user._id, ""); // Mettez à jour l'espace actuel de l'utilisateur à null

      res.status(200).json({ message: 'Exit registered', user: user, ticket: ticket });

  } catch (err: any) {
      res.status(500).json({ message: err.message });
  }
}




async deleteTicket(req: Request, res: Response): Promise<void> {
    try {
        const ticketId: string = req.params.ticketId;

        const ticket = await TicketService.deleteTicketById(ticketId);

        if (ticket) {
            // Get the user
            const user = await AuthService.getUserById(ticket._idOfUser);

            // Remove the ticket from the user's tickets
            if (user && user.tickets) {
                const index = user.tickets.indexOf(ticketId);
                if (index > -1) {
                    user.tickets.splice(index, 1);
                }

                await user.save();
            }

            res.status(200).json(ticket);
        } else {
            res.status(404).end();
        }
        
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

async deleteAllTicketdFromUserId(req: Request, res: Response): Promise<void> {
    try {
        const userId: string = req.params.userId;

        const tickets = await TicketService.deleteAllTicketFromAnUser(userId);

        if (tickets) {
            // Get the user
            const user = await AuthService.getUserById(userId);
            
            // Update the tickets field
            if (user) {
                user.tickets = [];
                await user.save();
            }

            res.status(200).json(tickets);
        } else {
            res.status(404).end();
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}





async buyTicket(req: Request, res: Response): Promise<void> {
    try {
      const spaceNames: string[] = req.body.spaces;
      const userId: string = req.params.userId;
      const type = req.body.type;
  
      // Vérifier si tous les espaces existent
      const spaces: ISpace[] = [];
      for (const spaceName of spaceNames) {
        const space = await SpacesService.getSpaceByName(spaceName);
        if (space) {
          spaces.push(space);
        } else {
          res.status(404).json({ message: `Space not found: ${spaceName}` });
          return;
        }
      }
  
      // Vérifier si l'utilisateur existe
      const user = await AuthService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      // Créer le ticket pour tous les espaces disponibles
        const ticket: ITicket = await TicketService.createTicket(spaces, user, type);

        // Ajouter le ticket à l'utilisateur
        user.tickets = user.tickets ? [...user.tickets, ticket._idOfUser] : [ticket._idOfUser];
        await user.save();

        res.status(201).json({ message: 'Ticket successfully created', ticket });

    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}

  


  async getBestMonthForSpace(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const bestMonth = await SpacesService.getBestMonthForSpace(nom);

      if (bestMonth) {
        res.status(200).json(bestMonth);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }


  /**
   * Add animal species to space
   */

  async addAnimalSpecies(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const species: string = req.body.species;
  
      const updatedSpace = await SpacesService.addAnimalSpecies(nom, species);
  
      if (updatedSpace) {
        res.status(200).json(updatedSpace);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAnimalsInSpace(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const animals = await SpacesService.getAnimalsInSpace(nom);
  
      if (animals !== null) {
        if (animals.length > 0) {
          res.status(200).json(animals);
        }
      } else {
        res.status(200).json({ message: 'Aucun animal trouvé dans cet espace.' });
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
  
   async addTreatmentToVeterinaryLog(req: Request, res: Response): Promise<void> {
    try {
      const nom: string = req.params.nom;
      const treatment: IVeterinaryLog = req.body.treatment;

      // Ajouter la personne ayant fait le traitement avec AuthService.verifyToken
      const adminUsername: string = AuthService.verifyToken(req).username;

      treatment.treatmentBy = adminUsername;
      
      const space = await SpacesService.addTreatmentToVeterinaryLog(nom, treatment);
      if (space) {
        res.status(200).json(space);
      } else {
        res.status(404).end();
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }


}

export default new SpacesController();
