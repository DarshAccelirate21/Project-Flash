document.addEventListener('DOMContentLoaded', () => {
    fetchParticipations();
    setupSearch();
});

function fetchParticipations() {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Participation')
        .then(response => response.json())
        .then(data => {
            const participationContainer = document.getElementById('participation-container');
            if (participationContainer) {
                participationContainer.innerHTML = ''; // Clear any existing content
                const newParticipationCard = createNewParticipationCard();
                participationContainer.appendChild(newParticipationCard);
                if (data.status === 200 && data.data) {
                    const participations = data.data;
                    participations.forEach(participation => {
                        const participationCard = createParticipationCard(participation);
                        participationContainer.appendChild(participationCard);
                    });
                } else {
                    console.error('Invalid API response:', data);
                }
            } else {
                console.error('Participation container element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching participations:', error);
            const participationContainer = document.getElementById('participation-container');
            if (participationContainer) {
                participationContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load participations. Please try again later.</p>';
                const newParticipationCard = createNewParticipationCard();
                participationContainer.appendChild(newParticipationCard);
            }
        });
}

function createNewParticipationCard() {
    const card = document.createElement('div');
    card.className = 'new-participation-card';
    card.textContent = 'Add New Participation';
    card.onclick = () => {
        window.location.href = 'addparticipation.html';
    };
    return card;
}

function createParticipationCard(participation) {
    const card = document.createElement('div');
    card.className = 'participation-card';

    const name = document.createElement('h2');
    name.textContent = participation.PARTICIPATION_TYPE;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.textAlign = 'center';

    const editButton = createButton('Edit Participation', `editparticipation.html?ParticipationID=${participation.ParticipationID}`);

    buttonContainer.appendChild(editButton);
    card.appendChild(name);
    card.appendChild(buttonContainer);

    return card;
}

function createButton(text, url) {
    const button = document.createElement('button');
    button.className = 'edit-button';
    button.textContent = text;
    button.onclick = () => {
        window.location.href = url;
    };
    return button;
}

function setupSearch() {
    const participationInput = document.getElementById('participation-input');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    participationInput.addEventListener('input', filterParticipations);

    clearFiltersButton.addEventListener('click', () => {
        participationInput.value = '';
        filterParticipations();
    });

    function filterParticipations() {
        const participationQuery = participationInput.value.toLowerCase();
        const participationCards = document.querySelectorAll('.participation-card');

        // Restore all cards before filtering
        participationCards.forEach(card => card.style.display = 'block');

        let hasMatches = false;

        participationCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();

            const matchesQuery = name.includes(participationQuery) || !participationQuery;

            card.style.display = matchesQuery ? 'block' : 'none';
            if (matchesQuery) hasMatches = true;
        });

        const noResultsMessage = document.getElementById('no-results-message');
        if (!hasMatches) {
            if (!noResultsMessage) {
                const message = document.createElement('p');
                message.id = 'no-results-message';
                message.textContent = 'No coincidence found';
                message.style.textAlign = 'center';
                message.style.fontWeight = 'bold';
                document.getElementById('participation-container').appendChild(message);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }
}
