const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Endpoint pour récupérer les informations de score de match
app.get('/matches', (req, res) => {
    // Construire le chemin complet vers le fichier JSON
    const filePath = path.join(__dirname, 'jsons', 'matches.json');
    
    // Lire le fichier JSON contenant les informations de score de match
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading matches.json:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        // Convertir les données JSON en objet JavaScript
        const matches = JSON.parse(data);
        
        // Envoyer les informations de score de match en réponse à la requête
        res.json(matches);
    });
});

app.use(cors());
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
