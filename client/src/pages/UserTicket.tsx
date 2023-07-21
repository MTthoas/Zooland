import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Modal, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ITicketUser {
  _id: string;
  _idOfUser: string;
  dateOfPurchase: Date;
  validUntil: Date;
  spaces: string[];
  type: 'journee' | 'weekend' | 'annuel' | '1daymonth' | 'escapegame';
  escapeGameOrder?: string[];
}

const UserTickets = () => {
  const [tickets, setTickets] = useState<ITicketUser[]>([]);
  const [spaces, setSpaces] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'journee' | 'weekend' | 'annuel' | '1daymonth' | 'escapegame'>('journee');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const tokenId = localStorage.getItem('token');
  const userName = localStorage.getItem('username');
  const [userId, setUserId] = useState('');

  // Configurer les en-têtes de la requête
  let config = {
    headers: {
      'Authorization': 'Bearer ' + tokenId
    }
  }

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`/usersinfo/${userName}`, config);
      setUserId(response.data._id);
    } catch (error) {
        console.error(error);
    }
};

const fetchUserTickets = async () => {
  try {
    const response = await axios.get(`/user/${userId}/tickets`, config);
    setTickets(response.data);
    const initialCheckInStatus = response.data.reduce((acc: Record<string, boolean>, ticket: ITicketUser) => ({ ...acc, [ticket._id]: false }), {});
    setCheckInStatus(initialCheckInStatus);
  } catch (error) {
    console.error(error);
  }
};



  const fetchSpaces = async () => {
    try {
      const response = await axios.get('/spaces', config);
      setSpaces(response.data.map((space: any) => space.nom));
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyTicket = async () => {
    try {
      if (userId && selectedSpace.length > 0) {
        const response = await axios.patch(`/tickets/${userId}/buy`, {
          spaces: Array.isArray(selectedSpace) ? selectedSpace : [selectedSpace],
          type: selectedType,
        }, config);
        setIsModalVisible(false);
        fetchUserTickets();
      } else {
        console.log('Veuillez renseigner l\'ID de l\'utilisateur et sélectionner au moins un espace');
      }
    } catch (error) {
      console.error(error);
      console.log('Erreur lors de l\'achat du billet');
    }
  };

  const handleCheckIn = async (ticketId: string, spaceName: string) => {
    try {
      const response = await axios.get(`/checkTicket/${ticketId}/${spaceName}`, config);
      console.log(response.data);
      // Mettre à jour l'état isCheckIn en fonction de la réponse de l'API
      setIsCheckIn(response.data.checkIn);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleCheckInOut = async (ticketId: string, spaceName: string) => {
    try {
      if (checkInStatus[ticketId]) {
        // CheckOut
        console.log("config : ", config)
        const response = await axios.post(`/checkout/${ticketId}/${spaceName}`, {}, config);
        console.log(response.data);
        setCheckInStatus(prevState => ({ ...prevState, [ticketId]: false }));
      } else {
        // CheckIn
        const response = await axios.get(`/checkTicket/${ticketId}/${spaceName}`, config);
        console.log(response.data);
        setCheckInStatus(prevState => ({ ...prevState, [ticketId]: true }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  


  useEffect(() => {
    fetchUserInfo();
    fetchSpaces();
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchUserTickets();
    }
  }, [userId]);

  return (
    <div className="flex flex-col pt-24">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <Typography.Title level={1} className="users-heading" style={{ color: 'white' }}>Mes tickets</Typography.Title>
          <div className="flex flex-row justify-between mb-4">
          <Button type="primary" danger onClick={() => setIsModalVisible(true)}>Acheter un ticket</Button>
          </div>
          <Modal title="Acheter un ticket" visible={isModalVisible} onOk={handleBuyTicket} onCancel={() => setIsModalVisible(false)}>
            <Select value={selectedSpace} onChange={setSelectedSpace} style={{ width: 120 }}>
              {spaces.map((space, index) => (
                <Select.Option key={index} value={space}>{space}</Select.Option>
              ))}
            </Select>
            <Select value={selectedType} onChange={setSelectedType} style={{ width: 120 }}>
              <Select.Option value="journee">Journée</Select.Option>
              <Select.Option value="weekend">Weekend</Select.Option>
              <Select.Option value="annuel">Annuel</Select.Option>
              <Select.Option value="1daymonth">1 jour par mois</Select.Option>
              <Select.Option value="escapegame">Escape Game</Select.Option>
            </Select>
          </Modal>
          <div className="shadow overflow-hidden sm:rounded-lg mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID du billet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'achat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'expiration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Espaces
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">
                      Aucun ticket trouvé.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-500">{ticket._id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-500">{new Date(ticket.dateOfPurchase).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-500">{new Date(ticket.validUntil).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-500">{ticket.spaces.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-left text-gray-500">{ticket.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button onClick={() => handleCheckInOut(ticket._id, ticket.spaces[0])}>
                          {checkInStatus[ticket._id] ? 'CheckOut' : 'CheckIn'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTickets;


