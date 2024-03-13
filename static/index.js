window.addEventListener('load', () => {
    const url = 'http://localhost:3300/matches';
    // when server is online
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('PWA_backendImports_scores');
            container.innerHTML = ''; // Nettoyer le contenu précédent
            data.forEach(match => {
                const matchElement = document.createElement('div');
                matchElement.classList.add('match-score');
                matchElement.innerHTML = `<h3>Match ${match.id}</h3><p>${match.team1} vs ${match.team2}: ${match.score1} - ${match.score2}</p>`;
                container.appendChild(matchElement);
            });
        })
        // when app is offline
        .catch(error => {
            console.error('Fetch error:', error);
            // Tentative de récupérer les données du cache
            caches.match(url).then(response => {
                if (response) {
                    response.json().then(data => {
                        const container = document.getElementById('PWA_backendImports_scores');
                        container.innerHTML = ''; // Nettoyer le contenu précédent
                        data.forEach(match => {
                            const matchElement = document.createElement('div');
                            matchElement.classList.add('match-score');
                            matchElement.innerHTML = `<h3>Match ${match.id}</h3><p>${match.team1} vs ${match.team2}: ${match.score1} - ${match.score2}</p>`;
                            container.appendChild(matchElement);
                        });
                    });
                }
            });
        });
});
