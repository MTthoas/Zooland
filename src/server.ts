import express, {Express, Request, Response} from 'express';
import mongoose from 'mongoose';
import SpacesController from './resources/spaces/spaces.controller';
import AuthRoutes from './resources/auth/auth.routes';
import cookieParser from 'cookie-parser';
import { Schema, model } from 'mongoose';

import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";


dotenv.config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;


const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use auth routes
app.use('/auth', AuthRoutes);

app.get('/spacesdd', SpacesController.getAllSpaces);
// app.get('/spaces/:nom', SpacesController.getSpaceByName);
app.post('/spaces', SpacesController.addSpace);
// app.delete('/spaces/:nom', SpacesController.deleteSpace);
// app.put('/spaces/:nom', SpacesController.updateSpace);
// app.patch('/spaces/:nom', SpacesController.toggleMaintenanceStatus);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

mongoose.connect(process.env.MONGODB_URI as string, {
    authSource: "admin" 
}).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch(error => {
    console.log("Unable to connect to MongoDB.");
    console.error(error);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});