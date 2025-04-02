document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const participationID = urlParams.get('ParticipationID');
    if (participationID) {
        fetchParticipationData(participationID);
    }

    document.getElementById('edit-participation-button').addEventListener('click', () => {
        const participationType = document.getElementById('participation-type').value;

        if (participationType.trim() === '') {
            alert('Please enter a participation type.');
            return;
        }

        const updatedParticipation = {
            ParticipationID: participationID,
            PARTICIPATION_TYPE: participationType
        };

        fetch(`http://localhost:2024/api/update/Dim_Participation/${participationID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedParticipation)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Participation updated successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to update participation. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating participation:', error);
            alert('An error occurred. Please try again.');
        });
    });
});

function fetchParticipationData(participationID) {
    fetch(`http://localhost:2024/api/select/Dim_Participation?ParticipationID=${participationID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200 && data.data) {
            const participation = data.data[0];
            document.getElementById('participation-id').value = participation.ParticipationID;
            document.getElementById('participation-type').value = participation.PARTICIPATION_TYPE;
        } else {
            alert('Failed to load participation data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching participation data:', error);
        alert('Failed to load participation data. Please try again.');
    });
}
