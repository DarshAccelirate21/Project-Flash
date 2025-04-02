document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
    setupSearch();
});

function fetchDepartments() {
    fetch('http://localhost:2024/api/select/Dim_Department')
        .then(response => response.json())
        .then(data => {
            const departmentContainer = document.getElementById('department-container');
            if (departmentContainer) {
                departmentContainer.innerHTML = ''; // Clear any existing content
                const newDepartmentCard = createNewDepartmentCard();
                departmentContainer.appendChild(newDepartmentCard);
                if (data.status === 200 && data.data) {
                    const departments = data.data;
                    departments.forEach(department => {
                        const departmentCard = createDepartmentCard(department);
                        departmentContainer.appendChild(departmentCard);
                    });
                } else {
                    console.error('Invalid API response:', data);
                }
            } else {
                console.error('Department container element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching departments:', error);
            const departmentContainer = document.getElementById('department-container');
            if (departmentContainer) {
                departmentContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load departments. Please try again later.</p>';
                const newDepartmentCard = createNewDepartmentCard();
                departmentContainer.appendChild(newDepartmentCard);
            }
        });
}

function createNewDepartmentCard() {
    const card = document.createElement('div');
    card.className = 'new-department-card';
    card.textContent = 'Add New Department';
    card.onclick = () => {
        window.location.href = 'adddepartment.html';
    };
    return card;
}

function createDepartmentCard(department) {
    const card = document.createElement('div');
    card.className = 'department-card';

    const name = document.createElement('h2');
    name.textContent = department.DEPARTMENT;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.textAlign = 'center';

    const editButton = createButton('Edit Department', `editdepartment.html?DepartmentID=${department.DepartmentID}`);

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
    const departmentInput = document.getElementById('department-input');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    departmentInput.addEventListener('input', filterDepartments);

    clearFiltersButton.addEventListener('click', () => {
        departmentInput.value = '';
        filterDepartments();
    });

    function filterDepartments() {
        const departmentQuery = departmentInput.value.toLowerCase();
        const departmentCards = document.querySelectorAll('.department-card');

        // Restore all cards before filtering
        departmentCards.forEach(card => card.style.display = 'block');

        let hasMatches = false;

        departmentCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();

            const matchesQuery = name.includes(departmentQuery) || !departmentQuery;

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
                document.getElementById('department-container').appendChild(message);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }
}
