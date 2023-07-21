# Zooland

Zooland est un projet TypeScript qui simule la gestion d'un zoo. Le front-end est construit avec React JS et est situé dans le répertoire ./Client. Le back-end est une application Express avec une base de données MongoDB et se trouve dans le répertoire ./server.

# Structure du Projet

Zooland/
│
├── Client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── server/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── Dockerfile
├── docker-compose.yml
└── .github/
    └── workflows/
        └── deploy.yml
# Pré-requis

Node.js
npm
Docker
Docker Compose
Installation
Cloner le dépôt :
bash
Copy code
git clone https://github.com/MTthoas/Zooland.git
Installer les dépendances pour le client et le serveur :
bash
Copy code
cd Zooland/Client
npm install

cd ../server
npm install
Exécution en local
Démarrer le client :
bash
Copy code
cd Zooland/Client
npm start
Démarrer le serveur :
bash
Copy code
cd Zooland/server
npm start

# Déploiement
Le déploiement est automatisé à l'aide de GitHub Actions. Lorsque du code est poussé sur la branche master, une action est déclenchée pour déployer le code sur un VPS.

Le script de déploiement SSH effectue les opérations suivantes :

Récupération des dernières modifications depuis le dépôt
Installation des dépendances du serveur
Compilation du serveur
Redémarrage des conteneurs Docker
Docker
Une configuration Docker est fournie pour faciliter le déploiement.

Le Dockerfile utilise l'image node:14 comme base, copie les fichiers nécessaires et démarre le serveur Express.

Le docker-compose.yml configure deux services : l'application elle-même et la base de données MongoDB. Les données de la base de données sont conservées dans un volume Docker pour la persistance.

Pour démarrer les conteneurs Docker, exécutez la commande suivante dans le répertoire racine du projet :

bash
Copy code
docker-compose up
Pour arrêter les conteneurs et supprimer les ressources associées :

bash
Copy code
docker-compose down
Contributions
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

# License
Zooland est un logiciel libre. Voir le fichier LICENSE pour plus d'informations.