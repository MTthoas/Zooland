import express, { Request, Response } from 'express';

const app = express();
const port = 3000; 

app.use(express.json());

app.post('/notify', (req: Request, res: Response) => {
    console.log('Notification reçue:', req.body);
    res.status(200).send('Notification reçue');
});

app.listen(port, () => {
    console.log(`Serveur listener démarré sur http://localhost:${port}`);
});
