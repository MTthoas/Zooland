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
    
        // Verify if tokenId exists
        if (!tokenId) {
            console.log("No token found in localStorage");
            return;
        }
    
        const fetchSpaces = async () => {
            try {
                console.log("Fetching spaces")
                const response = await axios.get('/spaces', {
                    headers: { 
                        'Authorization': 'Bearer ' + tokenId 
                    },
                    withCredentials: true
                })
                
                console.log(response.data);
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
        <div className="h-screen pt-24">
            <div className="flex flex-wrap justify-center">
                {spaces.map((space, index) => (
                    <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="bg-cover bg-center h-56 p-4" style={{ backgroundImage: `url(${space.images[0]})` }}>
                                <div className="flex justify-between">
                                    <span className="text-white text-lg">{space.nom}</span>
                                    <button onClick={() => handleEdit(space)} className="text-white bg-blue-500 hover:bg-blue-700 text-xs font-bold py-1 px-2 rounded">
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="uppercase tracking-wide text-sm font-bold text-gray-700">{space.type}</p>
                                <p className="text-gray-900 text-lg font-semibold mb-2">{space.description}</p>
                                <p className="text-gray-700"><i className="fas fa-users"></i> {space.capacite}</p>
                                <p className="text-gray-700"><i className="fas fa-wheelchair"></i> {space.accessibleHandicape ? 'Accessible' : 'Not Accessible'}</p>
                            </div>
                            <div className="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
                                <div className="text-xs uppercase font-bold text-gray-600 tracking-wide">Maintenance</div>
                                <div className="flex items-center pt-2">
                                    <div className="bg-green-200 text-green-800 text-xs px-2 py-1 font-semibold rounded uppercase">{space.isMaintenance ? 'Ongoing' : 'None'}</div>
                                    <div className="text-sm text-gray-600 ml-2">{space.bestMonth}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleCreate} className="fixed right-0 bottom-0 m-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Add
            </button>
        </div>
    );
}

export default Spaces;
