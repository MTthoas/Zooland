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

  if (!user) {
    return <div className="pt-44">Loading...</div>;
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
    </div>
  );
}

export default ProfilDetails;
