# Utiliser une image Node.js comme base
FROM node:lts-bookworm-slim

# Créer le répertoire de travail
WORKDIR /usr/src/app

# Copier les dépendances du package.json et du package-lock.json
COPY ../backend/package*.json ./
COPY ../backend/server.js ./
COPY ../backend/jsons/*.json ./jsons/

# Installer les dépendances
RUN npm install

# Copier le reste du code source de l'application
# COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD [ "npm", "start" ]
