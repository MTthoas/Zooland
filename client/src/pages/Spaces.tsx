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

        // get localStorage

        const tokenId = localStorage.getItem('token');

        let config = {
            headers: {
              'Authorization': 'Bearer ' + tokenId
            }
          }
          
        const fetchSpaces = async () => {
            try {
                const response = await axios.get('/spaces', config);
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
        <div className="h-screen pt-24 bg-base100">

            
           
        </div>
    );
}

export default Spaces;
