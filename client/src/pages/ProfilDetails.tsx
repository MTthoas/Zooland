import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface IUser {
  username: string;
  _id: string;
  role: string;
  tickets: string[];
  currentSpace: string | null;
}

function ProfilDetails() {
  const { name } = useParams<{ name: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [name, token]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRole(event.target.value);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`/users/${user?._id}`, {
        username: newUsername,
        role: newRole,
      });
      // Mettre à jour localement les nouvelles valeurs de l'utilisateur
      setUser((prevUser) =>
        prevUser ? { ...prevUser, username: newUsername, role: newRole } : null
      );
      // Réinitialiser les valeurs des champs de saisie
      setNewUsername('');
      setNewRole('');
      console.log('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div className="pt-44">Chargement...</div>;
  }

  return (
    <div className="pt-44 text-center">
      <h1 className="text-2xl font-bold mb-4">Votre profil {user.username}</h1>
      <p className="mb-2">
        <span className="font-bold">ID:</span> {user._id}
      </p>
      <p className="mb-2">
        <span className="font-bold">Rôle:</span> {user.role}
      </p>
      <p className="mb-2">
        <span className="font-bold">Tickets:</span> {user.tickets.length}
      </p>
      <p>
        <span className="font-bold">Espace actuel:</span>{' '}
        {user.currentSpace ? user.currentSpace : 'Aucun'}
      </p>

      <h2 className="text-lg font-bold mt-8">Modifier l'utilisateur</h2>
      <div className="flex items-center justify-center mt-4">
        <input
          type="text"
          placeholder="Nouveau nom d'utilisateur"
          value={newUsername}
          onChange={handleUsernameChange}
          className="px-2 py-1 mr-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Nouveau rôle"
          value={newRole}
          onChange={handleRoleChange}
          className="px-2 py-1 mr-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleUpdateUser}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
}

export default ProfilDetails;
