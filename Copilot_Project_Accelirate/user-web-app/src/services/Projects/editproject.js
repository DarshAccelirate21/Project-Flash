document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectID = urlParams.get('ProjectID');
    if (projectID) {
        fetchProjectData(projectID);
    }

    document.getElementById('edit-project-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const groupCode = document.getElementById('group-code').value;
        const assignedClient = document.getElementById('assigned-client').value;

        const projectData = {
            ProjectID: projectID,
            C_GROUP_CODE: groupCode,
            C_ASSIGNED_CLIENT: assignedClient
        };

        fetch(`http://localhost:2024/api/update/Dim_Project/${projectID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Project updated successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to update project. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating project:', error);
            alert('Failed to update project. Please try again.');
        });
    });
});

function fetchProjectData(projectID) {
    fetch(`http://localhost:2024/api/select/Dim_Project?ProjectID=${projectID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200 && data.data) {
            const project = data.data[0];
            document.getElementById('project-id').value = project.ProjectID;
            document.getElementById('group-code').value = project.C_GROUP_CODE;
            document.getElementById('assigned-client').value = project.C_ASSIGNED_CLIENT;
        } else {
            alert('Failed to load project data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching project data:', error);
        alert('Failed to load project data. Please try again.');
    });
}
