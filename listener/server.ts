import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const { exec } = require('child_process');

const app = express();
const port = 5111; 

app.use(bodyParser.json());
const repo = 'mtthoas/zooland:main';

function pullImage() {
    exec(`docker pull ${repo}`, (err: any, stdout: any, stderr: any) => {
        if(err) {
            return;
        }
        console.log(`Image ${repo} mise à jour`);
    });
}

// Cas d'utilisation 1: Pull de l'image si on reçoit une notification de Docker Hub, utile quand on a une adresse publique
// Dans ce cas d'usage, décommenter le healthcheck dans le workflow/main.yaml

app.post('/dockerhub-webhook', (req: Request, res: Response) => {
    console.log('Notification reçue:', req.body);

    const event = req.headers['x-docker-hub-event'];

    if(event && event === 'push') {
        console.log('Notification reçue:', req.body);
        console.log('Pulling image... : ', repo)
        pullImage();
    }

    res.status(200).send('Notification reçue');
});

// Cas d'utilisation 2: Pull de l'image toutes les 25 secondes, utile quand on a une adresse privée

setInterval(() => {
    console.log('Je suis toujours vivant');
    pullImage()
    
}, 30000);


app.listen(port, () => {
    console.log(`Serveur listener démarré sur http://localhost:${port}`);
});
