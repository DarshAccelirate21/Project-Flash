document.addEventListener('DOMContentLoaded', () => {
    fetchJobPositions();
    setupSearch();
});

function fetchJobPositions() {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_JobPosition')
        .then(response => response.json())
        .then(data => {
            const jobPositionContainer = document.getElementById('jobposition-container');
            if (jobPositionContainer) {
                jobPositionContainer.innerHTML = ''; // Clear any existing content
                const newJobPositionCard = createNewJobPositionCard();
                jobPositionContainer.appendChild(newJobPositionCard);
                if (data.status === 200 && data.data) {
                    const jobPositions = data.data;
                    jobPositions.forEach(jobPosition => {
                        const jobPositionCard = createJobPositionCard(jobPosition);
                        jobPositionContainer.appendChild(jobPositionCard);
                    });
                } else {
                    console.error('Invalid API response:', data);
                }
            } else {
                console.error('Job position container element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching job positions:', error);
            const jobPositionContainer = document.getElementById('jobposition-container');
            if (jobPositionContainer) {
                jobPositionContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load job positions. Please try again later.</p>';
                const newJobPositionCard = createNewJobPositionCard();
                jobPositionContainer.appendChild(newJobPositionCard);
            }
        });
}

function createNewJobPositionCard() {
    const card = document.createElement('div');
    card.className = 'new-jobposition-card';
    card.textContent = 'Add New Job Position';
    card.onclick = () => {
        window.location.href = 'addjobposition.html';
    };
    return card;
}

function createJobPositionCard(jobPosition) {
    const card = document.createElement('div');
    card.className = 'jobposition-card';

    const name = document.createElement('h2');
    name.textContent = jobPosition.JOBPOSITION;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.textAlign = 'center';

    const editButton = createButton('Edit Job Position', `editjobposition.html?JobPositionID=${jobPosition.JobPositionID}`);

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
    const jobPositionInput = document.getElementById('jobposition-input');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    jobPositionInput.addEventListener('input', filterJobPositions);

    clearFiltersButton.addEventListener('click', () => {
        jobPositionInput.value = '';
        filterJobPositions();
    });

    function filterJobPositions() {
        const jobPositionQuery = jobPositionInput.value.toLowerCase();
        const jobPositionCards = document.querySelectorAll('.jobposition-card');

        // Restore all cards before filtering
        jobPositionCards.forEach(card => card.style.display = 'block');

        let hasMatches = false;

        jobPositionCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();

            const matchesQuery = name.includes(jobPositionQuery) || !jobPositionQuery;

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
                document.getElementById('jobposition-container').appendChild(message);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }
}
