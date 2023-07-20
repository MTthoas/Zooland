import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react';

import axios from 'axios';

interface IUser {
  username: string;
  _id: string;
  role: string;
  tickets: string[];
  currentSpace: string | null;
}

function ProfilDetails() {
  const { username } = useParams();
  const [user, setUser] = useState<IUser | null>(null); // Ajoutez le type IUser | null
  console.log("username");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${username}`);
        console.log(response);
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  },);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profil de {user.username}</h1>
      <p>ID: {user._id}</p>
      <p>Rôle: {user.role}</p>
      <p>Tickets: {user.tickets.length}</p>
      <p>Espace actuel: {user.currentSpace ? user.currentSpace : 'Aucun'}</p>
    </div>
  );
}

export default ProfilDetails;
