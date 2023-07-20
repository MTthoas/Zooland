import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  List,
  Carousel,
  Timeline,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Upload,
} from "antd";
import type { UploadProps } from "antd";
import "./Space.css";

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
  imagePath: string;
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
    treatmentBy: "",
    condition: "",
    treatmentDetails: "",
    species: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [modal, contextHolder] = Modal.useModal();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [spacesForDelete, setSpacesForDelete] = useState<ISpace[]>([]);
  const [newImage, setNewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // get localStorage
    const tokenId = localStorage.getItem("token");

    // Verify if tokenId exists
    if (!tokenId) {
      console.log("No token found in localStorage");
      return;
    }

    setToken(tokenId);
    fetchSpaces(tokenId);
  }, []);

  const handleImageChange = (event: any) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleEdit = (space: ISpace) => {
    setEditingSpace(space);
    setIsCreating(false);
    setIsModalVisible(true);
  };

  const fetchSpaces = async (tokenId?: any) => {
    const tokenForFetch = tokenId ? tokenId : token;

    try {
      console.log("Fetching spaces");
      const response = await axios.get("/spaces", {
        headers: {
          Authorization: "Bearer " + tokenForFetch,
        },
        withCredentials: true,
      });

      console.log(response.data);
      setSpaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = () => {
    setEditingSpace({
      nom: "",
      description: "",
      images: [],
      type: "",
      capacite: 0,
      horaires: [],
      imagePath: "",
      accessibleHandicape: false,
      isMaintenance: false,
      bestMonth: "",
      maintenanceLog: [],
      animalSpecies: [],
      veterinaryLog: [],
    });
    setIsCreating(true);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (editingSpace) {
      // Create a new FormData object to send the form data
      const formData = new FormData();
      if (selectedImage) {
        console.log("selectedImage", selectedImage);
        formData.append("image", selectedImage);
      }
      // Append other form fields to the FormData

      formData.append("nom", editingSpace.nom);
      formData.append("description", editingSpace.description);
      formData.append("type", editingSpace.type); // assuming type exists on editingSpace object
      formData.append("capacite", editingSpace.capacite.toString()); // assuming capacite exists on editingSpace object
      formData.append(
        "accessibleHandicape",
        editingSpace.accessibleHandicape.toString()
      ); // assuming accessibleHandicape exists on editingSpace object

      // Append other form fields as needed

      if (isCreating) {
        try {
          const response = await axios.post("/spaces", formData, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data", // Set the content type for FormData
            },
            withCredentials: true,
          });
          console.log(response.data);
          message.success("Espace créé avec succès");
        } catch (error) {
          console.error(error);
          message.error("Erreur lors de la création de l'espace");
        }
      } else {
        try {
          const response = await axios.put(
            `/spaces/${editingSpace.nom}`,
            formData,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data", // Set the content type for FormData
              },
              withCredentials: true,
            }
          );
          console.log(response.data);
          message.success("Espace modifié avec succès");
        } catch (error) {
          console.error(error);
          message.error("Erreur lors de la modification de l'espace");
        }
      }
    }

    fetchSpaces();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingSpace) {
      setEditingSpace({
        ...editingSpace,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    if (editingSpace) {
      setEditingSpace({ ...editingSpace, [name]: value });
    }
  };

  const handleDelete = async (space: ISpace) => {
    if (space._id) {
      setSpacesForDelete([space]);
      setConfirmDelete(true);
    }
  };

  const handleConfirmDelete = async () => {
    const space = spacesForDelete[0];
    setConfirmDelete(false);
    console.log(space);
    if (space && space._id) {
      try {
        await axios.delete(`/spaces/${space.nom}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });
        setSpaces(spaces.filter((s) => s.nom !== space.nom));
        message.success("Espace supprimé avec succès");
      } catch (error) {
        console.error(error);
        message.error("Erreur lors de la suppression de l'espace");
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
        const response = await axios.post(
          `/spaces/${editingSpace.nom}/animals`,
          { species: newAnimal },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        message.success("Espèce d'animal ajoutée avec succès");
        setNewAnimal(""); // Réinitialiser la valeur du nouvel animal
        setIsAnimalModalVisible(false); // Fermer la fenêtre contextuelle
        fetchSpaces();
      } catch (error) {
        console.error(error);
        message.error("Erreur lors de l'ajout d'une espèce d'animal");
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
        const response = await axios.post(
          `/spaces/${editingSpace.nom}/treatments`,
          newTreatment
        );
        console.log(response.data);
        message.success("Traitement ajouté avec succès au journal vétérinaire");
        setNewTreatment({
          treatmentBy: "",
          condition: "",
          treatmentDetails: "",
          species: "",
        }); // Réinitialisez le formulaire
        setIsTreatmentModalVisible(false); // Fermez le modal
      } catch (error) {
        console.error(error);
        message.error(
          "Erreur lors de l'ajout d'un traitement au journal vétérinaire"
        );
      }
    }
  };

  const handleTreatmentCancel = () => {
    setIsTreatmentModalVisible(false);
  };

  return (
    <div className="h-screen pt-32 bg-base100 overflow-y-auto pb-32">
      {spaces.map((space) => {

          const baseUrl = "http://54.37.68.74:8080";
          let imageUrl;

          if (space.imagePath) {
              const imagePath = space.imagePath.replace("/var/www/Zooland/public", "");
              imageUrl = baseUrl + imagePath;
          } else {
              imageUrl = ""; // Fallback URL or keep it empty
          }

          console.log(imageUrl)

        return (
         <div className="mx-32 bg-white rounded-xl shadow-md overflow-hidden my-5">
  <div className="md:flex">
      <div className="flex-shrink-0 w-4/12 ">
        <img
          className="h-full w-64 object-cover"
          src={imageUrl}
          alt={space.nom}
        />
      </div>
      <div className="flex-grow p-8 pl-2 w-6/12">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          {space.type}
        </div>
        <a
          href="#"
          className="block mt-1 text-lg leading-tight font-medium text-black text-inline"
        >
          {" "}
          <span className="hover:underline"> {space.nom} </span>
          {space.isMaintenance ? (
            <span className="text-red-500 text-xs ml-2">
              {" "}
              (En maintenance){" "}
            </span>
          ) : (
            <span className="text-green-500 text-xs ml-2">
              {" "}
              (Disponible){" "}
            </span>
          )}{" "}
        </a>
        <p className="mt-2 text-gray-500">{space.description}</p>
        <p className="mt-2 text-gray-500 text-sm">
          Capacité d'accueil : {space.capacite}
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          Nombre d'espèces animales : {space.animalSpecies.length}
        </p>
        <p className="flex gap-x-3">
          {" "}
          {space.animalSpecies.map((specie) => (
            <p className="mt-2  text-indigo-500 text-sm"> {specie} </p>
          ))}{" "}
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          Accessible aux personnes à mobilité réduite :{" "}
          {space.accessibleHandicape ? "Oui" : "Non"}
        </p>
        {space.horaires.map((horaire) => (
          <p className="mt-2 text-gray-500">
            Horaires : {horaire.opening} - {horaire.closing}
          </p>
        ))}
      </div>
      <div className="p-8 flex flex-col items-start w-3/12 border-l gap-y-3">
        <div className="flex-col my-auto w-full">
          <button
            onClick={() => handleEdit(space)}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded w-full mb-1"
          >
            Modifier{" "}
          </button>
          <button
            onClick={() => handleDelete(space)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded w-full"
          >
            Supprimer
          </button>
        </div>
        <div>
          <button
            onClick={() => null}
            className="px-2 py-1 bg-gray-800 text-white rounded-lg mt-2 text-sm w-full"
          >
            Accéder aux logs{" "}
          </button>
          <button
            onClick={() => handleAddAnimalSpecies(space)}
            className="px-2 py-1 bg-gray-800 text-white rounded-lg mt-2 text-sm w-full"
          >
            Ajouter une espèce
          </button>
          <button
            onClick={() => handleAddTreatmentToVeterinaryLog(space)}
            className="px-2 py-1 bg-gray-800 text-white rounded-lg mt-2 text-sm w-full"
          >
            Ajouter un traitement
          </button>
        </div>
      </div>
    </div>
  </div>

        );
      })}
      <button
        onClick={() => handleCreate()}
        className="fixed right-5 bottom-5 w-12 h-12 mb-2 pb-1 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl main-content"
        title="Ajouter un espace"
      >
        +
      </button>

      <Modal
        title="Ajouter une nouvelle espèce d'animal"
        visible={isAnimalModalVisible}
        onCancel={handleAnimalCancel}
        footer={[
          <Button key="back" onClick={handleAnimalCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-gray-900 hover:bg-gray-800"
            onClick={handleAnimalOk}
          >
            Submit
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="Nom de l'animal">
            <Input
              value={newAnimal}
              onChange={(e) => setNewAnimal(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ajouter un nouveau traitement"
        visible={isTreatmentModalVisible}
        onOk={handleTreatmentOk}
        onCancel={handleTreatmentCancel}
      >
        <Form>
          <Form.Item label="Traitement par">
            <Input
              value={newTreatment.treatmentBy}
              onChange={(e) =>
                setNewTreatment({
                  ...newTreatment,
                  treatmentBy: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Condition">
            <Input
              value={newTreatment.condition}
              onChange={(e) =>
                setNewTreatment({ ...newTreatment, condition: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Détails du traitement">
            <Input
              value={newTreatment.treatmentDetails}
              onChange={(e) =>
                setNewTreatment({
                  ...newTreatment,
                  treatmentDetails: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Espèce">
            <Input
              value={newTreatment.species}
              onChange={(e) =>
                setNewTreatment({ ...newTreatment, species: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {editingSpace && (
        <Modal
          title={isCreating ? "Créer un nouvel espace" : "Modifier l'espace"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="bg-gray-900 hover:bg-gray-800"
              onClick={handleOk}
            >
              Submit
            </Button>,
          ]}
        >
          <Form>
            <Form.Item label="Nom">
              <Input
                name="nom"
                value={editingSpace.nom}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input
                name="description"
                value={editingSpace.description}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item label="Image">
              <input type="file" name="image" onChange={handleImageChange} />
            </Form.Item>

            <Form.Item label="Type">
              <Input
                name="type"
                value={editingSpace.type}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Capacité">
              <Input
                name="capacite"
                value={editingSpace.capacite}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Accessible aux handicapés">
              <Switch
                checked={editingSpace.accessibleHandicape}
                onChange={(value) =>
                  handleSwitchChange("accessibleHandicape", value)
                }
              />
            </Form.Item>
            <Form.Item label="En maintenance">
              <Switch
                checked={editingSpace.isMaintenance}
                onChange={(value) => handleSwitchChange("isMaintenance", value)}
              />
            </Form.Item>
            {/* ... (autres champs du formulaire) */}
          </Form>
        </Modal>
      )}

      {confirmDelete && (
        <Modal
          title="Supprimer un espace"
          visible={confirmDelete}
          onCancel={() => setConfirmDelete(false)}
          footer={[
            <Button key="back" onClick={() => setConfirmDelete(false)}>
              Return
            </Button>,
            <Button type="primary" danger onClick={() => handleConfirmDelete()}>
              Submit
            </Button>,
          ]}
        >
          <p>Êtes-vous sûr de vouloir supprimer cet espace ?</p>
        </Modal>
      )}
    </div>
  );
}

export default Spaces;
