document.getElementById('add-jobposition-button').addEventListener('click', () => {
    const jobPositionID = document.getElementById('jobposition-id').value;
    const jobPositionName = document.getElementById('jobposition-name').value;

    if (jobPositionID.trim() === '' || jobPositionName.trim() === '') {
        alert('Please enter both job position ID and name.');
        return;
    }

    const newJobPosition = {
        JobPositionID: jobPositionID,
        JOBPOSITION: jobPositionName
    };

    fetch('http://localhost:2024/api/insert/Dim_JobPosition', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newJobPosition)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Job position added successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Failed to add job position. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding job position:', error);
        alert('An error occurred. Please try again.');
    });
});
