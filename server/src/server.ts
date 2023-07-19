import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SpacesController from './controllers/spaces.controller';
import AuthController from './controllers/auth.controller';
import ZooController from './controllers/zoo.controller';
import AuthService from './services/auth.service';
import { Schema, model } from 'mongoose';
import ZooModel, { IZoo } from './models/zoo.model';
import { ISpace } from './models/spaces.model';
import StatisticsController from './controllers/stats.controller';
import cors from 'cors';

require('dotenv').config();

const app = express();
const port = 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/auth/login', AuthController.authenticate);
app.post('/auth/register', AuthController.signup);

// Accès dédié à tous

app.get('/spaces', ZooController.ensureZooOpen,  AuthController.ensureAuthenticated, SpacesController.getAllSpaces);
app.get('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, SpacesController.getSpaceByName);

// Accès dédié aux visiteurs

app.post('/spaces/:spaceId/visit', AuthController.ensureRole(['visitor']), SpacesController.recordVisit);
app.patch('/tickets/:userId/buy', AuthController.ensureRole(['visitor']), SpacesController.buyTicket);
app.get('/checkTicket/:ticketId/:spaceName', AuthController.ensureRole(['visitor']), SpacesController.checkTicket);
app.post('/checkout/:ticketId/:spaceName', AuthController.ensureRole(['visitor']), SpacesController.checkOut);


// Accès dédié aux employés

app.patch('/zoo/open',  AuthController.ensureRole(['admin', 'receptionist']), ZooController.openZoo);
app.patch('/zoo/close', AuthController.ensureRole(['admin', 'receptionist']), ZooController.closeZoo);

app.get('/users/:userId', AuthController.ensureRole(['receptionist', 'admin']), AuthController.getUserById);
// app.get('/users', AuthController.ensureRole(['receptionist, admin']), AuthController.getAllUsers);

app.get('/tickets', AuthController.ensureRole(['salesperson', 'receptionist', 'admin']), SpacesController.getAllTickets);
app.get('/tickets/:spaceName', AuthController.ensureRole(['salesperson', 'receptionist', 'admin']), SpacesController.getTicketsFromSpace);
app.delete('/tickets/:ticketId', AuthController.ensureRole(['receptionist', 'admin']), SpacesController.deleteTicket)
app.delete('/tickets/:userId/deleteAll', AuthController.ensureRole(['receptionist', 'admin']), SpacesController.deleteAllTicketdFromUserId)

// Accès dédié aux admins

app.delete('/users/:userId', AuthController.ensureRole(['admin']), AuthController.deleteUser);
app.patch('/users/:userId/role', AuthController.ensureRole(['admin']), AuthController.setUserRole);

app.post('/spaces', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.addSpace);
app.delete('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.deleteSpace);
app.put('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.updateSpace);

app.patch('/spaces/:nom/maintenance', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.toggleMaintenanceStatus);
app.get('/spaces/:nom/bestMonth', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.getBestMonthForSpace);
app.patch('/spaces/:nom/bestMonth', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.setBestMonthForSpace);

app.get('/stats/live', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), StatisticsController.getLiveStats);
app.get('/stats/daily', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), StatisticsController.getDailyStatistics);
app.get('/stats/weekly', AuthController.ensureRole(['admin']), StatisticsController.getWeeklyStatistics);


// Accès dédié aux vétérinaires

app.post('/spaces/:nom/animals', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary']), SpacesController.addAnimalSpecies);
app.get('/spaces/:nom/animals', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary']), SpacesController.getAnimalsInSpace);
app.post('/spaces/:nom/treatments', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary']), SpacesController.addTreatmentToVeterinaryLog);

// Route de dev

app.post('/users/add-all', AuthController.addAllUsers);
app.get('/users', AuthController.getAllUsers);

app.get('/', (req, res) => {
  res.send('Hello !');
});

mongoose
   .connect(process.env.MONGODB_URI as string, {
    authSource: 'admin',
   })
   .then(() => {
   console.log('Successfully connected to MongoDB.');
    
    // Initialisation du zoo
   ZooModel.findOne({ nom: 'LaFaille' }) 
      .then((zoo) => {
        if (!zoo) {
          const newZoo = new ZooModel({
            nom: 'LaFaille', // Nom de votre zoo
            adresse: '20 rue de la bagarre', // Adresse de votre zoo
            isOpen: false,
            espaces: [],
            employees: []
          });
          newZoo.save().then(() => {
            console.log('Zoo créé avec succès.');
          });
        }
      });
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB.');
    console.error(error);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
}
);
