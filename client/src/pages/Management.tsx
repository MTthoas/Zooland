import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Management.css';

function Management() {
  const [zooStatus, setZooStatus] = useState<boolean>(false);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const toggleZooStatus = async () => {
    try {
      const response = await axios.patch(`/zoo/${zooStatus ? 'close' : 'open'}`);
      setZooStatus(!zooStatus);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      alert(response.data.message);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSpace = async (spaceName: string) => {
    try {
      const response = await axios.delete(`/spaces/${spaceName}`);
      alert(response.data.message);
      fetchSpaces();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSpaces = async () => {
    try {
      const response = await axios.get('/spaces');
      setSpaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchZooStatus = async () => {
      try {
        const response = await axios.get('/zoo');
        setZooStatus(response.data.isOpen);
      } catch (error) {
        console.error(error);
      }
    };
    fetchZooStatus();
    fetchUsers();
    fetchSpaces();
  }, []);

  return (
    <div className="management">
      <h1>Management Page</h1>
      <button className="toggle-zoo-button" onClick={toggleZooStatus}>
        {zooStatus ? 'Close Zoo' : 'Open Zoo'}
      </button>
      <h2>Spaces</h2>
      {spaces.map((space) => (
        <div className="space" key={space.nom}>
          {space.nom}
          <button onClick={() => deleteSpace(space.nom)}>Delete</button>
        </div>
      ))}
      <h2>Users</h2>
      {users.map((user) => (
        <div className="user" key={user._id}>
          {user.username}
          <button onClick={() => deleteUser(user._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Management;
