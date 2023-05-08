import express, {Express, Request, Response} from 'express'
import SpacesController from './resources/spaces/spaces.controller';

const app = express()
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/spaces', SpacesController.getAllSpaces);
app.get('/spaces/:nom', SpacesController.getSpaceByName);
app.post('/spaces', SpacesController.addSpace);
app.delete('/spaces/:nom', SpacesController.deleteSpace);
app.put('/spaces/:nom', SpacesController.updateSpace);


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});