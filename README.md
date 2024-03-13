# Lancement du projet PWA avec Docker et Docker Compose

Ce guide vous mènera à travers les étapes nécessaires pour construire et exécuter votre application PWA, comprenant un backend Node.js et un serveur Apache pour le frontend, en utilisant Docker et Docker Compose.

## Prérequis

- Docker [Installation guide](https://docs.docker.com/get-docker/)
- Docker Compose (normalement inclus dans les installations de Docker pour Windows et Mac) [Documentation](https://docs.docker.com/compose/)

## Étapes pour lancer le projet

1. **Cloner le dépôt Git**

   Clonez le dépôt du projet en utilisant la commande suivante :

```sh
   git clone git@github.com:Arzoter/TP_PWA.git
   cd TP_PWA
   ```

2. **Construire les images Docker**

   Avant de lancer les conteneurs, vous devez construire les images Docker définies par les Dockerfiles du projet. Docker Compose simplifie ce processus en permettant de construire toutes les images nécessaires avec une seule commande.

   Exécutez la commande suivante à la racine du projet où se trouve le fichier `docker-compose.yml` :

```sh
   docker compose build
```


3. **Lancer les conteneurs**

Une fois les images construites, vous pouvez lancer les conteneurs. Docker Compose permet également de le faire facilement avec une seule commande.

Utilisez la commande suivante pour lancer les conteneurs en arrière-plan :
```sh
   docker compose up -d
```

TIP: Vous pouvez aussi construire les images et lancer les conteneurs en même temps en utilisant la commande suivante :
```sh
   docker compose up --build -d
```

Si vous préférez voir les logs dans le terminal, omettez l'option `-d` :


4. **Accéder aux services**

Une fois les conteneurs lancés, les services suivants seront accessibles :

- Frontend Apache Server: [http://localhost](http://localhost)
- Backend Node.js API (pour les scores des matchs): [http://localhost:3300/matches](http://localhost:3300/matches)

5. **Arrêter les conteneurs**

Pour arrêter les conteneurs, utilisez la commande suivante :
```sh
   docker-compose down
```

## Nettoyage (optionnel)

Si vous souhaitez supprimer les images Docker construites pour ce projet, vous pouvez le faire avec les commandes `docker rmi` suivi par les noms des images ou les ID. Utilisez `docker images` pour lister les images disponibles.




