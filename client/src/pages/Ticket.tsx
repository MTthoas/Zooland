import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Input, Modal, message, Select, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ITicket {
  _id: string;
  _idOfUser: string;
  dateOfPurchase: Date;
  validUntil: Date;
  spaces: string[];
  type: 'journee' | 'weekend' | 'annuel' | '1daymonth' | 'escapegame';
  escapeGameOrder?: string[];
}

const Tickets = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [userId, setUserId] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ticketType, setTicketType] = useState<'journee' | 'weekend' | 'annuel' | '1daymonth' | 'escapegame'>('journee');
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [spaces, setSpaces] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [userRole, setUserRole] = useState('');

  const tokenId = localStorage.getItem('token');
  const userName = localStorage.getItem('username');
  const navigate = useNavigate();


  // Configurer les en-têtes de la requête
  let config = {
    headers: {
      'Authorization': 'Bearer ' + tokenId
    }
  }

  const fetchTickets = async () => {
    // Récupérer le token du localStorage
  
    try {
      const response = await axios.get('/tickets', config);
      setTickets(response.data);
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la récupération des billets');
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
  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`/tickets/${selectedSpace}`, config);
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getRole = async (userName: string) => {
      try {
        const response = await axios.get(`/users/${userName}`, config); 
        setUserRole(response.data.role);
      } catch (error) {
        setUserRole('visitor');
      }
    };

    if (userName) {
      getRole(userName);
    }
    if(userRole !== 'visitor') {
      fetchSpaces();
      fetchTickets();
    }else{
      navigate('/ticketuser');
    }

  }, []);

  const columns = [
    {
      title: 'ID du billet',
      dataIndex: '_idOfUser',
      key: '_idOfUser',
    },
    {
      title: 'Date d\'achat',
      dataIndex: 'dateOfPurchase',
      key: 'dateOfPurchase',
    },
    {
      title: 'Date d\'expiration',
      dataIndex: 'validUntil',
      key: 'validUntil',
    },
    {
      title: 'Espaces',
      dataIndex: 'spaces',
      key: 'spaces',
      render: (spaces: string[]) => spaces.join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: ITicket) => (
        <Button type="primary" danger onClick={() => handleDelete(record._idOfUser)}>
          Supprimer
        </Button>
      ),
    },
  ];

  const handleBuyTicket = async () => {
    try {
      if (userId && selectedSpaces.length > 0) {
        const response = await axios.patch(`/tickets/${userId}/buy`, {
          spaces: selectedSpaces,
          type: ticketType,
        });
        message.success('Billet acheté avec succès');
        setIsModalVisible(false);
        fetchTickets();
      } else {
        message.error('Veuillez renseigner l\'ID de l\'utilisateur et sélectionner au moins un espace');
      }
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de l\'achat du billet');
    }
  };

  const handleCheckTicket = async (ticketId: string, spaceName: string) => {
    try {
      await axios.get(`/checkTicket/${ticketId}/${spaceName}`);
      message.success('Billet vérifié avec succès');
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la vérification du billet');
    }
  };

  const handleDelete = async (ticketId: string) => {
    try {
      await axios.delete(`/tickets/${ticketId}`, config);
      message.success('Ticket supprimé avec succès');
      fetchTickets();  // Recharger les tickets après la suppression
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la suppression du ticket');
    }
  };
  
  return (
    userRole !== 'visitor' ? (
      <div className="flex flex-col pt-24">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <Typography.Title level={1} className="users-heading" style={{ color: 'black' }}>Liste des tickets</Typography.Title>
          <div className="shadow overflow-hidden sm:rounded-lg mb-4">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a space"
              optionFilterProp="children"
              onChange={(value: string) => setSelectedSpace(value)}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }            
            >
              {spaces.map((space, index) => (
                <Select.Option key={index} value={space}>{space}</Select.Option>
              ))}
            </Select>
            <Button type="primary" style={{ backgroundColor: '#1A9EFF' }} onClick={handleSearch} className="my-blue-button">Search</Button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID de l'utilisateur
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
                  Ordre de l'Escape Game
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
                    {/* <p className="empty-tickets">Aucun ticket trouvé.</p> */}
                    {userRole}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-left text-gray-500">{ticket._idOfUser}</div>
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
                      <div className="text-sm text-left text-gray-500">{ticket.escapeGameOrder?.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <Button type="primary" danger onClick={() => handleDelete(ticket._id)}>
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>) : (
    navigate('/ticketuser'), null
  )
  );
};


export default Tickets;


