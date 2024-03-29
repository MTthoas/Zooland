import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Management.css';

function Management() {
  const [zooStatus, setZooStatus] = useState<boolean>(false);
  const token = localStorage.getItem('token');

  const toggleZooStatus = async () => {
    try {
      const response = await axios.patch(`/zoo/${zooStatus ? 'close' : 'open'}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setZooStatus(!zooStatus);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchZooStatus = async () => {
      try {
        const response = await axios.get('/zoo/status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data && typeof response.data.isOpen === 'boolean') {
          setZooStatus(response.data.isOpen);
        } else {
          console.error('Unexpected server response', response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchZooStatus();
  }, [token]);
  

  return (
    <div className="pt-24 text-center">
      <h1>Page de Gestion</h1>
      <button
        className="toggle-zoo-button"
        onClick={toggleZooStatus}
        style={{
          backgroundColor: zooStatus ? 'red' : 'green',
          color: 'white',
        }}
      >
        {zooStatus ? 'Fermer le Zoo' : 'Ouvrir le Zoo'}
      </button>
    </div>
  );
}

export default Management;
