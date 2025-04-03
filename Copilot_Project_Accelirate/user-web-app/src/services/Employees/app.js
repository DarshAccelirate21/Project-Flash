document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    setupSearch();
});

function fetchUsers() {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/vw_Employee_Allocation_Summary')
        .then(response => response.json())
        .then(data => {
            const userContainer = document.getElementById('user-container');
            const locationInput = document.getElementById('location-input');
            const participationTypeInput = document.getElementById('participation-type-input');
            const groupCodeInput = document.getElementById('group-code-input');
            const clientInput = document.getElementById('client-input');
            if (userContainer && locationInput && participationTypeInput && groupCodeInput && clientInput) {
                userContainer.innerHTML = ''; // Clear any existing content
                const newEmployeeCard = createNewEmployeeCard();
                userContainer.appendChild(newEmployeeCard);
                if (data.status === 200 && data.data) {
                    const users = data.data;
                    const userAllocations = {};
                    const uniqueUsers = {};
                    const locations = new Set();
                    const participationTypes = new Set();
                    const groupCodes = new Set();
                    const clients = new Set();

                    // Sum allocations for each user and ensure unique users
                    users.forEach(user => {
                        if (!userAllocations[user.EmployeeID]) {
                            userAllocations[user.EmployeeID] = 0;
                            uniqueUsers[user.EmployeeID] = [];
                        }
                        userAllocations[user.EmployeeID] += user.Total_Allocation;
                        uniqueUsers[user.EmployeeID].push(user);
                        locations.add(user.LOCATION_CONCAT);
                        participationTypes.add(user.PARTICIPATION_TYPE);
                        groupCodes.add(user.C_GROUP_CODE);
                        clients.add(user.C_ASSIGNED_CLIENT);
                    });

                    // Fill location dropdown options
                    locations.forEach(location => {
                        const option = document.createElement('option');
                        option.value = location;
                        option.textContent = location;
                        locationInput.appendChild(option);
                    });

                    // Fill participation type dropdown options
                    participationTypes.forEach(type => {
                        const option = document.createElement('option');
                        option.value = type;
                        option.textContent = type;
                        participationTypeInput.appendChild(option);
                    });

                    // Fill group code dropdown options
                    groupCodes.forEach(code => {
                        const option = document.createElement('option');
                        option.value = code;
                        option.textContent = code;
                        groupCodeInput.appendChild(option);
                    });

                    // Fill client dropdown options
                    clients.forEach(client => {
                        const option = document.createElement('option');
                        option.value = client;
                        option.textContent = client;
                        clientInput.appendChild(option);
                    });

                    Object.values(uniqueUsers).forEach(userRecords => {
                        const userCard = createUserCard(userRecords);
                        userContainer.appendChild(userCard);
                        checkAllocationStatus(userAllocations[userRecords[0].EmployeeID], userCard);
                    });
                } else {
                    console.error('Invalid API response:', data);
                }
            } else {
                console.error('User container, location input, participation type input, group code input, or client input element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            const userContainer = document.getElementById('user-container');
            if (userContainer) {
                userContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load users. Please try again later.</p>';
                const newEmployeeCard = createNewEmployeeCard();
                userContainer.appendChild(newEmployeeCard);
            }
        });
}

function createNewEmployeeCard() {
    const card = document.createElement('div');
    card.className = 'new-employee-card';
    card.textContent = 'Add New Employee';
    card.onclick = () => {
        window.location.href = 'adduser.html';
    };
    return card;
}

function createUserCard(userRecords) {
    const card = document.createElement('div');
    card.className = 'user-card';

    const name = document.createElement('h2');
    name.textContent = `${userRecords[0].FIRST_NAME} ${userRecords[0].LAST_NAME}`;

    const hireDate = document.createElement('h3');
    hireDate.textContent = `Hire Date: ${new Date(userRecords[0].HIRE_DATE).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })}`;

    const status = document.createElement('p');
    status.className = `status ${userRecords[0].Employee_Status === 'ACTIVE' ? 'active' : 'inactive'}`;
    status.textContent = `Status: ${userRecords[0].Employee_Status}`;

    const alertContainer = document.createElement('div');
    alertContainer.className = 'allocation-alert';

    card.appendChild(name);
    card.appendChild(hireDate);
    card.appendChild(status);
    card.appendChild(alertContainer);

    const recordsContainer = document.createElement('div');
    recordsContainer.className = 'records-container';

    const firstRecord = userRecords[0];
    const firstRecordContainer = createRecordContainer(firstRecord, 1);
    recordsContainer.appendChild(firstRecordContainer);

    if (userRecords.length > 1) {
        const showMoreButton = document.createElement('button');
        showMoreButton.className = 'show-more-button';
        showMoreButton.textContent = 'Show More';
        showMoreButton.onclick = () => {
            userRecords.slice(1).forEach((record, index) => {
                const recordContainer = createRecordContainer(record, index + 2);
                recordsContainer.appendChild(recordContainer);
            });
            showMoreButton.style.display = 'none';
            hideButton.style.display = 'block';
        };
        recordsContainer.appendChild(showMoreButton);

        const hideButton = document.createElement('button');
        hideButton.className = 'hide-button';
        hideButton.textContent = 'Hide';
        hideButton.style.display = 'none';
        hideButton.onclick = () => {
            const additionalRecords = recordsContainer.querySelectorAll('.record-container:not(:first-child)');
            additionalRecords.forEach(record => record.remove());
            showMoreButton.style.display = 'block';
            hideButton.style.display = 'none';
        };
        recordsContainer.appendChild(hideButton);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.textAlign = 'center';

    const editButton = createButton('Edit Employee', `edit.html?EmployeeID=${userRecords[0].EmployeeID}`);
    const assignmentsButton = createButton('Assignments', `assignment.html?EmployeeID=${userRecords[0].EmployeeID}`);

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(assignmentsButton);
    card.appendChild(buttonContainer);
    card.appendChild(recordsContainer);

    if (userRecords[0].Employee_Status === 'INACTIVE') {
        card.style.backgroundColor = '#D3D3D3';
    }

    return card;
}

function createRecordContainer(record, index) {
    const recordContainer = document.createElement('div');
    recordContainer.className = 'record-container';

    const recordTitle = document.createElement('h4');
    recordTitle.textContent = `Record ${index}`;

    const participationType = document.createElement('p');
    participationType.textContent = `Participation Type: ${record.PARTICIPATION_TYPE}`;

    const groupCode = document.createElement('p');
    groupCode.textContent = `Group Code: ${record.C_GROUP_CODE}`;

    const assignedClient = document.createElement('p');
    assignedClient.textContent = `Assigned Client: ${record.C_ASSIGNED_CLIENT}`;

    const allocation = document.createElement('p');
    allocation.textContent = `Allocation: ${record.Total_Allocation}%`;

    const locationConcat = document.createElement('p');
    locationConcat.textContent = `Location: ${record.LOCATION_CONCAT}`;

    recordContainer.appendChild(recordTitle);
    recordContainer.appendChild(participationType);
    recordContainer.appendChild(groupCode);
    recordContainer.appendChild(assignedClient);
    recordContainer.appendChild(allocation);
    recordContainer.appendChild(locationConcat);

    return recordContainer;
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

function checkAllocationStatus(totalAllocation, card) {
    const alertContainer = card.querySelector('.allocation-alert');

    if (totalAllocation > 100) {
        alertContainer.innerHTML = `<p style="color: red;">USER IS OVER ALLOCATED (${totalAllocation}%)</p>`;
        card.style.borderColor = 'red';
        card.style.borderWidth = '3px';
    } else if (totalAllocation < 100) {
        alertContainer.innerHTML = `<p style="color: orange;">USER IS UNDER ALLOCATED (${totalAllocation}%)</p>`;
        card.style.borderColor = 'orange';
        card.style.borderWidth = '3px';
    } else {
        alertContainer.innerHTML = `<p style="color: green;">USER IS FULLY ALLOCATED (${totalAllocation}%)</p>`;
        card.style.borderColor = 'green';
        card.style.borderWidth = '3px';
    }
}

function setupSearch() {
    const nameInput = document.getElementById('name-input');
    const hireDateFromInput = document.getElementById('hire-date-from-input');
    const hireDateToInput = document.getElementById('hire-date-to-input');
    const statusInput = document.getElementById('status-input');
    const allocationInput = document.getElementById('allocation-input');
    const participationTypeInput = document.getElementById('participation-type-input');
    const locationInput = document.getElementById('location-input');
    const groupCodeInput = document.getElementById('group-code-input');
    const clientInput = document.getElementById('client-input');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    const inputs = [nameInput, hireDateFromInput, hireDateToInput, statusInput, allocationInput, participationTypeInput, locationInput, groupCodeInput, clientInput];
    inputs.forEach(input => input.addEventListener('input', filterUsers));

    clearFiltersButton.addEventListener('click', () => {
        inputs.forEach(input => {
            if (input.tagName === 'SELECT' || input.tagName === 'INPUT') {
                input.value = '';
            }
        });
        filterUsers();
    });

    function filterUsers() {
        const nameQuery = nameInput.value.toLowerCase();
        const hireDateFromQuery = hireDateFromInput.value;
        const hireDateToQuery = hireDateToInput.value;
        const statusQuery = statusInput.value.toLowerCase();
        const allocationQuery = allocationInput.value.toLowerCase();
        const participationTypeQuery = participationTypeInput.value.toLowerCase();
        const locationQuery = locationInput.value.toLowerCase();
        const groupCodeQuery = groupCodeInput.value.toLowerCase();
        const clientQuery = clientInput.value.toLowerCase();
        const userCards = document.querySelectorAll('.user-card');

        // Restaura todas las tarjetas antes de filtrar
        userCards.forEach(card => card.style.display = 'block');

        let hasMatches = false;

        userCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            const hireDate = card.querySelector('h3').textContent.toLowerCase();
            const status = card.querySelector('.status').textContent.split(': ')[1].toLowerCase();
            const allocationAlert = card.querySelector('.allocation-alert').textContent.toLowerCase();
            const participationType = Array.from(card.querySelectorAll('.record-container p:nth-child(2)')).map(p => p.textContent.toLowerCase());
            const location = Array.from(card.querySelectorAll('.record-container p:nth-child(6)')).map(p => p.textContent.toLowerCase());
            const groupCode = Array.from(card.querySelectorAll('.record-container p:nth-child(3)')).map(p => p.textContent.toLowerCase());
            const client = Array.from(card.querySelectorAll('.record-container p:nth-child(4)')).map(p => p.textContent.toLowerCase());

            const hireDateValue = new Date(hireDate.split(': ')[1]);
            const hireDateFromValue = hireDateFromQuery ? new Date(hireDateFromQuery) : null;
            const hireDateToValue = hireDateToQuery ? new Date(hireDateToQuery) : null;

            const matchesQuery = 
                (name.includes(nameQuery) || !nameQuery) &&
                (!hireDateFromValue || hireDateValue >= hireDateFromValue) &&
                (!hireDateToValue || hireDateValue <= hireDateToValue) &&
                (status === statusQuery || !statusQuery) &&
                (allocationAlert.includes(allocationQuery) || !allocationQuery) &&
                (participationType.some(type => type.includes(participationTypeQuery)) || !participationTypeQuery) &&
                (location.some(loc => loc.includes(locationQuery)) || !locationQuery) &&
                (groupCode.some(code => code.includes(groupCodeQuery)) || !groupCodeQuery) &&
                (client.some(cli => cli.includes(clientQuery)) || !clientQuery);

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
                document.getElementById('user-container').appendChild(message);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }
}
