document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobPositionID = urlParams.get('JobPositionID');
    if (jobPositionID) {
        fetchJobPositionData(jobPositionID);
    }

    document.getElementById('edit-jobposition-button').addEventListener('click', () => {
        const jobPositionName = document.getElementById('jobposition-name').value;

        if (jobPositionName.trim() === '') {
            alert('Please enter a job position name.');
            return;
        }

        const updatedJobPosition = {
            JobPositionID: jobPositionID,
            JOBPOSITION: jobPositionName
        };

        fetch(`http://localhost:2024/api/update/Dim_JobPosition/${jobPositionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedJobPosition)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Job position updated successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to update job position. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating job position:', error);
            alert('An error occurred. Please try again.');
        });
    });
});

function fetchJobPositionData(jobPositionID) {
    fetch(`http://localhost:2024/api/select/Dim_JobPosition?JobPositionID=${jobPositionID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200 && data.data) {
            const jobPosition = data.data[0];
            document.getElementById('jobposition-id').value = jobPosition.JobPositionID;
            document.getElementById('jobposition-name').value = jobPosition.JOBPOSITION;
        } else {
            alert('Failed to load job position data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching job position data:', error);
        alert('Failed to load job position data. Please try again.');
    });
}
