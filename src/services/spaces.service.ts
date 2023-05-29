import { ISpace } from '../models/spaces.model';
import SpaceModel from '../models/spaces.model';

import { IMaintenanceLog } from '../models/maintenancelog.model';
import { IVeterinaryLog } from '../models/veterinarylog.model';


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


  async addSpace(space: ISpace): Promise<ISpace> {
    const newSpace = new SpaceModel(space);
  
    // Ajouter un log de maintenance initial
    newSpace.maintenanceLog.push({
      commentary: "Espace créé",
      maintenanceBy: "null", // On suppose qu'il n'y a pas de maintenance lors de la création
      month: new Date().toLocaleString('default', { month: 'long' }), // Ajoute le mois actuel
      doesBestMonth: false
    });

    newSpace.isMaintenance = false;
    newSpace.bestMonth = "null"; // On suppose qu'il n'y a pas de meilleur mois lors de la création
  
    // Assurez-vous que les logs vétérinaires et la liste des espèces animales sont initialisées vides
    newSpace.veterinaryLog = [];
    newSpace.animalSpecies = [];
  
    return await newSpace.save();
  }

  async updateSpace(nom: string, updatedSpace: ISpace): Promise<ISpace | null> {
    return await SpaceModel.findOneAndUpdate({ nom }, updatedSpace, { new: true });
  }

  async deleteSpace(nom: string): Promise<ISpace | null> {
    return await SpaceModel.findOneAndDelete({ nom });
  }

  async toggleMaintenanceStatus(nom: string, adminUserName: string): Promise<ISpace | null> {
    const space = await SpaceModel.findOne({ nom });
    const month = new Date().toLocaleString('default', { month: 'long' });
    if (space) {
      space.isMaintenance = !space.isMaintenance;
      space.maintenanceLog.push({
        commentary: space.isMaintenance ? "Espace mis en maintenance" : "Espace sorti de maintenance",
        maintenanceBy: adminUserName,
        month: month, // Ajoute le mois actuel
        doesBestMonth: space.bestMonth === month ? true : false
      });
      return await space.save();
    }
    return space;
  }
  

   async setBestMonthForSpace(nom: string, bestMonth: string): Promise<ISpace | null> {
    try {
      const updatedSpace = await SpaceModel.findOneAndUpdate(
        { nom },
        { $set: { 'bestMonth': bestMonth } },
        { new: true }
      );

      return updatedSpace;
    } catch (error) {
      throw new Error('Impossible de mettre à jour le meilleur mois pour réparer l\'espace.');
    }
  }

  async getBestMonthForSpace(nom: string): Promise<any | null> {
    try {

      const updatedSpace = await SpaceModel.findOneAndUpdate(
        { nom }
      );

      if (updatedSpace) {
        
        return { "bestMonth": updatedSpace.bestMonth }
        
      }
      return null;
    } catch (error) {
      throw new Error('Impossible de récupérer le meilleur mois pour réparer l\'espace.');
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

  
  async addTreatmentToVeterinaryLog(nom: string, treatment: IVeterinaryLog): Promise<ISpace | null> {
	const space = await SpaceModel.findOne({ nom });
	const currentDate = new Date();
	const day = currentDate.getDate();
	const month = currentDate.toLocaleString('default', { month: 'long' });
	const year = currentDate.getFullYear();
	
	if (space) {
	  const treatmentDateStr = `${month} ${day}, ${year}`;

	  space.veterinaryLog.push({
		treatmentDate: treatmentDateStr,
		treatmentBy: treatment.treatmentBy,
		condition: treatment.condition,
		treatmentDetails: treatment.treatmentDetails,
		species: treatment.species
	  });
	
	  return await space.save();
	}
	
	return space;
	
  }


}

export default new SpacesService();
