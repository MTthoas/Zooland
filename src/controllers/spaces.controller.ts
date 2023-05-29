import { Request, Response } from 'express';
import SpacesService from '../services/spaces.service';
import { ISpace } from '../models/spaces.model';
import AuthService from '../services/auth.service';

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
