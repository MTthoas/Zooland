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

  async toggleMaintenanceStatus(nom: string): Promise<ISpace | null> {
    const space = await SpaceModel.findOne({ nom });
    if (space) {
      space.isMaintenance = !space.isMaintenance;
      return await space.save();
    }
    return null;
  }
}

export default new SpacesService();
