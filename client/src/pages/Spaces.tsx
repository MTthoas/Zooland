import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IMaintenanceLog {
    month: string;
    commentary: string;
    maintenanceBy: string;
    doesBestMonth: boolean;
}

interface IVeterinaryLog {
    treatmentDate: string;
    treatmentBy: string;
    condition: string;
    treatmentDetails: string;
    species: string;
}

interface Space {
    _id: string;
    nom: string;
    description: string;
    images: string[];
    type: string;
    capacite: number;
    horaires: {
        opening: string;
        closing: string;
    }[];
    accessibleHandicape: boolean;
    isMaintenance: boolean;
    bestMonth: string;
    maintenanceLog: IMaintenanceLog[];
    animalSpecies: string[];
    veterinaryLog: IVeterinaryLog[];
}

function Spaces() {
    const [spaces, setSpaces] = useState<Space[]>([]);

    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await axios.get('/spaces');
                setSpaces(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSpaces();
    }, []);

    return (
        <div>
            {spaces.map(space => (
                <div key={space._id}>
                    <h2>{space.nom}</h2>
                    <p>{space.description}</p>
                    <p>Type: {space.type}</p>
                    <p>Capacité: {space.capacite}</p>
                    <p>Accessible aux handicapés: {space.accessibleHandicape ? 'Oui' : 'Non'}</p>
                    <p>En maintenance: {space.isMaintenance ? 'Oui' : 'Non'}</p>
                    <p>Meilleur mois: {space.bestMonth}</p>
                    <p>Espèces animales: {space.animalSpecies.join(', ')}</p>
                    <p>Nombre de logs de maintenance: {space.maintenanceLog.length}</p>
                    <p>Nombre de logs vétérinaires: {space.veterinaryLog.length}</p>
                    <p>Horaires:</p>
                    {space.horaires.map((horaire, index) => (
                        <div key={index}>
                            <p>Ouverture: {horaire.opening}</p>
                            <p>Fermeture: {horaire.closing}</p>
                        </div>
                    ))}
                    <p>Images:</p>
                    {space.images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Image ${index + 1}`} />
                        </div>
                    ))}
                    <p>Logs de maintenance:</p>
                    {space.maintenanceLog.length > 0 ? (
                        space.maintenanceLog.map((log, index) => (
                            <div key={index}>
                                <p>Mois: {log.month}</p>
                                <p>Commentaire: {log.commentary}</p>
                                <p>Maintenance par: {log.maintenanceBy}</p>
                                <p>Meilleur mois: {log.doesBestMonth ? 'Oui' : 'Non'}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aucun log de maintenance disponible.</p>
                    )}
                    <p>Logs vétérinaires:</p>
                    {space.veterinaryLog.length > 0 ? (
                        space.veterinaryLog.map((log, index) => (
                            <div key={index}>
                                <p>Date du traitement: {log.treatmentDate}</p>
                                <p>Traitement par: {log.treatmentBy}</p>
                                <p>Condition de l'animal: {log.condition}</p>
                                <p>Détails du traitement: {log.treatmentDetails}</p>
                                <p>Espèce: {log.species}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aucun log vétérinaire disponible.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Spaces;
