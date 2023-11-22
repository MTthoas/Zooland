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
import multer from 'multer';
import path from 'path';

const { exec } = require('child_process');

require('dotenv').config();

const app = express();
const port = 8080;

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use('/uploads', express.static('/app/public/uploads'));

app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/public/uploads')
  },
  filename: function (req, file, cb) {
  cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
}
})

var upload = multer({ storage: storage })

// Define /health

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.post('/auth/login', AuthController.authenticate);
app.post('/auth/register', AuthController.signup);

// Accès dédié à tous

app.get('/spaces', ZooController.ensureZooOpen,  AuthController.ensureAuthenticated, SpacesController.getAllSpaces);
app.get('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureAuthenticated, SpacesController.getSpaceByName);

// Accès dédié aux visiteurs

app.post('/spaces/:spaceId/visit', AuthController.ensureRole(['visitor']), SpacesController.recordVisit);
app.patch('/tickets/:userId/buy', AuthController.ensureRole(['visitor']), SpacesController.buyTicket);
app.get('/checkTicket/:ticketId/:spaceName', AuthController.ensureRole(['visitor','admin']), SpacesController.checkTicket);
app.post('/checkout/:ticketId/:spaceName', AuthController.ensureRole(['visitor']), SpacesController.checkOut);
app.get('/user/:userId/tickets', AuthController.ensureRole(['visitor']), SpacesController.getUserTickets);
app.get('/usersinfo/:username', AuthController.ensureRole(['visitor']), AuthController.getUserByName);


// Accès dédié aux employés

app.patch('/zoo/open',  AuthController.ensureRole(['admin', 'receptionist']), ZooController.openZoo);
app.patch('/zoo/close', AuthController.ensureRole(['admin', 'receptionist']), ZooController.closeZoo);
app.get('/zoo/status', AuthController.ensureRole(['admin', 'receptionist']), ZooController.checkZooStatus);


// app.get('/users', AuthController.ensureRole(['receptionist, admin']), AuthController.getAllUsers);

app.get('/tickets', AuthController.ensureRole(['salesperson', 'receptionist', 'admin']), SpacesController.getAllTickets);
app.get('/tickets/:spaceName', AuthController.ensureRole(['salesperson', 'receptionist', 'admin']), SpacesController.getTicketsFromSpace);
app.delete('/tickets/:ticketId', AuthController.ensureRole(['receptionist', 'admin']), SpacesController.deleteTicket)
app.delete('/tickets/:userId/deleteAll', AuthController.ensureRole(['receptionist', 'admin']), SpacesController.deleteAllTicketdFromUserId)
app.patch('/tickets/checkout-all', AuthController.ensureRole(['receptionist', 'admin']), SpacesController.checkOutAllTickets);

// Accès dédié aux admins

app.delete('/users/:userId', AuthController.ensureRole(['admin']), AuthController.deleteUser);
app.patch('/users/:userId/role', AuthController.ensureRole(['admin']), AuthController.setUserRole);
app.patch('/users/:userId', AuthController.updateUser);
app.get('/users/:username', AuthController.ensureRole(['receptionist', 'admin']), AuthController.getUserByName);
app.get('/usersinfo/:username', AuthController.ensureRole(['visitor']), AuthController.getUserByName);


app.post('/spaces', upload.single('image'), ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.addSpace);
app.delete('/spaces/:nom', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.deleteSpace);
app.put('/spaces/:nom', upload.single('image'), ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), SpacesController.updateSpace);

app.patch('/spaces/:nom/maintenance', ZooController.ensureZooOpen, AuthController.ensureRole(['admin', 'receptionist']), SpacesController.toggleMaintenanceStatus);
app.get('/spaces/:nom/bestMonth', ZooController.ensureZooOpen, AuthController.ensureRole(['admin', 'receptionist']), SpacesController.getBestMonthForSpace);
app.patch('/spaces/:nom/bestMonth', ZooController.ensureZooOpen, AuthController.ensureRole(['admin', 'receptionist']), SpacesController.setBestMonthForSpace);
app.get('/nom/:id', ZooController.ensureZooOpen, AuthController.ensureRole(['admin', 'receptionist']), SpacesController.getSpaceNomById);

app.get('/stats/live', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), StatisticsController.getLiveStats);
app.get('/stats/daily', ZooController.ensureZooOpen, AuthController.ensureRole(['admin']), StatisticsController.getDailyStatistics);
app.get('/stats/weekly', AuthController.ensureRole(['admin']), StatisticsController.getWeeklyStatistics);
app.delete('/stats/delete-all', AuthController.ensureRole(['admin']), StatisticsController.deleteAllStats);
app.delete('/stats/space/:spaceId', AuthController.ensureRole(['admin']), StatisticsController.suppStatByIdSpace);

// Accès dédié aux vétérinaires 

app.delete('/spaces/:nom/:species', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary', 'admin']), SpacesController.deleteAnimalSpecies);
app.post('/spaces/:nom/animals', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary', 'admin']), SpacesController.addAnimalSpecies);
app.get('/spaces/:nom/animals', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary', 'admin']), SpacesController.getAnimalsInSpace);
app.post('/spaces/:nom/treatments', ZooController.ensureZooOpen, AuthController.ensureRole(['veterinary', 'admin']), SpacesController.addTreatmentToVeterinaryLog);


// Route de dev

app.post('/users/add-all', AuthController.addAllUsers);
app.get('/users', AuthController.getAllUsers);

app.post('/deploy', (req, res) => {

  exec('script.sh', (error : TypeError, stdout: unknown, stderr: any) => {
    if (error) {
      console.error(`Erreur d'exécution: ${error}`);
      return res.status(500).send('Erreur lors du déploiement');
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send('Déploiement en cours');
  });

  res.send('Déploiement en cours');
});

app.get('/', (req, res) => {
  res.send('Hello !');
});

// mongoose
//    .connect(process.env.MONGODB_URI as string, {
//     authSource: 'admin',
//    })
//    .then(() => {
//    console.log('Successfully connected to MongoDB.');
    
//     // Initialisation du zoo
//    ZooModel.findOne({ nom: 'LaFaille' }) 
//       .then((zoo) => {
//         if (!zoo) {
//           const newZoo = new ZooModel({
//             nom: 'LaFaille', // Nom de votre zoo
//             adresse: '20 rue de la bagarre', // Adresse de votre zoo
//             isOpen: false,
//             espaces: [],
//             employees: []
//           });
//           newZoo.save().then(() => {
//             console.log('Zoo créé avec succès.');
//           });
//         }
//       });
//   })
//   .catch((error) => {
//     console.log('Unable to connect to MongoDB.');
//     console.error(error);
//   });

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
}
);
