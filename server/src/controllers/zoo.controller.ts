import { Request, Response, NextFunction } from 'express';
import ZooModel, { IZoo } from '../models/zoo.model';
import UserModel, { IUser } from '../models/auth.model';

export default class ZooController {

    static async openZoo(req: Request, res: Response) {

      try {
			
          // Vérifier si au moins une personne est présente pour chaque rôle
         const receptionist = await UserModel.findOne({ role: 'receptionist' });
         const veterinarian = await UserModel.findOne({ role: 'veterinary' });
         const cleaner = await UserModel.findOne({ role: 'cleaner' });
         const salesperson = await UserModel.findOne({ role: 'salesperson' });
    
         if (!receptionist || !veterinarian || !cleaner || !salesperson) {
            return res.status(400).json({ message: 'Impossible d\'ouvrir le zoo. Vérifiez qu\'il y ait au moins une personne à l\'accueil, un soigneur, un agent d\'entretien et un vendeur.' });
         }
    
         // Mettre à jour le statut d'ouverture du zoo
         const zoo = await ZooModel.findOneAndUpdate({}, { isOpen: true }, { new: true });
    
         if (!zoo) {
            return res.status(404).json({ message: 'Zoo non trouvé.' });
         }
    
         res.json({ message: 'Le zoo est ouvert.' });

      } catch (error) {

         res.status(500).json({ message: 'Erreur lors de l\'ouverture du zoo.' });
      }

    }

   static async closeZoo(req: Request, res: Response) {

      try {

         const zoo = await ZooModel.findOneAndUpdate({}, { isOpen: false }, { new: true });

         if (!zoo) {
            return res.status(404).json({ message: 'Zoo non trouvé.' });
         }

         res.json({ message: 'Le zoo est fermé.' });

      } catch (error) {

         res.status(500).json({ message: 'Erreur lors de la fermeture du zoo.' });
      }

   }

	static async ensureZooOpen(req: Request, res: Response, next: NextFunction) {
		try {
		  const zoo = await ZooModel.findOne({ nom: 'LaFaille' });
		  if (!zoo || !zoo.isOpen) {
			 return res.status(403).json({ message: 'Le zoo est fermé.' });
		  }
		  
        res.status(200).json({ message: 'Le zoo est ouvert.' });

		} catch (error) {
		  res.status(500).json({ message: 'Erreur lors de la vérification du statut du zoo.' });
		}
	 }

}