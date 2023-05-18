import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import SpacesController from './controllers/spaces.controller';
import AuthController from './controllers/auth.controller';
import AuthService from './services/auth.service';
import { Schema, model } from 'mongoose';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/auth/login', AuthController.authenticate);
app.post('/auth/register', AuthController.signup);

// Middleware d'authentification pour les routes protégées
app.get('/spaces', AuthController.ensureAuthenticated, SpacesController.getAllSpaces);
app.get('/spaces/:nom', AuthController.ensureAuthenticated, SpacesController.getSpaceByName);
app.post('/spaces', AuthController.ensureAuthenticated, SpacesController.addSpace);
app.delete('/spaces/:nom', AuthController.ensureAuthenticated, SpacesController.deleteSpace);
app.put('/spaces/:nom', AuthController.ensureAuthenticated, SpacesController.updateSpace);
app.patch('/spaces/:nom', AuthController.ensureAuthenticated, SpacesController.toggleMaintenanceStatus);

app.get('/users', AuthController.ensureAuthenticated, AuthController.getAllUsers);
app.delete('/users/:userId', AuthController.ensureAuthenticated, AuthController.deleteUser);

// Routes publiques

app.get('/', (req, res) => {
  res.send('Hello !');
});


mongoose
  .connect(process.env.MONGODB_URI as string, {
    authSource: 'admin',
  })
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB.');
    console.error(error);
  });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
