import { Request, Response } from 'express';
import SpacesService from './spaces.service';
import { Space } from './spaces.class';

class SpacesController {

  getAllSpaces(req: Request, res: Response): void {
    const spaces = SpacesService.getSpaces();
    res.status(200).json(spaces);
  }

  addSpace(req: Request, res: Response): void {
    const space: Space = req.body;

    if (SpacesService.getSpaceByName(space.nom)) {
        res.status(409).send(`A space with name "${space.nom}" already exists.`);
        return;
    }

    SpacesService.addSpace(space);
    res.status(201).json(space);
  }

  getSpaceByName(req: Request, res: Response): void {
    const nom: string = req.params.nom;
    console.log(nom)
    const space = SpacesService.getSpaceByName(nom);
    if (space) {
      res.status(200).json(space);
    } else {
      res.status(404).end();
    }
  }

    updateSpace(req: Request, res: Response): void {
        const nom: string = req.params.nom;
        const space: Space = req.body;
        SpacesService.updateSpace(nom, space);
        res.status(200).json(space);       
    }

    deleteSpace(req: Request, res: Response): void {
        const nom: string = req.params.nom;
        SpacesService.deleteSpace(nom);
        res.status(200).json("Suppression effectuée");
    }


}

export default new SpacesController();