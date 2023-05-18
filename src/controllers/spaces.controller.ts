import { Request, Response } from 'express';
import SpacesService from '../services/spaces.service';
import { ISpace } from '../models/spaces.model';
import AuthService from '../services/auth.service';

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
      const newSpace = await SpacesService.addSpace(space);
      res.status(201).json(newSpace);
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
      if (space) {
        res.status(200).json(space);
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
      const space = await SpacesService.toggleMaintenanceStatus(nom);
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
