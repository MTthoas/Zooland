import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Carousel, Timeline } from 'antd';
import './Space.css';

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
                console.log(response.data);
                setSpaces(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSpaces();
    }, []);

    return (
        <div className="spaces-grid">
            {spaces.map(space => (
                <Card key={space._id} title={space.nom}>
                    <Carousel autoplay>
                        {space.images.map((image, index) => (
                            <img key={index} src={image} alt={`Image ${index + 1}`} />
                        ))}
                    </Carousel>
                    <p>{space.description}</p>
                    <p>Type: {space.type}</p>
                    <p>Capacité: {space.capacite}</p>
                    <p>Accessible aux handicapés: {space.accessibleHandicape ? 'Oui' : 'Non'}</p>
                    <p>En maintenance: {space.isMaintenance ? 'Oui' : 'Non'}</p>
                    <p>Meilleur mois: {space.bestMonth}</p>
                    <p>Espèces animales:</p>
                    <List
                        size="small"
                        dataSource={space.animalSpecies}
                        renderItem={(item: string) => <List.Item>{item}</List.Item>}
                    />
                    <p>Nombre de logs de maintenance: {space.maintenanceLog.length}</p>
                    <p>Nombre de logs vétérinaires: {space.veterinaryLog.length}</p>
                    <p>Horaires:</p>
                    <Timeline>
                        {space.horaires.map((horaire, index) => (
                            <Timeline.Item key={index}>
                                Ouverture: {horaire.opening}, Fermeture: {horaire.closing}
                            </Timeline.Item>
                        ))}
                    </Timeline>
                    {/* ... (autres informations) */}
                </Card>
            ))}
        </div>
    );
}

export default Spaces;
