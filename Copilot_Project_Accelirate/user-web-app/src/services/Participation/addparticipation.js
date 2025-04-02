document.getElementById('add-participation-button').addEventListener('click', () => {
    const participationID = document.getElementById('participation-id').value;
    const participationType = document.getElementById('participation-type').value;

    if (participationID.trim() === '' || participationType.trim() === '') {
        alert('Please enter both participation ID and type.');
        return;
    }

    const newParticipation = {
        ParticipationID: participationID,
        PARTICIPATION_TYPE: participationType
    };

    fetch('http://localhost:2024/api/insert/Dim_Participation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newParticipation)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Participation added successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Failed to add participation. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding participation:', error);
        alert('An error occurred. Please try again.');
    });
});
