import { Router } from 'express'
import * as fs from 'fs';
import * as path from 'path';

import { Space } from './spaces.class';


class SpacesService {
  private spaces: Space[] = [];
  private dataFilePath: string = path.resolve(__dirname, 'spaces.json');


  constructor() {
    this.loadSpacesFromDataFile();
  }

  private loadSpacesFromDataFile(): void {
    try {
      const data = fs.readFileSync(this.dataFilePath, 'utf8');
      const spaces = JSON.parse(data);
      this.spaces = spaces.map((space: any) => new Space(
        space.nom,
        space.description,
        space.images,
        space.type,
        space.capacite,
        space.duree,
        space.horaires,
        space.accessibleHandicape,
      ));
    } catch (err) {
      console.error(`Erreur lors de la lecture du fichier ${this.dataFilePath}: ${err}`);
    }
  }

  private saveSpacesToDataFile(): void {
    try {
      const spacesData = JSON.stringify(this.spaces, null, 2);
      fs.writeFileSync(this.dataFilePath, spacesData, 'utf8');
    } catch (err) {
      console.error(`Erreur lors de l'écriture dans le fichier ${this.dataFilePath}: ${err}`);
    }
  }

  getSpaces(): Space[] {
    return this.spaces;
  }

  getSpaceByName(nom: string): Space | undefined {
    return this.spaces.find(space => space.nom === nom);
  }

  addSpace(space: Space): void {
    this.spaces.push(space);
    this.saveSpacesToDataFile();
  }

  updateSpace(nom: string, updatedSpace: Space): void {
    const index = this.spaces.findIndex(space => space.nom === nom);
    if (index !== -1) {
      this.spaces[index] = updatedSpace;
      this.saveSpacesToDataFile();
    }
  }

  deleteSpace(nom: string): void {
    const index = this.spaces.findIndex(space => space.nom === nom);
    if (index !== -1) {
      this.spaces.splice(index, 1);
      this.saveSpacesToDataFile();
    }
  }

}

export default new SpacesService();