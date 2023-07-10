import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Carousel, Timeline, Button, Modal, Form, Input, Switch } from 'antd';
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

interface ISpace {
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
    const [spaces, setSpaces] = useState<ISpace[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
    const [editingSpace, setEditingSpace] = useState<ISpace | null>(null);



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

    const handleEdit = (space: ISpace) => {
        setEditingSpace(space);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        if (editingSpace) {
            try {
                const response = await axios.put(`/spaces/${editingSpace.nom}`, editingSpace);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editingSpace) {
            setEditingSpace({ ...editingSpace, [event.target.name]: event.target.value });
        }
    };

    const handleSwitchChange = (name: string, value: boolean) => {
        if (editingSpace) {
            setEditingSpace({ ...editingSpace, [name]: value });
        }
    };

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
                    <Button onClick={() => handleEdit(space)}>Modifier</Button>
                </Card>
            ))}
            {editingSpace && (
                <Modal title="Modifier l'espace" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form>
                        <Form.Item label="Nom">
                            <Input name="nom" value={editingSpace.nom} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input name="description" value={editingSpace.description} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Type">
                            <Input name="type" value={editingSpace.type} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Capacité">
                            <Input name="capacite" value={editingSpace.capacite} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item label="Accessible aux handicapés">
                            <Switch checked={editingSpace.accessibleHandicape} onChange={(value) => handleSwitchChange('accessibleHandicape', value)} />
                        </Form.Item>
                        <Form.Item label="En maintenance">
                            <Switch checked={editingSpace.isMaintenance} onChange={(value) => handleSwitchChange('isMaintenance', value)} />
                        </Form.Item>
                        {/* ... (autres champs du formulaire) */}
                    </Form>
                </Modal>
            )}
        </div>
    );
}

export default Spaces;
