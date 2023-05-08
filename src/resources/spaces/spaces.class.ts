export class Space {
    nom: string;
    description: string;
    images: string[];
    type: string;
    capacite: number;
    duree: number;
    horaires: string[];
    accessibleHandicape: boolean;
  
    constructor(nom: string, description: string, images: string[], type: string, capacite: number, duree: number, horaires: string[], accessibleHandicape: boolean) {
      this.nom = nom;
      this.description = description;
      this.images = images;
      this.type = type;
      this.capacite = capacite;
      this.duree = duree;
      this.horaires = horaires;
      this.accessibleHandicape = accessibleHandicape;
    }
  }