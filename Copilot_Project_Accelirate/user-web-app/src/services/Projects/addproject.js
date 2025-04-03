document.getElementById('add-project-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectID = document.getElementById('project-id').value;
    const groupCode = document.getElementById('group-code').value;
    const assignedClient = document.getElementById('assigned-client').value;

    const projectData = {
        ProjectID: projectID,
        C_GROUP_CODE: groupCode,
        C_ASSIGNED_CLIENT: assignedClient
    };

    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Project', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Project added successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Failed to add project. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
    });
});
