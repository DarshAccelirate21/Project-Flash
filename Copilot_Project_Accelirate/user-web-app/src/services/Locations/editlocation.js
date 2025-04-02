document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const locationID = urlParams.get('LocationID');
    if (locationID) {
        fetchLocationData(locationID);
    }

    document.getElementById('edit-location-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const country = document.getElementById('location-country').value;
        const city = document.getElementById('location-city').value;

        const locationData = {
            LocationID: locationID,
            LOCATIONCOUNTRY: country,
            LOCATIONCITY: city
        };

        fetch(`http://localhost:2024/api/update/Dim_Location/${locationID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(locationData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Location updated successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to update location. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating location:', error);
            alert('Failed to update location. Please try again.');
        });
    });
});

function fetchLocationData(locationID) {
    fetch(`http://localhost:2024/api/select/Dim_Location?LocationID=${locationID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200 && data.data) {
            const location = data.data[0];
            document.getElementById('location-id').value = location.LocationID;
            document.getElementById('location-country').value = location.LOCATIONCOUNTRY;
            document.getElementById('location-city').value = location.LOCATIONCITY;
        } else {
            alert('Failed to load location data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching location data:', error);
        alert('Failed to load location data. Please try again.');
    });
}
