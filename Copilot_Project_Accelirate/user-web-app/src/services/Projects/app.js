document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    setupSearch();
});

function fetchProjects() {
    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Project')
        .then(response => response.json())
        .then(data => {
            const projectContainer = document.getElementById('project-container');
            if (projectContainer) {
                projectContainer.innerHTML = ''; // Clear any existing content
                const newProjectCard = createNewProjectCard();
                projectContainer.appendChild(newProjectCard);
                if (data.status === 200 && data.data) {
                    const projects = data.data;
                    projects.forEach(project => {
                        const projectCard = createProjectCard(project);
                        projectContainer.appendChild(projectCard);
                    });
                } else {
                    console.error('Invalid API response:', data);
                }
            } else {
                console.error('Project container element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            const projectContainer = document.getElementById('project-container');
            if (projectContainer) {
                projectContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load projects. Please try again later.</p>';
                const newProjectCard = createNewProjectCard();
                projectContainer.appendChild(newProjectCard);
            }
        });
}

function createNewProjectCard() {
    const card = document.createElement('div');
    card.className = 'new-project-card';
    card.textContent = 'Add New Project';
    card.onclick = () => {
        window.location.href = 'addproject.html';
    };
    return card;
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const name = document.createElement('h2');
    name.textContent = `${project.C_GROUP_CODE}, ${project.C_ASSIGNED_CLIENT}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.textAlign = 'center';

    const editButton = createButton('Edit Project', `editproject.html?ProjectID=${project.ProjectID}`);

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
    const groupCodeInput = document.getElementById('group-code-input');
    const assignedClientInput = document.getElementById('assigned-client-input');
    const clearFiltersButton = document.getElementById('clear-filters-button');

    const inputs = [groupCodeInput, assignedClientInput];
    inputs.forEach(input => input.addEventListener('input', filterProjects));

    clearFiltersButton.addEventListener('click', () => {
        inputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.value = '';
            }
        });
        filterProjects();
    });

    function filterProjects() {
        const groupCodeQuery = groupCodeInput.value.toLowerCase();
        const assignedClientQuery = assignedClientInput.value.toLowerCase();
        const projectCards = document.querySelectorAll('.project-card');

        // Restore all cards before filtering
        projectCards.forEach(card => card.style.display = 'block');

        let hasMatches = false;

        projectCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();

            const matchesQuery = 
                (name.includes(groupCodeQuery) || !groupCodeQuery) &&
                (name.includes(assignedClientQuery) || !assignedClientQuery);

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
                document.getElementById('project-container').appendChild(message);
            }
        } else {
            if (noResultsMessage) {
                noResultsMessage.remove();
            }
        }
    }
}
