document.getElementById('add-location-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const locationID = document.getElementById('location-id').value;
    const country = document.getElementById('location-country').value;
    const city = document.getElementById('location-city').value;

    const locationData = {
        LocationID: locationID,
        LOCATIONCOUNTRY: country,
        LOCATIONCITY: city
    };

    fetch('http://localhost:2024/api/insert/Dim_Location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Location added successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Failed to add location. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding location:', error);
        alert('Failed to add location. Please try again.');
    });
});
