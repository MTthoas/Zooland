import { Request, Response } from 'express';
import SpacesService from './spaces.service';
import Space, { ISpace } from './spaces.model';

class SpacesController {
    
    async getAllSpaces(req: Request, res: Response): Promise<void> {
        try {
            const spaces = await Space.find({})
            res.json(spaces)
        }catch (err: any) {
            res.status(500).json({message: err.message})
        }
    }

    async addSpace(req: Request, res: Response): Promise<void> {
        try {
            const space: ISpace = req.body;
            const newSpace = new Space(space);
            await newSpace.save();
            res.status(201).json(newSpace);
        }catch (err: any) {
            res.status(500).json({message: err.message})
        }
    }
    

    // async addSpace(req: Request, res: Response): Promise<void> {

    // }



    // async getAllSpaces(req: Request, res: Response): Promise<void> {
    //     const spaces = await SpacesService.getSpaces();
    //     res.status(200).json(spaces);
    // }

    // async addSpace(req: Request, res: Response): Promise<void> {
    //     const space: ISpace = req.body;

    //     if (await SpacesService.getSpaceByName(space.nom)) {
    //         res.status(409).send(`A space with name "${space.nom}" already exists.`);
    //         return;
    //     }

    //     const newSpace = await SpacesService.addSpace(space);
    //     res.status(201).json(newSpace);
    // }

    // async getSpaceByName(req: Request, res: Response): Promise<void> {
    //     const nom: string = req.params.nom;
    //     const space = await SpacesService.getSpaceByName(nom);
    //     if (space) {
    //         res.status(200).json(space);
    //     } else {
    //         res.status(404).end();
    //     }
    // }

    // async updateSpace(req: Request, res: Response): Promise<void> {
    //     const nom: string = req.params.nom;
    //     const space: ISpace = req.body;
    //     const updatedSpace = await SpacesService.updateSpace(nom, space);
    //     if (updatedSpace) {
    //         res.status(200).json(updatedSpace);
    //     } else {
    //         res.status(404).send(`A space with name "${nom}" does not exist.`);
    //     }
    // }

    // async deleteSpace(req: Request, res: Response): Promise<void> {
    //     const nom: string = req.params.nom;
    //     const deletedSpace = await SpacesService.deleteSpace(nom);
    //     if (deletedSpace) {
    //         res.status(200).json(`Deleted space with name "${nom}"`);
    //     } else {
    //         res.status(404).send(`A space with name "${nom}" does not exist.`);
    //     }
    // }

    // async toggleMaintenanceStatus(req: Request, res: Response): Promise<void> {
    //     const nom: string = req.params.nom;
    //     const isAdmin: boolean = req.body.isAdmin;
    //     const success: boolean = await SpacesService.toggleMaintenanceStatus(nom, isAdmin);
    //     if (success) {
    //         res.status(200).end();
    //     } else {
    //         res.status(404).end();
    //     }
    // }
}

export default new SpacesController();
