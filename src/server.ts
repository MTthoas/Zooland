import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SpacesController from './controllers/spaces.controller';
import AuthController from './controllers/auth.controller';
import ZooController from './controllers/zoo.controller';
import AuthService from './services/auth.service';
import { Schema, model } from 'mongoose';
import ZooModel, { IZoo } from './models/zoo.model';
import { ISpace } from './models/spaces.model';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/auth/login', AuthController.authenticate);
app.post('/auth/register', AuthController.signup);

// Middleware d'authentification pour les routes protégées

app.get('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, SpacesController.getSpaceByName);
app.post('/spaces', ZooController.ensureZooOpen, AuthController.ensureAdmin, SpacesController.addSpace);
app.delete('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, SpacesController.deleteSpace);
app.put('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, SpacesController.updateSpace);
app.patch('/spaces/:nom/maintenance', ZooController.ensureZooOpen, AuthController.ensureAdmin, SpacesController.toggleMaintenanceStatus);

app.delete('/users/:userId', AuthController.ensureAdmin, AuthController.deleteUser);
app.patch('/users/:userId/role', AuthController.ensureAdmin, AuthController.setUserRole);

app.get('/spaces/:nom/bestMonth', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, AuthController.ensureAdmin, SpacesController.getMaintenanceBestMonth);
app.patch('/spaces/:nom/bestMonth', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, AuthController.ensureAdmin, SpacesController.setBestMonthForSpace);

app.post('/spaces/:nom/animals', ZooController.ensureZooOpen, AuthController.ensureVeterinary, SpacesController.addAnimalSpecies);
app.get('/spaces/:nom/animals', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, SpacesController.getAnimalsInSpace);
app.post('/spaces/:nom/treatments', ZooController.ensureZooOpen, AuthController.ensureVeterinary, SpacesController.addTreatmentToVeterinaryLog);

// Routes publiques

app.get('/users', AuthController.getAllUsers);
app.get('/spaces', ZooController.ensureZooOpen, SpacesController.getAllSpaces);

app.patch('/zoo/open',AuthController.ensureRole(['admin', 'receptionist']), ZooController.openZoo);
app.patch('/zoo/close', AuthController.ensureRole(['admin', 'receptionist']), ZooController.closeZoo);
app.post('/users/add-all', AuthController.addAllUsers);


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
