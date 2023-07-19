import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Management.css';

function Management() {
  const [zooStatus, setZooStatus] = useState<boolean>(false);

  const toggleZooStatus = async () => {
    try {
      const response = await axios.patch(`/zoo/${zooStatus ? 'close' : 'open'}`);
      setZooStatus(!zooStatus);
      alert(response.data.message);
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
  }, []);

  return (
    <div className="management">
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
