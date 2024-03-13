window.addEventListener('load', () => {
    const url = 'http://localhost:3000/matches';
    // when server is online
    fetch({url, mode: "no-cors"})
        .then(response => {console.log(response); response.json();})

        .then(data => {
            console.log(data);
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

            caches.match(url).then(response => {
                if (response) {
                    response.json().then(data => {
                        const container = document.getElementById('PWA_backendImports_scores');
                        container.innerHTML = '';
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
