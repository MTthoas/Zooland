import { ISpace } from '../models/spaces.model';
import SpaceModel from '../models/spaces.model';

class SpacesService {
  constructor() {
    // Connect to MongoDB here if you haven't done so in another file
  }

  async getSpaces(): Promise<ISpace[]> {
    return await SpaceModel.find();
  }

  async getSpaceByName(nom: string): Promise<ISpace | null> {
    return await SpaceModel.findOne({ nom });
  }

  async getMaintenanceBestMonth(): Promise<string | null> {
    try {
      const spaces = await SpaceModel.find();
      const bestMonth = spaces.reduce((acc: string | null, space: ISpace) => {
        if (space.maintenanceLog && space.maintenanceLog.length > 0) {
          const currentBestMonth = space.maintenanceLog[0].bestMonth;
          if (!acc) return currentBestMonth;
          if (currentBestMonth < acc) return currentBestMonth;
        }
        return acc;
      }, null);

      return bestMonth;
    } catch (err) {
      throw new Error('Erreur lors de la récupération du meilleur mois dans le carnet de maintenance.');
    }
  }

  async addSpace(space: ISpace): Promise<ISpace> {
    space.maintenanceLog = [{ bestMonth: 'Janvier', commentary:"Nouvelle espace" }]; // Assurez-vous d'ajouter la propriété maintenanceLog avec la valeur par défaut
    const newSpace = new SpaceModel(space);
    return await newSpace.save();
  }

  async updateSpace(nom: string, updatedSpace: ISpace): Promise<ISpace | null> {
    return await SpaceModel.findOneAndUpdate({ nom }, updatedSpace, { new: true });
  }

  async deleteSpace(nom: string): Promise<ISpace | null> {
    return await SpaceModel.findOneAndDelete({ nom });
  }

  async toggleMaintenanceStatus(nom: string): Promise<ISpace | null> {
    const space = await SpaceModel.findOne({ nom });
    if (space) {
      space.isMaintenance = !space.isMaintenance;
      return await space.save();
    }
    return space;
  }

   async setBestMonthForSpace(nom: string, bestMonth: string): Promise<ISpace | null> {
    try {
      const updatedSpace = await SpaceModel.findOneAndUpdate(
        { nom },
        { $set: { 'maintenanceLog.0.bestMonth': bestMonth } },
        { new: true }
      );

      return updatedSpace;
    } catch (error) {
      throw new Error('Impossible de mettre à jour le meilleur mois pour réparer l\'espace.');
    }
  }

  /** 
   * Animals
  */

  async addAnimalSpecies(nom: string, species: string): Promise<ISpace | null> {
    try {
      const space = await SpaceModel.findOneAndUpdate(
        { nom },
        { $push: { animalSpecies: species } },
        { new: true }
      );
  
      return space;
    } catch (err) {
      throw new Error('Erreur lors de l\'ajout de l\'espèce animale à l\'espace.');
    }
  }

  
  async getAnimalsInSpace(nom: string): Promise<string[] | null> {
    try {
      const space = await SpaceModel.findOne({ nom });
      if (space) {
        if (space.animalSpecies.length > 0) {
          return space.animalSpecies;
        }
      }
      return null;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des espèces animales pour l\'espace spécifié.');
    }
  }

  
  async addTreatmentToVeterinaryLog(nom: string, treatment: string): Promise<ISpace | null> {
    try {
      const space = await SpaceModel.findOneAndUpdate(
        { nom },
        { $push: { veterinaryLog: treatment } },
        { new: true }
      );
  
      return space;
    } catch (err) {
      throw new Error('Erreur lors de l\'ajout du traitement au carnet de suivi vétérinaire.');
    }
  }


}

export default new SpacesService();
