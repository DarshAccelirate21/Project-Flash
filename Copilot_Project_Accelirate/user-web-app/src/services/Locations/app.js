document.addEventListener('DOMContentLoaded', () => {
    fetchLocations();
    setupSearch();
});

function fetchLocations() {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Location')
        .then(response => response.json())
        .then(data => {
            const locationContainer = document.getElementById('location-container');
            if (locationContainer) {
                locationContainer.innerHTML = ''; // Clear any existing content
                const newLocationCard = createNewLocationCard();
                locationContainer.appendChild(newLocationCard);
                if (data.status === 200 && data.data) {
                    const locations = data.data;
                    locations.forEach(location => {
                        const locationCard = createLocationCard(location);
                        locationContainer.appendChild(locationCard);
                    });
                } else {
                    console.error('Invalid API response:', data);
                }
            } else {
                console.error('Location container element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
            const locationContainer = document.getElementById('location-container');
            if (locationContainer) {
                locationContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load locations. Please try again later.</p>';
                const newLocationCard = createNewLocationCard();
                locationContainer.appendChild(newLocationCard);
            }
        });
}

function createNewLocationCard() {
    const card = document.createElement('div');
    card.className = 'new-location-card';
    card.textContent = 'Add New Location';
    card.onclick = () => {
        window.location.href = 'addlocation.html';
    };
    return card;
}

function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';

    const name = document.createElement('h2');
    name.textContent = `${location.LOCATIONCITY}, ${location.LOCATIONCOUNTRY}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.textAlign = 'center';

    const editButton = createButton('Edit Location', `editlocation.html?LocationID=${location.LocationID}`);

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
    const countryInput = document.getElementById('country-input');
    const cityInput = document.getElementById('city-input');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    const inputs = [countryInput, cityInput];
    inputs.forEach(input => input.addEventListener('input', filterLocations));

    clearFiltersButton.addEventListener('click', () => {
        inputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.value = '';
            }
        });
        filterLocations();
    });

    function filterLocations() {
        const countryQuery = countryInput.value.toLowerCase();
        const cityQuery = cityInput.value.toLowerCase();
        const locationCards = document.querySelectorAll('.location-card');

        // Restaura todas las tarjetas antes de filtrar
        locationCards.forEach(card => card.style.display = 'block');

        let hasMatches = false;

        locationCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();

            const matchesQuery = 
                (name.includes(countryQuery) || !countryQuery) &&
                (name.includes(cityQuery) || !cityQuery);

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
                document.getElementById('location-container').appendChild(message);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }
}
