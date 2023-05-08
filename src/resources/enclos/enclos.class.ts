import { Space } from '../spaces/spaces.class';

export class Enclos extends Space {
    animals : string[];

    constructor(nom: string, description: string, images: string[], type: string, capacite: number, duree: number, horaires: string[], accessibleHandicape: boolean, animals: string[]) {
        super(nom, description, images, type, capacite, duree, horaires, accessibleHandicape);
        this.animals = animals;
    }
}

