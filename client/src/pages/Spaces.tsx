import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, List, Carousel, Timeline, Button, Modal, Form, Input, Switch, message } from 'antd';
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
    _id?: string;
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
    const [editingSpace, setEditingSpace] = useState<ISpace | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isAnimalModalVisible, setIsAnimalModalVisible] = useState(false);
    const [newAnimal, setNewAnimal] = useState("");
    const [isTreatmentModalVisible, setIsTreatmentModalVisible] = useState(false);
    const [newTreatment, setNewTreatment] = useState({
        treatmentBy: '',
        condition: '',
        treatmentDetails: '',
        species: ''
      });
      

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
        setIsCreating(false);
        setIsModalVisible(true);
    };

    const handleCreate = () => {
        setEditingSpace({
            nom: '',
            description: '',
            images: [],
            type: '',
            capacite: 0,
            horaires: [],
            accessibleHandicape: false,
            isMaintenance: false,
            bestMonth: '',
            maintenanceLog: [],
            animalSpecies: [],
            veterinaryLog: [],
        });
        setIsCreating(true);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        if (editingSpace) {
            if (isCreating) {
                try {
                    const response = await axios.post('/spaces', editingSpace);
                    console.log(response.data);
                    message.success('Espace créé avec succès');
                } catch (error) {
                    console.error(error);
                    message.error('Erreur lors de la création de l\'espace');
                }
            } else {
                try {
                    const response = await axios.put(`/spaces/${editingSpace.nom}`, editingSpace);
                    console.log(response.data);
                    message.success('Espace modifié avec succès');
                } catch (error) {
                    console.error(error);
                    message.error('Erreur lors de la modification de l\'espace');
                }
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

    const handleDelete = async (space: ISpace) => {
        if (space._id) {
            try {
                await axios.delete(`/users/${space._id}`);
                setSpaces(spaces.filter(s => s._id !== space._id));
                message.success('Espace supprimé avec succès');
            } catch (error) {
                console.error(error);
                message.error('Erreur lors de la suppression de l\'espace');
            }
        }
    };

    const handleAddAnimalSpecies = (space: ISpace) => {
        setEditingSpace(space);
        setIsAnimalModalVisible(true);
    };

    const handleAnimalOk = async () => {
        if (editingSpace && editingSpace.nom && newAnimal) {
            try {
                const response = await axios.post(`/spaces/${editingSpace.nom}/animals`, { name: newAnimal });
                console.log(response.data);
                message.success('Espèce d\'animal ajoutée avec succès');
                setNewAnimal("");  // Réinitialiser la valeur du nouvel animal
                setIsAnimalModalVisible(false);  // Fermer la fenêtre contextuelle
            } catch (error) {
                console.error(error);
                message.error('Erreur lors de l\'ajout d\'une espèce d\'animal');
            }
        }
    };
    
    const handleAnimalCancel = () => {
        setIsAnimalModalVisible(false);
    };    

    const handleAddTreatmentToVeterinaryLog = (space: ISpace) => {
        setEditingSpace(space);
        setIsTreatmentModalVisible(true);
    };

    const handleTreatmentOk = async () => {
        if (editingSpace && editingSpace.nom && newTreatment) {
          try {
            const response = await axios.post(`/spaces/${editingSpace.nom}/treatments`, newTreatment);
            console.log(response.data);
            message.success('Traitement ajouté avec succès au journal vétérinaire');
            setNewTreatment({
              treatmentBy: '',
              condition: '',
              treatmentDetails: '',
              species: ''
            });  // Réinitialisez le formulaire
            setIsTreatmentModalVisible(false);  // Fermez le modal
          } catch (error) {
            console.error(error);
            message.error('Erreur lors de l\'ajout d\'un traitement au journal vétérinaire');
          }
        }
      };
      
      const handleTreatmentCancel = () => {
        setIsTreatmentModalVisible(false);
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
                    <Button onClick={() => handleAddAnimalSpecies(space)} style={{ backgroundColor: 'grey', color: 'black' }} type="primary">Ajouter une espèce d'animal</Button>
                    <Modal title="Ajouter une nouvelle espèce d'animal" visible={isAnimalModalVisible} onOk={handleAnimalOk} onCancel={handleAnimalCancel}>
                        <Form>
                            <Form.Item label="Nom de l'animal">
                                <Input value={newAnimal} onChange={e => setNewAnimal(e.target.value)} />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <p>Nombre de logs de maintenance: {space.maintenanceLog.length}</p>
                    <p>Nombre de logs vétérinaires: {space.veterinaryLog.length}</p>
                    <Button onClick={() => handleAddTreatmentToVeterinaryLog(space)} style={{ backgroundColor: 'grey', color: 'black' }} type="primary">Ajouter un traitement au journal</Button>
                    <Modal title="Ajouter un nouveau traitement" visible={isTreatmentModalVisible} onOk={handleTreatmentOk} onCancel={handleTreatmentCancel}>
                      <Form>
                        <Form.Item label="Traitement par">
                          <Input value={newTreatment.treatmentBy} onChange={e => setNewTreatment({ ...newTreatment, treatmentBy: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Condition">
                          <Input value={newTreatment.condition} onChange={e => setNewTreatment({ ...newTreatment, condition: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Détails du traitement">
                          <Input value={newTreatment.treatmentDetails} onChange={e => setNewTreatment({ ...newTreatment, treatmentDetails: e.target.value })} />
                        </Form.Item>
                        <Form.Item label="Espèce">
                          <Input value={newTreatment.species} onChange={e => setNewTreatment({ ...newTreatment, species: e.target.value })} />
                        </Form.Item>
                      </Form>
                    </Modal>
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
                    <Button onClick={() => handleDelete(space)} type="primary" danger>Supprimer</Button>
                </Card>
            ))}
            <Button type="primary" onClick={handleCreate} style={{ backgroundColor: 'white', color: 'black' }}>Créer un nouvel espace</Button>
            {editingSpace && (
                <Modal title={isCreating ? "Créer un nouvel espace" : "Modifier l'espace"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
