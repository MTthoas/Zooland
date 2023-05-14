import { ISpace } from './spaces.model';
import SpaceModel from './spaces.model';

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
    return await newSpace.save();
  }

  async updateSpace(nom: string, updatedSpace: ISpace): Promise<ISpace | null> {
    return await SpaceModel.findOneAndUpdate({ nom }, updatedSpace, { new: true });
  }

  async deleteSpace(nom: string): Promise<ISpace | null> {
    return await SpaceModel.findOneAndDelete({ nom });
  }

  async toggleMaintenanceStatus(nom: string, isAdmin: boolean): Promise<boolean> {
    if (!isAdmin) {
      return false; // user is not an admin
    }
    const space = await this.getSpaceByName(nom);
    if (!space) {
      return false; // space not found
    }
    space.isMaintenance = !space.isMaintenance;
    await space.save();
    return true;
  }

}

export default new SpacesService();
