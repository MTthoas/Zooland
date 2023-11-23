import express, { Request, Response } from 'express';
const { exec } = require('child_process');

const app = express();
const port = 3000; 

app.use(express.json());
const repo = 'mtthoas/zooland:main';

app.post('/dockerhub-webhook', (req: Request, res: Response) => {
    console.log('Notification reçue:', req.body);

    const event = req.headers['x-docker-hub-event'];

    if(event !== 'push') {
        res.status(200).send('Notification ignorée');
        return;
    }else{
        console.log('Notification reçue:', req.body);
    }

    res.status(200).send('Notification reçue');
});

setInterval(() => {
    console.log('Je suis toujours vivant');

    exec(`docker pull ${repo}`, (err: any, stdout: any, stderr: any) => {
        if(err) {
            console.error(`Erreur lors de la mise à jour de l'image ${repo}:`, err);
            return;
        }

        console.log(`Image ${repo} mise à jour`);
    });
    
}, 1000 * 60 * 5);


app.listen(port, () => {
    console.log(`Serveur listener démarré sur http://localhost:${port}`);
});
