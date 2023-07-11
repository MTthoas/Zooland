import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, Modal, message } from 'antd';

interface ITicket {
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

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error(error);
      message.error('Erreur lors de la récupération des billets');
    }
  };

  useEffect(() => {
    fetchTickets();
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
    // Ajoutez d'autres colonnes selon vos besoins
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

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Acheter un billet
      </Button>
      <Table
        dataSource={tickets}
        columns={columns}
        rowKey="_idOfUser"
        onRow={(record) => ({
          onClick: () => handleCheckTicket(record._idOfUser, record.spaces[0]),
        })}
      />
      <Modal
        title="Acheter un billet"
        visible={isModalVisible}
        onOk={handleBuyTicket}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="ID de l'utilisateur"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Input
          placeholder="Sélectionnez les espaces (séparés par des virgules)"
          value={selectedSpaces.join(', ')}
          onChange={(e) => setSelectedSpaces(e.target.value.split(',').map(space => space.trim()))}
        />
        <div>
          <span>Type de billet : </span>
          <select value={ticketType} onChange={(e) => setTicketType(e.target.value as any)}>
            <option value="journee">Journée</option>
            <option value="weekend">Weekend</option>
            <option value="annuel">Annuel</option>
            <option value="1daymonth">1 jour par mois</option>
            <option value="escapegame">Escape Game</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default Tickets;
